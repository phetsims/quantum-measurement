// Copyright 2024, University of Colorado Boulder

/**
 * PolarizingBeamSplitter is a model element that represents a device that splits a beam of photons into two beams based
 * on the polarization of the photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon, { QuantumPossibleState, RIGHT, UP } from './Photon.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = {
  collapsePhotonsProperty: TReadOnlyProperty<boolean>;
};
type PolarizingBeamSplitterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PolarizingBeamSplitter implements TPhotonInteraction {

  // The position of the center of the beam splitter in two-dimensional space.  Units are in meters.
  public readonly centerPosition: Vector2;

  // The size of the beam splitter, in meters.  This is empirically determined to match the design doc.
  public readonly size = new Dimension2( 0.07, 0.07 );

  // A line in model space that represents the position of the polarizing beam splitter.
  public readonly polarizingSurfaceLine: Line;

  // A flag that indicates whether to collapse the interacting photons, which represents the classical case.
  public readonly collapsePhotonsProperty: TReadOnlyProperty<boolean>;

  public constructor( centerPosition: Vector2, providedOptions: PolarizingBeamSplitterOptions ) {
    this.centerPosition = centerPosition;
    this.collapsePhotonsProperty = providedOptions.collapsePhotonsProperty;

    // Initialize the line that represents the position of the beam splitter in the model.
    const endpoint1 = new Vector2( centerPosition.x - this.size.width / 2, centerPosition.y - this.size.height / 2 );
    const endpoint2 = new Vector2( centerPosition.x + this.size.width / 2, centerPosition.y + this.size.height / 2 );
    this.polarizingSurfaceLine = new Line( endpoint1, endpoint2 );
  }

  public testForPhotonInteraction( photonState: QuantumPossibleState, photon: Photon, dt: number ): PhotonInteractionTestResult {

    assert && assert( photon.activeProperty.value, 'save CPU cycles - don\'t use this method with inactive photons' );

    // Test for whether this photon crosses the surface of the beam splitter.
    const photonIntersectionPoint = photonState.getTravelPathIntersectionPoint(
      this.polarizingSurfaceLine.start,
      this.polarizingSurfaceLine.end,
      dt
    );

    // Assume no interaction until proven otherwise.
    let interaction: PhotonInteractionTestResult = { interactionType: 'none' };

    if ( photonIntersectionPoint !== null ) {

      if ( photon.possibleStates[ 1 ].probabilityProperty.value === 0 ) {
        // Prepare the second state position, for its probability will now be >0 and will become relevant
        photon.possibleStates[ 1 ].positionProperty.value = photonState.positionProperty.value;
      }

      // Calculate the probability of reflection based on the custom angle according to Malus's Law
      const angleInRadians = Utils.toRadians( photon.polarizationAngleProperty.value );
      const probabilityOfReflection = 1 - Math.pow( Math.cos( angleInRadians ), 2 );

      if ( this.collapsePhotonsProperty.value ) {
        if ( dotRandom.nextDouble() <= probabilityOfReflection ) {

          // Set the probability of the reflected state, the other one will change due to entanglement
          photon.possibleStates[ 0 ].probabilityProperty.value = 1;

          // The photon is being reflected by the beam splitter.  The only direction supported currently is up.
          interaction = {
            interactionType: 'reflected',
            reflectionPoint: photonIntersectionPoint,
            reflectionDirection: UP
          };
        }
      }
      else {
        // Set the probability of the reflected state, the other one will change due to entanglement
        photon.possibleStates[ 0 ].probabilityProperty.value = probabilityOfReflection;

        // The photon is being reflected by the beam splitter.  The only direction supported currently is up.
        interaction = {
          interactionType: 'reflected',
          reflectionPoint: photonIntersectionPoint,
          reflectionDirection: photonState.polarization === 'vertical' ? UP : RIGHT
        };
      }
    }

    return interaction;
  }
}

quantumMeasurement.register( 'PolarizingBeamSplitter', PolarizingBeamSplitter );