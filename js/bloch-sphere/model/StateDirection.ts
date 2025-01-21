// Copyright 2024-2025, University of Colorado Boulder

/**
 * Represents the possible preset directions the state vector within the Bloch Sphere can have.
 *
 * @author Agustín Vallejo
 */

import Vector3 from '../../../../dot/js/Vector3.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { MeasurementAxis } from './MeasurementAxis.js';

export class StateDirection extends EnumerationValue {
  public static readonly X_PLUS = new StateDirection( '+X', Math.PI / 2, 0, 'XPlus' );
  public static readonly X_MINUS = new StateDirection( '-X', Math.PI / 2, Math.PI, 'XMinus' );
  public static readonly Y_PLUS = new StateDirection( '+Y', Math.PI / 2, Math.PI / 2, 'YPlus' );
  public static readonly Y_MINUS = new StateDirection( '-Y', Math.PI / 2, 3 * Math.PI / 2, 'YMinus' );
  public static readonly Z_PLUS = new StateDirection( '+Z', 0, 0, 'ZPlus' );
  public static readonly Z_MINUS = new StateDirection( '-Z', Math.PI, 0, 'ZMinus' );
  public static readonly CUSTOM = new StateDirection( 'Custom', 0, 0, 'Custom' );

  public static readonly enumeration = new Enumeration( StateDirection );

  public readonly shortName: string;

  public constructor( public readonly description: string,
                      public readonly polarAngle: number,
                      public readonly azimuthalAngle: number,
                      public readonly tandemName: string ) {
    super();

    this.shortName = description.replace( '+', '' );
  }

  public static directionToVector( direction: StateDirection | MeasurementAxis ): Vector3 {
    return new Vector3( Math.sin( direction.polarAngle ) * Math.cos( direction.azimuthalAngle ),
      Math.sin( direction.polarAngle ) * Math.sin( direction.azimuthalAngle ),
      Math.cos( direction.polarAngle ) );
  }

  public static anglesToVector( polarAngle: number, azimuthalAngle: number ): Vector3 {
    return new Vector3( Math.sin( polarAngle ) * Math.cos( azimuthalAngle ),
      Math.sin( polarAngle ) * Math.sin( azimuthalAngle ),
      Math.cos( polarAngle ) );
  }
}

quantumMeasurement.register( 'StateDirection', StateDirection );