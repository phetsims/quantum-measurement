// Copyright 2024, University of Colorado Boulder

/**
 * CoinExperimentStates is the possible states that the coin experiments - including the single-coin and multi-coin
 * experiments - can be in during the experiment process.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const CoinExperimentStateValues = [ 'hiddenAndStill', 'preparingToBeMeasured', 'revealedAndStill' ] as const;
export type CoinExperimentStates = ( typeof CoinExperimentStateValues )[number];