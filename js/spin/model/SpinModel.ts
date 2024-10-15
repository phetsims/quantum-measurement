// Copyright 2024, University of Colorado Boulder

/**
 * The SpinModel handles the state and behavior for the "Spin" screen.
 * In here, the user will select between initial spin values of incoming particles, represented via a Bloch Sphere.
 * The particles will pass across a series of Stern Gerlach experiments, and the final state will be displayed.
 *
 * This model is responsible for managing the selected spin state, or the experiment.
 *
 * @author Agustín Vallejo
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';
import SpinExperiment from './SpinExperiment.js';
import SternGerlachModel from './SternGerlachModel.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;


export class SpinValue extends EnumerationValue {

  // TODO: This should go in the strings file https://github.com/phetsims/quantum-measurement/issues/53
  public static readonly Z_PLUS = new SpinValue( 'Z_PLUS', '"+Z"    ⟨Sz⟩ = +ħ/2', 'ZPlus' );
  public static readonly X_PLUS = new SpinValue( 'X_PLUS', '"+X"    ⟨Sz⟩ = 0', 'XPlus' );
  public static readonly Z_MINUS = new SpinValue( 'Z_MINUS', '"-Z"    ⟨Sz⟩ = -ħ/2', 'ZMinus' );

  public static readonly enumeration = new Enumeration( SpinValue );

  public constructor( public readonly value: string,
                      public readonly description: string | TReadOnlyProperty<string>,
                      public readonly tandemName: string ) {
    super();
  }
}

export class SourceMode extends EnumerationValue {

  public static readonly SINGLE = new SourceMode( 'Single Particle', 'singleParticle' );

  public static readonly CONTINUOUS = new SourceMode( 'Continuous', 'continuous' );

  public static readonly enumeration = new Enumeration( SourceMode );

  public constructor( public readonly sourceName: string | TReadOnlyProperty<string>, public readonly tandemName: string ) {
    super();
  }
}

export default class SpinModel implements TModel {

  public readonly sourceModeProperty: Property<SourceMode>;

  public readonly blochSphere: SimpleBlochSphere;

  public readonly currentExperimentProperty: Property<SpinExperiment>;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly firstSternGerlachModel: SternGerlachModel;
  public readonly secondSternGerlachModel: SternGerlachModel;
  public readonly thirdSternGerlachModel: SternGerlachModel;

  public readonly currentlyShootingParticlesProperty: Property<boolean>;

  public readonly particleAmmountProperty: NumberProperty;

  // Used to update the opacities of the particle rays
  // TODO: Better naming?? https://github.com/phetsims/quantum-measurement/issues/53
  public readonly probabilitiesUpdatedEmitter: Emitter = new Emitter();

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.sourceModeProperty = new Property<SourceMode>( SourceMode.SINGLE );

    this.blochSphere = new SimpleBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
    } );

    this.currentExperimentProperty = new Property<SpinExperiment>( SpinExperiment.EXPERIMENT_1 );

    const sternGerlachModelsTandem = providedOptions.tandem.createTandem( 'sternGerlachModels' );
    this.firstSternGerlachModel = new SternGerlachModel( true, sternGerlachModelsTandem.createTandem( 'firstSternGerlachModel' ) );
    this.secondSternGerlachModel = new SternGerlachModel( false, sternGerlachModelsTandem.createTandem( 'secondSternGerlachModel' ) );
    this.thirdSternGerlachModel = new SternGerlachModel( false, sternGerlachModelsTandem.createTandem( 'thirdSternGerlachModel' ) );

    const sternGerlachModels = [ this.firstSternGerlachModel, this.secondSternGerlachModel, this.thirdSternGerlachModel ];

    this.currentExperimentProperty.link( experiment => {
      sternGerlachModels.forEach( ( sternGerlachModel, index ) => {
        if ( experiment.experimentSetting.length > index ) {
          // TODO: Should visibility be only handled via the View? https://github.com/phetsims/quantum-measurement/issues/53
          sternGerlachModel.isVisibleProperty.set( experiment.experimentSetting[ index ].active );
          sternGerlachModel.isZOrientedProperty.set( experiment.experimentSetting[ index ].isZOriented );
        }
        else {
          sternGerlachModel.isVisibleProperty.set( false );
        }
      } );

      // Set the probabilities of the experiment. In the continuous case, this immediately alters the shown rays
      // In the single case, this prepares the probabilities for the particle that will be shot
      // TODO: Given the above description, is measure() a correct name? https://github.com/phetsims/quantum-measurement/issues/53
      this.measure();
    } );

    this.blochSphere.spinStateProperty.link( () => {
      this.measure();
    } );

    this.currentlyShootingParticlesProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'currentlyShootingParticlesProperty' ),
      phetioValueType: BooleanIO
    } );

    this.particleAmmountProperty = new NumberProperty( 1, {
      tandem: providedOptions.tandem.createTandem( 'particleAmmountProperty' ),
      range: new Range( 0, 1 )
    } );

  }

  public measure(): void {
    const experimentSetting = this.currentExperimentProperty.value.experimentSetting;

    // Measure on the first SG, this will change its upProbabilityProperty
    this.firstSternGerlachModel.measure( this.blochSphere.spinStateProperty.value );

    if ( experimentSetting.length > 1 ) {
      // Measure on the second SG according to the orientation of the first one
      this.secondSternGerlachModel.measure(
        // SG1 passes the up-spin particles to SG2
        this.firstSternGerlachModel.isZOrientedProperty.value ? SpinValue.Z_PLUS : SpinValue.X_PLUS
      );

      this.thirdSternGerlachModel.measure(
        // SG1 passes the down-spin particles to SG3, and because X- is not in the initial spin values, we pass null
        this.firstSternGerlachModel.isZOrientedProperty.value ? SpinValue.Z_MINUS : null
      );

    }

    this.probabilitiesUpdatedEmitter.emit();
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    // TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }
}

quantumMeasurement.register( 'SpinModel', SpinModel );