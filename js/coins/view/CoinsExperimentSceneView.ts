// Copyright 2024, University of Colorado Boulder

/**
 * CoinsExperimentSceneView is the base class for the scene views on the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Circle, Color, Line, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
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
import PhysicalCoinNode from './PhysicalCoinNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import { PhysicalCoinStates } from '../model/PhysicalCoinStates.js';
import QuantumCoinNode from './QuantumCoinNode.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import CoinExperimentPreparationArea from './CoinExperimentPreparationArea.js';

type SelfOptions = EmptySelfOptions;
export type CoinsExperimentSceneViewOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const SCENE_WIDTH = QuantumMeasurementConstants.LAYOUT_BOUNDS.width;
const DIVIDER_X_POSITION_DURING_PREPARATION = Math.floor( ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.38 );
const DIVIDER_X_POSITION_DURING_MEASUREMENT = Math.ceil( ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.2 );
const DIVIDER_HEIGHT = 500; // empirically determined

export default class CoinsExperimentSceneView extends Node {

  // The coin experiment scene view has two areas, one for preparing the experiment and one for running it and measuring
  // the results. These are the root nodes for each of these areas.  They are mostly populated by subclasses.
  protected readonly preparationArea: VBox;
  protected readonly measurementArea = new VBox( { spacing: 28 } );

  // This button is used by the user to start a new experiment by preparing a new coin.
  protected readonly newCoinButton: ButtonNode;

  // The X (horizontal) position in screen coordinates where the demarcation between the preparation area and the
  // measurement area should be.  This moves back and forth when moving between preparation and measurement modes.
  protected readonly dividerXPositionProperty: TProperty<number>;

  // The animation for the movement of the divider when switching between 'preparation' and 'measurement' modes.  This
  // will be null when no animation is in progress.
  private dividerMovementAnimation: Animation | null = null;

  // The coin node that will appear in the preparation area and indicate the initially prepared state.  It must be
  // created by the subclasses, but needs to be available here so that its position is available.
  protected orientationIndicatorCoinNode: Node | null = null;

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

    // the Node and animation for the coin that moves from the prep area to the measurement area
    let animatingSingleCoinNode: PhysicalCoinNode | null = null;
    let preparedSingleCoinAnimation: Animation | null = null;

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

      if ( !preparingExperiment ) {

        // The user has prepared the experiment and wants to now make measurements.  Animate the motion of the prepared
        // coins to the measurement areas.
        const coinMask = new Circle( InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS, {
          fill: Color.LIGHT_GRAY,
          opacity: 0.2
        } );
        let coinNode;
        if ( sceneModel.systemType === 'physical' ) {
          coinNode = new PhysicalCoinNode(
            sceneModel.initialCoinStateProperty as Property<PhysicalCoinStates>,
            InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          );
        }
        else {
          coinNode = new QuantumCoinNode(
            sceneModel.stateBiasProperty,
            InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          );
        }
        animatingSingleCoinNode = new Node( {
          children: [ coinNode, coinMask ]
        } );
        this.addChild( animatingSingleCoinNode );
        animatingSingleCoinNode.moveToBack();

        if ( this.orientationIndicatorCoinNode ) {

          // Figure out where this coin should start - it will animate from here to the measurement area.
          animatingSingleCoinNode.center =
            this.globalToLocalBounds( this.orientationIndicatorCoinNode?.getGlobalBounds() ).center;

          // Create and start an animation to move this coin to the top screen in the measurement area.
          preparedSingleCoinAnimation = new Animation( {
            setValue: value => { animatingSingleCoinNode!.center = value; },
            getValue: () => animatingSingleCoinNode!.center,

            // TODO: See https://github.com/phetsims/quantum-measurement/issues/9.  This is hardcoded so that a demo can
            //       be shown, but it should get the needed value from the measurement area at some point.
            to: new Vector2( 615, 130 ),
            duration: 1,
            easing: Easing.CUBIC_OUT
          } );
          preparedSingleCoinAnimation.start();
          preparedSingleCoinAnimation.endedEmitter.addListener( () => {
            coinMask.opacity = 1;
            preparedSingleCoinAnimation = null;
          } );
        }
      }
      else if ( animatingSingleCoinNode ) {
        assert && assert(
          this.hasChild( animatingSingleCoinNode ),
          'the parent scene view should never have reference to the animating coin unless it is a child'
        );
        preparedSingleCoinAnimation && preparedSingleCoinAnimation.stop();
        this.removeChild( animatingSingleCoinNode );
        animatingSingleCoinNode.dispose();
        animatingSingleCoinNode = null;
      }
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