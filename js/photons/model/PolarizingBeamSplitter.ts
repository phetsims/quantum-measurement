// Copyright 2024, University of Colorado Boulder

/**
 * PolarizingBeamSplitter is a model element that represents a device that splits a beam of photons into two beams based
 * on the polarization of the photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon, { UP } from './Photon.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = EmptySelfOptions;
type PolarizingBeamSplitterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PolarizingBeamSplitter implements TPhotonInteraction {

  // The position of the center of the beam splitter in two-dimensional space.  Units are in meters.
  public readonly centerPosition: Vector2;

  // the size of the beam splitter, in meters
  public readonly size = new Dimension2( 0.10, 0.10 );

  // A line in model space that represents the position of the polarizing beam splitter.
  public readonly polarizingSurfaceLine: Line;

  public constructor( centerPosition: Vector2, providedOptions: PolarizingBeamSplitterOptions ) {
    this.centerPosition = centerPosition;

    // Initialize the line that represents the position of the beam splitter in the model.
    const endpoint1 = new Vector2( centerPosition.x - this.size.width / 2, centerPosition.y - this.size.height / 2 );
    const endpoint2 = new Vector2( centerPosition.x + this.size.width / 2, centerPosition.y + this.size.height / 2 );
    this.polarizingSurfaceLine = new Line( endpoint1, endpoint2 );
  }

  public testForPhotonInteraction( photon: Photon, dt: number ): PhotonInteractionTestResult {

    assert && assert( photon.activeProperty.value, 'save CPU cycles - don\'t use this method with inactive photons' );

    // Test for whether this photon crosses the surface of the beam splitter.
    const photonIntersectionPoint = photon.getTravelPathIntersectionPoint(
      this.polarizingSurfaceLine.start,
      this.polarizingSurfaceLine.end,
      dt
    );

    // Assume no interaction until proven otherwise.
    let interaction: PhotonInteractionTestResult = { interactionType: 'none' };

    if ( photonIntersectionPoint !== null ) {

      // Calculate the probability of reflection based on the custom angle according to Malus's Law
      const angleInRadians = Utils.toRadians( photon.polarizationAngleProperty.value );
      const probabilityOfReflection = 1 - Math.pow( Math.cos( angleInRadians ), 2 );

      if ( dotRandom.nextDouble() <= probabilityOfReflection ) {

        // The photon is being reflected by the beam splitter.  The only direction supported currently is up.
        interaction = {
          interactionType: 'reflected',
          reflectionPoint: photonIntersectionPoint,
          reflectionDirection: UP
        };
      }
    }

    return interaction;
  }
}

quantumMeasurement.register( 'PolarizingBeamSplitter', PolarizingBeamSplitter );