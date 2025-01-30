// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonMotionState is a class that represents a possible state of a photon's motion.  It contains variables for
 * position, direction, and the probability of the photon being in that state.
 *
 * @author Agustín Vallejo
 * * @author John Blanco (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2, { Vector2StateObject } from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { PHOTON_SPEED } from './Photon.js';

export class PhotonMotionState {

  public constructor( public position: Vector2,
                      public direction: Vector2,
                      public probability: number ) {
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

  public static readonly PhotonMotionStateIO = new IOType<PhotonMotionState, PhotonMotionStateStateObject>( 'PhotonMotionStateIO', {
    valueType: PhotonMotionState,
    stateSchema: {
      position: Vector2.Vector2IO,
      direction: Vector2.Vector2IO,
      probability: NumberIO
    },
    fromStateObject: ( stateObject: PhotonMotionStateStateObject ) => {
      return new PhotonMotionState(
        Vector2.fromStateObject( stateObject.position ),
        Vector2.fromStateObject( stateObject.direction ),
        stateObject.probability
      );
    }
  } );
}

export type PhotonMotionStateStateObject = {
  position: Vector2StateObject;
  direction: Vector2StateObject;
  probability: number;
};