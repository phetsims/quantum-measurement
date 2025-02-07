// Copyright 2025, University of Colorado Boulder

/**
 * MaxCoinsViewManager creates and manages the node that is used to represent the set of 10k coins in the experiment. It
 * creates the node that represents this set of coins and animates it from the preparation area to the test box.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Agustín Vallejo
 */

import TProperty from '../../../../axon/js/TProperty.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { MEASUREMENT_PREPARATION_TIME } from '../model/CoinSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinSetPixelRepresentation from './CoinSetPixelRepresentation.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';

const COIN_TRAVEL_ANIMATION_DURATION = MEASUREMENT_PREPARATION_TIME * 0.95;

class MaxCoinsViewManager {

  public readonly abortIngressAnimationForCoinSet: () => void;
  public readonly startIngressAnimationForCoinSet: ( forReprepare: boolean ) => void;

  public constructor( sceneModel: CoinsExperimentSceneModel,
                      measurementArea: CoinExperimentMeasurementArea,
                      multipleCoinTestBox: MultiCoinTestBox,
                      coinSetInTestBoxProperty: TProperty<boolean> ) {

    let animationToCoinBox: Animation | null = null;

    const pixelRepresentation = new CoinSetPixelRepresentation(
      sceneModel.coinSet,
      MultiCoinTestBox.SIZE.width * 0.9, // somewhat smaller than the test box so that it will fit inside
      coinSetInTestBoxProperty,
      {
        populatingAnimationDuration: COIN_TRAVEL_ANIMATION_DURATION
      }
    );

    // Create a closure function for aborting the animation of the incoming single coin. This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally. If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    this.abortIngressAnimationForCoinSet = () => {

      // If there is an in-progress animation, stop it.
      animationToCoinBox?.stop();

      // Set the flag to indicate that the coins aren't in the box.
      coinSetInTestBoxProperty.value = false;

      // Stop the pixel representation from doing its inflation animation.
      pixelRepresentation.abortAllAnimations();

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // If the pixel representation is a child of the parent node, remove it.
      if ( sceneGraphParent.hasChild( pixelRepresentation ) ) {
        sceneGraphParent.removeChild( pixelRepresentation );
      }
    };

    this.startIngressAnimationForCoinSet = ( forReprepare: boolean ) => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = measurementArea.getParent() as CoinsExperimentSceneView;

      // Make sure the test box is empty.
      multipleCoinTestBox.clearContents();

      // Add the pixel representation to the scene graph parent.
      sceneGraphParent.addManyCoinsNode( pixelRepresentation );

      // The tricky bit about this animation is that the test box where these coins are headed could itself be moving
      // due to the way the measurement area works.  This unfortunately means we need to have a bit of the "tweak
      // factor" to get the destination right.
      const testAreaXOffset = forReprepare ? 0 : -92; // empirically determined
      const multipleCoinTestBoxBounds = sceneGraphParent.globalToLocalBounds( multipleCoinTestBox.getGlobalBounds() );
      const destinationCenter = multipleCoinTestBoxBounds.center.plusXY( testAreaXOffset, 0 );

      const animationDuration = isSettingPhetioStateProperty.value ? 0 : COIN_TRAVEL_ANIMATION_DURATION;

      // Create an animation that will move this node to the edge of the multi-coin test box.
      animationToCoinBox = new Animation( {
        to: destinationCenter,
        setValue: position => { pixelRepresentation.center = position; },
        getValue: () => pixelRepresentation.center,
        duration: animationDuration,
        easing: Easing.CUBIC_IN_OUT
      } );

      animationToCoinBox.finishEmitter.addListener( () => {

        // The node should now be within the bounds of the multi-coin test box. Remove it from the scene graph parent
        // and add it to the test box.
        sceneGraphParent.removeChild( pixelRepresentation );
        multipleCoinTestBox.addPixelRepresentationToBox( pixelRepresentation );

        if ( sceneModel.systemType === 'quantum' ) {
          sceneModel.coinSet.prepareNow();
        }

        // The animation has completed, so set the flag to indicate that the coins are in the box.
        coinSetInTestBoxProperty.value = true;
        animationToCoinBox = null;
      } );

      // Regardless of how the animation terminated its reference needs to be removed when it is done.
      animationToCoinBox.endedEmitter.addListener( () => {
        animationToCoinBox = null;
      } );

      animationToCoinBox.start();
      pixelRepresentation.startPopulatingAnimation();
    };
  }
}

quantumMeasurement.register( 'MaxCoinsViewManager', MaxCoinsViewManager );

export default MaxCoinsViewManager;