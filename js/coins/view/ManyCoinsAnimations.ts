// Copyright 2024, University of Colorado Boulder

/**
 * ManyCoinsAnimations handles the exceptional 10_000 coins case, where each coin is represented as a pixel.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import { MEASUREMENT_PREPARATION_TIME } from '../../common/model/TwoStateSystemSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinSetPixelRepresentation from './CoinSetPixelRepresentation.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';

const COIN_TRAVEL_ANIMATION_DURATION = MEASUREMENT_PREPARATION_TIME * 0.95;

export default class ManyCoinsAnimations extends Rectangle {

  public readonly abortIngressAnimationForCoinSet: () => void;
  public readonly startIngressAnimationForCoinSet: ( forReprepare: boolean ) => void;

  public constructor(
    sceneModel: CoinsExperimentSceneModel,
    measurementArea: CoinExperimentMeasurementArea,
    manyCoinsPixelRepresentation: CoinSetPixelRepresentation,
    coinSetInTestBoxProperty: TProperty<boolean>,
    providedOptions?: RectangleOptions
  ) {
    super( 0, 0, 1, 1, providedOptions );

    const animationsToCoinBox: Animation[] = [];

    const pixelRepresentation = new CoinSetPixelRepresentation(
      'classical', new Property<ExperimentMeasurementState>( 'preparingToBeMeasured' ), coinSetInTestBoxProperty, {
        canvasBounds: this.bounds,
        animationDuration: COIN_TRAVEL_ANIMATION_DURATION
      }
    );
    pixelRepresentation.setCanvasBounds( this.bounds );
    pixelRepresentation.setPixelScale( 1.8 );
    this.addChild( pixelRepresentation );

    // Create a closure function for aborting the animation of the incoming single coin. This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally. If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    this.abortIngressAnimationForCoinSet = () => {

      // Stop any of the animations that exist.
      animationsToCoinBox.forEach( animation => animation.stop() );

      // Remove the animations from the list of active ones.
      animationsToCoinBox.length = 0;

      // Set the flag to indicate that the coins aren't in the box.
      coinSetInTestBoxProperty.value = false;

      pixelRepresentation.abortAllAnimations( 0 );
      pixelRepresentation.visible = false;
    };

    this.startIngressAnimationForCoinSet = ( forReprepare: boolean ) => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( measurementArea.getParent() instanceof CoinsExperimentSceneView );

      const boxTopLeftCorner = this.globalToLocalPoint( manyCoinsPixelRepresentation.localToGlobalPoint( manyCoinsPixelRepresentation.leftTop ) ).minusXY( manyCoinsPixelRepresentation.width / 2, 10 );

      const totalAnimationDuration = isSettingPhetioStateProperty.value ? 0 : COIN_TRAVEL_ANIMATION_DURATION;

      // Create an animation that will move this coin node to the edge of the multi-coin test box.
      const animationToBoxCenter = new Animation( {
        to: boxTopLeftCorner,
        from: new Vector2( -100, -100 ),
        duration: totalAnimationDuration,
        // easing: Easing.CUBIC_IN_OUT,
        setValue: position => {
          pixelRepresentation.visible = true;
          pixelRepresentation.center = position;
        },
        getValue: () => pixelRepresentation.center
      } );

      animationsToCoinBox.push( animationToBoxCenter );
      animationToBoxCenter.finishEmitter.addListener( () => {
        if ( sceneModel.systemType === 'quantum' ) {
          sceneModel.coinSet.prepareNow();
        }

        // If all animations have completed, set the flag that indicates the coins are fully in the box.
        const runningAnimations = animationsToCoinBox.filter(
          animation => animation.animatingProperty.value
        );
        if ( runningAnimations.length === 0 ) {
          coinSetInTestBoxProperty.value = true;
        }
      } );

      // Regardless of how the animation terminated its reference needs to be removed when it is done.
      animationToBoxCenter.endedEmitter.addListener( () => {

        // Remove the now-completed animation from the list of active ones.
        animationsToCoinBox.filter(
          animation => animation !== animationToBoxCenter
        );
      } );

      animationToBoxCenter.start();
      pixelRepresentation.startPopulatingAnimation();
    };
  }
}

quantumMeasurement.register( 'ManyCoinsAnimations', ManyCoinsAnimations );