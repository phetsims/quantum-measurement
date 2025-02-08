// Copyright 2025, University of Colorado Boulder

/**
 * CoinFaceStates is a union type that represents the possible states for the face of a classical or quantum coin.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const CoinFaceStateValues = [ 'heads', 'tails', 'up', 'down', 'superposed' ] as const;
export type CoinFaceStates = ( typeof CoinFaceStateValues )[number];