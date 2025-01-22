// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation handles the creation and display of an NxN grid of coins,
 * each represented by a pixel.
 *
 * @author Agustín Vallejo
 *
 */

import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { MEASUREMENT_PREPARATION_TIME } from '../../common/model/TwoStateSystemSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';

type SelfOptions = {
  animationDuration?: number;
};

type CoinSetPixelRepresentationOptions = SelfOptions & CanvasNodeOptions;

class CoinSetPixelRepresentation extends CanvasNode {
  private readonly sideLength = 100;
  private pixels = new Array( 100 * 100 ).fill( 0 );
  private pixelScale = 1;
  private currentFrame = 0;

  public populatingAnimation: Animation | null = null;
  public flippingAnimation: Animation | null = null;

  public animationDuration: number;

  public constructor(
    private readonly systemType: 'classical' | 'quantum',
    private readonly experimentStateProperty: TReadOnlyProperty<ExperimentMeasurementState>,
    private readonly coinSetInTestBoxProperty: TProperty<boolean>,
    providedOptions?: CoinSetPixelRepresentationOptions
  ) {

    const options = optionize<CoinSetPixelRepresentationOptions, SelfOptions, CanvasNodeOptions>()( {
      animationDuration: MEASUREMENT_PREPARATION_TIME
    }, providedOptions );

    super( options );

    this.animationDuration = options.animationDuration;

    this.createAnimations();

    this.setAllPixels( 0 );

    this.experimentStateProperty.lazyLink( state => {
      this.invalidatePaint();
      if ( state === 'readyToBeMeasured' ) {
        this.setAllPixels( 1 );
      }
    } );
  }

  public createAnimations(): void {

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

    this.populatingAnimation.endedEmitter.addListener( () => {
      this.setAllPixels( 1 );
      this.currentFrame = 0;
      this.coinSetInTestBoxProperty.value = true;
    } );

    this.flippingAnimation.endedEmitter.addListener( () => {
      this.setAllPixels( 1 );
      this.currentFrame = 0;
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

  public startPopulatingAnimation(): void {
    assert && assert( this.populatingAnimation, 'populatingAnimation should be defined, perhaps createAnimations() was not properly called?' );

    if ( this.visible ) {
      // Set all pixels to 0
      this.setAllPixels( 0 );
      this.currentFrame = 0;
      this.populatingAnimation?.start();
    }
  }

  public startFlippingAnimation(): void {
    assert && assert( this.flippingAnimation, 'flippingAnimation should be defined, perhaps createAnimations() was not properly called?' );

    if ( this.visible ) {
      this.flippingAnimation?.start();
    }
  }

  /**
   * Closure function to stop all ongoing animations and revert pixels back to their initial state.
   */
  public abortAllAnimations( pixelState = 1 ): void {
    assert && assert( this.populatingAnimation, 'populatingAnimation should be defined, perhaps createAnimations() was not properly called?' );
    assert && assert( this.flippingAnimation, 'flippingAnimation should be defined, perhaps createAnimations() was not properly called?' );

    this.flippingAnimation?.stop();
    this.populatingAnimation?.stop();
    this.setAllPixels( pixelState );

    // Set the flag to indicate that the coins aren't in the box.
    this.coinSetInTestBoxProperty.value = false;

    this.createAnimations();
  }

  public setAllPixels( value: number ): void {
    this.pixels = new Array( this.sideLength * this.sideLength ).fill( value );
  }

  /**
   * Paints the grid lines on the canvas node.
   */
  public paintCanvas( context: CanvasRenderingContext2D ): void {

    let getColor: ( value: number ) => string;
    switch( this.experimentStateProperty.value ) {
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
        // Quantum case for coins traveling to the box
        getColor = ( value: number ) => {
          return value === 1 ? 'grey' : 'transparent';
        };
        break;
      case 'measuredAndHidden':
        if ( this.coinSetInTestBoxProperty.value ) {
          // The coins are already in the box, just show them as grey.
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
}

export default CoinSetPixelRepresentation;
quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );