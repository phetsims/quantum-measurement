// Copyright 2025, University of Colorado Boulder

/**
 * SpinMeasurementStates is an enumearion of possible spin measurement states.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';

export class SpinMeasurementState extends EnumerationValue {
  public static readonly PREPARED = new SpinMeasurementState( QuantumMeasurementColors.startMeasurementButtonColorProperty );
  public static readonly TIMING_OBSERVATION = new SpinMeasurementState( QuantumMeasurementColors.startMeasurementButtonColorProperty );
  public static readonly OBSERVED = new SpinMeasurementState( QuantumMeasurementColors.experimentButtonColorProperty );

  public static readonly enumeration = new Enumeration( SpinMeasurementState );

  public constructor( public readonly colorProperty: ProfileColorProperty ) {
    super();
  }
}