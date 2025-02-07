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
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';

const HEADS_FILL_COLOR_PROPERTY = QuantumMeasurementColors.headsFillColorProperty;
const HEADS_STROKE_AND_LETTER_COLOR_PROPERTY = QuantumMeasurementColors.headsColorProperty;
const TAILS_FILL_COLOR_PROPERTY = QuantumMeasurementColors.tailsFillColorProperty;
const TAILS_STROKE_AND_LETTER_COLOR_PROPERTY = QuantumMeasurementColors.tailsColorProperty;
const LETTER_LABEL_FONT = new PhetFont( { size: 40, weight: 'bold' } );

export default class ClassicalCoinNode extends CoinNode {

  public constructor( coinStateProperty: TReadOnlyProperty<ClassicalCoinStates>, radius: number, tandem: Tandem ) {

    const headsOptions: CoinFaceParameters = {
      fill: HEADS_FILL_COLOR_PROPERTY,
      stroke: HEADS_STROKE_AND_LETTER_COLOR_PROPERTY,
      content: new Text( QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL, {
        font: LETTER_LABEL_FONT,
        fill: HEADS_STROKE_AND_LETTER_COLOR_PROPERTY,
        boundsMethod: 'accurate'
      } )
    };

    const tailsOptions: CoinFaceParameters = {
      fill: TAILS_FILL_COLOR_PROPERTY,
      stroke: TAILS_STROKE_AND_LETTER_COLOR_PROPERTY,
      content: new Text( QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL, {
        font: LETTER_LABEL_FONT,
        fill: TAILS_STROKE_AND_LETTER_COLOR_PROPERTY,
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