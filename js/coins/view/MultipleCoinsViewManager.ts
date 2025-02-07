// Copyright 2024-2025, University of Colorado Boulder

/**
 * MultipleCoinsViewManager creates and animates the sets of coin nodes that are configured in the preparation area, and
 * thus appear to originate there, and move into the measurement area.  This is used for the 10 and 100 coin cases.  The
 * 10k case is handled differently and is not included here.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TProperty from '../../../../axon/js/TProperty.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { MEASUREMENT_PREPARATION_TIME } from '../model/CoinSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel, { MULTI_COIN_ANIMATION_QUANTITIES } from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';
import SmallCoinNode, { SmallCoinDisplayMode } from './SmallCoinNode.js';

const COIN_TRAVEL_ANIMATION_DURATION = MEASUREMENT_PREPARATION_TIME * 0.95;

class MultipleCoinsViewManager {

  // Method for starting the animation that moves the coins from the preparation area to the test box.  It is created
  // as a closure to make things easier.
  public readonly startIngressAnimationForCoinSet: ( forReprepare: boolean ) => void;

  // Method for aborting the animation that moves the coins from the preparation area to the test box.  It is created
  // as a closure to make things easier.
  public readonly abortIngressAnimationForCoinSet: () => void;

  public constructor( sceneModel: CoinsExperimentSceneModel,
                      measurementArea: CoinExperimentMeasurementArea,
                      multipleCoinTestBox: MultiCoinTestBox,
                      coinSetInTestBoxProperty: TProperty<boolean> ) {

    // map of the size of the coin set to the nodes used for that set
    const coinNodeSets = new Map<number, SmallCoinNode[]>();

    // Set up the coin nodes for each of the quantities that can be selected by the user.  As of Jan 2025, this includes
    // 10 and 100 coins.  The 10k case is handled differently and is not included here.
    MULTI_COIN_ANIMATION_QUANTITIES.forEach( quantity => {
      const radius = MultiCoinTestBox.getRadiusFromCoinQuantity( quantity );
      const coinNodes: SmallCoinNode[] = [];
      _.times( quantity, () => {
        coinNodes.push( new SmallCoinNode( radius, { tandem: Tandem.OPT_OUT } ) );
      } );
      coinNodeSets.set( quantity, coinNodes );
    } );

    const animations: Animation[] = [];

    // Create a closure function for aborting the animations. This is intended to be called when a state change occurs
    // that prevents the ingress animation from finishing normally. If no animation is in progress, this does nothing,
    // so it is safe to call as a preventative measure.
    this.abortIngressAnimationForCoinSet = () => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // Stop any of the animations that exist.
      animations.forEach( animation => animation.stop() );

      // Remove the animations from the list of active ones.
      animations.length = 0;

      // Clear out any coins that made it to the test box.
      multipleCoinTestBox.clearContents();

      // Remove any coin nodes that are moving from the prep area out from the scene graph parent.
      sceneGraphParent.children.filter( child => child instanceof SmallCoinNode ).forEach( smallCoinNode => {
        sceneGraphParent.removeChild( smallCoinNode );
      } );

      // Set the flag to indicate that the coins aren't in the box.
      coinSetInTestBoxProperty.value = false;
    };

    this.startIngressAnimationForCoinSet = ( forReprepare: boolean ) => {

      assert && assert(
        coinNodeSets.has( sceneModel.coinSet.numberOfActiveSystemsProperty.value ),
        `No coin nodes exist for the needed quantity: ${sceneModel.coinSet.numberOfActiveSystemsProperty.value}`
      );

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // Make sure the test box is empty.
      multipleCoinTestBox.clearContents();

      // Get the set of coin nodes that will be animated.
      const coinsToAnimate = coinNodeSets.get( sceneModel.coinSet.numberOfActiveSystemsProperty.value );

      // Add the coins to our parent node. This is done so that we don't change the local bounds of the measurement
      // area, since this would break the layout.  These will be added back to the measurement area when they reach the
      // desired location and are thus withing the bounds of the measurement area.
      sceneGraphParent.addCoinNodeSet( coinsToAnimate! );

      const multipleCoinTestBoxBounds = sceneGraphParent.globalToLocalBounds( multipleCoinTestBox.getGlobalBounds() );

      // The tricky bit about this animation is that the test box where these coins are headed could itself be moving
      // due to the way the measurement area works.  This unfortunately means we need to have a bit of the "tweak
      // factor" to get the destination right.
      const testAreaXOffset = forReprepare ? 0 : -92; // empirically determined
      const destinationCenter = multipleCoinTestBoxBounds.center.plusXY( testAreaXOffset, 0 );

      // Set up and start the animation for each of the individual coins.
      const coinsMasked = sceneModel.coinSet.measurementStateProperty.value !== 'revealed';

      coinsToAnimate!.forEach( ( coinNode, index ) => {

        // Mask or display the coin value based on the measurement state.
        coinNode.displayModeProperty.value = coinsMasked ?
                                             'masked' :
                                             sceneModel.coinSet.measuredValues[ index ] as SmallCoinDisplayMode;

        // Get the final destination for this coin node in terms of its offset from the center of the test box.
        const finalDestinationOffset = multipleCoinTestBox.getOffsetFromCenter( index );

        // Start the 2nd portion of the animation, which moves the coin into the test box.
        const animationToTestBox = new Animation( {
          setValue: value => { coinNode.center = value; },
          getValue: () => coinNode.center,
          to: destinationCenter.plus( finalDestinationOffset ),
          duration: isSettingPhetioStateProperty.value ? 0 : COIN_TRAVEL_ANIMATION_DURATION,
          easing: Easing.CUBIC_OUT
        } );
        animations.push( animationToTestBox );
        animationToTestBox.finishEmitter.addListener( () => {

          // The coin node should now be within the bounds of the multi-coin test box. Remove the coin node from the
          // scene graph parent and add it to the test box.
          sceneGraphParent.removeChild( coinNode );
          const offset = multipleCoinTestBox.getOffsetFromCenter( coinsToAnimate!.indexOf( coinNode ) );
          coinNode.center = multipleCoinTestBox.getLocalBounds().center.plus( offset );
          multipleCoinTestBox.addCoinNodeToBox( coinNode );

          if ( sceneModel.systemType === 'quantum' ) {
            sceneModel.coinSet.prepareNow();
          }

          // If all animations have completed, set the flag that indicates the coins are fully in the box.
          const runningAnimations = animations.filter(
            animation => animation.animatingProperty.value
          );
          if ( runningAnimations.length === 0 ) {
            coinSetInTestBoxProperty.value = true;
          }
        } );

        // Regardless of how the animation terminated its reference needs to be removed when it is done.
        animationToTestBox.endedEmitter.addListener( () => {

          // Remove the now-completed animation from the list of active ones.
          animations.filter(
            animation => animation !== animationToTestBox
          );
        } );

        // Kick off the 2nd animation, which moves the coin from the edge of the test box to inside.
        animationToTestBox.start();
      } );
    };
  }
}

quantumMeasurement.register( 'MultipleCoinsViewManager', MultipleCoinsViewManager );

export default MultipleCoinsViewManager;