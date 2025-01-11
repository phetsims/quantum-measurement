// Copyright 2024-2025, University of Colorado Boulder

/**
 * SpinExperiment contains the details for all posisble Stern-Gerlach configurations of the Spin Screen.
 *
 * @author Agustín Vallejo
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { BlockingMode } from './BlockingMode.js';


type SternGerlachExperimentSetting = {
  isZOriented: boolean;
};

export default class SpinExperiment extends EnumerationValue {

  public static readonly EXPERIMENT_1 = new SpinExperiment( '1', '[SGz]', [
    { isZOriented: true }
  ] );
  public static readonly EXPERIMENT_2 = new SpinExperiment( '2', '[SGx]', [
    { isZOriented: false }
  ] );
  public static readonly EXPERIMENT_3 = new SpinExperiment( '3', '[SGz, SGx]', [
    { isZOriented: true },
    { isZOriented: false },
    { isZOriented: false }
  ] );
  public static readonly EXPERIMENT_4 = new SpinExperiment( '4', '[SGz, SGz]', [
    { isZOriented: true },
    { isZOriented: true },
    { isZOriented: true }
  ] );
  public static readonly EXPERIMENT_5 = new SpinExperiment( '5', '[SGx, SGz]', [
    { isZOriented: false },
    { isZOriented: true },
    { isZOriented: true }
  ] );
  public static readonly EXPERIMENT_6 = new SpinExperiment( '6', '[SGx, SGx]', [
    { isZOriented: false },
    { isZOriented: false },
    { isZOriented: false }
  ] );
  public static readonly CUSTOM = new SpinExperiment( 'Custom', '', [
    { isZOriented: false },
    { isZOriented: true },
    { isZOriented: true }
  ] );

  public static readonly enumeration = new Enumeration( SpinExperiment );

  public readonly experimentName: string | TReadOnlyProperty<string>;

  public readonly experimentSetting: SternGerlachExperimentSetting[];

  public readonly usingSingleApparatus: boolean;

  // Wether the blocker is blocking the up or down exit, if applicable
  public readonly blockingModeProperty: Property<BlockingMode>;

  public constructor(
    index: string | TReadOnlyProperty<string>,
    experimentOrder: string | TReadOnlyProperty<string>, // Like '[SGz, SGx]'
    experimentSetting: SternGerlachExperimentSetting[]
  ) {
    super();
    this.experimentName = index === 'Custom' ?
                          QuantumMeasurementStrings.customStringProperty :
                          new DerivedStringProperty(
                            [ QuantumMeasurementStrings.experimentNPatternStringProperty ],
                            ( experimentNPattern: string ) => StringUtils.fillIn( experimentNPattern, {
                              number: index,
                              order: experimentOrder
                            } )
                          );
    this.experimentSetting = experimentSetting;

    this.usingSingleApparatus = this.experimentSetting.length === 1;

    this.blockingModeProperty = new Property<BlockingMode>( BlockingMode.BLOCK_UP );
  }
}

quantumMeasurement.register( 'SpinExperiment', SpinExperiment );