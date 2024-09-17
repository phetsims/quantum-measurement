// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinStates is a union type the represents the possible states for a quantum coin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

// Collapsed states after measurements
export const QuantumCoinStateValues = [ 'up', 'down' ] as const;
export type QuantumCoinStates = ( typeof QuantumCoinStateValues )[number];

// Uncollapsed states when preparing the coin
export const QuantumUncollapsedCoinStateValues = [ 'up', 'down', 'superposed' ] as const;
export type QuantumUncollapsedCoinStates = ( typeof QuantumUncollapsedCoinStateValues )[number];