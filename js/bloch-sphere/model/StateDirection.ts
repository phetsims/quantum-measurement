// Copyright 2024, University of Colorado Boulder

/**
 * Represents the possible preset directions the state vector within the Bloch Sphere can have.
 *
 * @author Agustín Vallejo
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export class StateDirection extends EnumerationValue {
  public static readonly Z_PLUS = new StateDirection( '+Z', 0, 0, 'ZPlus' );
  public static readonly Z_MINUS = new StateDirection( '-Z', Math.PI, 0, 'ZMinus' );
  public static readonly X_PLUS = new StateDirection( '+X', Math.PI / 2, 0, 'XPlus' );
  public static readonly X_MINUS = new StateDirection( '-X', Math.PI / 2, Math.PI, 'XMinus' );
  public static readonly Y_PLUS = new StateDirection( '+Y', Math.PI / 2, Math.PI / 2, 'YPlus' );
  public static readonly Y_MINUS = new StateDirection( '-Y', Math.PI / 2, 3 * Math.PI / 2, 'YMinus' );
  public static readonly CUSTOM = new StateDirection( 'Custom', 0, 0, 'Custom' );

  public static readonly enumeration = new Enumeration( StateDirection );

  public constructor( public readonly description: string,
                      public readonly polarAngle: number,
                      public readonly azimuthalAngle: number,
                      public readonly tandemName: string ) {
    super();
  }
}

quantumMeasurement.register( 'StateDirection', StateDirection );