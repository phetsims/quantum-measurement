// Copyright 2024, University of Colorado Boulder

/**
 * CoinsExperimentSceneView presents the views for the physical or the quantum scene on the "Coins" screen depending
 * upon how it is configured.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Animation from '../../../../twixt/js/Animation.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Easing from '../../../../twixt/js/Easing.js';
import CoinExperimentPreparationArea from './CoinExperimentPreparationArea.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinNode from './CoinNode.js';

type SelfOptions = EmptySelfOptions;
export type CoinsExperimentSceneViewOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const SCENE_WIDTH = QuantumMeasurementConstants.LAYOUT_BOUNDS.width;
const DIVIDER_X_POSITION_DURING_PREPARATION = Math.floor( ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.38 );
const DIVIDER_X_POSITION_DURING_MEASUREMENT = Math.ceil( ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.2 );
const DIVIDER_HEIGHT = 500; // empirically determined

export default class CoinsExperimentSceneView extends Node {

  // The coin experiment scene view has two areas, one for preparing the experiment and one for running it and measuring
  // the results. These are the root nodes for each of these areas.  They are mostly populated by subclasses.
  protected readonly preparationArea: CoinExperimentPreparationArea;
  protected readonly measurementArea: CoinExperimentMeasurementArea;

  // This button is used by the user to start a new experiment by preparing a new coin.
  protected readonly newCoinButton: ButtonNode;

  // The X (horizontal) position in screen coordinates where the demarcation between the preparation area and the
  // measurement area should be.  This moves back and forth when moving between preparation and measurement modes.
  protected readonly dividerXPositionProperty: TProperty<number>;

  // The animation for the movement of the divider when switching between 'preparation' and 'measurement' modes.  This
  // will be null when no animation is in progress.
  private dividerMovementAnimation: Animation | null = null;

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: CoinsExperimentSceneViewOptions ) {

    const options = optionize<CoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      {
        visibleProperty: sceneModel.activeProperty
      },
      providedOptions
    );

    super( options );

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
      centerY: 245 // empirically determined
    } );
    this.addChild( startMeasurementButton );

    // Position the dividing line and the two areas of activity.
    this.dividerXPositionProperty.link( dividerPositionX => {
      dividingLine.centerX = dividerPositionX;
      startMeasurementButton.centerX = dividerPositionX;
      this.updateActivityAreaPositions();
    } );

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

      // Add a handler for when the animation is ended.  This is here for situations such as a reset occurring during
      // the animation.
      this.dividerMovementAnimation.endedEmitter.addListener( () => {
        this.dividerXPositionProperty.value = preparingExperiment ?
                                              DIVIDER_X_POSITION_DURING_PREPARATION :
                                              DIVIDER_X_POSITION_DURING_MEASUREMENT;
        this.dividerMovementAnimation = null;
      } );

      // Kick off the divider animation.
      this.dividerMovementAnimation.start();
    } );

    // Create and add the button for starting a new experiment by preparing a new coin.
    this.newCoinButton = new TextPushButton( QuantumMeasurementStrings.newCoinStringProperty, {
      visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty ),
      baseColor: Color.CYAN,
      font: new PhetFont( 14 ),
      listener: () => {
        sceneModel.preparingExperimentProperty.value = true;
      }
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
   * Add a coin node to the scene graph.  This is used to support the creation an animation of a coin from the
   * preparation to the measurement area.  Having this method allows the measurement area to create the node and get it
   * into the scene graph without altering its bounds.
   */
  public addCoinNode( coinNode: CoinNode ): void {

    // TODO: See https://github.com/phetsims/quantum-measurement/issues/11.  Values based on the local coordering frame
    //       are being used because the attempts to do something more general (the commented out code) weren't working.
    //       This should be fixed up.
    // const indicatorCoinGlobalBounds = this.preparationArea.getIndicatorCoinGlobalBounds();
    // coinNode.center = this.globalToLocalPoint( indicatorCoinGlobalBounds.center );
    coinNode.centerX = this.dividerXPositionProperty.value - 100;
    coinNode.centerY = DIVIDER_HEIGHT / 3;

    this.addChild( coinNode );
  }

  protected updateActivityAreaPositions(): void {
    const dividerPositionX = this.dividerXPositionProperty.value;
    this.preparationArea.centerX = dividerPositionX / 2;
    this.measurementArea.centerX = dividerPositionX + ( SCENE_WIDTH - dividerPositionX ) / 2;
  }

  public reset(): void {
    if ( this.dividerMovementAnimation ) {
      this.dividerMovementAnimation.stop();
    }
  }
}

quantumMeasurement.register( 'CoinsExperimentSceneView', CoinsExperimentSceneView );