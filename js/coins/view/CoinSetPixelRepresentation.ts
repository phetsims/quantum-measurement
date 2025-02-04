// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation handles the creation and display of an NxN grid of coins, each represented by a pixel.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import TwoStateSystemSet, { MEASUREMENT_PREPARATION_TIME } from '../../common/model/TwoStateSystemSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';

type SelfOptions = {
  animationDuration?: number;
};

type CoinSetPixelRepresentationOptions = SelfOptions & CanvasNodeOptions;

export const SIDE_LENGTH = 100;

class CoinSetPixelRepresentation extends CanvasNode {
  private readonly sideLength = SIDE_LENGTH;
  private pixels = new Array( SIDE_LENGTH * SIDE_LENGTH ).fill( 0 );
  private readonly pixelBuffer = document.createElement( 'canvas' );
  private pixelScale = 1;
  private currentFrame = 0;

  public populatingAnimation: Animation | null = null;
  public flippingAnimation: Animation | null = null;

  public animationDuration: number;

  public constructor( private readonly coinSet: TwoStateSystemSet<ClassicalCoinStates> | TwoStateSystemSet<QuantumCoinStates>,
                      private readonly systemType: 'classical' | 'quantum',
                      private readonly coinSetInTestBoxProperty: TProperty<boolean>,
                      providedOptions?: CoinSetPixelRepresentationOptions ) {

    const options = optionize<CoinSetPixelRepresentationOptions, SelfOptions, CanvasNodeOptions>()( {
      animationDuration: MEASUREMENT_PREPARATION_TIME
    }, providedOptions );

    super( options );

    this.pixelBuffer.width = this.sideLength;
    this.pixelBuffer.height = this.sideLength;

    this.animationDuration = options.animationDuration;

    this.setAllPixels( 0 );

    this.coinSet.measurementStateProperty.lazyLink( () => {
      this.redraw( this.coinSet.measuredValues );
    } );

    this.coinSet.measuredDataChangedEmitter.addListener( () => {
      this.redraw( this.coinSet.measuredValues );
    } );
  }

  public redraw( measuredValues: Array<string | null> ): void {

    const comparisonValue = this.systemType === 'classical' ? 'heads' : 'up';

    // Create an array of pixel colors (1 for fuchsia, 0 for black).
    this.pixels = measuredValues.map( value => value === comparisonValue ? 1 : 0 );

    this.invalidatePaint();
  }

  /**
   * Sets the scale of the individual pixels.
   */
  public setPixelScale( scale: number ): void {
    this.pixelScale = scale;
  }

  public startPopulatingAnimation(): void {

    // Stop any previously initiated animation.
    if ( this.populatingAnimation ) {
      this.populatingAnimation.stop();
    }

    this.setAllPixels( 0 );
    this.currentFrame = 0;

    const center = Math.floor( this.sideLength / 2 );
    const maxRadius = Math.sqrt( 2 ) * center * 1.1; // 10% extra radius to avoid missed pixels at the corners
    const fps = 40;
    const totalFrames = 4 * this.animationDuration / fps;

    this.populatingAnimation = new Animation( {
      to: totalFrames,
      duration: isSettingPhetioStateProperty.value ? 0 : this.animationDuration,
      easing: Easing.LINEAR,
      getValue: () => {
        return this.currentFrame;
      },
      setValue: frame => {
        const progress = this.currentFrame / totalFrames;
        const currentRadius = progress * maxRadius;

        for ( let i = 0; i < this.sideLength; i++ ) {
          for ( let j = 0; j < this.sideLength; j++ ) {
            const dx = i - center;
            const dy = j - center;
            const distance = Math.sqrt( dx * dx + dy * dy );

            if ( distance <= currentRadius ) {
              const index = i * this.sideLength + j;
              if ( this.pixels[ index ] === 0 ) {

                // Some chance to populate a pixel
                if ( dotRandom.nextDouble() < 0.3 ) {
                  this.pixels[ index ] = 1; // Set to grey
                }
              }
            }
          }
        }

        this.invalidatePaint();
        this.currentFrame = frame;
      }
    } );
    this.populatingAnimation.start();

    this.populatingAnimation.endedEmitter.addListener( () => {
      this.setAllPixels( 1 );
      this.currentFrame = 0;
      this.coinSetInTestBoxProperty.value = true;
      this.populatingAnimation = null;
    } );
  }

  public startFlippingAnimation(): void {

    // Stop any previously initiated animation.
    if ( this.flippingAnimation ) {
      this.flippingAnimation.stop();
    }

    this.flippingAnimation = new Animation( {
      to: 100,
      duration: MEASUREMENT_PREPARATION_TIME,
      getValue: () => this.currentFrame,
      setValue: frame => {
        for ( let i = 0; i < this.sideLength; i++ ) {
          for ( let j = 0; j < this.sideLength; j++ ) {
            const index = i * this.sideLength + j;

            // Set a random value between 0 and 1 for each pixel.
            this.pixels[ index ] = ( dotRandom.nextInt( 2 ) + 1 ) / 2;
          }
        }
        this.invalidatePaint();
        this.currentFrame = frame;
      }
    } );

    this.flippingAnimation.endedEmitter.addListener( () => {
      this.setAllPixels( 1 );
      this.currentFrame = 0;
    } );

    this.flippingAnimation?.start();
  }

  /**
   * Stop any in-progress animations and revert pixels back to their initial state.
   */
  public abortAllAnimations( pixelState = 1 ): void {

    this.populatingAnimation && this.populatingAnimation.stop();
    this.flippingAnimation && this.flippingAnimation.stop();
    this.setAllPixels( pixelState );

    // Set the flag to indicate that the coins aren't in the box.
    this.coinSetInTestBoxProperty.value = false;
  }

  public setAllPixels( value: number ): void {
    this.pixels = new Array( this.sideLength * this.sideLength ).fill( value );
  }

  /**
   * Paint the pixels on the canvas node.
   */
  public paintCanvas( context: CanvasRenderingContext2D ): void {

    let getColor: ( value: number ) => string;
    switch( this.coinSet.measurementStateProperty.value ) {
      case 'preparingToBeMeasured':

        // Coins are flipping, so alternate between grey and light grey. 0 is used when repreparing.
        getColor = ( value: number ) => {
          return value === 1 ? 'grey' :
                 value === 0.5 ? '#aaa' : // light grey
                 'transparent';
        };
        break;

      case 'revealed':
        getColor = ( value: number ) => {
          return value === 1 ? 'black' : 'fuchsia';
        };
        break;

      case 'readyToBeMeasured':

        // quantum case for coins traveling to the box
        getColor = ( value: number ) => {
          return value === 1 ? 'grey' : 'transparent';
        };
        break;

      case 'measuredAndHidden':
        if ( this.coinSetInTestBoxProperty.value ) {

          // The coins are already in the box, so just show them as grey.
          getColor = () => 'grey';
        }
        else {

          // Classical case for coins traveling to the box
          getColor = ( value: number ) => {
            return value === 1 ? 'grey' : 'transparent';
          };
        }
        break;

      default:
        assert && assert( false, 'Not all states are being considered in CoinSetPixelRepresentation' );
        getColor = () => {
          return 'red';
        };
        break;
    }

    // Render the pixels to the buffer canvas.
    const bufferContext = this.pixelBuffer.getContext( '2d' )!;
    bufferContext.clearRect( 0, 0, this.sideLength, this.sideLength );
    for ( let i = 0; i < this.sideLength; i++ ) {
      for ( let j = 0; j < this.sideLength; j++ ) {
        const index = i * this.sideLength + j;
        bufferContext.fillStyle = getColor( this.pixels[ index ] );
        bufferContext.fillRect( j, i, 1, 1 );
      }
    }

    // Draw the pixels on the visible canvas.
    context.save();
    const scaledSideLength = this.sideLength * this.pixelScale;
    context.drawImage( this.pixelBuffer, 0, 0, scaledSideLength, scaledSideLength );
    context.restore();
  }
}

export default CoinSetPixelRepresentation;
quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );