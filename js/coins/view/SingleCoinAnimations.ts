// Copyright 2024, University of Colorado Boulder

/**
 * CoinAnimations is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where users can flip and reveal coins. Depending on how this is parameterized, the coins may either
 * be classical or quantum coins.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import stepTimer from '../../../../axon/js/stepTimer.js';
import { TEmitterListener } from '../../../../axon/js/TEmitter.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { Circle, HBox, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import ClassicalCoinNode from './ClassicalCoinNode.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinNode from './CoinNode.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import QuantumCoinNode from './QuantumCoinNode.js';

const SINGLE_COIN_TEST_BOX_SIZE = new Dimension2( 165, 145 );
const COIN_FLIP_RATE = 3; // full flips per second
const COIN_TRAVEL_ANIMATION_DURATION = QuantumMeasurementConstants.PREPARING_TO_BE_MEASURED_TIME * 0.95;

// allowed values for the number of coins to use in the multi-coin experiment
export const MULTI_COIN_EXPERIMENT_QUANTITIES = [ 10, 100, 10000 ];

export default class SingleCoinAnimations {

  public readonly abortIngressAnimationForSingleCoin: () => void;
  public readonly startIngressAnimationForSingleCoin: ( forReprepare: boolean ) => void;
  public readonly clearSingleCoinTestBox: () => void;
  public readonly flipCoin: ( singleCoinMeasurementState: ExperimentMeasurementState ) => void;

  public constructor(
    sceneModel: CoinsExperimentSceneModel,
    measurementArea: CoinExperimentMeasurementArea,
    coinMask: Circle,
    singleCoinTestBox: Node,
    singleCoinMeasurementArea: HBox,
    singleCoinInTestBoxProperty: TProperty<boolean>
  ) {
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

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // Stop any of the animations that exist.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox && singleCoinAnimationFromPrepAreaToEdgeOfTestBox.stop();
      singleCoinAnimationFromEdgeOfTestBoxToInside && singleCoinAnimationFromEdgeOfTestBoxToInside.stop();

      if ( singleCoinNode ) {
        if ( sceneGraphParent.hasChild( singleCoinNode ) ) {
          sceneGraphParent.removeChild( singleCoinNode );
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

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // Clear out the test box if there's anything in there.
      this.clearSingleCoinTestBox();

      // Create the coin that will travel from the preparation area into this measurement area.
      if ( sceneModel.systemType === 'classical' ) {
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
      // layout. It will be added back to this area when it is back within the bounds.
      sceneGraphParent.addSingleCoinNode( singleCoinNode );

      // Make sure the coin mask is outside the test box so that it isn't visible until it slides into the test box.
      coinMask.x = -SINGLE_COIN_TEST_BOX_SIZE.width * 2;

      // Create and start an animation to move the single coin to the side of the single coin test box. The entire
      // process consists of two animations, one to move the coin to the left edge of the test box while the test box is
      // potentially also moving, then a second one to move the coin into the box. The durations must be set up such
      // that the test box is in place before the 2nd animation begins or the coin won't end up in the right place.
      const testAreaXOffset = forReprepare ? 200 : 420; // empirically determined
      const leftOfTestArea = singleCoinMeasurementArea.center.minusXY( testAreaXOffset, 0 );
      const leftOfTestAreaInParentCoords = measurementArea.localToParentPoint( leftOfTestArea );
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox = new Animation( {
        setValue: value => { singleCoinNode!.center = value; },
        getValue: () => singleCoinNode!.center,
        to: leftOfTestAreaInParentCoords,
        duration: COIN_TRAVEL_ANIMATION_DURATION / 2,
        easing: Easing.LINEAR
      } );
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.finishEmitter.addListener( () => {

        assert && assert( singleCoinNode, 'There should be a singleCoinNode instance at the end of this animation.' );

        // Get a reference to the coin Node that allows the code to omit all the exclamation points and such.
        const assuredSingleCoinNode = singleCoinNode!;
        assuredSingleCoinNode.moveToBack();

        // Move the mask to be on top of the coin Node.
        coinMask.center = singleCoinTestBox.parentToLocalPoint( measurementArea.parentToLocalPoint( assuredSingleCoinNode.center ) );

        // Start the 2nd portion of the animation, which moves the masked coin into the test box.
        singleCoinAnimationFromEdgeOfTestBoxToInside = new Animation( {
          setValue: value => {
            assuredSingleCoinNode.center = value;
            coinMask.center = singleCoinMeasurementArea.parentToLocalPoint(
              singleCoinTestBox.parentToLocalPoint( measurementArea.parentToLocalPoint( assuredSingleCoinNode.center ) )
            );
          },
          getValue: () => assuredSingleCoinNode.center,
          to: measurementArea.localToParentPoint( singleCoinMeasurementArea.localToParentPoint( singleCoinTestBox.center ) ),
          duration: COIN_TRAVEL_ANIMATION_DURATION / 2,
          easing: Easing.CUBIC_OUT
        } );
        singleCoinAnimationFromEdgeOfTestBoxToInside.finishEmitter.addListener( () => {

          // Now that the coin is within the bounds of the test box, remove it from the parent and add it as a child.
          sceneGraphParent.removeChild( assuredSingleCoinNode );
          assuredSingleCoinNode.center = singleCoinTestBox.center;
          singleCoinTestBox.insertChild( 0, assuredSingleCoinNode );
          coinMask.center = singleCoinTestBox.center;

          if ( sceneModel.systemType === 'quantum' ) {

            // "Collapse" the state of the coin node so that it shows a single state, not a superposed one.
            const quantumCoinNode = singleCoinNode as QuantumCoinNode;
            quantumCoinNode.showSuperpositionProperty.value = false;
            sceneModel.singleCoin.prepareInstantly();
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

      // Regardless of how the animation terminated its reference needs to be cleared when it is done.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.endedEmitter.addListener( () => {
        singleCoinAnimationFromPrepAreaToEdgeOfTestBox = null;
      } );

      // Kick off the 1st animation.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.start();
    };

    this.flipCoin = ( singleCoinMeasurementState: ExperimentMeasurementState ) => {
      if ( sceneModel.systemType === 'classical' ) {

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

            // Handle the case where we hit zero, since the scale can't be set to that value.
            if ( xScale === 0 ) {
              xScale = previousXScale < 0 ? 0.01 : -0.01;
            }

            // Scale the coin on the x-axis to make it look like they are rotating.
            // REVIEW: Why not check for coinMask? https://github.com/phetsims/quantum-measurement/issues/20
            coinMask.setScaleMagnitude( xScale, 1 );
            singleCoinNode && singleCoinNode.setScaleMagnitude( xScale, 1 );

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
      else if ( sceneModel.systemType === 'quantum' ) {

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
}

quantumMeasurement.register( 'SingleCoinAnimations', SingleCoinAnimations );