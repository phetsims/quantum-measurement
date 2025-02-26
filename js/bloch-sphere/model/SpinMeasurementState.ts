// Copyright 2025, University of Colorado Boulder

/**
 * SpinMeasurementStates is an enumearion of possible spin measurement states.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export class SpinMeasurementState extends EnumerationValue {
  public static readonly PREPARED = new SpinMeasurementState();
  public static readonly TIMING_OBSERVATION = new SpinMeasurementState();
  public static readonly OBSERVED = new SpinMeasurementState();

  public static readonly enumeration = new Enumeration( SpinMeasurementState );

  public constructor() {
    super();
  }
}