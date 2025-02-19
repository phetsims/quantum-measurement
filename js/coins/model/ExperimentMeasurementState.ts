// Copyright 2024-2025, University of Colorado Boulder

/**
 * ExperimentMeasurementState is a string union that functions as an enumeration of the possible states for a basic
 * measurement experiment. The possible values of the states are intended to support the measurement of both classical
 * and quantum systems.  The states used and the transitions between them will be somewhat different for classical
 * versus quantum systems.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

// REVIEW: Why did you decide to use a string union instead of an enum? Your measurementStateProperty could also be
  // an EnumerationProperty which provides more support for valid values.
export const ExperimentMeasurementStateValues = [

  // The experiment is in the process of preparing to be measured. For example, in the case of a coin flipping
  // experiment, this is the state when the coin is being flipped.
  'preparingToBeMeasured',

  // The experiment is prepared and can be measured, but hasn't been yet.  This state only applies to quantum systems.
  'readyToBeMeasured',

  // The experiment is in a state where the values are determined but are not currently being shown to the user.
  'measuredAndHidden',

  // The experiment's state has been revealed to the observer(s).
  'revealed'

] as const;

export type ExperimentMeasurementState = ( typeof ExperimentMeasurementStateValues )[number];