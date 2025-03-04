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
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';

const ARROW_LENGTH = 20;
const ARROW_NODE_COMMON_OPTIONS: ArrowNodeOptions = {
  headHeight: ARROW_LENGTH / 5,
  headWidth: ARROW_LENGTH / 3,
  tailWidth: ARROW_LENGTH / 18
};
const MIN_MARGIN_FACTOR = 0.3;

export default class QuantumCoinNode extends CoinNode {

  public readonly showSuperpositionProperty: BooleanProperty;

  public constructor( coinStateProperty: TReadOnlyProperty<QuantumCoinStates>,
                      stateProbabilityProperty: TReadOnlyProperty<number>,
                      radius: number,
                      tandem: Tandem ) {

    const upFaceOptions: CoinFaceParameters = {
      fill: QuantumMeasurementColors.upFillColorProperty,
      stroke: QuantumMeasurementColors.upColorProperty,
      content: new ArrowNode( 0, 0, 0, ARROW_LENGTH, combineOptions<ArrowNodeOptions>( ARROW_NODE_COMMON_OPTIONS, {
        fill: QuantumMeasurementColors.upColorProperty
      } ) ),
      minYMarginFactor: MIN_MARGIN_FACTOR
    };

    const downFaceOptions: CoinFaceParameters = {
      fill: QuantumMeasurementColors.downFillColorProperty,
      stroke: QuantumMeasurementColors.downColorProperty,
      content: new ArrowNode( 0, ARROW_LENGTH, 0, 0, combineOptions<ArrowNodeOptions>( ARROW_NODE_COMMON_OPTIONS, {
        fill: QuantumMeasurementColors.upColorProperty
      } ) ),
      minYMarginFactor: MIN_MARGIN_FACTOR
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