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
import Photon, { PHOTON_SPEED } from './Photon.js';
import PhotonDetector from './PhotonDetector.js';
import PhotonEmitter from './PhotonEmitter.js';
import { PhotonInteraction } from './PhotonsModel.js';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.js';

type SelfOptions = EmptySelfOptions;
type PhotonsExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// The width of the photon beam, in meters.  5 cm seemed a reasonable width, but it is essentially arbitrary.
export const PHOTON_BEAM_WIDTH = 0.08;

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

    // Step the photon emitter, which could potentially add new photons.
    this.photonEmitter.step( dt );

    // Make a list of active photons.
    const activePhotons = this.photons.filter( photon => photon.activeProperty.value );

    // Gather the things that can potentially interact with the photons
    const potentialInteractors = [ this.polarizingBeamSplitter, this.mirror ];

    // Update each active photon's position based on its direction and speed and whether it interacts with any other
    // model elements.
    activePhotons.forEach( photon => {

      // Test for interactions with the potential interactors.
      let interaction: PhotonInteraction = { interactionType: 'none' };
      for ( const potentiallyInteractingElement of potentialInteractors ) {
        interaction = potentiallyInteractingElement.testForPhotonInteraction( photon, dt );
        if ( interaction.interactionType !== 'none' ) {
          break;
        }
      }

      if ( interaction.interactionType === 'reflected' ) {

        // This photon was reflected.  First step it to the reflection point.
        const dtToReflection = photon.positionProperty.value.distance( interaction.reflectionPoint! ) / PHOTON_SPEED;
        assert && assert( dtToReflection <= dt );

        // Change the direction of the photon to the reflection direction.
        photon.directionProperty.set( interaction.reflectionDirection! );

        // Step the photon the remaining time.
        photon.step( dt - dtToReflection );
      }
      else {

        // Just step the photon normally, which will move it forward in its current travel direction.
        photon.step( dt );
      }
    } );

    // TODO: temporary - if any photons go too far, deactivate them, see https://github.com/phetsims/quantum-measurement/issues/52
    this.photons.forEach( photon => {
      if ( photon.activeProperty.value &&
           ( photon.positionProperty.value.x > 0.28 || photon.positionProperty.value.y > 0.25 || photon.positionProperty.value.y < -0.25 ) ) {
        photon.activeProperty.set( false );
        photon.positionProperty.set( Vector2.ZERO );
      }
    } );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneModel', PhotonsExperimentSceneModel );