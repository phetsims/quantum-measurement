// Copyright 2024, University of Colorado Boulder

/**
 * Photon is a model element that represents a single photon.  It supports the needs of the Quantum Measurement sim,
 * and allows photons to be positioned and moved, and not much else.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export const PHOTON_SPEED = 0.2; // meters per second

// pre-fab unit vectors for the four cardinal directions
export const UP = new Vector2( 0, 1 );
export const DOWN = new Vector2( 0, -1 );
export const LEFT = new Vector2( -1, 0 );
export const RIGHT = new Vector2( 1, 0 );

export default class Photon extends PhetioObject {

  // position in 2D space
  public readonly positionProperty: Vector2Property;

  // a unit vector that represents the direction of travel for this photon
  public readonly directionProperty: Vector2Property;

  // whether this photon is active, and should thus be moved by the model and shown in the view
  public readonly activeProperty: BooleanProperty;

  // the angle of polarization for this photon, in degrees
  public readonly polarizationAngleProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    this.polarizationAngleProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'polarizationAngleProperty' )
    } );

    this.directionProperty = new Vector2Property( RIGHT, {
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

  /**
   * Get the point where this photon would intersect the provided line segment if it were to move for the specified
   * amount of time.  Returns null if the photon would not intersect the line segment.
   * @param lineStart
   * @param lineEnd
   * @param dt - time step, in seconds
   */
  public getTravelPathIntersectionPoint( lineStart: Vector2, lineEnd: Vector2, dt: number ): Vector2 | null {

    // Create a line that represents the path of the photon.
    const photonPathEndPoint = this.positionProperty.value.plus( this.directionProperty.value.timesScalar( PHOTON_SPEED * dt ) );

    // Return the intersection point if there is one, null if not.
    return Utils.lineSegmentIntersection(
      this.positionProperty.value.x,
      this.positionProperty.value.y,
      photonPathEndPoint.x,
      photonPathEndPoint.y,
      lineStart.x,
      lineStart.y,
      lineEnd.x,
      lineEnd.y
    );
  }
}

quantumMeasurement.register( 'Photon', Photon );