// Copyright 2024, University of Colorado Boulder

/**
 * SpinExperiment contains the details for all posisble Stern-Gerlach configurations of the Spin Screen.
 *
 * // TODO: Think of a better logic for blocking https://github.com/phetsims/quantum-measurement/issues/53
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';


type SternGerlachExperimentSetting = {
  isZOriented: boolean;
  active: boolean;
};

export default class SpinExperiment extends EnumerationValue {

  public static readonly EXPERIMENT_1 = new SpinExperiment( 'Experiment 1 [SGz]', [
    { isZOriented: true, active: true }
  ] );
  public static readonly EXPERIMENT_2 = new SpinExperiment( 'Experiment 2 [SGx]', [
    { isZOriented: false, active: true }
  ] );
  public static readonly EXPERIMENT_3 = new SpinExperiment( 'Experiment 3 [SGz, SGx]', [
    { isZOriented: true, active: true },
    { isZOriented: false, active: true },
    { isZOriented: false, active: true }
  ] );
  public static readonly EXPERIMENT_4 = new SpinExperiment( 'Experiment 4 [SGz, SGz]', [
    { isZOriented: true, active: true },
    { isZOriented: true, active: true },
    { isZOriented: true, active: true }
  ] );
  public static readonly EXPERIMENT_5 = new SpinExperiment( 'Experiment 5 [SGx, SGz]', [
    { isZOriented: false, active: true },
    { isZOriented: true, active: true },
    { isZOriented: true, active: true }
  ] );
  public static readonly EXPERIMENT_6 = new SpinExperiment( 'Experiment 6 [SGx, SGx]', [
    { isZOriented: false, active: true },
    { isZOriented: false, active: true },
    { isZOriented: false, active: true }
  ] );
  public static readonly CUSTOM = new SpinExperiment( 'Custom', [
    { isZOriented: false, active: false },
    { isZOriented: false, active: false },
    { isZOriented: false, active: false }
  ] );

  public static readonly enumeration = new Enumeration( SpinExperiment );

  public readonly experimentName: string | TReadOnlyProperty<string>;

  public readonly experimentSetting: SternGerlachExperimentSetting[];

  public readonly isShortExperiment: boolean;

  public constructor( experimentName: string | TReadOnlyProperty<string>, experimentSetting: SternGerlachExperimentSetting[] ) {
    super();
    this.experimentName = experimentName;
    this.experimentSetting = experimentSetting;

    this.isShortExperiment = this.experimentSetting.length === 1;
  }
}

quantumMeasurement.register( 'SpinExperiment', SpinExperiment );