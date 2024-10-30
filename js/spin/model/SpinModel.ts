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

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import MeasurementLine, { MeasurementState } from './MeasurementLine.js';
import ParticleRays from './ParticleRays.js';
import ParticleSourceModel from './ParticleSourceModel.js';
import { ParticleWithSpin } from './ParticleWithSpin.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';
import { SourceMode } from './SourceMode.js';
import { SpinDirection } from './SpinDirection.js';
import SpinExperiment from './SpinExperiment.js';
import SternGerlach from './SternGerlach.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SpinModel implements TModel {

  public readonly blochSphere: SimpleBlochSphere;

  // Single particles shot by the user transversing the experiment
  public readonly singleParticles: ParticleWithSpin[];

  public readonly currentExperimentProperty: Property<SpinExperiment>;

  // MODEL ELEMENTS OF UI COMPONENTS ------------------------------------------------

  // Information of the particle paths
  public readonly particleRays: ParticleRays;

  // Position of the particle source
  public readonly particleSourceModel: ParticleSourceModel;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly sternGerlachs: SternGerlach[];

  public readonly measurementLines: MeasurementLine[];

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    const MAX_NUMBER_OF_SINGLE_PARTICLES = 50;

    this.currentExperimentProperty = new Property<SpinExperiment>( SpinExperiment.EXPERIMENT_1 );

    this.particleSourceModel = new ParticleSourceModel( new Vector2( 0, 0 ), providedOptions.tandem.createTandem( 'particleSourceModel' ) );

    const vectorSpinStateProperty = new DerivedProperty(
      [ this.particleSourceModel.spinStateProperty ], spinState => SpinDirection.spinToVector( spinState )
    );
    this.blochSphere = new SimpleBlochSphere(
      vectorSpinStateProperty, { tandem: providedOptions.tandem.createTandem( 'blochSphere' ) }
    );

    const sternGerlachsTandem = providedOptions.tandem.createTandem( 'SternGerlachs' );
    this.sternGerlachs = [
      new SternGerlach( new Vector2( 0.8, 0 ), true, sternGerlachsTandem.createTandem( 'firstSternGerlach' ) ),
      new SternGerlach( new Vector2( 2, 0.3 ), false, sternGerlachsTandem.createTandem( 'secondSternGerlach' ) ),
      new SternGerlach( new Vector2( 2, -0.3 ), false, sternGerlachsTandem.createTandem( 'thirdSternGerlach' ) )
    ];

    const measurementLinesTandem = providedOptions.tandem.createTandem( 'measurementLines' );
    this.measurementLines = [
      new MeasurementLine(
        new Vector2( ( this.particleSourceModel.exitPositionProperty.value.x + this.sternGerlachs[ 0 ].entrancePositionProperty.value.x ) / 2, 1 ),
        { tandem: measurementLinesTandem.createTandem( 'firstMeasurementLine' ) }
      ),
      new MeasurementLine(
        new Vector2( ( this.sternGerlachs[ 0 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].entrancePositionProperty.value.x ) / 2, 1 ),
        { tandem: measurementLinesTandem.createTandem( 'secondMeasurementLine' ) }
      ),
      new MeasurementLine(
        new Vector2( ( this.sternGerlachs[ 1 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].topExitPositionProperty.value.plusXY( 1, 0 ).x ) / 2, 1 ),
        { tandem: measurementLinesTandem.createTandem( 'thirdMeasurementLine' ), isInitiallyActive: false }
      )
    ];

    this.particleRays = new ParticleRays(
      [
        this.particleSourceModel.exitPositionProperty.value,
        this.sternGerlachs[ 0 ].entrancePositionProperty.value
      ], [
      {
        destination: this.sternGerlachs[ 0 ],
        afterDestination: 'infinity'
      },
      {
        source: this.sternGerlachs[ 0 ],
        exit: 'top',
        destination: this.sternGerlachs[ 1 ],
        afterDestination: 'infinity'
      },
      {
        source: this.sternGerlachs[ 0 ],
        exit: 'bottom',
        destination: this.sternGerlachs[ 2 ],
        afterDestination: 'infinity'
      }
    ] );

    this.singleParticles = _.times( MAX_NUMBER_OF_SINGLE_PARTICLES, id => {
      return new ParticleWithSpin( id );
    } );

    // TODO: Maybe integrate with the ParticleRay constructor? https://github.com/phetsims/quantum-measurement/issues/53

    const updateProbabilities = ( particleAmmount: number ) => {
      if ( this.particleRays.isShortExperiment ) {
        this.particleRays.updateProbabilities( [
          particleAmmount, // First ray only depends on the initial particle ammount
          this.sternGerlachs[ 0 ].upProbabilityProperty.value * particleAmmount, // From first to infinity
          this.sternGerlachs[ 0 ].downProbabilityProperty.value * particleAmmount, // From first to infinity
          this.sternGerlachs[ 0 ].upProbabilityProperty.value * particleAmmount, // From first to second
          this.sternGerlachs[ 0 ].downProbabilityProperty.value * particleAmmount // From first to third
        ] );
      }
      else {
        this.particleRays.updateProbabilities( [
          particleAmmount, // First ray only depends on the initial particle ammount
          this.sternGerlachs[ 0 ].upProbabilityProperty.value * particleAmmount, // From first to second
          this.sternGerlachs[ 0 ].upProbabilityProperty.value * this.sternGerlachs[ 1 ].upProbabilityProperty.value * particleAmmount,
          this.sternGerlachs[ 0 ].upProbabilityProperty.value * this.sternGerlachs[ 1 ].downProbabilityProperty.value * particleAmmount,
          this.sternGerlachs[ 0 ].downProbabilityProperty.value * particleAmmount, // From first to third
          this.sternGerlachs[ 0 ].downProbabilityProperty.value * this.sternGerlachs[ 2 ].upProbabilityProperty.value * particleAmmount,
          this.sternGerlachs[ 0 ].downProbabilityProperty.value * this.sternGerlachs[ 2 ].downProbabilityProperty.value * particleAmmount
        ] );
      }
    };

    // Multilink for changes in the experiment either via source mode or experiment selection
    Multilink.multilink(
      [
        this.currentExperimentProperty,
        this.particleSourceModel.sourceModeProperty
      ],
      ( experiment, sourceMode ) => {
        this.particleRays.reset();
        this.particleRays.isShortExperiment = experiment.isShortExperiment;
        this.particleRays.updateExperiment();
        updateProbabilities( this.particleSourceModel.particleAmmountProperty.value );

        const isSingle = sourceMode === SourceMode.SINGLE;
        this.measurementLines[ 0 ].isActiveProperty.value = isSingle;
        this.measurementLines[ 1 ].isActiveProperty.value = isSingle;
        this.measurementLines[ 2 ].isActiveProperty.value = isSingle && !experiment.isShortExperiment;

        this.measurementLines.forEach( line => line.measurementStateProperty.reset() );

        this.singleParticles.forEach( particle => particle.reset() );
      }
    );

    this.particleSourceModel.particleAmmountProperty.link( particleAmmount => {
      updateProbabilities( particleAmmount );
    } );


    this.currentExperimentProperty.link( experiment => {
      this.singleParticles.forEach( particle => particle.reset() );

      this.sternGerlachs.forEach( ( SternGerlach, index ) => {
        if ( experiment.experimentSetting.length > index ) {
          // TODO: Should visibility be only handled via the View? https://github.com/phetsims/quantum-measurement/issues/53
          SternGerlach.isVisibleProperty.set( experiment.experimentSetting[ index ].active );
          SternGerlach.isZOrientedProperty.set( experiment.experimentSetting[ index ].isZOriented );
        }
        else {
          SternGerlach.isVisibleProperty.set( false );
        }
      } );

      // Set the probabilities of the experiment. In the continuous case, this immediately alters the shown rays
      // In the single case, this prepares the probabilities for the particle that will be shot
      this.prepare();

      updateProbabilities( this.particleSourceModel.particleAmmountProperty.value );
    } );

    this.particleSourceModel.spinStateProperty.link( () => {
      this.prepare();
    } );

    // Find the first inactive single particle and activate it
    this.particleSourceModel.currentlyShootingParticlesProperty.link( shooting => {
      if ( shooting ) {
        for ( let i = 0; i < MAX_NUMBER_OF_SINGLE_PARTICLES; i++ ) {
          if ( !this.singleParticles[ i ].activeProperty.value ) {

            // TODO: filter? https://github.com/phetsims/quantum-measurement/issues/53
            const particleToActivate = this.singleParticles[ i ];
            particleToActivate.reset();

            particleToActivate.firstSpinVector = SpinDirection.spinToVector( this.particleSourceModel.spinStateProperty.value );

            let upProbability = 1;
            upProbability = this.sternGerlachs[ 0 ].prepare( this.particleSourceModel.spinStateProperty.value );
            particleToActivate.secondSpinUp = dotRandom.nextDouble() < upProbability;
            particleToActivate.secondSpinVector = SpinDirection.spinToVector(
              particleToActivate.secondSpinUp ?
              this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS :
              this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
            );

            if ( this.currentExperimentProperty.value.experimentSetting.length > 1 ) {
              if ( particleToActivate.secondSpinUp ) {
                upProbability = this.sternGerlachs[ 1 ].prepare( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS );
                particleToActivate.thirdSpinUp = dotRandom.nextDouble() < upProbability;
                particleToActivate.thirdSpinVector = SpinDirection.spinToVector(
                  particleToActivate.thirdSpinUp ?
                  this.sternGerlachs[ 1 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS :
                  this.sternGerlachs[ 1 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
                );
              }
              else {
                const upProbability = this.sternGerlachs[ 2 ].prepare( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null );
                particleToActivate.thirdSpinUp = dotRandom.nextDouble() < upProbability;
                particleToActivate.thirdSpinVector = SpinDirection.spinToVector(
                  particleToActivate.thirdSpinUp ?
                  this.sternGerlachs[ 2 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS :
                  this.sternGerlachs[ 2 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
                );
              }
            }

            this.particleRays.assignRayToParticle( particleToActivate );

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
    this.sternGerlachs[ 0 ].prepare( this.particleSourceModel.spinStateProperty.value );

    if ( experimentSetting.length > 1 ) {
      // Measure on the second SG according to the orientation of the first one
      this.sternGerlachs[ 1 ].prepare(
        // SG1 passes the up-spin particles to SG2
        this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS
      );

      this.sternGerlachs[ 2 ].prepare(
        // SG1 passes the down-spin particles to SG3, and because X- is not in the initial spin values, we pass null
        this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
      );

    }
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.sternGerlachs.forEach( sternGerlach => sternGerlach.reset() );
    this.singleParticles.forEach( particle => particle.reset() );
    this.measurementLines.forEach( line => line.reset() );
    this.currentExperimentProperty.reset();
    this.particleSourceModel.spinStateProperty.reset();
    this.particleSourceModel.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.singleParticles.forEach( particle => {
      const behindMeasurementLine: boolean[] = this.measurementLines.map( line => line.isParticleBehind( particle.positionProperty.value ) );
      particle.step( dt );

      // If the particle crosses a measurement line, we update the line
      this.measurementLines.forEach( ( line, index ) => {
        if ( behindMeasurementLine[ index ] && !line.isParticleBehind( particle.positionProperty.value ) ) {
          line.spinStateProperty.value = index === 0 ? particle.firstSpinVector : index === 1 ? particle.secondSpinVector : particle.thirdSpinVector;
          line.measurementStateProperty.value = MeasurementState.MEASURING;
        }
      } );
    } );
  }
}

quantumMeasurement.register( 'SpinModel', SpinModel );