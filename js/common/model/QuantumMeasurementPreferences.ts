// Copyright 2025, University of Colorado Boulder

/**
 * QuantumMeasurementPreferences is the model for sim-specific preferences.  The values declared here can be updated via
 * the Preferences dialog.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementQueryParameters from '../QuantumMeasurementQueryParameters.js';

const QuantumMeasurementPreferences = {

  // Toggles whether Global Phase will be shown in the Bloch Sphere Screen.
  showGlobalPhaseProperty: new BooleanProperty( QuantumMeasurementQueryParameters.showGlobalPhase, {
    tandem: Tandem.PREFERENCES.createTandem( 'showGlobalPhaseProperty' ),
    phetioFeatured: true
  } ),

  classicalCoinsStartVisibleProperty: new BooleanProperty( QuantumMeasurementQueryParameters.classicalCoinsStartVisible, {
    tandem: Tandem.PREFERENCES.createTandem( 'classicalCoinsStartVisibleProperty' ),
    phetioFeatured: true
  } )
};

quantumMeasurement.register( 'QuantumMeasurementPreferences', QuantumMeasurementPreferences );
export default QuantumMeasurementPreferences;