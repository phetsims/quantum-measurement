// Copyright 2025, University of Colorado Boulder

/**
 * CoinStates is a type that represents the possible states for the face of a classical or quantum coin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStateValues } from './ClassicalCoinStates.js';
import { QuantumCoinStateValues } from './QuantumCoinStates.js';

export const CoinStateValues = [ ...ClassicalCoinStateValues, ...QuantumCoinStateValues ] as const;
export type CoinStates = ( typeof CoinStateValues )[number];

// Workaround for mapping model states to accessible names
export const CoinStatesAccessibleNameMap = {
  heads: QuantumMeasurementStrings.a11y.coinsScreen.coinStates.headsStringProperty,
  tails: QuantumMeasurementStrings.a11y.coinsScreen.coinStates.tailsStringProperty,
  up: QuantumMeasurementStrings.a11y.coinsScreen.coinStates.upStringProperty,
  down: QuantumMeasurementStrings.a11y.coinsScreen.coinStates.downStringProperty,
  superposition: QuantumMeasurementStrings.a11y.coinsScreen.coinStates.superpositionStringProperty
};

// TODO: Wondering about a better pattern for this, see https://github.com/phetsims/quantum-measurement/issues/92
// TODO: This will be leaking memory, see https://github.com/phetsims/quantum-measurement/issues/92
export const getCoinAccessibleName = ( property: Property<CoinStates> ): TReadOnlyProperty<string> => {
  return DerivedProperty.deriveAny( [ property, ..._.values( CoinStatesAccessibleNameMap ) ], () => CoinStatesAccessibleNameMap[ property.value ].value );
};