// Copyright 2025, University of Colorado Boulder

/**
 * MaxCoinsViewManager creates and manages the node that is used to represent the set of 10k coins in the experiment. It
 * creates the node that represents this set of coins and animates it from the preparation area to the test box.
 *
 * The animations here are pretty complex due to the need to move the cains in areas outside the bounds of the node in
 * which they originate, to handle the large number of coins, and to handle the inflation animation that is used to
 * represent the coins as they move from the preparation area to the measurement area.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Agustín Vallejo
 */

import TProperty from '../../../../axon/js/TProperty.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { MEASUREMENT_PREPARATION_TIME } from '../model/CoinSet.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinSetPixelRepresentation from './CoinSetPixelRepresentation.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import CoinViewManager from './CoinViewManager.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';

const COIN_TRAVEL_ANIMATION_DURATION = MEASUREMENT_PREPARATION_TIME * 0.95;

class MaxCoinsViewManager extends CoinViewManager {

  private readonly abortIngressAnimationForCoinSet: () => void;
  private readonly startIngressAnimationForCoinSet: ( forReprepare: boolean ) => void;

  public constructor( sceneModel: CoinsExperimentSceneModel,
                      measurementArea: CoinExperimentMeasurementArea,
                      multipleCoinTestBox: MultiCoinTestBox,
                      coinSetInTestBoxProperty: TProperty<boolean> ) {

    super( measurementArea );

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

      // Get the scene view, since we'll need to remove the many-coins node if it was previously added.
      const coinsExperimentSceneView = this.getSceneView();

      // If the pixel representation is a child of the parent node, remove it.
      if ( coinsExperimentSceneView.hasChild( pixelRepresentation ) ) {
        coinsExperimentSceneView.removeChild( pixelRepresentation );
      }
    };

    this.startIngressAnimationForCoinSet = ( forReprepare: boolean ) => {

      // Make sure the parent node in the scene graph is the expected type, since some subtle interactions with it are
      // necessary to make the animations work.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );

      // Make sure the test box is empty.
      multipleCoinTestBox.clearContents();

      // Get the scene view, since we'll need to work with it to initially place the coins in the preparation area.
      const coinsExperimentSceneView = this.getSceneView();

      // Add the pixel representation to the scene graph parent.
      coinsExperimentSceneView.addManyCoinsNode( pixelRepresentation );

      // The tricky bit about this animation is that the test box where these coins are headed could itself be moving
      // due to the way the measurement area works. This unfortunately means we need to have a bit of the "tweak
      // factor" to get the destination right.
      const testAreaXOffset = this.getLowerTestBoxXOffset( forReprepare );
      const multipleCoinTestBoxBounds = coinsExperimentSceneView.globalToLocalBounds( multipleCoinTestBox.getGlobalBounds() );
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
        coinsExperimentSceneView.removeChild( pixelRepresentation );
        multipleCoinTestBox.addPixelRepresentationToBox( pixelRepresentation );

        if ( sceneModel.systemType === SystemType.QUANTUM ) {
          sceneModel.coinSet.prepareNow();
        }

        // The animation has completed, so set the flag to indicate that the coins are in the box.
        coinSetInTestBoxProperty.value = true;
        animationToCoinBox = null;
      } );

      // Regardless of how the animation terminated, its reference needs to be removed when it is done.
      animationToCoinBox.endedEmitter.addListener( () => {
        animationToCoinBox = null;
      } );

      animationToCoinBox.start();
      pixelRepresentation.startPopulatingAnimation();
    };
  }

  public override startIngressAnimation( forReprepare: boolean ): void {
    this.startIngressAnimationForCoinSet( forReprepare );
  }

  public override abortIngressAnimation():void {
    this.abortIngressAnimationForCoinSet();
  }
}

quantumMeasurement.register( 'MaxCoinsViewManager', MaxCoinsViewManager );

export default MaxCoinsViewManager;