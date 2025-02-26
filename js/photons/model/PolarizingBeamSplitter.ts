// Copyright 2024-2025, University of Colorado Boulder

/**
 * PolarizingBeamSplitter is a model element that represents a device that splits a beam of photons into two beams based
 * on the polarization of the photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/segments/Segment.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon, { RIGHT, UP } from './Photon.js';
import { PhotonMotionState } from './PhotonMotionState.js';
import { PhotonInteractionTestResult, PhotonInteractionValues } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = {
  particleBehaviorModeProperty: TReadOnlyProperty<SystemType>;
};
type PolarizingBeamSplitterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class PolarizingBeamSplitter implements TPhotonInteraction {

  // The position of the center of the beam splitter in two-dimensional space.  Units are in meters.
  public readonly centerPosition: Vector2;

  // The size of the beam splitter, in meters.  This is empirically determined to match the design doc.
  public readonly size = new Dimension2( 0.07, 0.07 );

  // A line in model space that represents the position of the polarizing beam splitter.
  public readonly polarizingSurfaceLine: Line;

  // A flag that indicates whether to collapse the interacting photons, which represents the classical case.
  public readonly particleBehaviorModeProperty: TReadOnlyProperty<SystemType>;

  public constructor( centerPosition: Vector2, providedOptions: PolarizingBeamSplitterOptions ) {
    this.centerPosition = centerPosition;
    this.particleBehaviorModeProperty = providedOptions.particleBehaviorModeProperty;

    // Initialize the line that represents the position of the beam splitter in the model.
    const endpoint1 = new Vector2( centerPosition.x - this.size.width / 2, centerPosition.y - this.size.height / 2 );
    const endpoint2 = new Vector2( centerPosition.x + this.size.width / 2, centerPosition.y + this.size.height / 2 );
    this.polarizingSurfaceLine = new Line( endpoint1, endpoint2 );
  }

  /**
   * Test for photon interactions with the beam splitter.
   */
  public testForPhotonInteraction( photon: Photon, dt: number ): Map<PhotonMotionState, PhotonInteractionTestResult> {

    const mapOfStatesToInteractions = new Map<PhotonMotionState, PhotonInteractionTestResult>();

    // Iterate over the possible states and test for interactions.
    photon.possibleMotionStates.forEach( photonState => {

      // Test whether this photon state reaches or crosses the surface of the beam splitter.
      const photonIntersectionPoint = photonState.getTravelPathIntersectionPoint(
        this.polarizingSurfaceLine.start,
        this.polarizingSurfaceLine.end,
        dt
      );

      if ( photonIntersectionPoint !== null ) {

        // Calculate the probability of reflection based on the custom angle according to Malus's Law
        const angleInRadians = toRadians( photon.polarizationAngle );
        const probabilityOfReflection = 1 - Math.pow( Math.cos( angleInRadians ), 2 );

        if ( this.particleBehaviorModeProperty.value === 'classical' ) {

          // This is the classical case, where photons "choose" a path at the beam splitter.
          if ( dotRandom.nextDouble() <= probabilityOfReflection ) {

            // The photon is being reflected by the beam splitter.  The only direction supported currently is up.
            mapOfStatesToInteractions.set( photonState, {
              interactionType: PhotonInteractionValues.REFLECTED,
              reflectionInfo: {
                reflectionPoint: photonIntersectionPoint,
                reflectionDirection: UP
              }
            } );
          }
        }
        else {

          // This is the quantum case where the photon is split into a superposition of states until observed by one of
          // the detectors.
          mapOfStatesToInteractions.set( photonState, {
            interactionType: PhotonInteractionValues.SPLIT,
            splitInfo: {
              splitPoint: photonIntersectionPoint,
              splitStates: [
                {
                  direction: UP,
                  probability: probabilityOfReflection
                },
                {
                  direction: RIGHT,
                  probability: 1 - probabilityOfReflection
                }
              ]
            }
          } );
        }
      }
    } );

    return mapOfStatesToInteractions;
  }
}

quantumMeasurement.register( 'PolarizingBeamSplitter', PolarizingBeamSplitter );
export default PolarizingBeamSplitter;