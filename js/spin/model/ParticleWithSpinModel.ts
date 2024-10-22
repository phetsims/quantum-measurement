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

export class ParticleWithSpinModel {

  public lifetime = 0;
  public activeProperty: BooleanProperty;

  public path: Vector2[][] = [];

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
    // Travel from vector a to vector b based on speed and t
    const travel = ( a: Vector2, b: Vector2, t: number ): Vector2 => {
      const direction = b.minus( a ).normalized();
      return a.plus( direction.times( this.speed * t ) );
    };

    const fractionalLifetime = this.lifetime % 1;

    switch( Math.floor( this.lifetime ) ) {
      case 0:
        // Between the first two points of the first path
        this.positionProperty.value = travel( this.path[ 0 ][ 0 ], this.path[ 0 ][ 1 ], fractionalLifetime );
        break;
      case 1:
        // In the middle of the SG1 apparatus
        this.positionProperty.value = travel( this.path[ 0 ][ 1 ], this.path[ 1 ][ 0 ], 0.5 );
        this.readyToBeMeasuredEmitter.emit();
        break;
      case 2:
        // Along the second or third paths
        this.positionProperty.value = travel( this.path[ 1 ][ 0 ], this.path[ 1 ][ 1 ], fractionalLifetime );
        break;
      case 3:
        // Inside a SG2 or SG3 apparatus
        if ( this.path.length > 3 ) {
          this.positionProperty.value = travel( this.path[ 0 ][ 1 ], this.path[ 1 ][ 0 ], 0.5 );
          this.readyToBeMeasuredEmitter.emit();
        }
        else {
          this.positionProperty.value = travel( this.path[ 1 ][ 0 ], this.path[ 1 ][ 1 ], this.lifetime - 2 );
        }
        break;
      default:
        // Along the last paths
        if ( this.path.length > 3 ) {
          this.positionProperty.value = travel( this.path[ 2 ][ 0 ], this.path[ 2 ][ 1 ], this.lifetime - 4 );
        }
        else {
          this.positionProperty.value = travel( this.path[ 1 ][ 0 ], this.path[ 1 ][ 1 ], this.lifetime - 2 );
        }
        break;
    }

    console.log( this.positionProperty.value );
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