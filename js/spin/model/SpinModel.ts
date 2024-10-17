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
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ParticleWithSpinModel } from './ParticleWithSpinModel.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';
import { SourceMode } from './SourceMode.js';
import { SpinDirection } from './SpinDirection.js';
import SpinExperiment from './SpinExperiment.js';
import SternGerlachModel from './SternGerlachModel.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SpinModel implements TModel {

  public readonly sourceModeProperty: Property<SourceMode>;

  public readonly spinStateProperty: Property<SpinDirection>;

  public readonly blochSphere: SimpleBlochSphere;

  // Single particles shot by the user transversing the experiment
  public readonly singleParticles: ParticleWithSpinModel[];

  public readonly currentExperimentProperty: Property<SpinExperiment>;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly firstSternGerlachModel: SternGerlachModel;
  public readonly secondSternGerlachModel: SternGerlachModel;
  public readonly thirdSternGerlachModel: SternGerlachModel;

  public readonly currentlyShootingParticlesProperty: Property<boolean>;

  // Mapped from [0, 1] to control the Continuous mode, 0 is 'None' and 1 is 'Lots'
  public readonly particleAmmountProperty: NumberProperty;

  // Used to update the opacities of the particle rays
  // TODO: Better naming?? https://github.com/phetsims/quantum-measurement/issues/53
  public readonly probabilitiesUpdatedEmitter: Emitter = new Emitter();

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.sourceModeProperty = new Property<SourceMode>( SourceMode.SINGLE );

    this.spinStateProperty = new Property<SpinDirection>( SpinDirection.Z_PLUS, {
      validValues: SpinDirection.enumeration.values
    } );

    this.blochSphere = new SimpleBlochSphere(
      this.spinStateProperty, {
        tandem: providedOptions.tandem.createTandem( 'blochSphere' )
      } );

    const MAX_NUMBER_OF_SINGLE_PARTICLES = 10;

    this.currentExperimentProperty = new Property<SpinExperiment>( SpinExperiment.EXPERIMENT_1 );

    const sternGerlachModelsTandem = providedOptions.tandem.createTandem( 'sternGerlachModels' );
    this.firstSternGerlachModel = new SternGerlachModel( true, sternGerlachModelsTandem.createTandem( 'firstSternGerlachModel' ) );
    this.secondSternGerlachModel = new SternGerlachModel( false, sternGerlachModelsTandem.createTandem( 'secondSternGerlachModel' ) );
    this.thirdSternGerlachModel = new SternGerlachModel( false, sternGerlachModelsTandem.createTandem( 'thirdSternGerlachModel' ) );

    this.singleParticles = _.times( MAX_NUMBER_OF_SINGLE_PARTICLES, id => {
      const particle = new ParticleWithSpinModel( id );

      particle.readyToBeMeasuredEmitter.addListener( () => {

        let upProbability = 0;
        switch( Math.floor( particle.lifetime ) ) {
          case 1:
            upProbability = this.firstSternGerlachModel.measure( this.spinStateProperty.value );
            particle.secondSpinUp = dotRandom.nextDouble() < upProbability;
            break;
          case 3:
            if ( particle.secondSpinUp ) {
              upProbability = this.secondSternGerlachModel.measure( this.firstSternGerlachModel.isZOrientedProperty ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS );
              particle.thirdSpinUp = dotRandom.nextDouble() < upProbability;
            }
            else {
              const upProbability = this.thirdSternGerlachModel.measure( this.firstSternGerlachModel.isZOrientedProperty ? SpinDirection.Z_MINUS : null );
              particle.thirdSpinUp = dotRandom.nextDouble() < upProbability;
            }
            break;
          default:
            break;
        }
      } );

      return particle;
    } );

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
      // TODO: Given the above description, is measure() a correct name? Maybe prepare https://github.com/phetsims/quantum-measurement/issues/53
      this.measure();
    } );

    this.spinStateProperty.link( () => {
      this.measure();
    } );

    this.currentlyShootingParticlesProperty = new Property<boolean>( false, {
      tandem: providedOptions.tandem.createTandem( 'currentlyShootingParticlesProperty' ),
      phetioValueType: BooleanIO
    } );

    // Find the first inactive single particle and activate it
    this.currentlyShootingParticlesProperty.link( shooting => {
      if ( shooting ) {
        for ( let i = 0; i < MAX_NUMBER_OF_SINGLE_PARTICLES; i++ ) {
          if ( !this.singleParticles[ i ].activeProperty.value ) {

            // TODO: filter? https://github.com/phetsims/quantum-measurement/issues/53
            const particleToActivate = this.singleParticles[ i ];
            particleToActivate.reset();
            particleToActivate.firstSpinVector = SpinDirection.spinToVector( this.spinStateProperty.value );
            particleToActivate.activeProperty.value = true;
            break;
          }
        }
      }
    } );

    this.particleAmmountProperty = new NumberProperty( 1, {
      tandem: providedOptions.tandem.createTandem( 'particleAmmountProperty' ),
      range: new Range( 0, 1 )
    } );

  }

  public measure(): void {
    const experimentSetting = this.currentExperimentProperty.value.experimentSetting;

    // Measure on the first SG, this will change its upProbabilityProperty
    this.firstSternGerlachModel.measure( this.spinStateProperty.value );

    if ( experimentSetting.length > 1 ) {
      // Measure on the second SG according to the orientation of the first one
      this.secondSternGerlachModel.measure(
        // SG1 passes the up-spin particles to SG2
        this.firstSternGerlachModel.isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS
      );

      this.thirdSternGerlachModel.measure(
        // SG1 passes the down-spin particles to SG3, and because X- is not in the initial spin values, we pass null
        this.firstSternGerlachModel.isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
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
    this.singleParticles.forEach( particle => particle.step( dt ) );
  }
}

quantumMeasurement.register( 'SpinModel', SpinModel );