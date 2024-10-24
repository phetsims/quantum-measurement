// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneModel is the class that defines the model for each of the two scenes in the "Photons" screen, one for the
 * single-photon experiment and one for the multi-photon experiment.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Laser, { PhotonEmissionMode } from './Laser.js';
import Mirror from './Mirror.js';
import Photon, { PHOTON_SPEED } from './Photon.js';
import PhotonDetector from './PhotonDetector.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = {
  photonEmissionMode: PhotonEmissionMode;
};
type PhotonsExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// The number of photons created at construction time and pooled for usage in the experiment.  This value was
// empirically determined to be sufficient to handle the maximum number of photons that could be active at any given
// time, but may have to be adjusted if other aspects of the model are changed.
const MAX_PHOTONS = 800;

export default class PhotonsExperimentSceneModel {

  // The polarizing beam splitter that the photons will encounter.
  public readonly polarizingBeamSplitter: PolarizingBeamSplitter;

  // The mirror that reflects the photons that pass through the beam splitter downward to the detector.
  public readonly mirror: Mirror;

  // The laser, which emits the photons.
  public readonly laser: Laser;

  // photon detectors
  public readonly verticalPolarizationDetector: PhotonDetector;
  public readonly horizontalPolarizationDetector: PhotonDetector;

  // The photons that will be emitted and reflected in the experiment.
  public readonly photons: Photon[] = [];

  public constructor( providedOptions: PhotonsExperimentSceneModelOptions ) {

    this.polarizingBeamSplitter = new PolarizingBeamSplitter( Vector2.ZERO, {
      tandem: providedOptions.tandem.createTandem( 'polarizingBeamSplitter' )
    } );

    // Create the laser that will emit the photons that will be sent toward the polarizing beam splitter.
    this.laser = new Laser( new Vector2( -0.15, 0 ), this.photons, {
      emissionMode: providedOptions.photonEmissionMode,
      tandem: providedOptions.tandem.createTandem( 'laser' )
    } );

    // Create the photon detectors that will measure the rate at which photons are arriving after being either reflected
    // or transmitted by the polarizing beam splitter.
    this.verticalPolarizationDetector = new PhotonDetector( new Vector2( 0, 0.25 ), 'up', {
      displayMode: this.laser.emissionMode === 'singlePhoton' ? 'count' : 'rate',
      tandem: providedOptions.tandem.createTandem( 'verticalPolarizationDetector' )
    } );
    this.horizontalPolarizationDetector = new PhotonDetector( new Vector2( 0.25, -0.25 ), 'down', {
      displayMode: this.laser.emissionMode === 'singlePhoton' ? 'count' : 'rate',
      tandem: providedOptions.tandem.createTandem( 'horizontalPolarizationDetector' )
    } );

    this.mirror = new Mirror( new Vector2( 0.25, 0 ), {
      tandem: providedOptions.tandem.createTandem( 'mirror' )
    } );

    // Create all photons that will be used in the experiment.
    _.times( MAX_PHOTONS, index => {
      const photon = new Photon( providedOptions.tandem.createTandem( `photon${index}` ) );
      this.photons.push( photon );
    } );
  }

  /**
   * Resets the scene model.
   */
  public reset(): void {
    this.laser.reset();
    this.photons.forEach( photon => photon.reset() );
    this.verticalPolarizationDetector.reset();
    this.horizontalPolarizationDetector.reset();
  }

  public step( dt: number ): void {

    // Step the photon emitter, which could potentially add new photons.
    this.laser.step( dt );

    // Make a list of active photons.
    const activePhotons = this.photons.filter( photon => photon.activeProperty.value );

    // Gather the things that can potentially interact with the photons
    const potentialInteractors : TPhotonInteraction[] = [
      this.polarizingBeamSplitter,
      this.mirror,
      this.horizontalPolarizationDetector,
      this.verticalPolarizationDetector
    ];

    // Update each active photon's position based on its direction and speed and whether it interacts with any other
    // model elements.
    activePhotons.forEach( photon => {

      // Test for interactions with the potential interactors.
      let interaction: PhotonInteractionTestResult = { interactionType: 'none' };
      for ( const potentiallyInteractingElement of potentialInteractors ) {
        interaction = potentiallyInteractingElement.testForPhotonInteraction( photon, dt );
        if ( interaction.interactionType !== 'none' ) {
          break;
        }
      }

      if ( interaction.interactionType === 'reflected' ) {

        assert && assert( interaction.reflectionPoint, 'reflection point should be defined' );
        assert && assert( interaction.reflectionDirection, 'reflection direction should be defined' );

        // This photon was reflected.  First step it to the reflection point.
        const dtToReflection = photon.positionProperty.value.distance( interaction.reflectionPoint! ) / PHOTON_SPEED;
        assert && assert( dtToReflection <= dt );
        photon.step( dtToReflection );

        // Change the direction of the photon to the reflection direction.
        photon.directionProperty.set( interaction.reflectionDirection! );

        // Step the photon the remaining time.
        photon.step( dt - dtToReflection );
      }
      else if ( interaction.interactionType === 'absorbed' ) {

        // The photon was absorbed, so deactivate it.
        photon.activeProperty.set( false );
        photon.positionProperty.set( Vector2.ZERO );
      }
      else {

        // Just step the photon normally, which will move it forward in its current travel direction.
        photon.step( dt );
      }
    } );

    // Step the photon detectors.
    this.horizontalPolarizationDetector.step( dt );
    this.verticalPolarizationDetector.step( dt );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneModel', PhotonsExperimentSceneModel );