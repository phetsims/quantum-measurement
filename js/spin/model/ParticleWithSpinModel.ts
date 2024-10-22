// Copyright 2024, University of Colorado Boulder

/**
 * ParticleWithSpinModel is the model for a particle with a predetermined spin. It has a lifetime, which will
 * determine its position in the Ray Path, and a spin value, which will be modified as it passes through the SG apparatuses.
 *
 *
 * // TODO: Would this be better off as an enumeration or state machine??? https://github.com/phetsims/quantum-measurement/issues/53
 * The lifetime should determine the current position of the particle in the view, like so:
 * t = 0 to t = 1: Traveling from source to SG1
 * t = 1 to t = 2: Being measured inside SG1
 * t = 2 to t = 3: Traveling from SG1 to SG2 or SG3 (if applicable)
 * t = 3 to t = 4: Being measured inside SG2 or SG3 (if applicable)
 * t = 4 to t = 5: Traveling onwards from SG2 or SG3
 * ( For experiments with only SG1, t = 2 to t = 5 is just traveling along the Ray Path )
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

export class ParticleWithSpinModel {

  public lifetime = 0;
  public activeProperty: BooleanProperty;

  public path: Vector2[] = [];

  // Spin values of the particle in the XZ plane along its lifetime
  public firstSpinVector = new Vector2( 0, 0 );
  public secondSpinVector = new Vector2( 0, 0 ); // After passing through SG1
  public thirdSpinVector = new Vector2( 0, 0 ); // After passing through SG2 or SG3

  // TODO: This is very specific to the model!! https://github.com/phetsims/quantum-measurement/issues/53
  // Same but simplified to spinUp booleans
  public firstSpinUp = false;
  public secondSpinUp = false;
  public thirdSpinUp = false;

  // Emitter to trigger a measurement by the model
  public readyToBeMeasuredEmitter = new Emitter();

  public positionProperty: Vector2Property;
  public speed = 1;

  public constructor( public readonly id: number ) {
    this.activeProperty = new BooleanProperty( false );
    this.positionProperty = new Vector2Property( new Vector2( 0, 0 ) );
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

      if ( this.lifetime > 10 ) {
        this.reset();
      }
    }
  }

  /**
   * The lifetime should determine the current position of the particle in the view, like so:
   * t = 0 to t = 1: Traveling from source to SG1 -> Path 0
   * t = 1 to t = 2: Being measured inside SG1
   * t = 2 to t = 3: Traveling from SG1 to SG2 or SG3 (if applicable) -> Path 1 or 2
   * t = 3 to t = 4: Being measured inside SG2 or SG3 (if applicable)
   * t = 4 to t = 5: Traveling onwards from SG2 or SG3 -> Paths 3 - 6
   */
  public calculatePosition(): void {

    // Travel until the final point, then stop
    const clampTravel = ( a: Vector2, b: Vector2, t: number ): Vector2 => {
      const direction = b.minus( a ).normalized();
      const distance = this.speed * t;
      return distance < a.distance( b ) ? a.plus( direction.times( distance ) ) : b;
    };

    // Similar to clampTravel but if it reached the end, move to the next pair of vectors until the end
    const pathTravel = ( path: Vector2[], t: number ): Vector2 => {
      let traveledTime = t;
      let traveledDistance = this.speed * t;
      let currentPosition = path[ 0 ];

      for ( let i = 0; i < path.length - 1; i++ ) {
        const start = path[ i ];
        const end = path[ i + 1 ];
        const segmentDistance = start.distance( end );

        if ( traveledDistance < segmentDistance ) {
          return clampTravel( start, end, traveledTime );
        }
        else {
          traveledTime -= segmentDistance / this.speed;
          traveledDistance -= segmentDistance;
          currentPosition = end;
        }
      }

      return currentPosition;
    };

    // Travel along the path
    this.positionProperty.value = pathTravel( this.path, this.lifetime );

  }

  public reset(): void {
    this.lifetime = 0;
    this.activeProperty.value = false;
    this.firstSpinVector.setXY( 0, 0 );
    this.secondSpinVector.setXY( 0, 0 );
    this.thirdSpinVector.setXY( 0, 0 );
    this.positionProperty.reset();
  }
}


quantumMeasurement.register( 'ParticleWithSpinModel', ParticleWithSpinModel );