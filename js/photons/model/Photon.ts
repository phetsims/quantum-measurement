// Copyright 2024, University of Colorado Boulder

/**
 * Photon is a model element that represents a single photon.  It supports the needs of the Quantum Measurement sim,
 * and allows photons to be positioned and moved, and not much else.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export const PHOTON_SPEED = 0.1; // meters per second

export default class Photon extends PhetioObject {

  // position in 2D space
  public readonly positionProperty: Vector2Property;

  // a unit vector that represents the direction of travel for this photon
  public readonly directionProperty: Vector2Property;

  // whether this photon is active, and should thus be moved by the model and shown in the view
  public readonly activeProperty: BooleanProperty;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    this.directionProperty = new Vector2Property( new Vector2( 1, 0 ), {
      tandem: tandem.createTandem( 'directionProperty' )
    } );

    this.activeProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'activeProperty' )
    } );
  }

  public step( dt: number ): void {
    if ( this.activeProperty.value ) {
      this.positionProperty.set( this.positionProperty.value.plus( this.directionProperty.value.timesScalar( PHOTON_SPEED * dt ) ) );
    }
  }

  public reset(): void {
    this.positionProperty.reset();
    this.directionProperty.reset();
    this.activeProperty.reset();
  }
}

quantumMeasurement.register( 'Photon', Photon );