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
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ParticleRays from './ParticleRays.js';
import ParticleSourceModel from './ParticleSourceModel.js';
import { ParticleWithSpinModel } from './ParticleWithSpinModel.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';
import { SpinDirection } from './SpinDirection.js';
import SpinExperiment from './SpinExperiment.js';
import SternGerlach from './SternGerlach.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-preparement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SpinModel implements TModel {

  public readonly spinStateProperty: Property<SpinDirection>;

  public readonly blochSphere: SimpleBlochSphere;

  // Single particles shot by the user transversing the experiment
  public readonly singleParticles: ParticleWithSpinModel[];

  public readonly currentExperimentProperty: Property<SpinExperiment>;

  // MODEL ELEMENTS OF UI COMPONENTS ------------------------------------------------

  // Information of the particle paths
  public readonly particleRays: ParticleRays;

  // Position of the particle source
  public readonly particleSourceModel: ParticleSourceModel;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly firstSternGerlach: SternGerlach;
  public readonly secondSternGerlach: SternGerlach;
  public readonly thirdSternGerlach: SternGerlach;

  // Used to update the opacities of the particle rays
  // TODO: Better naming?? https://github.com/phetsims/quantum-preparement/issues/53
  public readonly probabilitiesUpdatedEmitter: Emitter = new Emitter();

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.spinStateProperty = new Property<SpinDirection>( SpinDirection.Z_PLUS, {
      validValues: SpinDirection.enumeration.values
    } );

    this.blochSphere = new SimpleBlochSphere(
      this.spinStateProperty, {
        tandem: providedOptions.tandem.createTandem( 'blochSphere' )
      } );

    const MAX_NUMBER_OF_SINGLE_PARTICLES = 10;

    this.currentExperimentProperty = new Property<SpinExperiment>( SpinExperiment.EXPERIMENT_1 );

    this.particleRays = new ParticleRays();

    this.particleSourceModel = new ParticleSourceModel( new Vector2( 0, 0 ), providedOptions.tandem.createTandem( 'particleSourceModel' ) );

    const SternGerlachsTandem = providedOptions.tandem.createTandem( 'SternGerlachs' );
    this.firstSternGerlach = new SternGerlach( new Vector2( 1, 0 ), true, SternGerlachsTandem.createTandem( 'firstSternGerlach' ) );
    this.secondSternGerlach = new SternGerlach( new Vector2( 2, 0.3 ), false, SternGerlachsTandem.createTandem( 'secondSternGerlach' ) );
    this.thirdSternGerlach = new SternGerlach( new Vector2( 2, -0.3 ), false, SternGerlachsTandem.createTandem( 'thirdSternGerlach' ) );

    this.singleParticles = _.times( MAX_NUMBER_OF_SINGLE_PARTICLES, id => {
      const particle = new ParticleWithSpinModel( id );

      particle.readyToBeMeasuredEmitter.addListener( () => {

        let upProbability = 0;
        switch( Math.floor( particle.lifetime ) ) {
          case 1:
            upProbability = this.firstSternGerlach.prepare( this.spinStateProperty.value );
            particle.secondSpinUp = dotRandom.nextDouble() < upProbability;
            break;
          case 3:
            if ( particle.secondSpinUp ) {
              upProbability = this.secondSternGerlach.prepare( this.firstSternGerlach.isZOrientedProperty ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS );
              particle.thirdSpinUp = dotRandom.nextDouble() < upProbability;
            }
            else {
              const upProbability = this.thirdSternGerlach.prepare( this.firstSternGerlach.isZOrientedProperty ? SpinDirection.Z_MINUS : null );
              particle.thirdSpinUp = dotRandom.nextDouble() < upProbability;
            }
            break;
          default:
            break;
        }
      } );

      return particle;
    } );

    const updateProbabilities = ( particleAmmount: number ) => {
      this.particleRays.updateProbabilities( [
        particleAmmount, // First ray only depends on the initial particle ammount
        this.firstSternGerlach.upProbabilityProperty.value * particleAmmount,
        this.firstSternGerlach.downProbabilityProperty.value * particleAmmount,
        this.firstSternGerlach.upProbabilityProperty.value * this.secondSternGerlach.upProbabilityProperty.value * particleAmmount,
        this.firstSternGerlach.upProbabilityProperty.value * this.secondSternGerlach.downProbabilityProperty.value * particleAmmount,
        this.firstSternGerlach.downProbabilityProperty.value * this.thirdSternGerlach.upProbabilityProperty.value * particleAmmount,
        this.firstSternGerlach.downProbabilityProperty.value * this.thirdSternGerlach.downProbabilityProperty.value * particleAmmount
      ] );
    };

    this.particleSourceModel.particleAmmountProperty.link( particleAmmount => {
      updateProbabilities( particleAmmount );
    } );

    this.probabilitiesUpdatedEmitter.addListener( () => {
      updateProbabilities( this.particleSourceModel.particleAmmountProperty.value );
    } );

    const SternGerlachs = [ this.firstSternGerlach, this.secondSternGerlach, this.thirdSternGerlach ];

    this.currentExperimentProperty.link( experiment => {
      SternGerlachs.forEach( ( SternGerlach, index ) => {
        if ( experiment.experimentSetting.length > index ) {
          // TODO: Should visibility be only handled via the View? https://github.com/phetsims/quantum-preparement/issues/53
          SternGerlach.isVisibleProperty.set( experiment.experimentSetting[ index ].active );
          SternGerlach.isZOrientedProperty.set( experiment.experimentSetting[ index ].isZOriented );
        }
        else {
          SternGerlach.isVisibleProperty.set( false );
        }
      } );

      // Set the probabilities of the experiment. In the continuous case, this immediately alters the shown rays
      // In the single case, this prepares the probabilities for the particle that will be shot
      // TODO: Given the above description, is prepare() a correct name? Maybe prepare https://github.com/phetsims/quantum-preparement/issues/53
      this.prepare();

      updateProbabilities( this.particleSourceModel.particleAmmountProperty.value );
    } );

    this.spinStateProperty.link( () => {
      this.prepare();
    } );

    // Find the first inactive single particle and activate it
    this.particleSourceModel.currentlyShootingParticlesProperty.link( shooting => {
      if ( shooting ) {
        for ( let i = 0; i < MAX_NUMBER_OF_SINGLE_PARTICLES; i++ ) {
          if ( !this.singleParticles[ i ].activeProperty.value ) {

            // TODO: filter? https://github.com/phetsims/quantum-preparement/issues/53
            const particleToActivate = this.singleParticles[ i ];
            particleToActivate.reset();
            particleToActivate.firstSpinVector = SpinDirection.spinToVector( this.spinStateProperty.value );
            particleToActivate.activeProperty.value = true;
            break;
          }
        }
      }
    } );
  }

  public prepare(): void {
    const experimentSetting = this.currentExperimentProperty.value.experimentSetting;

    // Measure on the first SG, this will change its upProbabilityProperty
    this.firstSternGerlach.prepare( this.spinStateProperty.value );

    if ( experimentSetting.length > 1 ) {
      // Measure on the second SG according to the orientation of the first one
      this.secondSternGerlach.prepare(
        // SG1 passes the up-spin particles to SG2
        this.firstSternGerlach.isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS
      );

      this.thirdSternGerlach.prepare(
        // SG1 passes the down-spin particles to SG3, and because X- is not in the initial spin values, we pass null
        this.firstSternGerlach.isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
      );

    }

    this.probabilitiesUpdatedEmitter.emit();
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    // TODO, see https://github.com/phetsims/quantum-preparement/issues/1
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