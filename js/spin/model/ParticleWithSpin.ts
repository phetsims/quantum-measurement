// Copyright 2024, University of Colorado Boulder

/**
 * ParticleWithSpin is the model for a particle with a predetermined spin. It has a lifetime, which will
 * determine its position in the Ray Path, and a spin value, which will be modified as it passes through the SG apparatuses.
 *
 * This time is not measured in seconds, but rather, scaled to the different moments in the life of the particle.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import quantumMeasurement from '../../quantumMeasurement.js';

// constants
const SPEED_MULTIPLIER = 1.5;

export class ParticleWithSpin {

  public lifetime = 0;
  public activeProperty: BooleanProperty;

  public path: Vector2[] = [];

  // Spin values of the particle in the XZ plane along its lifetime
  public spinVectors = [ new Vector2( 0, 0 ), new Vector2( 0, 0 ), new Vector2( 0, 0 ) ];

  // Same but simplified to spinUp booleans
  public isSpinUp = [ false, false, false ];

  // If the particle spin was already counted for the histograms. First spin is never counted, should always be false
  public wasCounted = [ false, false, false ];

  // Emitter to trigger a measurement by the model
  public readyToBeMeasuredEmitter = new Emitter();

  public positionProperty: Vector2Property;
  public speed = 1;

  public constructor( private readonly offset: Vector2 ) {
    this.activeProperty = new BooleanProperty( false );
    this.positionProperty = new Vector2Property( Vector2.ZERO );
  }

  /**
   * Updates the speed of the particle based on the distance between the first two points of the path.
   * When the multiplier is 1, it takes 1s to transverse from the emitting source to the first SG apparatus.
   */
  public updateSpeed(): void {
    this.speed = SPEED_MULTIPLIER * this.path[ 0 ].distance( this.path[ 1 ] );
  }

  public step( dt: number ): void {
    if ( this.activeProperty.value ) {
      this.lifetime += dt;

      this.calculatePosition();

      if ( this.lifetime > 5 ) {
        this.reset();
      }
    }
  }

  public calculatePosition(): void {

    // Travel until the final point, then stop
    const travel = ( a: Vector2, b: Vector2, t: number ): Vector2 => {
      const direction = b.minus( a ).normalized();
      const distance = this.speed * t;
      return a.plus( direction.times( distance ) );
    };

    // Similar to travel but if it reached the end, move to the next pair of vectors until the end
    const pathTravel = ( path: Vector2[], t: number ): Vector2 => {
      let traveledTime = t;
      let traveledDistance = this.speed * t;
      let currentPosition = path[ 0 ];
      let start = path[ 0 ];
      let end = path[ 1 ];
      let segmentDistance = start.distance( end );

      for ( let i = 0; i < path.length - 1; i++ ) {
        start = path[ i ];
        end = path[ i + 1 ];
        segmentDistance = start.distance( end );

        if ( traveledDistance < segmentDistance ) {
          return travel( start, end, traveledTime );
        }
        else {
          traveledTime -= segmentDistance / this.speed;
          traveledDistance -= segmentDistance;
          currentPosition = end;
        }
      }
      traveledTime += segmentDistance / this.speed;

      return travel( path[ path.length - 2 ], currentPosition, traveledTime );
    };

    // Travel along the path
    this.positionProperty.value = pathTravel( this.path, this.lifetime ).plus( this.offset );

  }

  public reset(): void {
    this.lifetime = 0;
    this.activeProperty.value = false;
    this.spinVectors.forEach( vector => vector.setXY( 0, 0 ) );
    this.positionProperty.reset();
    this.wasCounted = [ false, false, false ];
  }
}


quantumMeasurement.register( 'ParticleWithSpin', ParticleWithSpin );