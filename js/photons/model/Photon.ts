// Copyright 2024, University of Colorado Boulder

/**
 * Photon is a model element that represents a single photon.  It supports the needs of the Quantum Measurement sim,
 * and allows photons to be positioned and moved, and exist in multiple possible states.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export const PHOTON_SPEED = 0.3; // meters per second

// pre-fab unit vectors for the four cardinal directions
export const UP = new Vector2( 0, 1 );
export const DOWN = new Vector2( 0, -1 );
export const LEFT = new Vector2( -1, 0 );
export const RIGHT = new Vector2( 1, 0 );

// Due to the experiment's nature, when photons are split,
// the resulting states will either be measured as vertical or horizontal.
export type PossiblePolarizationResult = 'vertical' | 'horizontal';

// TODO: This class could live in its own file, once the feature is fully green lit, will move https://github.com/phetsims/quantum-measurement/issues/63
/**
 * QuantumPossibleState is a class that represents a possible state of a photon at a given point in time.
 * It contains variables for position, direction and the probability of the photon being in that state.
 */
export class QuantumPossibleState {
  public constructor( public position: Vector2,
                      public direction: Vector2,
                      public probability: number,
                      public readonly polarization: PossiblePolarizationResult /* TODO this still needed? https://github.com/phetsims/quantum-measurement/issues/65 */ ) {
    // no-op
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
    const photonPathEndPoint = this.position.plus( this.direction.timesScalar( PHOTON_SPEED * dt ) );

    // Return the intersection point if there is one, null if not.
    return Utils.lineSegmentIntersection(
      this.position.x,
      this.position.y,
      photonPathEndPoint.x,
      photonPathEndPoint.y,
      lineStart.x,
      lineStart.y,
      lineEnd.x,
      lineEnd.y
    );
  }

  public step( dt: number ): void {
    this.position = this.position.plus( this.direction.timesScalar( PHOTON_SPEED * dt ) );
  }

  public static readonly QuantumPossibleStateIO = new IOType<QuantumPossibleState, QuantumPossibleStateStateObject>( 'QuantumPossibleStateIO', {
    valueType: QuantumPossibleState,
    stateSchema: {
      position: Vector2.Vector2IO,
      direction: Vector2.Vector2IO,
      probability: NumberIO,
      polarization: StringIO
    },
    fromStateObject: ( stateObject: QuantumPossibleStateStateObject ) => {
      return new QuantumPossibleState(
        Vector2.Vector2IO.fromStateObject( stateObject.position ),
        Vector2.Vector2IO.fromStateObject( stateObject.direction ),
        stateObject.probability,
        stateObject.polarization as PossiblePolarizationResult
      );
    }
  } );
}

export default class Photon {

  // the angle of polarization for this photon, in degrees
  public polarizationAngle: number;

  // Contains all the possible states of the photon, which include position, direction, and probability.
  // Since they contain properties, and based on the design of this simulation, it will always have two states.
  public possibleStates: TwoStateQuantumPossibleState;

  public constructor( polarizationAngle: number,
                      possibleStates: TwoStateQuantumPossibleState ) {

    this.polarizationAngle = polarizationAngle;
    this.possibleStates = possibleStates;
  }

  public setCorrespondingProbability( providedState: QuantumPossibleState, probability: number ): void {
    const providedStateKey = _.findKey( this.possibleStates, providedState ) as PossiblePolarizationResult;

    assert && assert( providedStateKey, 'Photon state not found!' );

    const correspondingKey = providedStateKey === 'vertical' ? 'horizontal' : 'vertical';
    const correspondingState = this.possibleStates[ correspondingKey ];

    providedState.probability = probability;
    correspondingState.probability = 1 - probability;
  }

  public step( dt: number ): void {
    for ( const key in this.possibleStates ) {
      this.possibleStates[ key as PossiblePolarizationResult ].step( dt );
    }
  }

  public static readonly TwoStateQuantumPossibleStateIO = new IOType<TwoStateQuantumPossibleState, TwoStateQuantumPossibleStateStateObject>( 'TwoStateQuantumPossibleStateIO', {
    valueType: Photon,
    stateSchema: {
      vertical: QuantumPossibleState.QuantumPossibleStateIO,
      horizontal: QuantumPossibleState.QuantumPossibleStateIO
    },
    fromStateObject: ( stateObject: TwoStateQuantumPossibleStateStateObject ) => {
      return {
        vertical: QuantumPossibleState.QuantumPossibleStateIO.fromStateObject( stateObject.vertical ),
        horizontal: QuantumPossibleState.QuantumPossibleStateIO.fromStateObject( stateObject.horizontal )
      };
    }
  } );

  /**
   * Individual Projectile instances are not PhET-iO Instrumented. Instead, the Field that contains the Projectiles
   * calls ProjectileIO.toStateObject to serialize the Projectile instances. FieldIO uses reference type serialization
   * as a composite of the Projectiles, which use data type serialization.
   *
   * Please see https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * for more information on the different serialization types.
   */
  public static readonly PhotonIO = new IOType<Photon, PhotonStateObject>( 'PhotonIO', {
    valueType: Photon,
    stateSchema: {
      polarizationAngle: NumberIO,
      possibleStates: Photon.TwoStateQuantumPossibleStateIO
    },
    fromStateObject: ( stateObject: PhotonStateObject ) => {
      return new Photon(
        stateObject.polarizationAngle,
        {
          vertical: QuantumPossibleState.QuantumPossibleStateIO.fromStateObject( stateObject.possibleStates.vertical ),
          horizontal: QuantumPossibleState.QuantumPossibleStateIO.fromStateObject( stateObject.possibleStates.horizontal )
        }
      );
    }
  } );
}

type TwoStateQuantumPossibleState = {
  vertical: QuantumPossibleState;
  horizontal: QuantumPossibleState;
};

type TwoStateQuantumPossibleStateStateObject = {
  vertical: QuantumPossibleStateStateObject;
  horizontal: QuantumPossibleStateStateObject;
};

export type PhotonStateObject = {
  polarizationAngle: number;
  possibleStates: TwoStateQuantumPossibleStateStateObject;
};

export type QuantumPossibleStateStateObject = {
  position: Vector2StateObject;
  direction: Vector2StateObject;
  probability: number;
  polarization: string;
};

quantumMeasurement.register( 'Photon', Photon );