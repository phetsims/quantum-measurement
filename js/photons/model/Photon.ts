// Copyright 2024-2025, University of Colorado Boulder

/**
 * Photon is a model element that represents a single photon.  It supports the needs of the Quantum Measurement sim,
 * and allows photons to be positioned and moved, and exist in multiple possible states.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { PhotonMotionState } from './PhotonMotionState.js';

class Photon {

  // the angle of polarization for this photon, in degrees
  public polarizationAngle: number;

  // Contains all the possible motion states of the photon.  The photon should always have at least one of these, but
  // can have more than one if it is in a superposition of states.  The probabilities of these states should always add
  // up to 1.  This array can be monitored outside of this class, but should only be modified through the methods.
  public readonly possibleMotionStates: PhotonMotionState[];

  public static readonly PHOTON_SPEED = 0.3; // meters per second

  // pre-fab unit vectors for the four cardinal directions
  public static readonly UP = new Vector2( 0, 1 );
  public static readonly DOWN = new Vector2( 0, -1 );
  public static readonly LEFT = new Vector2( -1, 0 );
  public static readonly RIGHT = new Vector2( 1, 0 );

  public constructor( polarizationAngle: number,
                      initialPosition: Vector2,
                      initialDirection: Vector2 ) {

    this.polarizationAngle = polarizationAngle;

    // Start off with a single possible motion state for the photon.
    this.possibleMotionStates = [ new PhotonMotionState( initialPosition, initialDirection, 1 ) ];
  }

  /**
   * Add a new motion state to the photon.  The probability of the new state should be provided, and the probability of
   * the existing state will be adjusted accordingly.  The probabilities of all states should always add up to 1.
   */
  public addMotionState( position: Vector2, direction: Vector2, probability: number ): void {

    // As of this writing, only two possible motion states are allowed.
    assert && assert( this.possibleMotionStates.length < 2, 'Only two possible motion states are allowed.' );

    // Make sure the probabilities add up to 1.
    if ( this.possibleMotionStates.length === 1 ) {
      const existingMotionState = this.possibleMotionStates[ 0 ];
      existingMotionState.probability = 1 - probability;
    }
    else {

      // If this is the only state, make sure the probability is 1.
      assert && assert( probability === 1, 'The probability should be 1 for the first state.' );
    }

    // Add the new motion state.
    this.possibleMotionStates.push( new PhotonMotionState( position, direction, probability ) );
  }

  /**
   * Set the probability of a motion state.  The probability of the other state, if present, will be adjusted
   * accordingly.
   */
  public setMotionStateProbability( motionState: PhotonMotionState, probability: number ): void {

    // parameter and state checking
    assert && assert( probability >= 0 && probability <= 1, 'Probability must be between 0 and 1.' );
    assert && assert( this.possibleMotionStates.length <= 2, 'A max of 2 motion states are currently supported.' );

    const index = this.possibleMotionStates.indexOf( motionState );
    assert && assert( index !== -1, 'Motion state not found.' );
    this.possibleMotionStates[ index ].probability = probability;

    // If there are two states, adjust the probability of the other state.
    if ( this.possibleMotionStates.length === 2 ) {
      const otherMotionState = this.possibleMotionStates[ 1 - index ];
      otherMotionState.probability = 1 - probability;
    }
  }

  public step( dt: number ): void {
    this.possibleMotionStates.forEach( state => state.step( dt ) );
  }

  /**
   * Individual Photon instances are not PhET-iO Instrumented. Instead, the PhotonCollection that contains the
   * Photon instances calls PhotonIO.toStateObject to serialize them. PhotonCollectionIO uses reference-type
   * serialization as a composite of the Photon instances, which use data type serialization.
   *
   * Please see https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * for more information on the different serialization types.
   */
  public static readonly PhotonIO = new IOType<Photon, PhotonStateObject>( 'PhotonIO', {
    valueType: Photon,
    stateSchema: {
      polarizationAngle: NumberIO,
      possibleMotionStates: ArrayIO( PhotonMotionState.PhotonMotionStateIO )
    },
    fromStateObject: ( stateObject: PhotonStateObject ) => {

      assert && assert( stateObject.possibleMotionStates.length > 0, 'There must be at least one motion state.' );

      const photon = new Photon(
        stateObject.polarizationAngle,
        Vector2.fromStateObject( stateObject.possibleMotionStates[ 0 ].position ),
        Vector2.fromStateObject( stateObject.possibleMotionStates[ 0 ].direction )
      );

      // Add the remaining motion states, if any.
      for ( let i = 1; i < stateObject.possibleMotionStates.length; i++ ) {
        const motionStateStateObject = stateObject.possibleMotionStates[ i ];
        photon.addMotionState(
          Vector2.fromStateObject( motionStateStateObject.position ),
          Vector2.fromStateObject( motionStateStateObject.direction ),
          motionStateStateObject.probability
        );
      }

      return photon;
    }
  } );
}

export type PhotonStateObject = {
  polarizationAngle: number;
  possibleMotionStates: PhotonMotionState[];
};

quantumMeasurement.register( 'Photon', Photon );

export default Photon;