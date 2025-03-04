// Copyright 2024-2025, University of Colorado Boulder

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
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import { MEASUREMENT_PREPARATION_TIME } from '../model/CoinSet.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';

type SelfOptions = EmptySelfOptions;
export type SmallCoinNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// REVIEW: What does it mean for a coin to be "masked"? Oh... I think I get it. It's masked when it's hidden? Maybe
// just switch that to "hidden" since that's terminology you're already using elsewhere.
// Define a type for the display mode that composes all possible coin values plus one for when the coin is masked.
export type SmallCoinDisplayMode = ClassicalCoinStates | QuantumCoinStates | 'masked';

// constants
const DEFAULT_ARROW_FONT = new PhetFont( { size: 8, weight: 'bold' } );
const COIN_STROKE_COLOR_PROPERTY = QuantumMeasurementColors.coinStrokeColorProperty;
const MASKED_FILL_COLOR_PROPERTY = QuantumMeasurementColors.maskedFillColorProperty;
const HEADS_FILL_COLOR_PROPERTY = QuantumMeasurementColors.headsColorProperty;
const TAILS_FILL_COLOR_PROPERTY = QuantumMeasurementColors.tailsColorProperty;
const UP_COLOR_PROPERTY = QuantumMeasurementColors.upColorProperty;
const DOWN_COLOR_PROPERTY = QuantumMeasurementColors.downColorProperty;

class SmallCoinNode extends Node {

  public readonly displayModeProperty: TProperty<SmallCoinDisplayMode>;
  public readonly radius: number;
  private coinCircle: Circle;
  private flippingAnimation: Animation | null = null;

  public constructor( radius: number, providedOptions?: SmallCoinNodeOptions ) {

    const coinCircle = new Circle( radius, {
      fill: MASKED_FILL_COLOR_PROPERTY,
      stroke: COIN_STROKE_COLOR_PROPERTY,
      lineWidth: Math.max( Math.floor( radius / 4 ), 1.5 )
    } );

    // Create the up and down arrows as Text nodes.
    const upArrow = new RichText( QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER, {
      fill: UP_COLOR_PROPERTY,
      font: DEFAULT_ARROW_FONT
    } );
    const downArrow = new RichText( QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER, {
      fill: DOWN_COLOR_PROPERTY,
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
        coinCircle.fill = MASKED_FILL_COLOR_PROPERTY;
        coinCircle.stroke = COIN_STROKE_COLOR_PROPERTY;
      }
      else if ( displayMode === 'heads' ) {
        upArrow.visible = false;
        downArrow.visible = false;
        coinCircle.fill = HEADS_FILL_COLOR_PROPERTY;
        coinCircle.stroke = HEADS_FILL_COLOR_PROPERTY;
      }
      else if ( displayMode === 'tails' ) {
        upArrow.visible = false;
        downArrow.visible = false;
        coinCircle.fill = TAILS_FILL_COLOR_PROPERTY;
        coinCircle.stroke = TAILS_FILL_COLOR_PROPERTY;
      }
      else if ( displayMode === 'up' ) {
        upArrow.visible = true;
        downArrow.visible = false;
        coinCircle.fill = Color.TRANSPARENT;
        coinCircle.stroke = UP_COLOR_PROPERTY;
      }
      else if ( displayMode === 'down' ) {
        upArrow.visible = false;
        downArrow.visible = true;
        coinCircle.fill = Color.TRANSPARENT;
        coinCircle.stroke = DOWN_COLOR_PROPERTY;
      }
    };

    this.displayModeProperty.link( updateCoinAppearance );
  }

  public get isFlipping(): boolean { return this.flippingAnimation !== null; }

  // REVIEW: I would recommend documenting this a bit more especially to describe the flipPhase, previousXScale,
  //  destinationPhaseMultiplier, and rotationalAxis. That will help future maintainers from having to re-read multiple
  // times or visit the sim to understand what is going on.
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
      duration: isSettingPhetioStateProperty.value ? 0 : MEASUREMENT_PREPARATION_TIME,
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

export default SmallCoinNode;