// Copyright 2024, University of Colorado Boulder


/**
 * SmallCoinNode portrays the relatively small coins that are used in the "Multiple Coin Measurements" area on the Coins
 * screen. These are distinct from the larger coins shown in the "Single Coin Measurements" section.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
export type SmallCoinNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export type SmallCoinDisplayMode = 'masked' | 'heads' | 'tails' | 'up' | 'down';

// constants
const DEFAULT_ARROW_FONT = new PhetFont( { size: 8, weight: 'bold' } );
const COIN_STROKE = new Color( '#888888' );
const MASKED_FILL = new Color( '#cccccc' );
const HEADS_FILL = Color.BLACK;
const TAILS_FILL = Color.MAGENTA;
const UP_COLOR = Color.BLACK;
const DOWN_COLOR = Color.MAGENTA;

export default class SmallCoinNode extends Node {

  public readonly displayModeProperty: TProperty<SmallCoinDisplayMode>;
  public readonly radius: number;
  private coinCircle: Circle;
  private flippingAnimation: Animation | null = null;

  public constructor( radius: number,
                      providedOptions?: SmallCoinNodeOptions ) {

    const coinCircle = new Circle( radius, {
      fill: MASKED_FILL,
      stroke: COIN_STROKE,
      lineWidth: Math.max( Math.floor( radius / 4 ), 1 )
    } );

    // Create the up and down arrows as Text nodes.
    const upArrow = new Text( QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER, {
      fill: UP_COLOR,
      font: DEFAULT_ARROW_FONT
    } );
    const downArrow = new Text( QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER, {
      fill: DOWN_COLOR,
      font: DEFAULT_ARROW_FONT
    } );

    // Scale the arrows to fit within the coin circle.
    const arrowNodeScale = ( radius * 2 ) / upArrow.height;
    upArrow.scale( arrowNodeScale );
    upArrow.center = Vector2.ZERO;
    downArrow.scale( arrowNodeScale );
    downArrow.center = Vector2.ZERO;

    const options = optionize<SmallCoinNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ coinCircle, upArrow, downArrow ]
    }, providedOptions );

    super( options );

    this.radius = radius;
    this.coinCircle = coinCircle;
    this.displayModeProperty = new Property<SmallCoinDisplayMode>( 'masked' );

    const updateCoinAppearance = ( displayMode: SmallCoinDisplayMode ) => {
      if ( displayMode === 'masked' ) {
        upArrow.visible = false;
        downArrow.visible = false;
        coinCircle.fill = MASKED_FILL;
        coinCircle.stroke = COIN_STROKE;
      }
      else if ( displayMode === 'heads' ) {
        upArrow.visible = false;
        downArrow.visible = false;
        coinCircle.fill = HEADS_FILL;
        coinCircle.stroke = COIN_STROKE;
      }
      else if ( displayMode === 'tails' ) {
        upArrow.visible = false;
        downArrow.visible = false;
        coinCircle.fill = TAILS_FILL;
        coinCircle.stroke = COIN_STROKE;
      }
      else if ( displayMode === 'up' ) {
        upArrow.visible = true;
        downArrow.visible = false;
        coinCircle.fill = Color.TRANSPARENT;
        coinCircle.stroke = UP_COLOR;
      }
      else if ( displayMode === 'down' ) {
        upArrow.visible = false;
        downArrow.visible = true;
        coinCircle.fill = Color.TRANSPARENT;
        coinCircle.stroke = DOWN_COLOR;
      }
    };

    this.displayModeProperty.link( updateCoinAppearance );
  }

  public get isFlipping(): boolean { return this.flippingAnimation !== null; }

  public startFlipping(): void {
    let flipPhase = 0;
    let previousXScale = 0;
    const destinationPhaseMultiplier = dotRandom.nextDoubleBetween( 4, 12 );
    const rotationalAxis = dotRandom.nextIntBetween( 0, 2 ) * 2 * Math.PI / 3;
    this.coinCircle.setRotation( rotationalAxis );

    this.flippingAnimation = new Animation( {
      setValue: value => {
        flipPhase = value;
        let xScale = Math.sin( flipPhase );

        // Handle the case where we hit zero, since the scale can't be set to that value.
        if ( xScale === 0 ) {
          xScale = previousXScale < 0 ? 0.01 : -0.01;
        }
        this.coinCircle.setScaleMagnitude( xScale, 1 );
        previousXScale = xScale;
      },
      getValue: () => flipPhase,
      to: Math.PI * destinationPhaseMultiplier,
      duration: QuantumMeasurementConstants.PREPARING_TO_BE_MEASURED_TIME,
      easing: Easing.LINEAR
    } );
    this.flippingAnimation.endedEmitter.addListener( () => {
      this.coinCircle.setScaleMagnitude( 1, 1 );
      this.flippingAnimation = null;
    } );
    this.flippingAnimation.start();
  }

  public stopFlipping(): void {
    if ( this.flippingAnimation ) {
      this.flippingAnimation.stop();
    }
  }
}

quantumMeasurement.register( 'SmallCoinNode', SmallCoinNode );