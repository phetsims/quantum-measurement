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
import CoinNode, { CoinFaceParameters } from './CoinNode.js';
import { PhysicalCoinStates } from '../model/PhysicalCoinStates.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

const HEADS_FILL = new Color( '#EFE4B0' );
const HEADS_STROKE_AND_LETTER_COLOR = Color.BLACK;
const TAILS_FILL = new Color( '#EFE4B0' );
const TAILS_STROKE_AND_LETTER_COLOR = Color.MAGENTA;
const LETTER_LABEL_FONT = new PhetFont( { size: 40, weight: 'bold' } );

export default class PhysicalCoinNode extends CoinNode {

  public constructor( coinStateProperty: TReadOnlyProperty<PhysicalCoinStates>, radius: number, tandem: Tandem ) {

    const headsOptions: CoinFaceParameters = {
      fill: HEADS_FILL,
      stroke: HEADS_STROKE_AND_LETTER_COLOR,
      content: new Text( 'H', {
        font: LETTER_LABEL_FONT,
        fill: HEADS_STROKE_AND_LETTER_COLOR
      } )
    };

    const tailsOptions: CoinFaceParameters = {
      fill: TAILS_FILL,
      stroke: TAILS_STROKE_AND_LETTER_COLOR,
      content: new Text( 'T', {
        font: LETTER_LABEL_FONT,
        fill: TAILS_STROKE_AND_LETTER_COLOR
      } )
    };

    const crossFadeProperty: TReadOnlyProperty<number> = new DerivedProperty(
      [ coinStateProperty ],
      coinState => coinState === 'heads' ? 0 : 1
    );

    super( radius, crossFadeProperty, [ headsOptions, tailsOptions ], { tandem: tandem } );
  }
}

quantumMeasurement.register( 'PhysicalCoinNode', PhysicalCoinNode );