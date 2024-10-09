// Copyright 2024, University of Colorado Boulder

/**
 * PhotonDetector is the model element for the instrument that detects the rate at which photons are arriving in an
 * input window.  It keeps track of the rate at which photons arrive at this window.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;
export type DetectionDirection = ( [ 'up', 'down' ] )[number];

export default class PhotonDetector {

  // The position of the detector in two-dimensional space.  Units are in meters.
  public readonly position: Vector2;

  // The direction in which the detector is looking for photons.
  public readonly detectionDirection: DetectionDirection;

  // The rate at which photons are detected, in arrival events per second.
  public readonly detectionRateProperty: NumberProperty;

  public constructor( position: Vector2, detectionDirection: DetectionDirection, providedOptions: PhotonDetectorOptions ) {

    this.position = position;
    this.detectionDirection = detectionDirection;

    this.detectionRateProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'detectionRateProperty' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.detectionRateProperty.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // TBD - update the detection rate based on the number of photons that have arrived during this step.
  }
}

quantumMeasurement.register( 'PhotonDetector', PhotonDetector );