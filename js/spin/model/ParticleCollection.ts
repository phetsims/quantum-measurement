// Copyright 2024-2025, University of Colorado Boulder

/**
 * ParticleCollection is the model for a set of particles where each has a predetermined spin. It provides and API that
 * allows clients to create, remove, and measure particles.
 *
 * @author Agustín Vallejo
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceArrayIO from '../../../../tandem/js/types/ReferenceArrayIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlockingMode } from './BlockingMode.js';
import { ParticleWithSpin } from './ParticleWithSpin.js';
import { SpinDirection } from './SpinDirection.js';
import SpinModel from './SpinModel.js';
import SternGerlach from './SternGerlach.js';

const PARTICLE_RAY_WIDTH = 0.02;

const HORIZONTAL_ENDPOINT = new Vector2( 10, 0 );

export class ParticleCollection extends PhetioObject {

  protected readonly maxParticles: number;

  // Particles array
  public readonly particles: ParticleWithSpin[];

  public readonly model: SpinModel;

  public constructor( model: SpinModel, maxParticles: number, tandem: Tandem ) {
    super( {
      tandem: tandem,
      phetioType: ParticleCollection.ParticleCollectionIO
    } );
    this.maxParticles = maxParticles;
    this.model = model;
    this.particles = [];
  }

  protected createParticle(): void {

    const spinVectors = [ this.model.derivedSpinStateProperty.value.copy(), new Vector2( 0, 0 ), new Vector2( 0, 0 ) ];
    const isSpinUp = [ false, false, false ];
    const stageCompleted = [ false, false, false ];

    const particleStartPosition = this.model.particleSourceModel.exitPositionProperty.value;
    const particleEndPosition = this.model.sternGerlachs[ 0 ].entrancePositionProperty.value.plusXY(
      SternGerlach.STERN_GERLACH_WIDTH, 0
    );

    const randomParticleOffset = new Vector2(
      PARTICLE_RAY_WIDTH * ( dotRandom.nextDouble() * 2 - 1 ),
      PARTICLE_RAY_WIDTH * ( dotRandom.nextDouble() * 2 - 1 )
    );

    const position = particleStartPosition.plus( randomParticleOffset );

    const particle = new ParticleWithSpin(
      0, // Lifetime starts at 0
      position,
      Vector2.ZERO, // Velocity starts at 0, will be set in the constructor
      spinVectors,
      isSpinUp,
      stageCompleted,
      particleStartPosition,
      particleEndPosition,
      randomParticleOffset
    );

    this.particles.push( particle );
  }

  public removeParticle( particle: ParticleWithSpin ): void {
    _.pull( this.particles, particle );
  }

  public clear(): void {
    this.particles.length = 0;
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {

    // Remove old particles
    this.particles.forEach( particle => {
      if ( particle.lifetime > 4 ) {
        this.removeParticle( particle );
      }
    } );
  }

  /**
   * Check if the particle would be blocked by the exit blocker, and if so, reset it and return true.
   */
  protected checkParticleBlocking( particle: ParticleWithSpin ): boolean {

    // If there is no blocker in place
    if ( this.model.sternGerlachs[ 0 ].blockingModeProperty.value !== BlockingMode.NO_BLOCKER ) {
      const exitPositionProperty = this.model.exitBlockerPositionProperty.value;
      if (

        // If the blocker is on the 'up' position and the particle is spin up, and blocker position exists (can be null),
        // and particle position is greater than the blocker position
        this.model.sternGerlachs[ 0 ].blockingModeProperty.value === BlockingMode.BLOCK_UP &&
        particle.isSpinUp[ 1 ] && exitPositionProperty &&
        ( particle.position.x > exitPositionProperty.x ) ) {
        this.removeParticle( particle );
        return true;
      }
      else if (
        this.model.sternGerlachs[ 0 ].blockingModeProperty.value === BlockingMode.BLOCK_DOWN &&
        !particle.isSpinUp[ 1 ] && exitPositionProperty &&
        ( particle.position.x > exitPositionProperty.x ) ) {
        this.removeParticle( particle );
        return true;
      }
    }
    return false;
  }

  protected decideParticleDestiny( particle: ParticleWithSpin ): void {
    const wasParticleBlocked = this.checkParticleBlocking( particle );
    if ( wasParticleBlocked ) {
      return;
    }

    const threshold = 0.03;

    // If the particle were to reach its end position, measure it and decide on a new path
    if ( particle.position.x > particle.endPosition.x - threshold ) {
      const extraDistance = particle.position.x - particle.endPosition.x;
      const extraTime = extraDistance / particle.speed;

      const usingSingleApparatus = this.model.currentExperimentProperty.value.usingSingleApparatus;

      // If the first stage SOURCE-SG0 is not yet completed, mark it as completed and measure the particle
      if ( !particle.stageCompleted[ 0 ] ) {
        const isResultUp = this.measureParticle( particle, this.model.sternGerlachs[ 0 ], 1, particle.spinVectors[ 0 ] );
        this.model.sternGerlachs[ 0 ].count( isResultUp );

        const startPosition = isResultUp ?
                              this.model.sternGerlachs[ 0 ].topExitPositionProperty.value :
                              this.model.sternGerlachs[ 0 ].bottomExitPositionProperty.value;
        if ( usingSingleApparatus ) {
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
      else if ( !usingSingleApparatus && !particle.stageCompleted[ 1 ] ) {
        const startPosition = particle.endPosition;
        const endPosition = particle.endPosition.plusXY(
          SternGerlach.STERN_GERLACH_WIDTH, 0
        );
        particle.updatePath( startPosition, endPosition, extraTime );

        particle.stageCompleted[ 1 ] = true;
      }
      else if ( !usingSingleApparatus && !particle.stageCompleted[ 2 ] ) {
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
  protected measureParticle(
    particle: ParticleWithSpin,
    sternGerlach: SternGerlach,
    experimentStageIndex: number,
    incomingState: Vector2 ): boolean {

    const upProbability = sternGerlach.calculateProbability( incomingState );
    const isResultUp = dotRandom.nextDouble() < upProbability;
    particle.isSpinUp[ experimentStageIndex ] = isResultUp;
    particle.spinVectors[ experimentStageIndex ].set( SpinDirection.spinToVector(
      isResultUp ?
      sternGerlach.isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS :
      sternGerlach.isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
    ) );
    return isResultUp;
  }

  /**
   * For serialization, the ParticleCollectionIO uses reference type serialization. That is, each ParticleCollection
   * exists for the life of the simulation, and when we save the state of the simulation, we save the current state of
   * the ParticleCollection.
   *
   * The ParticleCollection serves as a composite container of ParticleIO instances. The Particles are serialized using
   * data-type serialization. For deserialization, the Particles are deserialized (again, using data-type serialization)
   * and applied to the ParticleCollection in its applyState method.
   *
   * Please see https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * for more information on the different serialization types.
   */
  public static readonly ParticleCollectionIO = new IOType<ParticleCollection>( 'ParticleCollectionIO', {
    valueType: ParticleCollection,
    documentation: 'The ParticleCollection is a model element that represents a collection of particles.',
    stateSchema: {
      particles: ReferenceArrayIO( ParticleWithSpin.ParticleWithSpinIO )
    }
  } );
}

quantumMeasurement.register( 'ParticleCollection', ParticleCollection );