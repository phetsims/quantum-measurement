// Copyright 2024, University of Colorado Boulder

/**
 * SystemType is used to distinguish between the two types of systems that are modeled in the sim: classical systems,
 * meaning something that is at the scale of typical human experience (e.g. a coin), and quantum systems, meaning
 * something that is very small and exhibits characteristics such as superpositions of internal state.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */


import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

export class SystemType extends EnumerationValue {

  public static readonly CLASSICAL = new SystemType(
    QuantumMeasurementStrings.classicalCoinStringProperty,
    QuantumMeasurementStrings.classicalStringProperty,
    'classical' );

  public static readonly QUANTUM = new SystemType(
    QuantumMeasurementStrings.quantumCoinQuotedStringProperty,
    QuantumMeasurementStrings.quantumStringProperty,
    'quantum' );

  public static readonly enumeration = new Enumeration( SystemType );

  public constructor(
    public readonly title: TReadOnlyProperty<string>,
    public readonly testingName: TReadOnlyProperty<string>,
    public readonly tandemName: string ) {
    super();
  }
}