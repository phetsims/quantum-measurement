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
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import { MEASUREMENT_PREPARATION_TIME } from '../model/CoinSet.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';

type SelfOptions = EmptySelfOptions;
export type SmallCoinNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// Define a type for the display mode that composes all possible coin values plus one for when the coin is hidden.
export type SmallCoinDisplayMode = ClassicalCoinStates | QuantumCoinStates | 'hidden';

// constants
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

    // Create the up and down arrows as ArrowNode instances.
    const arrowLength = radius * 1.25;
    const commonArrowOptions: ArrowNodeOptions = {
      headHeight: arrowLength / 2,
      headWidth: arrowLength / 1.5,
      tailWidth: arrowLength / 5
    };
    const upArrow = new ArrowNode( 0, arrowLength, 0, 0, combineOptions<ArrowNodeOptions>( commonArrowOptions, {
      stroke: null,
      fill: UP_COLOR_PROPERTY,
      center: Vector2.ZERO
    } ) );
    const downArrow = new ArrowNode( 0, 0, 0, arrowLength, combineOptions<ArrowNodeOptions>( commonArrowOptions, {
      stroke: null,
      fill: DOWN_COLOR_PROPERTY,
      center: Vector2.ZERO
    } ) );

    const options = optionize<SmallCoinNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ coinCircle, upArrow, downArrow ]
    }, providedOptions );

    super( options );

    this.radius = radius;
    this.coinCircle = coinCircle;
    this.displayModeProperty = new Property<SmallCoinDisplayMode>( 'hidden' );

    const updateCoinAppearance = ( displayMode: SmallCoinDisplayMode ) => {
      if ( displayMode === 'hidden' ) {
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

  /**
   * Start the flipping animation for the coin. This will cause the coin to appear to flip in place.  It does this by
   * scaling the coin in the one direction while keeping the orthogonal scale unchanged.
   */
  public startFlipping(): void {

    // The phase of the flip animation, in radians.  A value of 0 means the coin is flat with respect to the screen.
    let flipPhase = 0;

    // The scale of the coin in the x direction from the previous frame.  This is used to handle the case where the
    // scale is zero, which can't be set directly, so we skip over it in the direction it was changing.
    let previousXScale = 0;

    // The ending point of the animation.  This is randomly chosen so that a group of coins will flip and different
    // speeds, which looks more interesting.
    const destinationPhaseMultiplier = dotRandom.nextDoubleBetween( 4, 12 );

    // The axis of rotation for the flipping, which is randomly chosen.
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

    // When the animation ends, set the scale back to 1 to make the coin look flat and round.
    this.flippingAnimation.endedEmitter.addListener( () => {
      this.coinCircle.setScaleMagnitude( 1, 1 );
      this.flippingAnimation = null;
    } );

    // Kick off the animation.
    this.flippingAnimation.start();
  }

  /**
   * Stop the flipping animation if it is in progress.
   */
  public stopFlipping(): void {
    if ( this.flippingAnimation ) {
      this.flippingAnimation.stop();
    }
  }
}

quantumMeasurement.register( 'SmallCoinNode', SmallCoinNode );

export default SmallCoinNode;