// Copyright 2025, University of Colorado Boulder

/**
 * ManyCoinsAnimations handles the exceptional 10_000 coins case, where each coin is represented as a pixel.
 *
 * @author Agustín Vallejo
 */

import TProperty from '../../../../axon/js/TProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { MEASUREMENT_PREPARATION_TIME } from '../../common/model/TwoStateSystemSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinSetPixelRepresentation from './CoinSetPixelRepresentation.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';

const COIN_TRAVEL_ANIMATION_DURATION = MEASUREMENT_PREPARATION_TIME * 0.95;

class ManyCoinsAnimations {

  public readonly abortIngressAnimationForCoinSet: () => void;
  public readonly startIngressAnimationForCoinSet: ( forReprepare: boolean ) => void;

  public constructor( sceneModel: CoinsExperimentSceneModel,
                      measurementArea: CoinExperimentMeasurementArea,
                      multipleCoinTestBox: MultiCoinTestBox,
                      coinSetInTestBoxProperty: TProperty<boolean> ) {

    let animationToCoinBox: Animation | null = null;

    // TODO: Get this worked out better, see https://github.com/phetsims/quantum-measurement/issues/48
    // const pixelRepresentationBounds = MultiCoinTestBox.SIZE.toBounds();
    const pixelRepresentationBounds = new Bounds2( 0, 0, 180, 180 );
    const pixelRepresentation = new CoinSetPixelRepresentation(
      sceneModel.coinSet,
      sceneModel.systemType,
      coinSetInTestBoxProperty,
      {
        canvasBounds: pixelRepresentationBounds,
        animationDuration: COIN_TRAVEL_ANIMATION_DURATION
      }
    );
    // pixelRepresentation.setCanvasBounds( pixelRepresentationBounds );
    pixelRepresentation.setPixelScale( 1.8 );

    // Create a closure function for aborting the animation of the incoming single coin. This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally. If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    this.abortIngressAnimationForCoinSet = () => {

      // If there is an in-progress animation, stop it.
      animationToCoinBox?.stop();

      // Set the flag to indicate that the coins aren't in the box.
      coinSetInTestBoxProperty.value = false;

      // Stop the pixel representation from doing its inflation animation.
      pixelRepresentation.abortAllAnimations( 0 );

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
      const testAreaXOffset = forReprepare ? 0 : -91; // empirically determined
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

quantumMeasurement.register( 'ManyCoinsAnimations', ManyCoinsAnimations );

export default ManyCoinsAnimations;