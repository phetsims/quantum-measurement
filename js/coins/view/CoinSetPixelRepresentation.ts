// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation represents a set of classical or quantum coins as a grid of pixels.  The pixels are
 * colored to represent the state of the coins.  This is used only for the largest number of coins.
 *
 * This class also implements animations for populating the pixel grid and for flipping the coins.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Agustín Vallejo
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

    if ( this.coinSet.validateAlternativeDisplay ) {

      // Happy Easter.
      const dataIndex = Math.floor( index / 32 );
      const mask = 1 << ( index % 32 ); // eslint-disable-line no-bitwise
      return coherentAlternativeTransactionData[ dataIndex ] & mask ? // eslint-disable-line no-bitwise
             QuantumMeasurementColors.headsColorProperty.value.toCSS() :
             QuantumMeasurementColors.tailsColorProperty.value.toCSS();
    }
    else {
      return COIN_STATE_TO_COLOR_MAP.get( this.coinSet.measuredValues[ index ] )!.value.toCSS();
    }
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

const coherentAlternativeTransactionData = [
  0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 504241895, 2122293223, 0,
  3773951600, 3891920497, 31, 253683456, 2141185854, 510, 4058935296, 4194202593,
  8167, 518455296, 2682732061, 130687, 3462397952, 841171408, 1623601, 3858759680,
  576985348, 25977619, 1610612736, 641830990, 415641906, 0, 1679394022, 2349011746,
  1, 1100500576, 3253743654, 24, 1065674240, 520290916, 396, 4168015872,
  808463427, 6336, 2281439232, 50512952, 101475, 2076180480, 809255816, 1623600,
  3154116608, 63189123, 25977603, 3221225472, 1038588987, 535296120, 0, 2658780060,
  4269770627, 1, 3885775296, 3891820601, 31, 2042862592, 2139587486, 510,
  2621030400, 4168628711, 4071, 3281518592, 2273549945, 32383, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0,
  65536, 805308416, 1040187392, 1048576, 100696064, 1610612787, 16777220, 3758620672,
  48, 505297094, 15784176, 120664843, 839141472, 161058817, 2299736208, 1023182336,
  2308562961, 2603817216, 541876255, 2576417042, 2737960968, 205914120, 2567967522, 858816665,
  65012110, 2516673223, 856165145, 57539, 0, 0, 0, 8388608,
  6291456, 0, 402653184, 130023424, 0, 3221225472, 1056964615, 0,
  0, 3120546300, 3073, 0, 4294966720, 127004, 0, 2071552,
  3351014, 0, 3260416, 104009216, 0, 1835008, 3339771904, 0,
  12582912, 1620967424, 12, 67108864, 84140032, 398, 1879048192, 1885437952,
  6336, 2147483648, 67375043, 202754, 67108864, 1621164572, 3342384, 2147483648,
  439881923, 53528226, 0, 2495680448, 855892497, 0, 1277419520, 805712081,
  3, 1275461632, 2154988514, 49, 2153902080, 127664159, 796, 1876951040,
  3779082240, 12399, 1073741824, 185057292, 230159, 0, 2352743244, 1841200,
  0, 2978007280, 14796292, 0, 4029782240, 252698672, 0, 4256367040,
  1912471817, 0, 204473344, 2680166529, 3, 2397044736, 4026552337, 196633,
  3783262208, 229680, 4194236, 100663296, 990214, 74099584, 402653184, 983152,
  2175449088, 1073741825, 1920, 179240960, 32, 14339, 1794113536, 1024,
  114700, 2936012800, 98307, 1835040, 4026531840, 1835018, 14680448, 0,
  14680175, 234882048, 0, 260047856, 3758104576, 0, 1006636800, 2147581952,
  31, 4026560512, 15728641, 244, 2147713024, 4026531847, 4294967152, 524799,
  28, 261872, 8380416, 224, 15360, 218103808, 3968, 16384,
  3489660928, 64513, 262144, 0, 1040445, 4194304, 0, 15665104,
  67108864, 0, 49937664, 1073741824, 0, 503304192, 0, 4,
  2013069312, 0, 64, 2144337920, 3, 1024, 2097152000, 15,
  16384, 3489660928, 117, 262144, 0, 349, 4194304, 0,
  2384, 67108864, 0, 29952, 1073741824, 0, 217088, 0,
  4, 1376256, 0, 64, 13631488, 0, 1024, 218103808,
  0, 4294950912, 1073741823, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0
];

export default CoinSetPixelRepresentation;
quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );