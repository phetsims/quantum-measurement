// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneModel is the class that defines the model for each of the two scenes in the "Photons" screen, one for the
 * single-photon experiment and one for the multi-photon experiment.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Laser, { PhotonEmissionMode } from './Laser.js';
import Mirror from './Mirror.js';
import { PHOTON_SPEED, possiblePolarizationResult } from './Photon.js';
import { PhotonCollection } from './PhotonCollection.js';
import PhotonDetector from './PhotonDetector.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = {
  photonEmissionMode: PhotonEmissionMode;
};
type PhotonsExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

const PATH_LENGTH_UNIT = 0.2;

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

  // The normalized expectation value for the experiment.  This is essentially an average of all the possible outcomes
  // of the experiment weighted by their likelihoods, normalized to a range of -1 to 1.  The value can also be null,
  // which means the expectation value is not defined, which occurs when the photons are unpolarized.
  public readonly normalizedExpectationValueProperty: TReadOnlyProperty<number | null>;

  // The normalized outcome value for the experiment.  This is the difference between the two measurements divided by
  // the sum of the two measurements.  Its values range from -1 to 1.
  public readonly normalizedOutcomeValueProperty: TReadOnlyProperty<number>;

  // The photons that will be emitted and reflected in the experiment.
  public readonly photonCollection: PhotonCollection;

  // Whether the simulation is currently playing, which in this case means whether the photons are moving.
  public readonly isPlayingProperty: BooleanProperty;

  // The Classical understanding of this experiment implied that photons would choose a path at
  // the beam splitter. This is controlled by the Classical/Quantum toggle at the view.
  public readonly collapsePhotonsAtBeamSplitterProperty: BooleanProperty;

  public constructor( providedOptions: PhotonsExperimentSceneModelOptions ) {

    // Create all photons that will be used in the experiment.  It works better for phet-io if these are created at
    // construction time and activated and deactivated as needed, rather than creating and destroying them.
    this.photonCollection = new PhotonCollection( providedOptions.tandem.createTandem( 'photonCollection' ) );

    this.collapsePhotonsAtBeamSplitterProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'collapsePhotonsAtBeamSplitterProperty' )
    } );

    this.polarizingBeamSplitter = new PolarizingBeamSplitter( Vector2.ZERO, {
      tandem: providedOptions.tandem.createTandem( 'polarizingBeamSplitter' ),
      collapsePhotonsProperty: this.collapsePhotonsAtBeamSplitterProperty
    } );

    // Create the laser that will emit the photons that will be sent toward the polarizing beam splitter.
    this.laser = new Laser( new Vector2( -0.15, 0 ), this.photonCollection, {
      emissionMode: providedOptions.photonEmissionMode,
      tandem: providedOptions.tandem.createTandem( 'laser' )
    } );

    // Create the photon detectors that will measure the rate at which photons are arriving after being either reflected
    // or transmitted by the polarizing beam splitter.
    this.verticalPolarizationDetector = new PhotonDetector( new Vector2( 0, PATH_LENGTH_UNIT ), 'up', {
      displayMode: this.laser.emissionMode === 'singlePhoton' ? 'count' : 'rate',
      tandem: providedOptions.tandem.createTandem( 'verticalPolarizationDetector' )
    } );

    const mirrorDistanceProportion = 0.5;
    const horizontalDetectorXPosition = mirrorDistanceProportion * PATH_LENGTH_UNIT;
    const horizontalDetectorYPosition = ( 1 - mirrorDistanceProportion ) * PATH_LENGTH_UNIT;
    this.horizontalPolarizationDetector = new PhotonDetector( new Vector2( horizontalDetectorXPosition, -horizontalDetectorYPosition ), 'down', {
      displayMode: this.laser.emissionMode === 'singlePhoton' ? 'count' : 'rate',
      tandem: providedOptions.tandem.createTandem( 'horizontalPolarizationDetector' )
    } );
    this.mirror = new Mirror( new Vector2( horizontalDetectorXPosition, 0 ), {
      tandem: providedOptions.tandem.createTandem( 'mirror' )
    } );

    // Create a derived Property for the normalized expectation value.
    this.normalizedExpectationValueProperty = new DerivedProperty(
      [ this.laser.presetPolarizationDirectionProperty, this.laser.customPolarizationAngleProperty ],
      ( presetPolarizationDirection, customPolarizationAngle ) => {
        let normalizedExpectationValue: number | null;
        if ( presetPolarizationDirection === 'vertical' ) {
          normalizedExpectationValue = 1;
        }
        else if ( presetPolarizationDirection === 'horizontal' ) {
          normalizedExpectationValue = -1;
        }
        else if ( presetPolarizationDirection === 'fortyFiveDegrees' ) {
          normalizedExpectationValue = 0;
        }
        else if ( presetPolarizationDirection === 'unpolarized' ) {
          normalizedExpectationValue = null;
        }
        else {
          assert && assert( presetPolarizationDirection === 'custom', 'unrecognized polarization direction' );
          const angleInRadians = customPolarizationAngle * Math.PI / 180;
          normalizedExpectationValue = 1 - 2 * Math.pow( Math.cos( angleInRadians ), 2 );
        }
        return normalizedExpectationValue;
      },
      {
        tandem: providedOptions.tandem.createTandem( 'normalizedExpectationValueProperty' ),
        phetioReadOnly: true,
        phetioValueType: NullableIO( NumberIO )
      }
    );

    // Create a derived Property for the normalized outcome value.  This is a little different depending on the
    // experiment mode, but the general idea is that it's the difference between the two measurements divided by the sum
    // of the two measurements.
    const verticalMeasurementProperty = this.laser.emissionMode === 'singlePhoton' ?
                                        this.verticalPolarizationDetector.detectionCountProperty :
                                        this.verticalPolarizationDetector.detectionRateProperty;
    const horizontalMeasurementProperty = this.laser.emissionMode === 'singlePhoton' ?
                                          this.horizontalPolarizationDetector.detectionCountProperty :
                                          this.horizontalPolarizationDetector.detectionRateProperty;
    this.normalizedOutcomeValueProperty = new DerivedProperty(
      [ verticalMeasurementProperty, horizontalMeasurementProperty ],
      ( verticalValue, horizontalValue ) => verticalValue + horizontalValue === 0 ?
                                            0 :
                                            ( horizontalValue - verticalValue ) / ( horizontalValue + verticalValue ),
      {
        tandem: providedOptions.tandem.createTandem( 'normalizedOutcomeValueProperty' ),
        phetioReadOnly: true,
        phetioValueType: NumberIO
      }
    );

    // In the single photon mode, we want to reset the detection counts and remove all photons when the polarization
    // direction changes.
    if ( this.laser.emissionMode === 'singlePhoton' ) {
      Multilink.multilink(
        [ this.laser.presetPolarizationDirectionProperty, this.laser.customPolarizationAngleProperty ],
        () => {
          this.photonCollection.clear();
          this.verticalPolarizationDetector.resetDetectionCount();
          this.horizontalPolarizationDetector.resetDetectionCount();
        }
      );
    }

    // Create the Property that will be used to control whether the simulation is playing.
    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'isPlayingProperty' )
    } );
  }

  /**
   * Resets the scene model.
   */
  public reset(): void {
    this.laser.reset();
    this.verticalPolarizationDetector.reset();
    this.horizontalPolarizationDetector.reset();
    this.isPlayingProperty.reset();
  }

  public step( dt: number ): void {

    if ( this.isPlayingProperty.value ) {

      // Step the laser, which could potentially emit new photons.
      this.laser.step( dt );

      // Gather the things that can potentially interact with the photons
      const potentialInteractors: TPhotonInteraction[] = [
        this.polarizingBeamSplitter,
        this.mirror,
        this.horizontalPolarizationDetector,
        this.verticalPolarizationDetector
      ];

      // Update each active photon's quantum states based on their interaction with any other model elements.
      this.photonCollection.photons.forEach( photon => {
        for ( const key in photon.possibleStates ) {
          const photonState = photon.possibleStates[ key as possiblePolarizationResult ];
            // Only update active states
            if ( photonState.probability > 0 ) {
              // Test for interactions with the potential interactors.
              let interaction: PhotonInteractionTestResult = { interactionType: 'none' };
              for ( const potentiallyInteractingElement of potentialInteractors ) {
                interaction = potentiallyInteractingElement.testForPhotonInteraction( photonState, photon, dt );
                if ( interaction.interactionType !== 'none' ) {
                  break;
                }
              }

              if ( interaction.interactionType === 'reflected' ) {

                assert && assert( interaction.reflectionPoint, 'reflection point should be defined' );
                assert && assert( interaction.reflectionDirection, 'reflection direction should be defined' );

                // This photon was reflected.  First step it to the reflection point.
                const dtToReflection = photonState.position.distance( interaction.reflectionPoint! ) / PHOTON_SPEED;
                assert && assert( dtToReflection <= dt );
                photonState.step( dtToReflection );

                // Change the direction of the photon to the reflection direction.
                // photon.directionProperty.set( interaction.reflectionDirection! );
                photonState.direction = interaction.reflectionDirection!;

                // Step the photon the remaining time.
                photonState.step( dt - dtToReflection );
              }
              else if ( interaction.interactionType === 'absorbed' ) {
                // Once a photon is absorbed, remove it from the photon collection
                this.photonCollection.removePhoton( photon );
                break;
              }
              else {
                // Just step the photon normally, which will move it forward in its current travel direction.
                photonState.step( dt );
              }
            }
            else {
              photonState.step( dt );
            }
          }
      } );

      // Step the photon detectors.
      this.horizontalPolarizationDetector.step( dt );
      this.verticalPolarizationDetector.step( dt );
    }
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneModel', PhotonsExperimentSceneModel );