// Copyright 2024-2025, University of Colorado Boulder

/**
 * SingleCoinViewManager is responsible for creating and animating the motion of the single coin that is used in the
 * experiment. This includes the animation of the coin moving from the preparation area to the measurement area, as
 * well as providing support for the coin flipping animation.
 *
 * The animations here are pretty complex due to the need to mask the coins in some cases, to work with clip areas, and
 * to move the cains in areas outside the bounds of the node in which they originate.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import stepTimer from '../../../../axon/js/stepTimer.js';
import { TEmitterListener } from '../../../../axon/js/TEmitter.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import { MEASUREMENT_PREPARATION_TIME } from '../model/CoinSet.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import ClassicalCoinNode from './ClassicalCoinNode.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinNode from './CoinNode.js';
import CoinViewManager from './CoinViewManager.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import QuantumCoinNode from './QuantumCoinNode.js';

const SINGLE_COIN_TEST_BOX_SIZE = new Dimension2( 165, 145 );
const COIN_FLIP_RATE = 3; // full flips per second
const COIN_TRAVEL_ANIMATION_DURATION = MEASUREMENT_PREPARATION_TIME * 0.95;

class SingleCoinViewManager extends CoinViewManager {

  // methods to start and abort the animation of the single coin moving from the preparation area to the test box
  private readonly startIngressAnimationForSingleCoin: ( forReprepare: boolean ) => void;
  private readonly abortIngressAnimationForSingleCoin: () => void;

  // method to update the flipping animation of the single coin
  public readonly updateFlipping: ( singleCoinMeasurementState: ExperimentMeasurementState ) => void;

  // method to clear the single coin test box
  public readonly clearSingleCoinTestBox: () => void;

  public constructor( sceneModel: CoinsExperimentSceneModel,
                      measurementArea: CoinExperimentMeasurementArea,
                      coinMask: Circle,
                      singleCoinTestBox: Node,
                      singleCoinInTestBoxProperty: TProperty<boolean> ) {

    super( measurementArea );

    // variables to support the coin animations
    let singleCoinNode: CoinNode | null = null;
    let singleCoinAnimationFromPrepAreaToEdgeOfTestBox: Animation | null = null;
    let singleCoinAnimationFromEdgeOfTestBoxToInside: Animation | null = null;
    let flippingAnimationStepListener: null | TEmitterListener<number[]> = null;

    // Create a closure function for clearing out the single coin test box.
    this.clearSingleCoinTestBox = () => {
      assert && assert(
      !singleCoinAnimationFromPrepAreaToEdgeOfTestBox && !singleCoinAnimationFromEdgeOfTestBoxToInside,
        'this function should not be invoked while animations are in progress'
      );
      if ( singleCoinNode && singleCoinTestBox.hasChild( singleCoinNode ) ) {
        singleCoinTestBox.removeChild( singleCoinNode );
        singleCoinNode.dispose();
        singleCoinNode = null;
      }
      coinMask.right = singleCoinTestBox.left;
      coinMask.y = singleCoinTestBox.centerY;
      singleCoinInTestBoxProperty.value = false;
    };

    // Create a closure function for aborting the animation of the incoming single coin. This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally. If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    this.abortIngressAnimationForSingleCoin = () => {

      // Get the scene view, since we'll need to remove the coin we created if it is there.
      const coinsExperimentSceneView = this.getSceneView();

      // Stop any of the animations that are in progress.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox && singleCoinAnimationFromPrepAreaToEdgeOfTestBox.stop();
      singleCoinAnimationFromEdgeOfTestBoxToInside && singleCoinAnimationFromEdgeOfTestBoxToInside.stop();

      if ( singleCoinNode ) {
        if ( coinsExperimentSceneView.hasChild( singleCoinNode ) ) {
          coinsExperimentSceneView.removeChild( singleCoinNode );
        }
        else if ( singleCoinTestBox.hasChild( singleCoinNode ) ) {
          singleCoinTestBox.removeChild( singleCoinNode );
        }
        singleCoinNode.dispose();
        singleCoinNode = null;
      }
    };

    // Create a closure function for creating and starting the animation of a single coin coming from the preparation
    // area into the single coin test box.
    this.startIngressAnimationForSingleCoin = ( forReprepare: boolean ) => {

      // Get the scene view, since we'll need to work with it to initially place the coin in the preparation area.
      const coinsExperimentSceneView = this.getSceneView();

      // Clear out the test box if there's anything in there.
      this.clearSingleCoinTestBox();

      // Create the coin that will travel from the preparation area into this measurement area.
      if ( sceneModel.systemType === SystemType.CLASSICAL ) {
        singleCoinNode = new ClassicalCoinNode(
          sceneModel.singleCoin.measuredValueProperty as TReadOnlyProperty<ClassicalCoinStates>,
          InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        );
      }
      else {
        singleCoinNode = new QuantumCoinNode(
          sceneModel.singleCoin.measuredValueProperty as TReadOnlyProperty<QuantumCoinStates>,
          sceneModel.upProbabilityProperty,
          InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        );
      }

      // Add the coin to our parent node. This is done so that we don't change our bounds, which could mess up the
      // layout. It will be added back to this area when it is back within this node's bounds.
      coinsExperimentSceneView.addSingleCoinNode( singleCoinNode );

      // Make sure the coin mask is outside the test box so that it isn't visible until it slides into the test box.
      coinMask.x = -SINGLE_COIN_TEST_BOX_SIZE.width * 2;

      // Determine the total animation duration, but use zero if phet-io state is being set.
      const totalAnimationDuration = isSettingPhetioStateProperty.value ? 0 : COIN_TRAVEL_ANIMATION_DURATION;

      // Create and start an animation to move the single coin to the side of the single coin test box. The entire
      // process consists of two animations, one to move the coin to the left edge of the test box while the test box is
      // potentially also moving, then a second one to move the coin into the box. The durations must be set up such
      // that the test box is in place before the 2nd animation begins or the coin won't end up in the right place.
      const testBoxXOffset = forReprepare ? 180 : 250; // empirically determined, adjust as needed
      const leftOfTestBoxGlobal = singleCoinTestBox.parentToGlobalPoint(
        singleCoinTestBox.center.minusXY( testBoxXOffset, 0 )
      );
      const leftOfTestBoxInParentCoords = measurementArea.globalToParentPoint( leftOfTestBoxGlobal );
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox = new Animation( {
        setValue: value => { singleCoinNode!.center = value; },
        getValue: () => singleCoinNode!.center,
        to: leftOfTestBoxInParentCoords,
        duration: totalAnimationDuration / 2,
        easing: Easing.LINEAR
      } );
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.finishEmitter.addListener( () => {

        assert && assert( singleCoinNode, 'There should be a singleCoinNode instance at the end of this animation.' );

        // Get a reference to the coin Node that allows the code to omit all the non-null assertions.
        const assuredSingleCoinNode = singleCoinNode!;
        assuredSingleCoinNode.moveToBack();

        // Start the 2nd portion of the animation, which moves the coin and the mask that covers it into the test box.
        singleCoinAnimationFromEdgeOfTestBoxToInside = new Animation( {
          setValue: value => {

            // Position the coin.
            assuredSingleCoinNode.center = value;

            // Position the mask that is covering the coin.
            const coinCenterInGlobalCoords = assuredSingleCoinNode.parentToGlobalPoint( assuredSingleCoinNode.center );
            coinMask.center = coinMask.globalToParentPoint( coinCenterInGlobalCoords );
          },
          getValue: () => assuredSingleCoinNode.center,
          to: assuredSingleCoinNode.globalToParentPoint( singleCoinTestBox.parentToGlobalPoint( singleCoinTestBox.center ) ),
          duration: totalAnimationDuration / 2,
          easing: Easing.QUADRATIC_OUT
        } );
        singleCoinAnimationFromEdgeOfTestBoxToInside.finishEmitter.addListener( () => {

          // Now that the coin is within the bounds of the test box, remove it from the parent and add it as a child.
          coinsExperimentSceneView.removeChild( assuredSingleCoinNode );
          singleCoinTestBox.insertChild( 0, assuredSingleCoinNode );
          assuredSingleCoinNode.center = singleCoinTestBox.center;
          coinMask.center = singleCoinTestBox.center;

          if ( sceneModel.systemType === SystemType.QUANTUM ) {

            // "Collapse" the state of the coin node so that it shows a single state, not a superposition one.
            const quantumCoinNode = singleCoinNode as QuantumCoinNode;
            quantumCoinNode.showSuperpositionProperty.value = false;
            sceneModel.singleCoin.prepareNow();
          }

          // The coin is in the test box, so update the flag that makes this known.
          singleCoinInTestBoxProperty.value = true;
        } );

        // Regardless of how the animation terminated its reference needs to be cleared when it is done.
        singleCoinAnimationFromEdgeOfTestBoxToInside.endedEmitter.addListener( () => {
          singleCoinAnimationFromEdgeOfTestBoxToInside = null;
        } );

        // Kick off the 2nd animation.
        singleCoinAnimationFromEdgeOfTestBoxToInside.start();
      } );

      // Regardless of how the animation terminated, its reference needs to be cleared when it is done.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.endedEmitter.addListener( () => {
        singleCoinAnimationFromPrepAreaToEdgeOfTestBox = null;
      } );

      // Kick off the 1st animation.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.start();
    };

    this.updateFlipping = ( singleCoinMeasurementState: ExperimentMeasurementState ) => {
      if ( sceneModel.systemType === SystemType.CLASSICAL ) {

        if ( singleCoinMeasurementState === 'preparingToBeMeasured' ) {

          // state checking
          assert && assert( !flippingAnimationStepListener, 'something is off - there should be no listener' );
          assert && assert( singleCoinNode, 'something is off - there should be a coin node' );

          // Set the initial state of things prior to starting the animation.
          let flippingAnimationPhase = 0;
          const rotation = dotRandom.nextDouble() * Math.PI;
          let previousXScale = 0;
          coinMask.setRotation( rotation );
          singleCoinNode!.setRotation( rotation );

          // Create and hook up a step listener to perform the animation.
          flippingAnimationStepListener = ( dt: number ) => {
            flippingAnimationPhase += 2 * Math.PI * COIN_FLIP_RATE * dt;
            let xScale = Math.sin( flippingAnimationPhase );

            // Handle the case where the scale hits zero, since it can't be set to that value.
            if ( xScale === 0 ) {
              xScale = previousXScale < 0 ? 0.01 : -0.01;
            }

            // Scale the coin on the x-axis to make it look like it is rotating relative to the plane of view.
            coinMask.setScaleMagnitude( xScale, 1 );
            singleCoinNode!.setScaleMagnitude( xScale, 1 );

            // Save state for handling the zero case.
            previousXScale = xScale;
          };
          stepTimer.addListener( flippingAnimationStepListener );
        }
        else if ( flippingAnimationStepListener ) {

          // The coin is no longer in the flipping state, so set it to be fully round and in the center of the test box.
          // The transform is being reset here because floating point errors were piling up during the animation, and
          // this just worked better.
          coinMask.resetTransform();
          coinMask.center = singleCoinTestBox.center;
          if ( singleCoinNode ) {
            singleCoinNode.resetTransform();
            singleCoinNode.center = singleCoinTestBox.center;
          }

          // Remove the step listener that was performing the flip animation.
          stepTimer.removeListener( flippingAnimationStepListener );
          flippingAnimationStepListener = null;
        }
      }
      else if ( sceneModel.systemType === SystemType.QUANTUM ) {

        if ( singleCoinMeasurementState === 'preparingToBeMeasured' ) {

          // Abort any previous animations and clear out the test box.
          this.abortIngressAnimationForSingleCoin();
          this.clearSingleCoinTestBox();

          // Animate a coin from the prep area to the single coin test box to indicate that a new "quantum coin" is
          // being prepared for measurement.
          this.startIngressAnimationForSingleCoin( true );
        }
      }
    };
  }

  public override startIngressAnimation( forReprepare: boolean ): void {
    this.startIngressAnimationForSingleCoin( forReprepare );
  }

  public override abortIngressAnimation():void {
    this.abortIngressAnimationForSingleCoin();
  }

}

quantumMeasurement.register( 'SingleCoinViewManager', SingleCoinViewManager );

export default SingleCoinViewManager;