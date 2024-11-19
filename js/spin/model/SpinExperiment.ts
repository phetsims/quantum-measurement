// Copyright 2024, University of Colorado Boulder

/**
 * SpinExperiment contains the details for all posisble Stern-Gerlach configurations of the Spin Screen.
 *
 * // TODO: Think of a better logic for blocking https://github.com/phetsims/quantum-measurement/issues/53
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlockingMode } from './BlockingMode.js';


type SternGerlachExperimentSetting = {
  isZOriented: boolean;
};

export default class SpinExperiment extends EnumerationValue {

  public static readonly EXPERIMENT_1 = new SpinExperiment( 'Experiment 1 [SGz]', [
    { isZOriented: true }
  ] );
  public static readonly EXPERIMENT_2 = new SpinExperiment( 'Experiment 2 [SGx]', [
    { isZOriented: false }
  ] );
  public static readonly EXPERIMENT_3 = new SpinExperiment( 'Experiment 3 [SGz, SGx]', [
    { isZOriented: true },
    { isZOriented: false },
    { isZOriented: false }
  ] );
  public static readonly EXPERIMENT_4 = new SpinExperiment( 'Experiment 4 [SGz, SGz]', [
    { isZOriented: true },
    { isZOriented: true },
    { isZOriented: true }
  ] );
  public static readonly EXPERIMENT_5 = new SpinExperiment( 'Experiment 5 [SGx, SGz]', [
    { isZOriented: false },
    { isZOriented: true },
    { isZOriented: true }
  ] );
  public static readonly EXPERIMENT_6 = new SpinExperiment( 'Experiment 6 [SGx, SGx]', [
    { isZOriented: false },
    { isZOriented: false },
    { isZOriented: false }
  ] );
  public static readonly CUSTOM = new SpinExperiment( 'Custom', [
    { isZOriented: false },
    { isZOriented: true },
    { isZOriented: true }
  ] );

  public static readonly enumeration = new Enumeration( SpinExperiment );

  public readonly experimentName: string | TReadOnlyProperty<string>;

  public readonly experimentSetting: SternGerlachExperimentSetting[];

  // TODO: Better naming, see https://github.com/phetsims/quantum-measurement/issues/53
  public readonly isShortExperiment: boolean;

  public readonly blockingModeProperty: Property<BlockingMode>;

  public constructor( experimentName: string | TReadOnlyProperty<string>, experimentSetting: SternGerlachExperimentSetting[] ) {
    super();
    this.experimentName = experimentName;
    this.experimentSetting = experimentSetting;

    this.isShortExperiment = this.experimentSetting.length === 1;

    this.blockingModeProperty = new Property<BlockingMode>( BlockingMode.BLOCK_UP );
  }
}

quantumMeasurement.register( 'SpinExperiment', SpinExperiment );