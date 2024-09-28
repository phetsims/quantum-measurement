// Copyright 2024, University of Colorado Boulder

/**
 * CoinAnimations is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where users can flip and reveal coins. Depending on how this is parameterized, the coins may either
 * be classical or quantum coins.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TProperty from '../../../../axon/js/TProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { MEASUREMENT_PREPARATION_TIME } from '../../common/model/TwoStateSystemSet.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel, { MULTI_COIN_EXPERIMENT_QUANTITIES } from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';
import SmallCoinNode from './SmallCoinNode.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

const COIN_TRAVEL_ANIMATION_DURATION = MEASUREMENT_PREPARATION_TIME * 0.95;

export default class MultipleCoinAnimations {

public readonly abortIngressAnimationForCoinSet: () => void;
public readonly startIngressAnimationForCoinSet: ( forReprepare: boolean ) => void;

  public constructor(
    sceneModel: CoinsExperimentSceneModel,
    measurementArea: CoinExperimentMeasurementArea,
    multipleCoinTestBox: MultiCoinTestBox,
    coinSetInTestBoxProperty: TProperty<boolean>
  ) {

    // Create the nodes that will be used to animate coin motion for the multiple coin experiments.  These are sized
    // differently based on the quantity being animated.
    const movingCoinNodes = new Map<number, SmallCoinNode[]>();
    MULTI_COIN_EXPERIMENT_QUANTITIES.forEach( quantity => {
      const quantityToCreate = Math.min( quantity, QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS );
      const radius = MultiCoinTestBox.getRadiusFromCoinQuantity( quantity );
      const coinNodes: SmallCoinNode[] = [];
      _.times( quantityToCreate, () => {
        coinNodes.push( new SmallCoinNode( radius ) );
      } );
      movingCoinNodes.set( quantity, coinNodes );
    } );

    const animationsToEdgeOfMultiCoinTestBox: Animation[] = [];
    const animationsFromEdgeOfMultiCoinBoxToInside: Animation[] = [];

    // Create a closure function for aborting the animation of the incoming single coin. This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally. If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    this.abortIngressAnimationForCoinSet = () => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // Stop any of the animations that exist.
      animationsToEdgeOfMultiCoinTestBox.forEach( animation => animation.stop() );
      animationsFromEdgeOfMultiCoinBoxToInside.forEach( animation => animation.stop() );

      // Clear out any coins that made it to the test box.
      multipleCoinTestBox.clearContents();

      // Remove any coin nodes that are moving from the prep area out from the scene graph parent.
      sceneGraphParent.children.filter( child => child instanceof SmallCoinNode ).forEach( smallCoinNode => {
        sceneGraphParent.removeChild( smallCoinNode );
      } );

      // Set the flag to indicate that the coins are not in the box.
      coinSetInTestBoxProperty.value = false;
    };

    this.startIngressAnimationForCoinSet = ( forReprepare: boolean ) => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // Make sure the test box is empty.
      multipleCoinTestBox.clearContents();

      // Set the flag to indicate that the coins aren't in the box.
      coinSetInTestBoxProperty.value = false;

      assert && assert(
        movingCoinNodes.has( sceneModel.coinSet.numberOfActiveSystemsProperty.value ),
        'No coin nodes exist for the needed quantity.'
      );
      const coinsToAnimate = movingCoinNodes.get( sceneModel.coinSet.numberOfActiveSystemsProperty.value );

      // Add the coins to our parent node. This is done so that we don't change our bounds, which could mess up the
      // layout. It will be added back to this area when it is back within the bounds.
      sceneGraphParent.addCoinNodeSet( coinsToAnimate! );

      // Create and start a set of animations to move these new created coin nodes to the side of the multiple coin test
      // box. The entire process consists of two animations, one to move a coin to the left edge of the test box while
      // the test box is potentially also moving, then a second one to move the coin into the box. The durations must
      // be set up such that the test box is in place before the 2nd animation begins or the coins won't end up in the
      // right places.
      const testAreaXOffset = forReprepare ? 100 : 300;
      const multipleCoinTestBoxBounds = measurementArea.globalToLocalBounds( multipleCoinTestBox.getGlobalBounds() );
      const leftOfTestBox = multipleCoinTestBoxBounds.center.minusXY( testAreaXOffset, 0 );
      const leftOfTestAreaInParentCoords = measurementArea.localToParentPoint( leftOfTestBox );
      coinsToAnimate!.forEach( ( coinNode, index ) => {

        // Get the final destination for this coin node in terms of its offset from the center of the test box.
        const finalDestinationOffset = multipleCoinTestBox.getOffsetFromCenter( index );

        // Calculate a destination at the edge of the test box such that this coin will just move right to its final
        // position.
        const destinationAtBoxEdge = leftOfTestAreaInParentCoords.plusXY( 0, finalDestinationOffset.y );

        // Determine the total animation duration, but use zero if phet-io state is being set.
        const totalAnimationDuration = isSettingPhetioStateProperty.value ? 0 : COIN_TRAVEL_ANIMATION_DURATION;

        // Create an animation that will move this coin node to the edge of the multi-coin test box.
        const animationToTestBoxEdge = new Animation( {
          setValue: value => { coinNode.center = value; },
          getValue: () => coinNode.center,
          to: destinationAtBoxEdge,
          duration: totalAnimationDuration / 2,
          easing: Easing.LINEAR
        } );
        animationsToEdgeOfMultiCoinTestBox.push( animationToTestBoxEdge );
        animationToTestBoxEdge.finishEmitter.addListener( () => {

          const boxCenter = measurementArea.globalToParentBounds( multipleCoinTestBox.getGlobalBounds() ).center;

          // Start the 2nd portion of the animation, which moves the coin into the test box.
          const animationFromTestBoxEdgeToInside = new Animation( {
            setValue: value => { coinNode.center = value; },
            getValue: () => coinNode.center,
            to: boxCenter.plus( finalDestinationOffset ),
            duration: totalAnimationDuration / 2,
            easing: Easing.CUBIC_OUT
          } );
          animationsFromEdgeOfMultiCoinBoxToInside.push( animationFromTestBoxEdgeToInside );
          animationFromTestBoxEdgeToInside.finishEmitter.addListener( () => {

            // The coin node should now be within the bounds of the multi-coin test box. Remove the coin node from the
            // scene graph parent and add it to the test box.
            sceneGraphParent.removeChild( coinNode );
            const offset = multipleCoinTestBox.getOffsetFromCenter( coinsToAnimate!.indexOf( coinNode ) );
            coinNode.center = multipleCoinTestBox.getLocalBounds().center.plus( offset );
            multipleCoinTestBox.addCoinNodeToBox( coinNode );

            if ( sceneModel.systemType === 'quantum' ) {
              sceneModel.coinSet.prepareInstantly();
            }

            // If all animations have completed, set the flag that indicates the coins are fully in the box.
            const runningAnimations = animationsFromEdgeOfMultiCoinBoxToInside.filter(
              animation => animation.animatingProperty.value
            );
            if ( runningAnimations.length === 0 ) {
              coinSetInTestBoxProperty.value = true;
            }
          } );

          // Regardless of how the animation terminated its reference needs to be removed when it is done.
          animationFromTestBoxEdgeToInside.endedEmitter.addListener( () => {

            // Remove the now-completed animation from the list of active ones.
            animationsFromEdgeOfMultiCoinBoxToInside.filter(
              animation => animation !== animationFromTestBoxEdgeToInside
            );
          } );

          // Kick off the 2nd animation, which moves the coin from the edge of the test box to inside.
          animationFromTestBoxEdgeToInside.start();
        } );

        // Regardless of how the animation terminated its reference needs to be removed when it is done.
        animationToTestBoxEdge.endedEmitter.addListener( () => {
          animationsToEdgeOfMultiCoinTestBox.filter( animation => animation !== animationToTestBoxEdge );
        } );

        // Kick off the animation to the test box edge.
        animationToTestBoxEdge.start();
      } );
    };

  }
}

quantumMeasurement.register( 'MultipleCoinAnimations', MultipleCoinAnimations );