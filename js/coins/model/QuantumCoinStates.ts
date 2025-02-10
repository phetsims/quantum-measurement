// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinStates is a union type the represents the possible states for a quantum coin.  Note that one of the states
 * is 'superposed', which is a state that is unique to quantum coins, and means that it is in a superposition of the
 * up and down states.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const QuantumCoinStateValues = [ 'up', 'down', 'superposed' ] as const;
export type QuantumCoinStates = ( typeof QuantumCoinStateValues )[number];