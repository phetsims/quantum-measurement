// Copyright 2025, University of Colorado Boulder

/**
 * Contains the three posible directions the measurements can be performed in
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { StateDirection } from './StateDirection.js';

export class MeasurementAxis extends EnumerationValue {
  public static readonly X_PLUS = new MeasurementAxis(
    QuantumMeasurementStrings.SSubXStringProperty, Math.PI / 2, 0, StateDirection.X_MINUS, 'SSubX'
  );
  public static readonly Y_PLUS = new MeasurementAxis(
    QuantumMeasurementStrings.SSubYStringProperty, Math.PI / 2, Math.PI / 2, StateDirection.Y_MINUS, 'SSubY'
  );
  public static readonly Z_PLUS = new MeasurementAxis(
    QuantumMeasurementStrings.SSubZStringProperty, 0, 0, StateDirection.Z_MINUS, 'SSubZ'
  );

  public static readonly enumeration = new Enumeration( MeasurementAxis );

  public constructor( public readonly label: TReadOnlyProperty<string>,
                      public readonly polarAngle: number,
                      public readonly azimuthalAngle: number,
                      public readonly oppositeDirection: StateDirection,
                      public readonly tandemName: string ) {
    super();
  }
}

quantumMeasurement.register( 'MeasurementAxis', MeasurementAxis );