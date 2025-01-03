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

export class MeasurementBasis extends EnumerationValue {
  public static readonly S_SUB_X = new MeasurementBasis( QuantumMeasurementStrings.SSubXStringProperty, Math.PI / 2, 0, 'SSubX' );
  public static readonly S_SUB_Y = new MeasurementBasis( QuantumMeasurementStrings.SSubYStringProperty, Math.PI / 2, Math.PI / 2, 'SSubY' );
  public static readonly S_SUB_Z = new MeasurementBasis( QuantumMeasurementStrings.SSubZStringProperty, 0, 0, 'SSubZ' );

  public static readonly enumeration = new Enumeration( MeasurementBasis );

  public constructor( public readonly label: TReadOnlyProperty<string>,
                      public readonly polarAngle: number,
                      public readonly azimuthalAngle: number,
                      public readonly tandemName: string ) {
    super();
  }
}

quantumMeasurement.register( 'MeasurementBasis', MeasurementBasis );