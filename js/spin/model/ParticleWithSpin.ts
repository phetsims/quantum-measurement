// Copyright 2024-2025, University of Colorado Boulder

/**
 * ParticleWithSpin is the model for a particle with a predetermined spin. It has a lifetime, which will determine its
 * position, and a spin value, which will be modified as it passes through the SG apparatuses.
 *
 * Particles advance from their startPosition to their endPositions, which will be assigned by the Collection they
 * belong to.
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export class ParticleWithSpin {

  // lifetime, will determine when the particle dies off
  public lifetime = 0;

  // randomized offset to give a more natural look
  private readonly offset: Vector2;

  // position of the particle in 2D space
  public position: Vector2;

  // velocity of the particle
  public velocity: Vector2;

  // spin values of the particle in the XZ plane along its lifetime
  // First one is initial spin after being emitted, second is exiting SG0, third is exiting SG1/SG2.
  public spinVectors = [ new Vector2( 0, 0 ), new Vector2( 0, 0 ), new Vector2( 0, 0 ) ];

  // same as the spinVectors but simplified to spinUp booleans
  public isSpinUp = [ false, false, false ];

  // whether the particle spin was already counted for the histograms or detectors
  public stageCompleted = [ false, false, false ];

  // start and end position properties for defining the particle paths
  public startPosition: Vector2;
  public endPosition: Vector2;

  public speed = 1;

  public constructor( lifetime: number,
                      position: Vector2,
                      velocity: Vector2,
                      spinVectors: Vector2[],
                      isSpinUp: boolean[],
                      stageCompleted: boolean[],
                      startPosition: Vector2,
                      endPosition: Vector2,
                      offset: Vector2 ) {

    this.lifetime = lifetime;
    this.velocity = velocity;
    this.spinVectors = spinVectors;
    this.isSpinUp = isSpinUp;
    this.stageCompleted = stageCompleted;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.offset = offset;

    this.updatePath( startPosition, endPosition );
    this.position = position;
  }

  public updatePath( start: Vector2, end: Vector2, extraTime = 0 ): void {
    this.startPosition = start;
    this.endPosition = end;
    this.position = this.startPosition.plus( this.offset );
    this.velocity = this.endPosition.minus( this.startPosition ).withMagnitude( this.speed );
    this.step( extraTime );
  }

  public step( dt: number ): void {
    this.lifetime += dt;
    this.position = this.position.plus( this.velocity.times( dt ) );
  }

  /**
   * Individual particle instances are not PhET-iO instrumented. Instead, the ParticleCollection that contains the
   * particle instances calls ParticleWithSpinIO.toStateObject to serialize the particle instances. ParticleCollectionIO
   * uses reference type serialization as a composite of the particles, which use data type serialization.
   *
   * Please see https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * for more information on the different serialization types.
   */
  public static readonly ParticleWithSpinIO = new IOType<ParticleWithSpin, ParticleWithSpinStateObject>( 'ParticleWithSpinIO', {
    valueType: ParticleWithSpin,
    stateSchema: {
      lifetime: NumberIO,
      position: Vector2.Vector2IO,
      velocity: Vector2.Vector2IO,
      spinVectors: ArrayIO( Vector2.Vector2IO ),
      isSpinUp: ArrayIO( BooleanIO ),
      stageCompleted: ArrayIO( BooleanIO ),
      startPosition: Vector2.Vector2IO,
      endPosition: Vector2.Vector2IO,
      offset: Vector2.Vector2IO
    },
    fromStateObject: ( stateObject: ParticleWithSpinStateObject ) => {
      return new ParticleWithSpin(
        stateObject.lifetime,
        Vector2.Vector2IO.fromStateObject( stateObject.position ),
        Vector2.Vector2IO.fromStateObject( stateObject.velocity ),
        ArrayIO( Vector2.Vector2IO ).fromStateObject( stateObject.spinVectors ),
        ArrayIO( BooleanIO ).fromStateObject( stateObject.isSpinUp ),
        ArrayIO( BooleanIO ).fromStateObject( stateObject.stageCompleted ),
        Vector2.Vector2IO.fromStateObject( stateObject.startPosition ),
        Vector2.Vector2IO.fromStateObject( stateObject.endPosition ),
        Vector2.Vector2IO.fromStateObject( stateObject.offset )
      );
    }
  } );
}

type ParticleWithSpinStateObject = {
  lifetime: number;
  position: Vector2;
  velocity: Vector2;
  spinVectors: Vector2[];
  isSpinUp: boolean[];
  stageCompleted: boolean[];
  startPosition: Vector2;
  endPosition: Vector2;
  offset: Vector2;
};

quantumMeasurement.register( 'ParticleWithSpin', ParticleWithSpin );