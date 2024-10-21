// Copyright 2024, University of Colorado Boulder

/**
 * PhotonDetector is the model element for the instrument that detects the rate at which photons are arriving in an
 * input window.  It keeps track of the rate at which photons arrive at this window.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { PHOTON_BEAM_WIDTH } from './Laser.js';
import Photon from './Photon.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;
export type DetectionDirection = ( [ 'up', 'down' ] )[number];

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

  // The rate at which photons are detected, in arrival events per second.
  public readonly detectionRateProperty: NumberProperty;

  // The photons detected by this detector since the last reset.
  public readonly detectionCountProperty: NumberProperty;

  public constructor( position: Vector2, detectionDirection: DetectionDirection, providedOptions: PhotonDetectorOptions ) {

    this.position = position;
    this.detectionDirection = detectionDirection;
    this.detectionLine = new Line(
      position.plus( new Vector2( -this.apertureDiameter / 2, 0 ) ),
      position.plus( new Vector2( this.apertureDiameter / 2, 0 ) )
    );

    this.detectionRateProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'detectionRateProperty' )
    } );

    this.detectionCountProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'detectionCountProperty' )
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
      this.detectionCountProperty.value = this.detectionCountProperty.value + 1;
    }

    return detectionResult;
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.detectionRateProperty.reset();
    this.detectionCountProperty.reset();
  }
}

quantumMeasurement.register( 'PhotonDetector', PhotonDetector );