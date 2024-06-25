// Copyright 2024, University of Colorado Boulder


/**
 * SmallCoinNode portrays the relatively small coins that are used in the "Multiple Coin Measurements" area on the Coins
 * screen. These are distinct from the larger coins shown in the "Single Coin Measurements" section.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Circle, Color, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;
export type SmallCoinNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export type SmallCoinDisplayMode = 'masked' | 'heads' | 'tails' | 'up' | 'down';

// constants
const DEFAULT_ARROW_FONT = new PhetFont( { size: 8, weight: 'bold' } );
const COIN_STROKE = new Color( '#888888' );
const MASKED_FILL = new Color( '#cccccc' );
const HEADS_FILL = Color.BLACK;
const TAILS_FILL = Color.MAGENTA;

export default class SmallCoinNode extends Node {

  public readonly displayModeProperty: TProperty<SmallCoinDisplayMode>;
  public readonly radius: number;

  public constructor( radius: number,
                      providedOptions?: SmallCoinNodeOptions ) {

    const coinCircle = new Circle( radius, {
      fill: MASKED_FILL,
      stroke: COIN_STROKE,
      lineWidth: Math.floor( radius / 5 )
    } );

    // Create the up and down arrows as Text nodes.
    const upArrow = new Text( QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER, {
      fill: Color.BLACK,
      font: DEFAULT_ARROW_FONT
    } );
    const downArrow = new Text( QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER, {
      fill: Color.MAGENTA,
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
        coinCircle.stroke = Color.TRANSPARENT;
      }
      else if ( displayMode === 'down' ) {
        upArrow.visible = false;
        downArrow.visible = true;
        coinCircle.fill = Color.TRANSPARENT;
        coinCircle.stroke = Color.TRANSPARENT;
      }
    };

    this.displayModeProperty.link( updateCoinAppearance );
  }
}

quantumMeasurement.register( 'SmallCoinNode', SmallCoinNode );