// Copyright 2024, University of Colorado Boulder

/**
 * PhotonDetector is the model element for the instrument that detects the rate at which photons are arriving in an
 * input window.  It keeps track of the rate at which photons arrive at this window.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AveragingCounterNumberProperty from '../../common/model/AveragingCounterNumberProperty.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { PHOTON_BEAM_WIDTH } from './Laser.js';
import Photon from './Photon.js';
import { PhotonMotionState } from './PhotonMotionState.js';
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

  // detection aperture height, in meters
  public readonly apertureHeight = 0.05;

  // A line in model space that represents the position of the detection aperture.  If a photon crosses this line, it
  // will be detected but not absorbed.
  public readonly detectionLine: Line;

  // The line in model space that represents the absorption line of the detector.  This is the line that the photon
  // must cross to be destroyed.
  public readonly absorptionLine: Line;

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
    this.absorptionLine = new Line(
      position.plus( new Vector2( -this.apertureDiameter / 2, this.detectionDirection === 'up' ? this.apertureHeight : -this.apertureHeight ) ),
      position.plus( new Vector2( this.apertureDiameter / 2, this.detectionDirection === 'up' ? this.apertureHeight : -this.apertureHeight ) )
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

  /**
   * Test for interaction between the provided photon and this detector.
   */
  public testForPhotonInteraction( photon: Photon, dt: number ): Map<PhotonMotionState, PhotonInteractionTestResult> {

    const mapOfStatesToInteractions = new Map<PhotonMotionState, PhotonInteractionTestResult>();

    // Iterate over the possible states and test for interactions.
    photon.possibleMotionStates.forEach( photonState => {

      // Test whether this photon state would reach or cross the detection aperture in the provided time.
      const detectionIntersectionPoint = photonState.getTravelPathIntersectionPoint(
        this.detectionLine.start,
        this.detectionLine.end,
        dt
      );

      // Test whether this photon state would reach or cross the absorption line in the provided time.
      const absorptionIntersectionPoint = photonState.getTravelPathIntersectionPoint(
        this.absorptionLine.start,
        this.absorptionLine.end,
        dt
      );

      // If, by any chance, the photon would cross BOTH the detection and absorption lines, we'll consider it to be
      // detected and absorbed.
      if ( detectionIntersectionPoint !== null && absorptionIntersectionPoint !== null ) {
        mapOfStatesToInteractions.set( photonState, { interactionType: 'detectedAndAbsorbed', detectionInfo: { detector: this } } );
      }
      // If the photon would cross the detection line, but not the absorption line, we'll consider it to be detected.
      else if ( detectionIntersectionPoint !== null ) {
        mapOfStatesToInteractions.set( photonState, { interactionType: 'detected', detectionInfo: { detector: this } } );
      }
      // If the photon would cross the absorption line, but not the detection line, we'll consider it to be absorbed.
      else if ( absorptionIntersectionPoint !== null ) {
        mapOfStatesToInteractions.set( photonState, { interactionType: 'absorbed' } );
      }
    } );

    return mapOfStatesToInteractions;
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