// Copyright 2025-2026, University of Colorado Boulder

/**
 * QuantumMeasurementPreferences is the model for sim-specific preferences.  The values declared here can be updated via
 * the Preferences dialog.  This uses the singleton pattern, so only one instance of this class will exist, and so that
 * the preference values can be customized based on the sim configuration.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementQueryParameters from '../QuantumMeasurementQueryParameters.js';

class QuantumMeasurementPreferences {

  // controls whether Global Phase will be shown in the Bloch Sphere Screen
  public showGlobalPhaseProperty: BooleanProperty;

  // controls whether the classical coins will be shown or hidden initially in the measurement area
  public classicalCoinsStartHiddenProperty: BooleanProperty;

  // singleton instance
  private static instance: QuantumMeasurementPreferences | null = null;

  private constructor( hasBlochSphereNumericalEquation: boolean ) {

    this.classicalCoinsStartHiddenProperty = new BooleanProperty(
      QuantumMeasurementQueryParameters.classicalCoinsStartHidden,
      {
        tandem: Tandem.PREFERENCES.createTandem( 'classicalCoinsStartHiddenProperty' ),
        phetioFeatured: true
      }
    );

    this.showGlobalPhaseProperty = new BooleanProperty( QuantumMeasurementQueryParameters.showGlobalPhase, {
      tandem: hasBlochSphereNumericalEquation ?
              Tandem.PREFERENCES.createTandem( 'showGlobalPhaseProperty' ) :
              Tandem.OPT_OUT,
      phetioFeatured: true
    } );
  }

  /**
   * Initialize the preferences.  This must be called once and only once at sim startup.
   */
  public static initialize( hasBlochSphereNumericalEquation: boolean ): void {
    if ( QuantumMeasurementPreferences.instance === null ) {
      QuantumMeasurementPreferences.instance = new QuantumMeasurementPreferences( hasBlochSphereNumericalEquation );
    }
  }

  /**
   * Get the singleton instance of QuantumMeasurementPreferences.  This will assert error if the instance has not been
   * initialized.
   */
  public static getInstance(): QuantumMeasurementPreferences {
    assert && assert(
      QuantumMeasurementPreferences.instance !== null,
      'QuantumMeasurementPreferences must be initialized prior to use'
    );
    return QuantumMeasurementPreferences.instance!;
  }
}

export default QuantumMeasurementPreferences;
