// Copyright 2024, University of Colorado Boulder

/**
 * SpinVector is a simple EnumerationValue class to switch between Single Particle and Continuous source modes.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export class SourceMode extends EnumerationValue {

  public static readonly SINGLE = new SourceMode( 'Single Particle', 'singleParticle' );

  public static readonly CONTINUOUS = new SourceMode( 'Continuous', 'continuous' );

  public static readonly enumeration = new Enumeration( SourceMode );

  public constructor( public readonly sourceName: string | TReadOnlyProperty<string>, public readonly tandemName: string ) {
    super();
  }
}
quantumMeasurement.register( 'SourceMode', SourceMode );