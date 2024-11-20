// Copyright 2024, University of Colorado Boulder

/**
 * ParticleSystem is the model for a particle with a predetermined spin. It has a lifetime, which will
 * determine its position in the Ray Path, and a spin value, which will be modified as it passes through the SG apparatuses.
 *
 * @author Agustín Vallejo
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlockingMode } from './BlockingMode.js';
import { ParticleWithSpin } from './ParticleWithSpin.js';
import { SpinDirection } from './SpinDirection.js';
import SpinModel from './SpinModel.js';
import SternGerlach from './SternGerlach.js';

const MAX_NUMBER_OF_SINGLE_PARTICLES = 50;
const MAX_NUMBER_OF_MULTIPLE_PARTICLES = 5000;
const PARTICLE_RAY_WIDTH = 0.02;
const MAX_PARTICLE_CREATION_RATE = 5; // max rate of particles created per second

const HORIZONTAL_ENDPOINT = new Vector2( 10, 0 );

export class ParticleSystem {

  // Single particles shot by the user
  public readonly singleParticles: ParticleWithSpin[];

  // Particle beam for the continuous source mode
  public readonly multipleParticles: ParticleWithSpin[];

  public readonly model: SpinModel;

  // The fractional accumulator for the emission rate, which is used to determine how many particles to create each step.
  private fractionalEmissionAccumulator = 0;

  public constructor(
    model: SpinModel
  ) {

    this.model = model;

    // Create all particles that will be used in the experiment.  It works better for phet-io if these are created at
    // construction time and activated and deactivated as needed, rather than creating and destroying them.
    this.singleParticles = _.times( MAX_NUMBER_OF_SINGLE_PARTICLES, () => {
      return new ParticleWithSpin( Vector2.ZERO );
    } );
    this.multipleParticles = _.times( MAX_NUMBER_OF_MULTIPLE_PARTICLES, () => {
      return new ParticleWithSpin( new Vector2( PARTICLE_RAY_WIDTH * ( dotRandom.nextDouble() * 2 - 1 ), PARTICLE_RAY_WIDTH * ( dotRandom.nextDouble() * 2 - 1 ) ) );
    } );

  }

  public shootSingleParticle(): void {
    const particleToActivate = this.singleParticles.find( particle => !particle.activeProperty.value );

    if ( particleToActivate ) {
      this.activateParticle( particleToActivate );
    }
  }

  private activateParticle( particle: ParticleWithSpin ): void {
    particle.reset();
    particle.activeProperty.value = true;


    // Set the first spin vector to the state of the generated particles
    // TODO: Is creating a bunch of copies of this vector bad?? https://github.com/phetsims/quantum-measurement/issues/53
    particle.spinVectors[ 0 ] = this.model.derivedSpinStateProperty.value.copy();

    particle.updatePath(
      this.model.particleSourceModel.exitPositionProperty.value,
      this.model.sternGerlachs[ 0 ].entrancePositionProperty.value.plusXY(
        SternGerlach.STERN_GERLACH_WIDTH, 0
      )
    );
  }

  private activateMultipleParticles(): void {
    // Calculate the number of particles to produce in this time step based on the particle amount property, the max
    // creation rate, and the time step.  This could include a fractional amount.
    const particlesToActivate = this.model.particleSourceModel.particleAmountProperty.value * MAX_PARTICLE_CREATION_RATE;

    // Calculate the whole number to actually activate, and use the fractional accumlator in the process.
    let wholeParticlesToActivate = Math.floor( particlesToActivate );

    this.fractionalEmissionAccumulator += particlesToActivate - wholeParticlesToActivate;

    if ( this.fractionalEmissionAccumulator >= 1 ) {
      wholeParticlesToActivate++;
      this.fractionalEmissionAccumulator -= 1;
    }

    // Activate the particles.
    for ( let i = 0; i < wholeParticlesToActivate; i++ ) {
      const particleToActivate = this.multipleParticles.find( particle => !particle.activeProperty.value );
      assert && assert( particleToActivate, 'no inactive particles available, increase the initial creation amount' );
      if ( particleToActivate ) {
        this.activateParticle( particleToActivate );
      }
    }
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {

    if ( !this.model.particleSourceModel.isContinuousModeProperty.value ) {
      // Filter out the active single particles
      const activeSingleParticles = this.singleParticles.filter( particle => particle.activeProperty.value );

      // Moves single particles and triggers measurements when they pass through Measuring Lines
      activeSingleParticles.forEach( particle => {
        const behindMeasurementLine: boolean[] = this.model.measurementLines.map( line => line.isParticleBehind( particle.positionProperty.value ) );

        particle.step( dt );
        this.decideParticleDestiny( particle );

        // If the particle crosses a measurement line, we update the line
        this.model.measurementLines.forEach( ( line, index ) => {
          if ( behindMeasurementLine[ index ] && !line.isParticleBehind( particle.positionProperty.value ) ) {
            line.measurementEmitter.emit();
            line.spinStateProperty.value = particle.spinVectors[ index ];
            // particle.stageCompleted[ index ] = true;
          }
        } );
      } );
    }
    else {
      // Generates the stream of particles. They are activated, not created, as they are already created at construction.
      this.activateMultipleParticles();

      // Make a list of all particles that are on a path that could potentially be blocked by the exit blocker.
      const activeMultipleParticles = this.multipleParticles.filter( particle => particle.activeProperty.value );

      // Step all active particles, and deactivate them if they cross the exit blocker position, and step them
      // normally if not.
      activeMultipleParticles.forEach( particle => {
        particle.step( dt );
        this.decideParticleDestiny( particle );
      } );
    }
  }


  /**
   * Check if the particle would be blocked by the exit blocker, and if so, reset it and return true.
   */
  private checkParticleBlocking( particle: ParticleWithSpin ): boolean {
    // If there is no blocker in place
    if ( this.model.sternGerlachs[ 0 ].blockingModeProperty.value !== BlockingMode.NO_BLOCKER ) {
      const exitPositionProperty = this.model.exitBlockerPositionProperty.value;
      if (
        // If the blocker is on the 'up' position and the particle is spin up, and blocker position exists (can be null),
        // and particle position is greater than the blocker position
        this.model.sternGerlachs[ 0 ].blockingModeProperty.value === BlockingMode.BLOCK_UP &&
        particle.isSpinUp[ 1 ] && exitPositionProperty &&
        ( particle.positionProperty.value.x > exitPositionProperty.x ) ) {
        particle.reset();
        return true;
      }
      else if (
        this.model.sternGerlachs[ 0 ].blockingModeProperty.value === BlockingMode.BLOCK_DOWN &&
        !particle.isSpinUp[ 1 ] && exitPositionProperty &&
        ( particle.positionProperty.value.x > exitPositionProperty.x ) ) {
        particle.reset();
        return true;
      }
    }
    return false;
  }

  private decideParticleDestiny( particle: ParticleWithSpin ): void {
    const wasParticleBlocked = this.checkParticleBlocking( particle );
    if ( wasParticleBlocked ) {
      return;
    }

    // If the particle were to reach its end position, measure it and decide on a new path
    if ( particle.positionProperty.value.x > particle.endPosition.x ) {
      const extraDistance = particle.positionProperty.value.x - particle.endPosition.x;
      const extraTime = extraDistance / particle.speed;

      const isShortExperiment = this.model.currentExperimentProperty.value.isShortExperiment;

      if ( !particle.stageCompleted[ 0 ] ) {
        const isResultUp = this.measureParticle( particle, this.model.sternGerlachs[ 0 ], 1, particle.spinVectors[ 0 ] );
        this.model.sternGerlachs[ 0 ].count( isResultUp );

        const startPosition = isResultUp ?
                              this.model.sternGerlachs[ 0 ].topExitPositionProperty.value :
                              this.model.sternGerlachs[ 0 ].bottomExitPositionProperty.value;
        if ( isShortExperiment ) {
          const endPosition = isResultUp ?
                              this.model.sternGerlachs[ 0 ].topExitPositionProperty.value.plus( HORIZONTAL_ENDPOINT ) : // To infinity
                              this.model.sternGerlachs[ 0 ].bottomExitPositionProperty.value.plus( HORIZONTAL_ENDPOINT ); // To infinity
          particle.updatePath( startPosition, endPosition, extraTime );
        }
        else {
          const endPosition = isResultUp ?
                              this.model.sternGerlachs[ 1 ].entrancePositionProperty.value :
                              this.model.sternGerlachs[ 2 ].entrancePositionProperty.value;
          particle.updatePath( startPosition, endPosition, extraTime );
        }

        particle.stageCompleted[ 0 ] = true;

      }
      else if ( !isShortExperiment && !particle.stageCompleted[ 1 ] ) {
        const startPosition = particle.endPosition;
        const endPosition = particle.endPosition.plusXY(
          SternGerlach.STERN_GERLACH_WIDTH, 0
        );
        particle.updatePath( startPosition, endPosition, extraTime );

        particle.stageCompleted[ 1 ] = true;
      }
      else if ( !isShortExperiment && !particle.stageCompleted[ 2 ] ) {
        const sternGerlach = particle.isSpinUp[ 1 ] ? this.model.sternGerlachs[ 1 ] : this.model.sternGerlachs[ 2 ];
        const isResultUp = this.measureParticle(
          particle, sternGerlach, 2, particle.spinVectors[ 1 ] );
        sternGerlach.count( isResultUp );

        const startPosition = isResultUp ?
                              sternGerlach.topExitPositionProperty.value :
                              sternGerlach.bottomExitPositionProperty.value;
        const endPosition = particle.startPosition.plus( HORIZONTAL_ENDPOINT ); // To infinity
        particle.updatePath( startPosition, endPosition, extraTime );

        particle.stageCompleted[ 2 ] = true;
      }
    }
  }

  /**
   * Given the incoming state of a particle, calculate the result of a SG measurement on a particle and set its spin
   */
  private measureParticle(
    particle: ParticleWithSpin,
    sternGerlach: SternGerlach,
    experimentStageIndex: number,
    incomingState: Vector2 ): boolean {

    const upProbability = sternGerlach.calculateProbability( incomingState );
    const isResultUp = dotRandom.nextDouble() < upProbability;
    particle.isSpinUp[ experimentStageIndex ] = isResultUp;
    particle.spinVectors[ experimentStageIndex ] = SpinDirection.spinToVector(
      isResultUp ?
      sternGerlach.isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS :
      sternGerlach.isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
    );
    return isResultUp;
  }

  public reset(): void {
    this.singleParticles.forEach( particle => particle.reset() );
    this.multipleParticles.forEach( particle => particle.reset() );
  }
}


quantumMeasurement.register( 'ParticleSystem', ParticleSystem );