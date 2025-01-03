// Copyright 2025, University of Colorado Boulder

/**
 * Contains the two possible selectable scenes on the Bloch Screen
 *
 * @author Agustín Vallejo
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export class BlochSphereScene extends EnumerationValue {
  public static readonly MEASUREMENT = new BlochSphereScene( 'Measurement', 'measurementScene' );
  public static readonly PRECESSION = new BlochSphereScene( 'Precession', 'precessionScene' );

  public static readonly enumeration = new Enumeration( BlochSphereScene );

  public constructor( public readonly description: string,
                      public readonly tandemName: string ) {
    super();
  }
}

quantumMeasurement.register( 'BlochSphereScene', BlochSphereScene );