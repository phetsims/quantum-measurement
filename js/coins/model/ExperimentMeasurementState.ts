// Copyright 2024, University of Colorado Boulder

/**
 * ExperimentMeasurementState is a string union that functions as an enumeration of the possible states for a basic
 * measurement experiment. It essentially encodes two pieces of information, one being whether the state of the
 * experiment has been measured and the other being whether the state is hidden or shown. Because the combination
 * of not measured and shown is not possible, this amounts to three states. See the comments below for each state for
 * more details.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const ExperimentMeasurementStateValues = [

  // The experiment is prepared and can be measured, but hasn't been yet.
  'readyToBeMeasured',

  // The experiment is in the process of preparing to be measured. For example, in the case of a coin flipping
  // experiment, this is the state when the coin is being flipped.
  'preparingToBeMeasured',

  // The experiment's state has been measured and revealed to the observer(s).
  'measuredAndRevealed'

] as const;

export type ExperimentMeasurementState = ( typeof ExperimentMeasurementStateValues )[number];