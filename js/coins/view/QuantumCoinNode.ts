// Copyright 2024-2025, University of Colorado Boulder

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
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';

const FONT = new PhetFont( { size: 40, weight: 'bold' } );

export default class QuantumCoinNode extends CoinNode {

  public readonly showSuperpositionProperty: BooleanProperty;

  public constructor( coinStateProperty: TReadOnlyProperty<QuantumCoinStates>,
                      stateProbabilityProperty: TReadOnlyProperty<number>,
                      radius: number,
                      tandem: Tandem ) {

    const upFaceOptions: CoinFaceParameters = {
      fill: QuantumMeasurementColors.upFillColorProperty,
      stroke: QuantumMeasurementColors.upColorProperty,
      content: new Text( QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER, {
        font: FONT,
        fill: QuantumMeasurementColors.upColorProperty
      } )
    };

    const downFaceOptions: CoinFaceParameters = {
      fill: QuantumMeasurementColors.downFillColorProperty,
      stroke: QuantumMeasurementColors.downColorProperty,
      content: new Text( QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER, {
        font: FONT,
        fill: QuantumMeasurementColors.downColorProperty
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