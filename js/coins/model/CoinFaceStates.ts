// Copyright 2025, University of Colorado Boulder

/**
 * CoinFaceStates is a type that represents the possible states for the face of a classical or quantum coin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { ClassicalCoinStateValues } from './ClassicalCoinStates.js';
import { QuantumCoinStateValues } from './QuantumCoinStates.js';

export const CoinFaceStateValues = [ ...ClassicalCoinStateValues, ...QuantumCoinStateValues ] as const;
export type CoinFaceStates = ( typeof CoinFaceStateValues )[number];