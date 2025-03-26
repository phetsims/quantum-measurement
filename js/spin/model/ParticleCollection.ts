// Copyright 2024-2025, University of Colorado Boulder

/**
 * ParticleCollection is the model for a set of particles where each has a predetermined spin. It provides an API that
 * allows clients to create, remove, and measure particles.
 *
 * Since there's many concurring modes that could be selected in this screen (single/multiple particles, single/multiple SG
 * apparatuses, and custom mode) the following is a table of the experiment configuration on each combination of modes:
 *
 * | Mode             | Single Particle              | Multi Particle                    |
 * |------------------|------------------------------|-----------------------------------|
 * | Single Apparatus | MD0, SG0, MD1                | SG0+H                             |
 * | Multi Apparatus  | MD0, SG0, MD1, SG1, SG2, MD2 | SG0+H (blockable), SG1+H*, SG2+H* |
 *
 * - MD: Measurement Device (the camera with Bloch Sphere) in front of each SG phase.
 * - SG: Stern-Gerlach Apparatus: SG0 is the first one, SG1 is the second top, SG2 is the second bottom.
 * - +H: additional histogram on top of SGs in multi-particle mode.
 * - *: apparatus conditionally visible based on SG0 blocking mode (up, down)
 *
 * Also, the experiment ocurrs in stages to better keep track of the state of the particles. The stages are:
 * - Stage 0: From particle source, across possibly MD0 and into SG0.
 * - Stage 1: From SG0, across possibly MD1 and possibly into SG1 or SG2.
 * - Stage 2: From SG1 or SG2, across possibly MD2 and shot into infinity.
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

const MAXIMUM_PARTICLE_LIFETIME = 4; // seconds, empirically determined. At this point they are out of the screen

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

    // Particles are created with three spin states, one for each stage of the experiment.
    // First one comes from the preparation area and the rest will be determined by the SG apparatuses.
    const spinVectors = [ this.model.derivedSpinStateProperty.value.copy(), new Vector2( 0, 0 ), new Vector2( 0, 0 ) ];
    const isSpinUp = [ false, false, false ]; // TBD by the experiment
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

    // All these parameters have to be provided like this for later setting PhET-io State of particles
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

  public step( dt: number ): void {

    // Remove old particles
    this.particles.forEach( particle => {
      if ( particle.lifetime > MAXIMUM_PARTICLE_LIFETIME ) {
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

    // Threshold to consider the particle has reached its end position
    const threshold = 0.03;

    // If the particle were to reach its end position, measure it and decide on a new path
    if ( particle.position.x > particle.endPosition.x - threshold ) {
      const extraDistance = particle.position.x - particle.endPosition.x;
      const extraTime = extraDistance / particle.speed;

      const usingSingleApparatus = this.model.experimentProperty.value.usingSingleApparatus;

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
   * Given the incoming state of a particle, calculate the result of an SG measurement on a particle and set its spin
   */
  protected measureParticle(
    particle: ParticleWithSpin,
    sternGerlach: SternGerlach,
    experimentStageIndex: number, // 0: Launch, 1: SG0, 2: SG1/SG2
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