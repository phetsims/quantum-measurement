// Copyright 2025, University of Colorado Boulder

/**
 * SpinMeasurementStates is a union type the represents the possible states for the measurement of a quantum spin system.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

export const SpinMeasurementStateValues = [

  // The system is prepared for a measurement.
  'prepared',

  // The system is prepared for a measurement and a timer is running, and when the timer expires, the measurement will
  // be made.
  'timingObservation',

  // The spin of the system has been measured (aka observed).
  'observed'

] as const;
export type SpinMeasurementState = ( typeof SpinMeasurementStateValues )[number];