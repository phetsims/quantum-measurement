// Copyright 2024, University of Colorado Boulder

/**
 * ClassicalCoinStates is a union type the represents the possible states for a classical (e.g. non-quantum) coin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const ClassicalCoinStateValues = [ 'heads', 'tails' ] as const;
export type ClassicalCoinStates = ( typeof ClassicalCoinStateValues )[number];