// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinNode portrays a single "quantum" coin in the view, allowing users to see its orientation, e.g. spin up,
 * spin down, or transposed somewhere in between.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Color, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';

const UP_FILL = new Color( '#00FFFF' );
const UP_STROKE_AND_ARROW_COLOR = Color.BLACK;
const DOWN_FILL = new Color( '#FFFF00' );
const DOWN_STROKE_AND_ARROW_COLOR = Color.MAGENTA;
const FONT = new PhetFont( { size: 40, weight: 'bold' } );

export default class QuantumCoinNode extends CoinNode {

  public constructor( stateProbabilityProperty: TReadOnlyProperty<number>,
                      radius: number,
                      tandem: Tandem ) {

    const upFaceOptions: CoinFaceParameters = {
      fill: UP_FILL,
      stroke: UP_STROKE_AND_ARROW_COLOR,
      content: new Text( QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER, {
        font: FONT,
        fill: UP_STROKE_AND_ARROW_COLOR
      } )
    };

    const downFaceOptions: CoinFaceParameters = {
      fill: DOWN_FILL,
      stroke: DOWN_STROKE_AND_ARROW_COLOR,
      content: new Text( QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER, {
        font: FONT,
        fill: DOWN_STROKE_AND_ARROW_COLOR
      } )
    };

    super( radius, stateProbabilityProperty, [ upFaceOptions, downFaceOptions ], { tandem: tandem } );
  }
}

quantumMeasurement.register( 'QuantumCoinNode', QuantumCoinNode );