// Copyright 2024, University of Colorado Boulder

/**
 * PhotonDetector is the model element for the instrument that detects the rate at which photons are arriving in an
 * input window.  It keeps track of the rate at which photons arrive at this window.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { PHOTON_BEAM_WIDTH } from './Laser.js';
import Photon from './Photon.js';
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

type DetectionCountSample = {
  duration: number; // in seconds
  count: number;
};

// constants used in the rate calculation
const TOTAL_AVERAGING_PERIOD = 2; // in seconds
const COUNT_SAMPLE_PERIOD = 0.5; // in seconds

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
  public readonly detectionRateProperty: NumberProperty;

  // variables used in the detection rate calculation
  private currentDetectionCount = 0;
  private detectionSampleHistory: DetectionCountSample[] = [];
  private timeSinceLastCountSample = 0;

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

    this.detectionRateProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'detectionRateProperty' )
    } );

    this.detectionCountProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'detectionCountProperty' )
    } );
  }

  public testForPhotonInteraction( photon: Photon, dt: number ): PhotonInteractionTestResult {

    assert && assert( photon.activeProperty.value, 'save CPU cycles - don\'t use this method with inactive photons' );

    // Test for whether this photon would cross the detection aperture.
    const photonIntersectionPoint = photon.getTravelPathIntersectionPoint(
      this.detectionLine.start,
      this.detectionLine.end,
      dt
    );

    const detectionResult: PhotonInteractionTestResult = photonIntersectionPoint !== null ?
      { interactionType: 'absorbed' } :
      { interactionType: 'none' };

    if ( detectionResult.interactionType === 'absorbed' ) {
      this.detectionCountProperty.value++;
      this.currentDetectionCount++;
    }

    return detectionResult;
  }

  public step( dt: number ): void {

    // See if it's time to record a sample of the detection count.
    this.timeSinceLastCountSample += dt;
    if ( this.timeSinceLastCountSample >= COUNT_SAMPLE_PERIOD ) {

      // Record this sample.
      this.detectionSampleHistory.push( {
        duration: this.timeSinceLastCountSample,
        count: this.currentDetectionCount
      } );

      // Count the number of samples needed to reach the averaging period and total the counts that they contain.  Since
      // the new samples are added to the end of the array, we need to start at the end and work backwards.
      let accumulatedSampleTime = 0;
      let accumulatedEventCount = 0;
      let sampleCount = 0;
      for ( let i = this.detectionSampleHistory.length - 1; i >= 0; i-- ) {
        accumulatedSampleTime += this.detectionSampleHistory[ i ].duration;
        accumulatedEventCount += this.detectionSampleHistory[ i ].count;
        sampleCount++;
        if ( accumulatedSampleTime >= TOTAL_AVERAGING_PERIOD ) {
          break;
        }
      }

      // Update the detection rate.
      if ( accumulatedSampleTime > 0 ) {
        this.detectionRateProperty.value = Utils.roundSymmetric( accumulatedEventCount / accumulatedSampleTime );
      }
      else {
        this.detectionRateProperty.value = 0;
      }

      // Remove samples that have aged out.
      _.times( this.detectionSampleHistory.length - sampleCount, () => this.detectionSampleHistory.shift() );

      // Reset the counts.
      this.currentDetectionCount = 0;
      this.timeSinceLastCountSample = 0;
    }
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.detectionRateProperty.reset();
    this.detectionCountProperty.reset();
    this.currentDetectionCount = 0;
    this.detectionSampleHistory.length = 0;
    this.timeSinceLastCountSample = 0;
  }

  /**
   * Resets just the detection count.
   */
  public resetDetectionCount(): void {
    this.detectionCountProperty.reset();
  }
}

quantumMeasurement.register( 'PhotonDetector', PhotonDetector );