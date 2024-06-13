// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinStates is a union type the represents the possible states for a quantum coin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const QuantumCoinStateValues = [ 'up', 'down' ] as const;
export type QuantumCoinStates = ( typeof QuantumCoinStateValues )[number];