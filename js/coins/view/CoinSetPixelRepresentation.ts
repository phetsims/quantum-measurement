// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation represents a set of classical or quantum coins as a grid of pixels.  The pixels are
 * colored to represent the state of the coins.  This is used only for the largest number of coins.
 *
 * This class also implements animations for populating the pixel grid and for flipping the coins.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CanvasNode, { CanvasNodeOptions } from '../../../../scenery/js/nodes/CanvasNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinSet, { MEASUREMENT_PREPARATION_TIME } from '../model/CoinSet.js';
import { MAX_COINS } from '../model/CoinsExperimentSceneModel.js';

type SelfOptions = {
  populatingAnimationDuration?: number;
};
type CoinSetPixelRepresentationOptions = SelfOptions & StrictOmit<CanvasNodeOptions, 'canvasBounds'>;

export const SIDE_LENGTH = Math.sqrt( MAX_COINS );
const COIN_STATE_TO_COLOR_MAP = new Map<string, Property<Color>>(
  [
    [ 'heads', QuantumMeasurementColors.headsColorProperty ],
    [ 'tails', QuantumMeasurementColors.tailsColorProperty ],
    [ 'up', QuantumMeasurementColors.upColorProperty ],
    [ 'down', QuantumMeasurementColors.downColorProperty ]
  ]
);
const HIDDEN_COLOR = '#aaa';
const LIGHTER_FLIPPING_COLOR = new Color( HIDDEN_COLOR ).colorUtilsBrighter( 0.2 ).toCSS();
const DARKER_FLIPPING_COLOR = new Color( HIDDEN_COLOR ).colorUtilsDarker( 0.1 ).toCSS();
const MIN_RENDERING_RADIUS = 1;
const MAX_RENDERING_RADIUS = Math.sqrt( 2 ) * SIDE_LENGTH / 2;
const FUZZY_EDGE_PROPORTION = 0.15;

class CoinSetPixelRepresentation extends CanvasNode {

  // the length of one side of this square grid of pixels
  private readonly sideLength = SIDE_LENGTH;

  // the pixel buffer where the pixels are drawn before being copied to the visible canvas
  private readonly pixelBuffer = document.createElement( 'canvas' );

  // the length of one side of the square when rendered to the view
  private readonly sideLengthInView: number;

  // animations
  public populatingAnimation: Animation | null = null;
  public flippingAnimation: Animation | null = null;

  // the duration of the populating animation
  private readonly populatingAnimationDuration: number;

  // the radius used during rending of the populating animation
  private renderingRadius = MAX_RENDERING_RADIUS;

  public constructor( private readonly coinSet: CoinSet,
                      sideLengthInView: number,
                      private readonly coinSetInTestBoxProperty: TProperty<boolean>,
                      providedOptions?: CoinSetPixelRepresentationOptions ) {

    const options = optionize<CoinSetPixelRepresentationOptions, SelfOptions, CanvasNodeOptions>()( {
      populatingAnimationDuration: MEASUREMENT_PREPARATION_TIME,
      canvasBounds: new Bounds2( 0, 0, sideLengthInView, sideLengthInView )
    }, providedOptions );

    super( options );

    this.pixelBuffer.width = this.sideLength;
    this.pixelBuffer.height = this.sideLength;
    this.sideLengthInView = sideLengthInView;
    this.populatingAnimationDuration = options.populatingAnimationDuration;

    // Do the initial rendering.
    this.update();

    // Update the rendering when the measurement state changes.
    this.coinSet.measurementStateProperty.lazyLink( () => {
      this.update();
    } );

    // Update the rendering when the measured data changes.
    this.coinSet.measuredDataChangedEmitter.addListener( () => {
      this.update();
    } );
  }

  /**
   * Update the rendering of the pixel grid based on the current state of the coin set.
   */
  private update(): void {
    if ( this.coinSet.measurementStateProperty.value === 'revealed' ) {
      this.renderCoinValues();
    }
    else {
      this.renderHiddenCoins();
    }
  }

  /**
   * Render the coin values as colored pixels.  This respects the rendering radius, which is used to animate the
   * populating of the pixel grid.
   */
  private renderCoinValues(): void {
    const bufferContext = this.pixelBuffer.getContext( '2d' )!;
    bufferContext.clearRect( 0, 0, this.sideLength, this.sideLength );
    const center = Math.floor( this.sideLength / 2 );
    for ( let i = 0; i < this.sideLength; i++ ) {
      for ( let j = 0; j < this.sideLength; j++ ) {
        const index = i * this.sideLength + j;
        const dx = i - center;
        const dy = j - center;
        const distance = Math.sqrt( dx * dx + dy * dy );
        if ( distance <= this.renderingRadius ) {
          bufferContext.fillStyle = this.getPixelColorForIndex( index );
        }
        else if ( distance <= this.renderingRadius * ( 1 + FUZZY_EDGE_PROPORTION ) ) {
          const extraDistance = distance - this.renderingRadius;
          const proportion = extraDistance / ( this.renderingRadius * FUZZY_EDGE_PROPORTION );
          bufferContext.fillStyle = dotRandom.nextDouble() > proportion ?
                                    this.getPixelColorForIndex( index ) :
                                    'transparent';
        }
        else {
          bufferContext.fillStyle = 'transparent';
        }
        bufferContext.fillRect( j, i, 1, 1 );
      }
    }

    this.invalidatePaint();
  }

  /**
   * Render the hidden coins.  This respects the rendering radius, which is used to animate the populating of the pixel
   * grid.
   */
  private renderHiddenCoins(): void {
    const bufferContext = this.pixelBuffer.getContext( '2d' )!;
    if ( this.renderingRadius >= MAX_RENDERING_RADIUS ) {
      bufferContext.fillStyle = HIDDEN_COLOR;
      bufferContext.fillRect( 0, 0, this.sideLength, this.sideLength );
    }
    else {
      bufferContext.clearRect( 0, 0, this.sideLength, this.sideLength );
      const center = Math.floor( this.sideLength / 2 );
      for ( let i = 0; i < this.sideLength; i++ ) {
        for ( let j = 0; j < this.sideLength; j++ ) {
          const dx = i - center;
          const dy = j - center;
          const distance = Math.sqrt( dx * dx + dy * dy );
          if ( distance <= this.renderingRadius ) {
            bufferContext.fillStyle = HIDDEN_COLOR;
          }
          else if ( distance <= this.renderingRadius * ( 1 + FUZZY_EDGE_PROPORTION ) ) {
            const extraDistance = distance - this.renderingRadius;
            const proportion = extraDistance / ( this.renderingRadius * FUZZY_EDGE_PROPORTION );
            bufferContext.fillStyle = dotRandom.nextDouble() > proportion ? HIDDEN_COLOR : 'transparent';
          }
          else {
            bufferContext.fillStyle = 'transparent';
          }
          bufferContext.fillRect( j, i, 1, 1 );
        }
      }

    }
    this.invalidatePaint();
  }

  /**
   * Get the pixel color that should be used to represent the coin at the provided index value.
   */
  private getPixelColorForIndex( index: number ): string {
    assert && assert( index >= 0 && index < this.sideLength * this.sideLength, 'index value out of range' );
    assert && assert( COIN_STATE_TO_COLOR_MAP.has( this.coinSet.measuredValues[ index ] ), 'no color for value' );
    return COIN_STATE_TO_COLOR_MAP.get( this.coinSet.measuredValues[ index ] )!.value.toCSS();
  }

  /**
   * Perform a single iteration of the flipping animation.  This is called multiple times to create the appearance of
   * flipping coins.
   */
  private flipCoins(): void {
    const bufferContext = this.pixelBuffer.getContext( '2d' )!;
    for ( let i = 0; i < this.sideLength; i++ ) {
      for ( let j = 0; j < this.sideLength; j++ ) {
        bufferContext.fillStyle = dotRandom.nextDouble() < 0.5 ? LIGHTER_FLIPPING_COLOR : DARKER_FLIPPING_COLOR;
        bufferContext.fillRect( j, i, 1, 1 );
      }
    }

    this.invalidatePaint();
  }

  /**
   * Start the animation the populates the pixel grid with the coin values.  This grows from the center and gets larger,
   * with a fuzzy edge, until the entire grid is filled.
   */
  public startPopulatingAnimation(): void {

    // Stop any previously initiated animation.
    if ( this.populatingAnimation ) {
      this.populatingAnimation.stop();
    }

    this.renderingRadius = MIN_RENDERING_RADIUS;

    this.populatingAnimation = new Animation( {
      from: MIN_RENDERING_RADIUS,
      to: MAX_RENDERING_RADIUS,
      duration: isSettingPhetioStateProperty.value ? 0 : this.populatingAnimationDuration,
      easing: Easing.LINEAR,
      setValue: radius => {
        this.renderingRadius = radius;
        this.update();
      }
    } );
    this.populatingAnimation.start();

    this.populatingAnimation.endedEmitter.addListener( () => {
      this.coinSetInTestBoxProperty.value = true;
      this.populatingAnimation = null;
    } );
  }

  /**
   * Start the animation that flips the coins.  This is done by changing the color of the pixels in a random pattern.
   */
  public startFlippingAnimation(): void {

    // Stop any previously initiated animation.
    if ( this.flippingAnimation ) {
      this.flippingAnimation.stop();
    }

    let flipCount = 0;
    this.flippingAnimation = new Animation( {
      from: 0,
      to: 10, // number of flips that will occur during this animation, adjust as needed
      duration: MEASUREMENT_PREPARATION_TIME,
      setValue: value => {
        if ( value >= flipCount ) {
          this.flipCoins();
          flipCount++;
        }
      },
      easing: Easing.LINEAR
    } );

    this.flippingAnimation.endedEmitter.addListener( () => {
      this.renderHiddenCoins();
      this.flippingAnimation = null;
    } );

    this.flippingAnimation?.start();
  }

  /**
   * Stop any in-progress animations.
   */
  public abortAllAnimations(): void {

    this.populatingAnimation && this.populatingAnimation.stop();
    this.flippingAnimation && this.flippingAnimation.stop();

    // Set the flag to indicate that the coins aren't in the box.
    this.coinSetInTestBoxProperty.value = false;
  }

  /**
   * Paint the pixels on the canvas node.
   */
  public paintCanvas( context: CanvasRenderingContext2D ): void {
    context.save();
    context.drawImage( this.pixelBuffer, 0, 0, this.sideLengthInView, this.sideLengthInView );
    context.restore();
  }
}

export default CoinSetPixelRepresentation;
quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );