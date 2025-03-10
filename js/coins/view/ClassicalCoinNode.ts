// Copyright 2024-2025, University of Colorado Boulder

/**
 * ClassicalCoinNode portrays a single classical coin in the view, allowing users to see its orientation, e.g. heads up
 * or tails up.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import classicalCoinHeads_svg from '../../../images/classicalCoinHeads_svg.js';
import classicalCoinTails_svg from '../../../images/classicalCoinTails_svg.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';

const HEADS_FILL_COLOR_PROPERTY = QuantumMeasurementColors.headsFillColorProperty;
const HEADS_STROKE_AND_LETTER_COLOR_PROPERTY = QuantumMeasurementColors.headsColorProperty;
const TAILS_FILL_COLOR_PROPERTY = QuantumMeasurementColors.tailsFillColorProperty;
const TAILS_STROKE_AND_LETTER_COLOR_PROPERTY = QuantumMeasurementColors.tailsColorProperty;

export default class ClassicalCoinNode extends CoinNode {

  public constructor( coinStateProperty: TReadOnlyProperty<ClassicalCoinStates>, radius: number, tandem: Tandem ) {

    const headsOptions: CoinFaceParameters = {
      fill: HEADS_FILL_COLOR_PROPERTY,
      stroke: HEADS_STROKE_AND_LETTER_COLOR_PROPERTY,
      content: new Image( classicalCoinHeads_svg )
    };

    const tailsOptions: CoinFaceParameters = {
      fill: TAILS_FILL_COLOR_PROPERTY,
      stroke: TAILS_STROKE_AND_LETTER_COLOR_PROPERTY,
      content: new Image( classicalCoinTails_svg ),
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