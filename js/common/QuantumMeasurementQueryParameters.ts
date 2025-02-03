// Copyright 2024, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import quantumMeasurement from '../quantumMeasurement.js';

const QuantumMeasurementQueryParameters = QueryStringMachine.getAll( {
  showGlobalPhase: {
    type: 'boolean',
    defaultValue: false
  }
} );

quantumMeasurement.register( 'QuantumMeasurementQueryParameters', QuantumMeasurementQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.quantumMeasurement.QuantumMeasurementQueryParameters' );

export default QuantumMeasurementQueryParameters;