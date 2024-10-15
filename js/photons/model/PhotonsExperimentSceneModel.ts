// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneModel is the class that defines the model for each of the two scenes in the "Photons" screen, one for the
 * single-photon experiment and one for the multi-photon experiment.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Mirror from './Mirror.js';
import Photon from './Photon.js';
import PhotonDetector from './PhotonDetector.js';
import PhotonEmitter from './PhotonEmitter.js';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.js';

type SelfOptions = EmptySelfOptions;
type PhotonsExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// The width of the photon beam, in meters.  5 cm seemed a reasonable width, but it is essentially arbitrary.
export const PHOTON_BEAM_WIDTH = 0.05;

export default class PhotonsExperimentSceneModel {

  // The polarizing beam splitter that the photons will encounter.
  public readonly polarizingBeamSplitter: PolarizingBeamSplitter;

  // The angle of polarization for the polarizing beam splitter, in degrees.  Zero is horizontal and 90 is vertical.
  public readonly photonPolarizationAngleProperty: NumberProperty;

  public readonly mirror: Mirror;

  public readonly photonEmitter: PhotonEmitter;

  // photon detectors
  public readonly verticalPolarizationDetector: PhotonDetector;
  public readonly horizontalPolarizationDetector: PhotonDetector;

  public readonly photons: Photon[] = []; // array of photons

  public constructor( providedOptions: PhotonsExperimentSceneModelOptions ) {

    this.polarizingBeamSplitter = new PolarizingBeamSplitter( new Vector2( 0, 0 ), {
      tandem: providedOptions.tandem.createTandem( 'polarizingBeamSplitter' )
    } );

    this.photonPolarizationAngleProperty = new NumberProperty( 45, {
      range: new Range( 0, 90 ),
      tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleProperty' )
    } );

    // Create the photon emitter that will produce the photons that will be sent toward the polarizing beam splitter.
    this.photonEmitter = new PhotonEmitter( new Vector2( -0.15, 0 ), this.photons, {
      tandem: providedOptions.tandem.createTandem( 'photonEmitter' )
    } );

    // Create the photon detectors that will measure the rate at which photons are arriving after being either reflected
    // or transmitted by the polarizing beam splitter.
    this.verticalPolarizationDetector = new PhotonDetector( new Vector2( 0, 0.25 ), 'up', {
      tandem: providedOptions.tandem.createTandem( 'verticalPolarizationDetector' )
    } );
    this.horizontalPolarizationDetector = new PhotonDetector( new Vector2( 0.25, -0.25 ), 'down', {
      tandem: providedOptions.tandem.createTandem( 'horizontalPolarizationDetector' )
    } );

    this.mirror = new Mirror( new Vector2( 0.25, 0 ), {
      tandem: providedOptions.tandem.createTandem( 'mirror' )
    } );

    // Create all photons that will be used in the experiment.
    _.times( 1000, index => {
      const photon = new Photon( providedOptions.tandem.createTandem( `photon${index}` ) );
      this.photons.push( photon );
    } );
  }

  /**
   * Resets the scene model.
   */
  public reset(): void {
    this.photonPolarizationAngleProperty.reset();
    this.photonEmitter.reset();
    this.photons.forEach( photon => photon.reset() );
  }

  public step( dt: number ): void {
    this.photons.forEach( photon => photon.step( dt ) );
    this.photonEmitter.step( dt );

    // TODO: temporary - if any photons go too far, deactivate them, see https://github.com/phetsims/quantum-measurement/issues/52
    this.photons.forEach( photon => {
      if ( photon.activeProperty.value && photon.positionProperty.value.x > 0.28 ) {
        photon.activeProperty.set( false );
        photon.positionProperty.set( Vector2.ZERO );
      }
    } );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneModel', PhotonsExperimentSceneModel );