// Copyright 2024-2025, University of Colorado Boulder

/**
 * Mirror is a model element that reflects photons that arrive from the left downward.  It is very specific to the
 * "Photons" screen, but could be generalized if necessary.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/segments/Segment.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon from './Photon.js';
import { PhotonMotionState } from './PhotonMotionState.js';
import { PhotonInteractionTestResult, PhotonInteractionValues } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

// constants
const MIRROR_LENGTH = 0.095; // meters

class Mirror extends PhetioObject implements TPhotonInteraction {

  // The position of the center of the mirror in 2D space.  Units are in meters.
  public readonly centerPosition: Vector2;

  // A line in model space that represents the position of the surface of the mirror.
  public readonly mirrorSurfaceLine: Line;

  public constructor( centerPosition: Vector2 ) {

    super( {
      phetioState: false,
      tandem: Tandem.OPT_OUT // No aspects of this should be alterable via phet-io.
    } );

    this.centerPosition = centerPosition;

    // Initialize the line that represents the position of the mirror surface in the model.
    const endpoint1 = centerPosition.plus( new Vector2( MIRROR_LENGTH / 2, 0 ).rotated( -Math.PI / 4 ) );
    const endpoint2 = centerPosition.plus( new Vector2( -MIRROR_LENGTH / 2, 0 ).rotated( -Math.PI / 4 ) );
    this.mirrorSurfaceLine = new Line( endpoint1, endpoint2 );
  }

  /**
   * Test for interaction between the provided photon and this mirror.
   */
  public testForPhotonInteraction( photon: Photon, dt: number ): Map<PhotonMotionState, PhotonInteractionTestResult> {

    const mapOfStatesToInteractions = new Map<PhotonMotionState, PhotonInteractionTestResult>();

    // Iterate over the possible states and test for interactions.
    photon.possibleMotionStates.forEach( photonState => {

      // Test whether this photon state would reach the surface of the mirror in the provided time.
      const photonIntersectionPoint = photonState.getTravelPathIntersectionPoint(
        this.mirrorSurfaceLine.start,
        this.mirrorSurfaceLine.end,
        dt
      );

      if ( photonIntersectionPoint !== null ) {

        // The photon is being reflected by this mirror.  The only direction supported currently is down.
        mapOfStatesToInteractions.set( photonState, {
          interactionType: PhotonInteractionValues.REFLECTED,
          reflectionInfo: {
            reflectionPoint: photonIntersectionPoint,
            reflectionDirection: Photon.DOWN
          }
        } );
      }
    } );

    return mapOfStatesToInteractions;
  }
}

quantumMeasurement.register( 'Mirror', Mirror );

export default Mirror;