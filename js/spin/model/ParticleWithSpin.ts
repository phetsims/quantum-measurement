// Copyright 2024, University of Colorado Boulder

/**
 * ParticleWithSpin is the model for a particle with a predetermined spin. It has a lifetime, which will
 * determine its position in the Ray Path, and a spin value, which will be modified as it passes through the SG apparatuses.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export class ParticleWithSpin {

  public lifetime = 0;
  public activeProperty: BooleanProperty;

  public path: Vector2[] = [];

  // Spin values of the particle in the XZ plane along its lifetime
  public spinVectors = [ new Vector2( 0, 0 ), new Vector2( 0, 0 ), new Vector2( 0, 0 ) ];

  // Same but simplified to spinUp booleans
  public isSpinUp = [ false, false, false ];

  // If the particle spin was already counted for the histograms or detectors
  public wasCounted = [ false, false, false ];

  // Start and end position properties for defining the particle paths
  public startPositionProperty: Vector2Property;
  public endPositionProperty: Vector2Property;

  public positionProperty: Vector2Property;
  public velocityProperty: Vector2Property;
  public speed = 1;

  public constructor( private readonly offset: Vector2 ) {
    this.activeProperty = new BooleanProperty( false );
    this.positionProperty = new Vector2Property( Vector2.ZERO );
    this.velocityProperty = new Vector2Property( Vector2.ZERO );

    this.startPositionProperty = new Vector2Property( Vector2.ZERO );
    this.endPositionProperty = new Vector2Property( new Vector2( 1, 0 ) );

    this.endPositionProperty.link( endPosition => {
      this.positionProperty.value = this.startPositionProperty.value.plus( this.offset );
      this.velocityProperty.value = endPosition.minus( this.startPositionProperty.value ).withMagnitude( this.speed );
      }
    );
  }

  public step( dt: number ): void {
    if ( this.activeProperty.value ) {
      this.lifetime += dt;

      this.positionProperty.value = this.positionProperty.value.plus( this.velocityProperty.value.times( dt ) );

      if ( this.lifetime > 5 ) {
        this.reset();
      }
    }
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