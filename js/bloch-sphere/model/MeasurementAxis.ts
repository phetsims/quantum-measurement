// Copyright 2025, University of Colorado Boulder

/**
 * Contains the three possible directions the measurements can be performed in.
 *
 * @author Agustín Vallejo
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { StateDirection } from './StateDirection.js';

export class MeasurementAxis extends EnumerationValue {
  public static readonly X_PLUS = new MeasurementAxis(
    'X', Math.PI / 2, 0, StateDirection.X_MINUS, 'X'
  );
  public static readonly Y_PLUS = new MeasurementAxis(
    'Y', Math.PI / 2, Math.PI / 2, StateDirection.Y_MINUS, 'Y'
  );
  public static readonly Z_PLUS = new MeasurementAxis(
    'Z', 0, 0, StateDirection.Z_MINUS, 'Z'
  );

  public static readonly enumeration = new Enumeration( MeasurementAxis );

  public constructor( public readonly label: string,
                      public readonly polarAngle: number,
                      public readonly azimuthalAngle: number,
                      public readonly oppositeDirection: StateDirection,
                      public readonly tandemName: string ) {
    super();
  }
}

quantumMeasurement.register( 'MeasurementAxis', MeasurementAxis );