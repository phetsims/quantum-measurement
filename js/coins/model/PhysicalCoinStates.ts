// Copyright 2024, University of Colorado Boulder

/**
 * PhysicalCoinStates is a union type the represents the possible states for a physical coin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const PhysicalCoinStateValues = [ 'heads', 'tails' ] as const;
export type PhysicalCoinStates = ( typeof PhysicalCoinStateValues )[number];