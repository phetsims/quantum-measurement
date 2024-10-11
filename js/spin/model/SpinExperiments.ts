// Copyright 2024, University of Colorado Boulder

/**
 * SpinExperiments contains the details for all posisble Stern-Gerlach configurations of the Spin Screen.
 *
 * // TODO: So far basing off OrbitalSystem.ts https://github.com/phetsims/quantum-measurement/issues/53
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';


type SternGerlachOptions = {
  isZOriented: boolean;
  active: boolean;
};

export default class SpinExperiments extends EnumerationValue {

  public static readonly EXPERIMENT_1 = new SpinExperiments( 'Experiment 1 [SGz]', [
    { isZOriented: true, active: true }
  ] );
  public static readonly EXPERIMENT_2 = new SpinExperiments( 'Experiment 2 [SGx]', [
    { isZOriented: false, active: true }
  ] );
  public static readonly EXPERIMENT_3 = new SpinExperiments( 'Experiment 3 [Sz, Sx]', [
    { isZOriented: true, active: true },
    { isZOriented: false, active: true }
  ] );
  public static readonly EXPERIMENT_4 = new SpinExperiments( 'Experiment 4 [Sz, Sz]', [
    { isZOriented: true, active: true },
    { isZOriented: true, active: true }
  ] );
  public static readonly EXPERIMENT_5 = new SpinExperiments( 'Experiment 5 [Sx, Sz]', [
    { isZOriented: false, active: true },
    { isZOriented: true, active: true }
  ] );
  public static readonly EXPERIMENT_6 = new SpinExperiments( 'Experiment 6 [Sx, Sx]', [
    { isZOriented: false, active: true },
    { isZOriented: false, active: true }
  ] );
  public static readonly CUSTOM = new SpinExperiments( 'Custom', [
    { isZOriented: false, active: false },
    { isZOriented: false, active: false }
  ] );

  public static readonly enumeration = new Enumeration( SpinExperiments );

  public readonly experimentName: string | TReadOnlyProperty<string>;

  public readonly experimentSettings: SternGerlachOptions[];

  public constructor( experimentName: string | TReadOnlyProperty<string>, experimentSettings: SternGerlachOptions[] ) {
    super();
    this.experimentName = experimentName;
    this.experimentSettings = experimentSettings;
  }
}

quantumMeasurement.register( 'SpinExperiments', SpinExperiments );