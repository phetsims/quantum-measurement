// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinNode portrays a single "quantum" coin in the view, allowing users to see its orientation, e.g. spin up,
 * spin down, or transposed somewhere in between.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';

const UP_FILL = new Color( '#00FFFF' );
const UP_STROKE_AND_ARROW_COLOR = Color.BLACK;
const DOWN_FILL = new Color( '#FFFF00' );
const DOWN_STROKE_AND_ARROW_COLOR = Color.MAGENTA;
const FONT = new PhetFont( { size: 40, weight: 'bold' } );

export default class QuantumCoinNode extends CoinNode {

  public readonly showSuperpositionProperty: BooleanProperty;

  public constructor( coinStateProperty: TReadOnlyProperty<QuantumCoinStates>,
                      stateProbabilityProperty: TReadOnlyProperty<number>,
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

    const showSuperpositionProperty = new BooleanProperty( true );
    const crossFadeProperty = new DerivedProperty(
      [ coinStateProperty, stateProbabilityProperty, showSuperpositionProperty ],
      ( coinState, stateProbability, showSuperposition ) => {
        return showSuperposition ? stateProbability :
               coinState === 'up' ? 1 : 0;
      }
    );

    super( radius, crossFadeProperty, [ upFaceOptions, downFaceOptions ], { tandem: tandem } );

    this.showSuperpositionProperty = showSuperpositionProperty;
  }
}

quantumMeasurement.register( 'QuantumCoinNode', QuantumCoinNode );