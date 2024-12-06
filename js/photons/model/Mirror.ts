// Copyright 2024, University of Colorado Boulder

/**
 * Mirror is a model element that reflects photons that arrive from the left downward.  It is very specific to the
 * "Photons" screen, but could be generalized if necessary.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon, { DOWN, PossiblePolarizationResult, QuantumPossibleState } from './Photon.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = EmptySelfOptions;
type MirrorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const MIRROR_LENGTH = 0.095; // meters

export default class Mirror implements TPhotonInteraction {

  // The position of the center of the mirror in 2D space.  Units are in meters.
  public readonly centerPosition: Vector2;

  // A line in model space that represents the position of the surface of the mirror.
  public readonly mirrorSurfaceLine: Line;

  public constructor( centerPosition: Vector2, providedOptions: MirrorOptions ) {
    this.centerPosition = centerPosition;

    // Initialize the line that represents the position of the mirror surface in the model.
    const endpoint1 = centerPosition.plus( new Vector2( MIRROR_LENGTH / 2, 0 ).rotated( -Math.PI / 4 ) );
    const endpoint2 = centerPosition.plus( new Vector2( -MIRROR_LENGTH / 2, 0 ).rotated( -Math.PI / 4 ) );
    this.mirrorSurfaceLine = new Line( endpoint1, endpoint2 );
  }

  public testForPhotonInteraction( photon: Photon, dt: number ): Map<QuantumPossibleState, PhotonInteractionTestResult> {

    const mapOfStatesToInteractions = new Map<QuantumPossibleState, PhotonInteractionTestResult>();

    // Iterate over the possible states and test for interactions.
    Object.keys( photon.possibleStates ).forEach( stateKey => {

      const photonState = photon.possibleStates[ stateKey as PossiblePolarizationResult ];

      // Test for whether this photon crosses the surface of the beam splitter.
      const photonIntersectionPoint = photonState.getTravelPathIntersectionPoint(
        this.mirrorSurfaceLine.start,
        this.mirrorSurfaceLine.end,
        dt
      );

      if ( photonIntersectionPoint !== null ) {

        // The photon is being reflected by this mirror.  The only direction supported currently is down.
        mapOfStatesToInteractions.set( photonState, {
          interactionType: 'reflected',
          reflectionPoint: photonIntersectionPoint,
          reflectionDirection: DOWN
        } );
      }
      else {
        mapOfStatesToInteractions.set( photonState, { interactionType: 'none' } );
      }
    } );

    return mapOfStatesToInteractions;
  }
}

quantumMeasurement.register( 'Mirror', Mirror );