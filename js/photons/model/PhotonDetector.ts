// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonDetector is the model element for the instrument that, based on how it is configured, either detects the number
 * of photons that reach it or the rate at which photons arrive.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/segments/Segment.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AveragingCounterNumberProperty from '../../common/model/AveragingCounterNumberProperty.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Laser from './Laser.js';
import Photon from './Photon.js';
import { PhotonMotionState } from './PhotonMotionState.js';
import { PhotonInteractionTestResult, PhotonInteractionValues } from './PhotonsModel.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = {
  displayMode?: DisplayMode;
};
type PhotonDetectorOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

// Define a type for the direction in which the detector is looking for photons.
export type DetectionDirection = ( [ 'up', 'down' ] )[number];

// Define a type for the display mode of the detector, which can be either a count of photons detected or a rate of
// detection.
export type DisplayMode = ( [ 'count', 'rate' ] )[number];

class PhotonDetector extends PhetioObject implements TPhotonInteraction {

  // The position of the detector in two-dimensional space. Units are in meters.
  public readonly position: Vector2;

  // The direction in which the detector is looking for photons.
  public readonly detectionDirection: DetectionDirection;

  // detection aperture width, in meters
  public readonly apertureDiameter = Laser.PHOTON_BEAM_WIDTH * 1.75;

  // detection aperture height, in meters
  public readonly apertureHeight = 0.05;

  // A line in model space that represents the position of the detection aperture. If a photon crosses this line, it
  // will be detected but not absorbed.
  public readonly detectionLine: Line;

  // The line in model space that represents the absorption line of the detector. This is the line that the photon
  // must cross to be absorbed, at which point it disappears from the sim.
  public readonly absorptionLine: Line;

  // The number of photons detected by this detector since the last reset.
  public readonly detectionCountProperty: NumberProperty;

  // The rate at which photons are detected, in arrival events per second.
  public readonly detectionRateProperty: AveragingCounterNumberProperty;

  // The display mode defines the information that should be displayed by this detector in the view.
  public readonly displayMode: DisplayMode;

  // The range of values that the detection count can take on.
  public static readonly COUNT_RANGE = new Range( 0, 999 );
  public static readonly RATE_RANGE = new Range( 0, 999 ); // in events per second

  public constructor( position: Vector2, detectionDirection: DetectionDirection, providedOptions: PhotonDetectorOptions ) {

    const options = optionize<PhotonDetectorOptions, SelfOptions, PhetioObjectOptions>()( {
      displayMode: 'count',
      phetioState: false
    }, providedOptions );

    super( options );

    this.position = position;
    this.detectionDirection = detectionDirection;
    this.displayMode = options.displayMode!;
    this.detectionLine = new Line(
      position.plus( new Vector2( -this.apertureDiameter / 2, 0 ) ),
      position.plus( new Vector2( this.apertureDiameter / 2, 0 ) )
    );
    const apertureLineYOffset = this.detectionDirection === 'up' ? this.apertureHeight : -this.apertureHeight;
    this.absorptionLine = new Line(
      position.plus( new Vector2( -this.apertureDiameter / 2, apertureLineYOffset ) ),
      position.plus( new Vector2( this.apertureDiameter / 2, apertureLineYOffset ) )
    );

    this.detectionRateProperty = new AveragingCounterNumberProperty( {
      range: PhotonDetector.RATE_RANGE,
      tandem: options.displayMode === 'rate' ?
              options.tandem.createTandem( '' +
                                           'detectionRateProperty' ) :
              Tandem.OPT_OUT,
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.detectionCountProperty = new NumberProperty( 0, {
      range: PhotonDetector.COUNT_RANGE,
      tandem: options.displayMode === 'count' ?
              options.tandem.createTandem( 'detectionCountProperty' ) :
              Tandem.OPT_OUT,
      phetioReadOnly: true,
      phetioFeatured: true
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

      // Make sure the photon won't cross both the detection and the absorption lines. If this starts happening, the
      // model may need to be extended to handle this case.
      assert && assert(
        !( detectionIntersectionPoint && absorptionIntersectionPoint ),
        'detection and absorption lines both crossed'
      );

      // If the photon will cross the detection line, but not the absorption line, we'll consider it to be detected.
      if ( detectionIntersectionPoint ) {
        mapOfStatesToInteractions.set( photonState, { interactionType: PhotonInteractionValues.DETECTOR_REACHED, detectionInfo: { detector: this } } );
      }
      // If the photon will cross the absorption line, but not the detection line, we'll consider it to be absorbed.
      else if ( absorptionIntersectionPoint ) {
        mapOfStatesToInteractions.set( photonState, { interactionType: PhotonInteractionValues.ABSORBED } );
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

export default PhotonDetector;