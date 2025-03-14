// Copyright 2024-2025, University of Colorado Boulder

/**
 * QuantumCoinStates is a union type the represents the possible states for the face of a quantum coin.  Note that one
 * of the states is 'superposition', which is a state that is unique to quantum coins, and means that it is in a
 * superposition of the up and down states.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const QuantumCoinStateValues = [ 'up', 'down', 'superposition' ] as const;
export type QuantumCoinStates = ( typeof QuantumCoinStateValues )[number];