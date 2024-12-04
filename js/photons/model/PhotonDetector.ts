// Copyright 2024, University of Colorado Boulder

/**
 * PhotonDetector is the model element for the instrument that detects the rate at which photons are arriving in an
 * input window.  It keeps track of the rate at which photons arrive at this window.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AveragingCounterNumberProperty from '../../common/model/AveragingCounterNumberProperty.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { PHOTON_BEAM_WIDTH } from './Laser.js';
import Photon, { QuantumPossibleState } from './Photon.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = {
  displayMode?: DisplayMode;
};
type PhotonDetectorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// Define a type for the direction in which the detector is looking for photons.
export type DetectionDirection = ( [ 'up', 'down' ] )[number];

// Define a type for the display mode of the detector, which can be either a count of photons detected or a rate of
// detection.
export type DisplayMode = ( [ 'count', 'rate' ] )[number];

export const COUNT_RANGE = new Range( 0, 999 );
export const RATE_RANGE = new Range( 0, 999 ); // in events per second

export default class PhotonDetector implements TPhotonInteraction {

  // The position of the detector in two-dimensional space.  Units are in meters.
  public readonly position: Vector2;

  // The direction in which the detector is looking for photons.
  public readonly detectionDirection: DetectionDirection;

  // detection aperture width, in meters
  public readonly apertureDiameter = PHOTON_BEAM_WIDTH * 1.75;

  // A line in model space that represents the position of the detection aperture.  If a photon crosses this line, it
  // will be absorbed and detected.
  public readonly detectionLine: Line;

  // The number of photons detected by this detector since the last reset.
  public readonly detectionCountProperty: NumberProperty;

  // The rate at which photons are detected, in arrival events per second.
  public readonly detectionRateProperty: AveragingCounterNumberProperty;

  // The display mode defines the information that should be displayed by this detector in the view.
  public readonly displayMode: DisplayMode;

  public constructor( position: Vector2, detectionDirection: DetectionDirection, providedOptions: PhotonDetectorOptions ) {

    const options = combineOptions<PhotonDetectorOptions>( {
      displayMode: 'count'
    }, providedOptions );

    this.position = position;
    this.detectionDirection = detectionDirection;
    this.displayMode = options.displayMode!;
    this.detectionLine = new Line(
      position.plus( new Vector2( -this.apertureDiameter / 2, 0 ) ),
      position.plus( new Vector2( this.apertureDiameter / 2, 0 ) )
    );

    this.detectionRateProperty = new AveragingCounterNumberProperty( {
      tandem: options.tandem.createTandem( 'detectionRateProperty' ),
      phetioReadOnly: true,
      range: RATE_RANGE
    } );

    this.detectionCountProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'detectionCountProperty' ),
      phetioReadOnly: true,
      range: COUNT_RANGE
    } );
  }

  public testForPhotonInteraction( photonState: QuantumPossibleState, photon: Photon, dt: number ): PhotonInteractionTestResult {

    assert && assert( photon.activeProperty.value, 'save CPU cycles - don\'t use this method with inactive photons' );

    // Test for whether this photon would cross the detection aperture.
    const photonIntersectionPoint = photonState.getTravelPathIntersectionPoint(
      this.detectionLine.start,
      this.detectionLine.end,
      dt
    );

    // Assume no interaction until proven otherwise.
    let interaction: PhotonInteractionTestResult = { interactionType: 'none' };

    if ( photonIntersectionPoint !== null ) {
      // Evaluate the detection result based on the probability of the photon actually being here!
      if ( dotRandom.nextDouble() < photonState.probabilityProperty.value ) {
        photonState.probabilityProperty.value = 1; // the photon is detected!
        interaction = { interactionType: 'absorbed' };
      }
      else {
        // If the photon is not detected. This state probability goes to 0%, which will make the other state 100%.
        photonState.probabilityProperty.value = 0;
      }
    }

    if ( interaction.interactionType === 'absorbed' ) {
      this.detectionCountProperty.value = Math.min( this.detectionCountProperty.value + 1, COUNT_RANGE.max );
      this.detectionRateProperty.countEvent();
    }

    return interaction;
  }

  public step( dt: number ): void {
    this.detectionRateProperty.step( dt );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.detectionCountProperty.reset();
    this.detectionRateProperty.reset();
  }

  /**
   * Resets just the detection count.
   */
  public resetDetectionCount(): void {
    this.detectionCountProperty.reset();
  }
}

quantumMeasurement.register( 'PhotonDetector', PhotonDetector );