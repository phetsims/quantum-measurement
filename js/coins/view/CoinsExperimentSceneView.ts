// Copyright 2024, University of Colorado Boulder

/**
 * CoinsExperimentSceneView presents the views for the classical or the quantum scene on the "Coins" screen depending
 * upon how it is configured.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinExperimentPreparationArea from './CoinExperimentPreparationArea.js';
import CoinNode from './CoinNode.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import SmallCoinNode from './SmallCoinNode.js';

type SelfOptions = EmptySelfOptions;
export type CoinsExperimentSceneViewOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const SCENE_WIDTH = QuantumMeasurementConstants.LAYOUT_BOUNDS.width;
const DIVIDER_X_POSITION_DURING_PREPARATION = Math.floor( ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.38 );
const DIVIDER_X_POSITION_DURING_MEASUREMENT = Math.ceil( ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.2 );
const DIVIDER_HEIGHT = 500; // empirically determined

export default class CoinsExperimentSceneView extends Node {

  // The coin experiment scene view has two areas, one for preparing the experiment and one for running it and measuring
  // the results. These are the root nodes for each of these areas. They are mostly populated by subclasses.
  protected readonly preparationArea: CoinExperimentPreparationArea;
  protected readonly measurementArea: CoinExperimentMeasurementArea;

  // This button is used by the user to start a new experiment by preparing a new coin.
  protected readonly newCoinButton: ButtonNode;

  // The X (horizontal) position in screen coordinates where the demarcation between the preparation area and the
  // measurement area should be. This moves back and forth when moving between preparation and measurement modes.
  protected readonly dividerXPositionProperty: TProperty<number>;

  // The animation for the movement of the divider when switching between 'preparation' and 'measurement' modes. This
  // will be null when no animation is in progress.
  private dividerMovementAnimation: Animation | null = null;

  // Track the location where animations of coins from the preparation area to the measurement area should start.  This
  // is updated as the size and layout of the preparation area changes.
  private travelingCoinsOrigin: Vector2;

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: CoinsExperimentSceneViewOptions ) {

    const options = optionize<CoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      {
        visibleProperty: sceneModel.activeProperty
      },
      providedOptions
    );

    super( options );

    // REVIEW TODO: Shouldn't this be phetioReadonly: true? See https://github.com/phetsims/quantum-measurement/issues/20
    this.dividerXPositionProperty = new NumberProperty( DIVIDER_X_POSITION_DURING_PREPARATION, {
      tandem: options.tandem.createTandem( 'dividerXPositionProperty' ),
      range: new Range( DIVIDER_X_POSITION_DURING_MEASUREMENT, DIVIDER_X_POSITION_DURING_PREPARATION )
    } );

    // Add the two areas of activity to the scene view.
    this.preparationArea = new CoinExperimentPreparationArea(
      sceneModel,
      options.tandem.createTandem( 'preparationArea' )
    );
    this.addChild( this.preparationArea );

    this.measurementArea = new CoinExperimentMeasurementArea(
      sceneModel,
      options.tandem.createTandem( 'measurementArea' )
    );
    this.addChild( this.measurementArea );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLine = new Line( 0, 0, 0, DIVIDER_HEIGHT, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineDash: [ 6, 5 ]
    } );
    this.addChild( dividingLine );

    // Add the button for switching from preparation mode to measurement mode.
    const startMeasurementButton = new RectangularPushButton( {
      baseColor: Color.GREEN,
      content: new ArrowNode( 0, 0, 60, 0, {
        headWidth: 20,
        headHeight: 15
      } ),
      listener: () => { sceneModel.preparingExperimentProperty.value = false; },
      visibleProperty: sceneModel.preparingExperimentProperty,
      centerY: 245, // empirically determined
      tandem: options.tandem.createTandem( 'startMeasurementButton' )
    } );
    this.addChild( startMeasurementButton );

    // Position the dividing line and the two areas of activity.
    this.dividerXPositionProperty.link( dividerPositionX => {
      dividingLine.centerX = dividerPositionX;
      startMeasurementButton.centerX = dividerPositionX;
      this.updateActivityAreaPositions();
    } );

    // Set the initial position that will be used when adding the coins that move (animate) between the preparation and
    // measurement areas.
    this.travelingCoinsOrigin = this.globalToLocalPoint( this.preparationArea.getIndicatorCoinGlobalCenter() );

    // Monitor the state of the experiment and update the view when switching between 'preparation' and 'measurement'.
    sceneModel.preparingExperimentProperty.link( preparingExperiment => {

      // If there was already an animation in progress, stop it.
      if ( this.dividerMovementAnimation ) {
        this.dividerMovementAnimation.stop();
      }

      // Start an animation to move the divider and the center positions of the activity areas.
      this.dividerMovementAnimation = new Animation( {
        property: this.dividerXPositionProperty,
        to: preparingExperiment ? DIVIDER_X_POSITION_DURING_PREPARATION : DIVIDER_X_POSITION_DURING_MEASUREMENT,
        duration: 0.5,
        easing: Easing.CUBIC_OUT
      } );

      // Add a handler for when the animation is ended. This is here for situations such as a reset occurring during
      // the animation.
      this.dividerMovementAnimation.endedEmitter.addListener( () => {
        this.dividerXPositionProperty.value = preparingExperiment ?
                                              DIVIDER_X_POSITION_DURING_PREPARATION :
                                              DIVIDER_X_POSITION_DURING_MEASUREMENT;
        this.dividerMovementAnimation = null;

        // Update the location where the coins should come from during animations.
        this.travelingCoinsOrigin = this.globalToLocalPoint( this.preparationArea.getIndicatorCoinGlobalCenter() );
      } );

      // Kick off the divider animation.
      this.dividerMovementAnimation.start();
    } );

    // Create and add the button for starting a new experiment by preparing a new coin.
    this.newCoinButton = new TextPushButton( QuantumMeasurementStrings.newCoinStringProperty, {
      visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty ),
      baseColor: Color.GREEN,
      font: new PhetFont( 14 ),
      listener: () => {
        sceneModel.preparingExperimentProperty.value = true;
      },
      tandem: options.tandem.createTandem( 'newCoinButton' )
    } );
    this.addChild( this.newCoinButton );

    // Position the "New Coin" button below the preparation area.
    this.preparationArea.boundsProperty.link( prepAreaBounds => {
      if ( prepAreaBounds.isFinite() && !prepAreaBounds.isEmpty() ) {
        this.newCoinButton.centerX = prepAreaBounds.centerX;
        this.newCoinButton.top = prepAreaBounds.bottom + 10;
      }
    } );
  }

  /**
   * Add the provided coin node to the scene graph. This is used to support the animation of the coins used in the
   * "Single Coin Measurements" experiment from the preparation area to the measurement area. Having this method allows
   * the measurement area to create the coin Node, retain a reference to it, and get it into the scene graph at the
   * appropriate place without altering its own bounds.
   */
  public addSingleCoinNode( coinNode: CoinNode ): void {
    coinNode.center = this.travelingCoinsOrigin;
    this.addChild( coinNode );
    coinNode.moveToBack();
  }

  /**
   * Add a set of the smaller type of coin nodes to the scene graph. This is used to support the animation of the coins
   * used in the "Multiple Coin Measurements" experiment from the preparation area to the measurement area. Having this
   * method allows the measurement area to create the nodes and get them into the scene graph at the appropriate places
   * without altering the measurement area's bounds.
   */
  public addCoinNodeSet( coinNodeSet: SmallCoinNode[] ): void {

    if ( coinNodeSet.length === 0 ) {
      return;
    }

    // variables used for randomizing the position of the coin node
    const offsetVector = new Vector2( 0, 0 );
    const maxDistanceFromCenter = InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS - coinNodeSet[ 0 ].radius;

    coinNodeSet.forEach( coinNode => {

      // Calculate a random offset from the center that will keep the coin within the bounds of the coin state
      // indicator node.
      const distanceFromCenter = dotRandom.nextDouble() * maxDistanceFromCenter;
      offsetVector.setXY( distanceFromCenter, 0 );
      offsetVector.rotate( dotRandom.nextDouble() * 2 * Math.PI );
      coinNode.center = this.travelingCoinsOrigin.plus( offsetVector );
      this.addChild( coinNode );
      coinNode.moveToBack();
    } );
  }

  protected updateActivityAreaPositions(): void {
    const dividerPositionX = this.dividerXPositionProperty.value;
    this.preparationArea.centerX = dividerPositionX / 2;
    this.measurementArea.centerX = dividerPositionX + ( SCENE_WIDTH - dividerPositionX ) / 2;
  }

  public reset(): void {

    // REVIEW: Shouldn't this also reset the divider to the original position? https://github.com/phetsims/quantum-measurement/issues/20

    if ( this.dividerMovementAnimation ) {
      this.dividerMovementAnimation.stop();
    }
  }
}

quantumMeasurement.register( 'CoinsExperimentSceneView', CoinsExperimentSceneView );