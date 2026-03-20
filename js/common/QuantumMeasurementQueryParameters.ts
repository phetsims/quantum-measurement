// Copyright 2024-2026, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author John Blanco, PhET Interactive Simulations
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import quantumMeasurement from '../quantumMeasurement.js';

const QuantumMeasurementQueryParameters = QueryStringMachine.getAll( {
  showGlobalPhase: {
    type: 'boolean',
    defaultValue: false,
    public: true
  },
  classicalCoinsStartHidden: {
    type: 'boolean',
    defaultValue: false,
    public: true
  }
} );

quantumMeasurement.register( 'QuantumMeasurementQueryParameters', QuantumMeasurementQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `QuantumMeasurementQueryParameters: ${JSON.stringify( QuantumMeasurementQueryParameters, null, 2 )}` );

export default QuantumMeasurementQueryParameters;
