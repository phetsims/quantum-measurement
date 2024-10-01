// Copyright 2024, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation handles the creation and display of an NxN grid of coins,
 * each represented by a pixel.
 *
 * @author Agustín Vallejo
 *
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import { MEASUREMENT_PREPARATION_TIME } from '../../common/model/TwoStateSystemSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';

export default class CoinSetPixelRepresentation extends CanvasNode {
  private readonly sideLength = 100;
  private pixels = new Array( 100 * 100 ).fill( 0 );
  private pixelScale = 1;
  private currentFrame = 0;

  public readonly populatingAnimation: Animation;
  public readonly flippingAnimation: Animation;

  public constructor(
    private readonly systemType: 'classical' | 'quantum',
    private readonly experimentStateProperty: TReadOnlyProperty<ExperimentMeasurementState>,
    providedOptions?: CanvasNodeOptions
  ) {
    super( providedOptions );

    const center = Math.floor( this.sideLength / 2 );
    const maxRadius = Math.sqrt( 2 ) * center * 1.1; // 10% extra radius to avoid missed pixels at the corners
    const fps = 40;
    const totalFrames = 4 * MEASUREMENT_PREPARATION_TIME / fps;

    this.populatingAnimation = new Animation( {
      to: totalFrames,
      duration: MEASUREMENT_PREPARATION_TIME,
      getValue: () => this.currentFrame,
      setValue: frame => {
        {
          const progress = frame / totalFrames;
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
      }
    } );

    this.flippingAnimation = new Animation( {
      to: 100,
      duration: MEASUREMENT_PREPARATION_TIME,
      getValue: () => this.currentFrame,
      setValue: frame => {
        for ( let i = 0; i < this.sideLength; i++ ) {
          for ( let j = 0; j < this.sideLength; j++ ) {
            const index = i * this.sideLength + j;
            // Set a random value between 0 and 1 for each pixel
            this.pixels[ index ] = ( dotRandom.nextInt( 2 ) + 1 ) / 2;
          }
        }
        this.invalidatePaint();
        this.currentFrame = frame;
      }
    } );

    this.populatingAnimation.finishEmitter.addListener( () => {
      this.setAllPixels( 1 );
      this.currentFrame = 0;
    } );

    this.flippingAnimation.finishEmitter.addListener( () => {
      this.setAllPixels( 1 );
      this.currentFrame = 0;
    } );

    this.setAllPixels( 0 );

    this.experimentStateProperty.lazyLink( state => {
      this.invalidatePaint();
      if ( state === 'readyToBeMeasured' ) {
        this.setAllPixels( 1 );
      }
    } );
  }

  public redraw( measuredValues: Array<string | null> ): void {

    const comparisonValue = this.systemType === 'classical' ? 'heads' : 'up';
    // Create an array of pixel colors (1 for fuchsia, 0 for black)
    this.pixels = measuredValues.map( value => value === comparisonValue ? 1 : 0 );

    this.invalidatePaint();
  }

  /**
   * Sets the scale of the grid.
   */
  public setPixelScale( scale: number ): void {
    this.pixelScale = scale;
  }

  /**
   * Paints the grid lines on the canvas node.
   */
  public paintCanvas( context: CanvasRenderingContext2D ): void {

    let getColor: ( value: number ) => string;
    switch( this.experimentStateProperty.value ) {
      case 'preparingToBeMeasured':
        getColor = ( value: number ) => {
          return value === 1 ? 'grey' :
                 value === 0.5 ? '#aaa' : // light grey
                 'transparent';
        };
        break;
      case 'measuredAndRevealed':
        getColor = ( value: number ) => {
          return value === 1 ? 'black' : 'fuchsia';
        };
        break;
      case 'readyToBeMeasured':
        getColor = ( value: number ) => {
          return value === 1 ? 'grey' : 'transparent';
        };
        break;
      default:
        getColor = () => {
          return 'red';
        };
        break;
    }

    context.save();
    // Draw pixels on canvas
    for ( let i = 0; i < this.sideLength; i++ ) {
      for ( let j = 0; j < this.sideLength; j++ ) {
        const index = i * this.sideLength + j;
        context.fillStyle = getColor( this.pixels[ index ] );
        context.fillRect( j * this.pixelScale, i * this.pixelScale, this.pixelScale, this.pixelScale );
      }
    }

    context.restore();
  }

  public startPopulatingAnimation(): void {
    // Set all pixels to 0
    this.setAllPixels( 0 );

    this.populatingAnimation.start();
  }

  public startFlippingAnimation(): void {
    this.flippingAnimation.start();
  }

  /**
   * Closure function to stop all ongoing animations and revert pixels back to their initial state.
   */
  public abortAllAnimations( pixelState = 1 ): void {
    this.flippingAnimation.stop();
    this.populatingAnimation.stop();
    this.currentFrame = 0;
    this.setAllPixels( pixelState );
  }

  public setAllPixels( value: number ): void {
    this.pixels = new Array( this.sideLength * this.sideLength ).fill( value );
  }
}

quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );