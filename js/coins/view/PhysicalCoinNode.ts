// Copyright 2024, University of Colorado Boulder

/**
 * PhysicalCoinNode portrays a single physical coin in the view, allowing users to see its orientation, e.g. heads up or
 * tails up.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Color, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CoinNode, { CoinFaceOptions } from './CoinNode.js';
import { PhysicalCoinStates } from '../model/PhysicalCoinStates.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const HEADS_FILL = new Color( '#EFE4B0' );
const HEADS_STROKE_AND_LETTER_COLOR = Color.BLACK;
const TAILS_FILL = new Color( '#EFE4B0' );
const TAILS_STROKE_AND_LETTER_COLOR = Color.MAGENTA;
const LETTER_LABEL_FONT = new PhetFont( { size: 40, weight: 'bold' } );

export default class PhysicalCoinNode extends CoinNode<PhysicalCoinStates> {

  public constructor( coinState: TReadOnlyProperty<PhysicalCoinStates>, radius: number, tandem: Tandem ) {

    const headsOptions: CoinFaceOptions = {
      fill: HEADS_FILL,
      stroke: HEADS_STROKE_AND_LETTER_COLOR,
      content: new Text( 'H', {
        font: LETTER_LABEL_FONT,
        fill: HEADS_STROKE_AND_LETTER_COLOR
      } )
    };

    const tailsOptions: CoinFaceOptions = {
      fill: TAILS_FILL,
      stroke: TAILS_STROKE_AND_LETTER_COLOR,
      content: new Text( 'T', {
        font: LETTER_LABEL_FONT,
        fill: TAILS_STROKE_AND_LETTER_COLOR
      } )
    };

    const faceOptionMap = new Map<PhysicalCoinStates, CoinFaceOptions>( [
      [ 'heads', headsOptions ],
      [ 'tails', tailsOptions ]
    ] );

    super( coinState, radius, {
      faceOptionsMap: faceOptionMap,
      tandem: tandem
    } );
  }
}

quantumMeasurement.register( 'PhysicalCoinNode', PhysicalCoinNode );