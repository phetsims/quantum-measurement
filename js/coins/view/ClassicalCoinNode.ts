// Copyright 2024, University of Colorado Boulder

/**
 * ClassicalCoinNode portrays a single classical coin in the view, allowing users to see its orientation, e.g. heads up
 * or tails up.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';

const HEADS_FILL = new Color( '#EFE4B0' );
const HEADS_STROKE_AND_LETTER_COLOR = Color.BLACK;
const TAILS_FILL = new Color( '#EFE4B0' );
const TAILS_STROKE_AND_LETTER_COLOR = Color.MAGENTA;
const LETTER_LABEL_FONT = new PhetFont( { size: 40, weight: 'bold' } );

export default class ClassicalCoinNode extends CoinNode {

  public constructor( coinStateProperty: TReadOnlyProperty<ClassicalCoinStates>, radius: number, tandem: Tandem ) {

    const headsOptions: CoinFaceParameters = {
      fill: HEADS_FILL,
      stroke: HEADS_STROKE_AND_LETTER_COLOR,
      content: new Text( QuantumMeasurementStrings.classicalUpSymbolStringProperty, {
        font: LETTER_LABEL_FONT,
        fill: HEADS_STROKE_AND_LETTER_COLOR,
        boundsMethod: 'accurate'
      } )
    };

    const tailsOptions: CoinFaceParameters = {
      fill: TAILS_FILL,
      stroke: TAILS_STROKE_AND_LETTER_COLOR,
      content: new Text( QuantumMeasurementStrings.classicalDownSymbolStringProperty, {
        font: LETTER_LABEL_FONT,
        fill: TAILS_STROKE_AND_LETTER_COLOR,
        boundsMethod: 'accurate'
      } ),
      minYMarginFactor: 0.3
    };

    const crossFadeProperty: TReadOnlyProperty<number> = new DerivedProperty(
      [ coinStateProperty ],
      coinState => coinState === 'heads' ? 1 : 0
    );

    super( radius, crossFadeProperty, [ headsOptions, tailsOptions ], { tandem: tandem } );
  }
}

quantumMeasurement.register( 'ClassicalCoinNode', ClassicalCoinNode );