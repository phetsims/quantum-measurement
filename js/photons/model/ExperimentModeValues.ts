// Copyright 2025, University of Colorado Boulder

/**
 * Enumeration for the different modes of the experiment.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

export default class ExperimentModeValues extends EnumerationValue {
  public static readonly SINGLE_PHOTON = new ExperimentModeValues( QuantumMeasurementStrings.singlePhotonStringProperty, 'singlePhoton' );
  public static readonly MANY_PHOTONS = new ExperimentModeValues( QuantumMeasurementStrings.manyPhotonsStringProperty, 'manyPhotons' );

  public static readonly enumeration = new Enumeration( ExperimentModeValues );

  public colorProperty = QuantumMeasurementColors.classicalSceneTextColorProperty;

  public constructor( public readonly title: TReadOnlyProperty<string>, public readonly tandemName: string ) {
    super();
  }
}

quantumMeasurement.register( 'ExperimentModeValues', ExperimentModeValues );