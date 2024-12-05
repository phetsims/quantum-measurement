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

export const PHOTON_SPEED = 0.3; // meters per second

// pre-fab unit vectors for the four cardinal directions
export const UP = new Vector2( 0, 1 );
export const DOWN = new Vector2( 0, -1 );
export const LEFT = new Vector2( -1, 0 );
export const RIGHT = new Vector2( 1, 0 );

// Due to the experiment's nature, when photons are split,
// the resulting states will either be measured as vertical or horizontal.
type possiblePolarizationResult = 'vertical' | 'horizontal';

// TODO: This class could live in its own file, once the feature is fully green lit, will move https://github.com/phetsims/quantum-measurement/issues/63
/**
 * QuantumPossibleState is a class that represents a possible state of a photon at a given point in time.
 * It contains properties for position, direction and the probability of the photon being in that state.
 */
export class QuantumPossibleState {
  public readonly positionProperty: Vector2Property;
  public readonly directionProperty: Vector2Property;
  public readonly probabilityProperty: NumberProperty;
  public readonly polarization: possiblePolarizationResult;

  public constructor( polarization: possiblePolarizationResult, tandem: Tandem ) {
    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );
    this.directionProperty = new Vector2Property( RIGHT, {
      tandem: tandem.createTandem( 'directionProperty' )
    } );
    this.probabilityProperty = new NumberProperty( polarization === 'vertical' ? 1 : 0, {
      tandem: tandem.createTandem( 'probabilityProperty' )
    } );
    this.polarization = polarization;
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

  public step( dt: number ): void {
    this.positionProperty.set( this.positionProperty.value.plus( this.directionProperty.value.timesScalar( PHOTON_SPEED * dt ) ) );
  }
}

export default class Photon extends PhetioObject {

  // Contains all the possible states of the photon, which include position, direction, and probability.
  // Since they contain properties, and based on the design of this simulation, it will always have two states.
  // TODO: Could this be an object instead of an array? https://github.com/phetsims/quantum-measurement/issues/65
  public possibleStates: [ QuantumPossibleState, QuantumPossibleState ];

  // whether this photon is active, and should thus be moved by the model and shown in the view
  public readonly activeProperty: BooleanProperty;

  // the angle of polarization for this photon, in degrees
  public readonly polarizationAngleProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.polarizationAngleProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'polarizationAngleProperty' )
    } );

    this.activeProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'activeProperty' )
    } );

    this.possibleStates = [
      new QuantumPossibleState( 'vertical', tandem.createTandem( 'verticalState' ) ),
      new QuantumPossibleState( 'horizontal', tandem.createTandem( 'horizontalState' ) )
    ];

    // Relate the possibilities of the two states
    this.possibleStates[ 0 ].probabilityProperty.lazyLink( probability => {
      this.possibleStates[ 1 ].probabilityProperty.set( 1 - probability );
    } );
    this.possibleStates[ 1 ].probabilityProperty.lazyLink( probability => {
      this.possibleStates[ 0 ].probabilityProperty.set( 1 - probability );
    } );

  }

  public step( dt: number ): void {
    if ( this.activeProperty.value ) {
      this.possibleStates.forEach( state => {
        state.step( dt );
      } );
    }
  }

  public reset(): void {
    this.activeProperty.reset();
    this.possibleStates.forEach( state => {
      state.positionProperty.reset();
      state.directionProperty.reset();
      state.probabilityProperty.reset();
    } );
  }
}

quantumMeasurement.register( 'Photon', Photon );