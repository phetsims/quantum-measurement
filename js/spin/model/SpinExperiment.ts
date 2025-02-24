// Copyright 2024-2025, University of Colorado Boulder

/**
 * SpinExperiment is an enumeration that contains the details for all possible Stern-Gerlach configurations used on the
 * Spin Screen.
 *
 * @author Agustín Vallejo
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
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

  public readonly isCustom: boolean = this === SpinExperiment.CUSTOM;

  // whether the blocker is blocking the up or down exit, if applicable
  public readonly blockingModeProperty: Property<BlockingMode>;

  public constructor( index: string | TReadOnlyProperty<string>,
                      experimentOrder: string | TReadOnlyProperty<string>, // Like '[SGz, SGx]'
                      experimentSetting: SternGerlachExperimentSetting[] ) {

    super();
    this.experimentName = index === 'Custom' ?
                          QuantumMeasurementStrings.customStringProperty :
                          new PatternStringProperty(
                            QuantumMeasurementStrings.experimentNPatternStringProperty,
                            {
                              number: index,
                              order: experimentOrder
                            }
                          );
    this.experimentSetting = experimentSetting;

    this.usingSingleApparatus = this.experimentSetting.length === 1;

    this.blockingModeProperty = new EnumerationProperty( BlockingMode.BLOCK_UP );
  }

  public static reset(): void {
    // Since each value has an associated property, which gets altered by the model, we have to manually reset them here
    SpinExperiment.enumeration.values.forEach( experiment => { experiment.blockingModeProperty.reset(); } );
  }
}

quantumMeasurement.register( 'SpinExperiment', SpinExperiment );