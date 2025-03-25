// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonsExperimentSceneModel is the class that defines the model for each of the two scenes in the "Photons" screen,
 * one for the single-photon experiment and one for the multi-photon experiment.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ExperimentModeValues from './ExperimentModeValues.js';
import Laser from './Laser.js';
import Mirror from './Mirror.js';
import Photon from './Photon.js';
import { PhotonCollection } from './PhotonCollection.js';
import PhotonDetector from './PhotonDetector.js';
import { PhotonMotionState } from './PhotonMotionState.js';
import { PhotonInteractionTestResult, PhotonInteractionValues } from './PhotonsModel.js';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.js';
import { TPhotonInteraction } from './TPhotonInteraction.js';

type SelfOptions = {
  photonEmissionMode: ExperimentModeValues;
};
type PhotonsExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// distances used to position the elements in the scene, in meters
const LASER_TO_BEAM_SPLITTER_DISTANCE = 0.15;
const BEAM_SPLITTER_TO_MIRROR_DISTANCE = 0.11;
const TOTAL_PHOTON_PATH_LENGTH = LASER_TO_BEAM_SPLITTER_DISTANCE + BEAM_SPLITTER_TO_MIRROR_DISTANCE + 0.09;

class PhotonsExperimentSceneModel {

  // The polarizing beam splitter that the photons will encounter.
  public readonly polarizingBeamSplitter: PolarizingBeamSplitter;

  // The mirror that reflects the photons that pass through the beam splitter downward to the detector.
  public readonly mirror: Mirror;

  // The laser, which emits the photons.
  public readonly laser: Laser;

  // photon detectors
  public readonly verticalPolarizationDetector: PhotonDetector;
  public readonly horizontalPolarizationDetector: PhotonDetector;

  // The normalized expectation value for the experiment. This is essentially an average of all the possible outcomes
  // of the experiment weighted by their likelihoods, normalized to a range of -1 to 1. The value can also be null,
  // which means the expectation value is not defined, which occurs when the photons are unpolarized.
  public readonly normalizedExpectationValueProperty: TReadOnlyProperty<number | null>;

  // The normalized outcome value for the experiment. This is the difference between the two measurements divided by
  // the sum of the two measurements. Its values range from -1 to 1.
  public readonly normalizedOutcomeValueProperty: TReadOnlyProperty<number>;

  // The photons that will be emitted and reflected in the experiment.
  public readonly photonCollection: PhotonCollection;

  // Whether the simulation is currently playing, which in this case means whether the photons are moving.
  public readonly isPlayingProperty: BooleanProperty;

  // Whether the photons behave as classical or quantum particles. When they are classical, they will choose a path
  // at the beam splitter. When they are quantum, they will be in a superposition of states after the beam splitter and
  // will collapse to a specific location at the detectors.
  public readonly photonBehaviorModeProperty: Property<SystemType>;

  // Whether the probability accordion box is expanded
  public readonly isProbabilityAccordionExpandedProperty: BooleanProperty;

  // the clock speed of the sim
  public readonly timeSpeedProperty: EnumerationProperty<TimeSpeed>;

  public constructor( providedOptions: PhotonsExperimentSceneModelOptions ) {

    // Create a parent tandem for the experiment that is conducted on the photons so that the model elements that
    // comprise the experiment can be grouped together within it.
    const experimentTandem = providedOptions.tandem.createTandem( 'experiment' );

    // Create all photons that will be used in the experiment. It works better for phet-io if these are created at
    // construction time and activated and deactivated as needed, rather than creating and destroying them.
    this.photonCollection = new PhotonCollection( experimentTandem.createTandem( 'photonCollection' ) );

    this.photonBehaviorModeProperty = new EnumerationProperty( SystemType.CLASSICAL, {
      tandem: experimentTandem.createTandem( 'photonBehaviorModeProperty' ),
      phetioFeatured: true
    } );

    this.photonBehaviorModeProperty.link( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.photonCollection.clear();
      }
    } );

    // The polarizing beam splitter that the photons will encounter.  This is in the middle of the model, everything
    // else is positioned around it.
    this.polarizingBeamSplitter = new PolarizingBeamSplitter( Vector2.ZERO, {
      photonBehaviorModeProperty: this.photonBehaviorModeProperty,
      tandem: experimentTandem.createTandem( 'polarizingBeamSplitter' )
    } );

    // Create the laser that will emit the photons that will be sent toward the polarizing beam splitter.
    this.laser = new Laser( new Vector2( -LASER_TO_BEAM_SPLITTER_DISTANCE, 0 ), this.photonCollection, {
      emissionMode: providedOptions.photonEmissionMode,
      tandem: experimentTandem.createTandem( 'laser' )
    } );

    // The mirror that reflects the photons that pass through the beam splitter downward to the detector.
    this.mirror = new Mirror( new Vector2( BEAM_SPLITTER_TO_MIRROR_DISTANCE, 0 ) );

    // Create the photon detectors that will measure the rate at which photons are arriving after being either reflected
    // or transmitted by the polarizing beam splitter.
    this.verticalPolarizationDetector = new PhotonDetector(
      new Vector2( 0, TOTAL_PHOTON_PATH_LENGTH - LASER_TO_BEAM_SPLITTER_DISTANCE ),
      'up',
      {
        displayMode: this.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ? 'count' : 'rate',
        tandem: experimentTandem.createTandem( 'verticalPolarizationDetector' )
      }
    );
    this.horizontalPolarizationDetector = new PhotonDetector(
      new Vector2(
        BEAM_SPLITTER_TO_MIRROR_DISTANCE,
        -( TOTAL_PHOTON_PATH_LENGTH - LASER_TO_BEAM_SPLITTER_DISTANCE - BEAM_SPLITTER_TO_MIRROR_DISTANCE )
      ),
      'down',
      {
        displayMode: this.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ? 'count' : 'rate',
        tandem: experimentTandem.createTandem( 'horizontalPolarizationDetector' )
      }
    );

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
        phetioValueType: NullableIO( NumberIO )
      }
    );

    // Create a derived Property for the normalized outcome value.  This is a little different depending on the
    // experiment mode, but the general idea is that it's the difference between the two measurements divided by the sum
    // of the two measurements.
    const verticalMeasurementProperty = this.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ?
                                        this.verticalPolarizationDetector.detectionCountProperty :
                                        this.verticalPolarizationDetector.detectionRateProperty;
    const horizontalMeasurementProperty = this.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ?
                                          this.horizontalPolarizationDetector.detectionCountProperty :
                                          this.horizontalPolarizationDetector.detectionRateProperty;
    this.normalizedOutcomeValueProperty = new DerivedProperty(
      [ verticalMeasurementProperty, horizontalMeasurementProperty ],
      ( verticalValue, horizontalValue ) => verticalValue + horizontalValue === 0 ?
                                            0 :
                                            ( verticalValue - horizontalValue ) / ( verticalValue + horizontalValue ),
      {
        tandem: providedOptions.tandem.createTandem( 'normalizedOutcomeValueProperty' ),
        phetioValueType: NumberIO
      }
    );

    // In the single photon mode, we want to reset the detection counts and remove all photons when the polarization
    // direction changes.
    if ( this.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ) {
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
      tandem: providedOptions.tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    } );

    this.isProbabilityAccordionExpandedProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'isProbabilityAccordionExpandedProperty' ),
      phetioFeatured: true
    } );

    this.timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL, {
      validValues: [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
      tandem: providedOptions.tandem.createTandem( 'timeSpeedProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The speed that at which the simulation is running.'
    } );
  }

  /**
   * Resets the scene model.
   */
  public reset(): void {
    this.laser.reset();
    this.photonCollection.clear();
    this.verticalPolarizationDetector.reset();
    this.horizontalPolarizationDetector.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
    this.photonBehaviorModeProperty.reset();
    this.isProbabilityAccordionExpandedProperty.reset();
  }

  public stepForwardInTime( dt: number ): void {

    // Step the laser, which could potentially emit new photons.
    this.laser.step( dt );

    // Gather the things that can potentially interact with the photons
    const potentialInteractors: TPhotonInteraction[] = [
      this.polarizingBeamSplitter,
      this.mirror,
      this.horizontalPolarizationDetector,
      this.verticalPolarizationDetector
    ];

    const photonsToRemove: Photon[] = [];

    // Update each photon's quantum states.  This tests for interactions with other elements in the model, like the
    // beam splitter, mirror, and photon detectors.
    this.photonCollection.photons.forEach( photon => {

      // Check for interactions between the current photon and the various elements in the scene.
      const photonStateToInteractionMap: Map<PhotonMotionState, PhotonInteractionTestResult> =
        new Map<PhotonMotionState, PhotonInteractionTestResult>();
      for ( const potentiallyInteractingElement of potentialInteractors ) {
        const interactions = potentiallyInteractingElement.testForPhotonInteraction( photon, dt );
        interactions.forEach( ( interaction, photonState ) => {

          // The model is designed such that there should really be at most one interaction per photon state.  Make sure
          // that's the case.
          assert && assert(
            !photonStateToInteractionMap.has( photonState ),
            'there should only be one interaction per photon state at one time'
          );

          if ( !photonStateToInteractionMap.has( photonState ) ) {
            photonStateToInteractionMap.set( photonState, interaction );
          }
        } );
      }

      // Handle interactions - or lack thereof - between the photon's possible states and the various elements in the
      // scene.
      photon.possibleMotionStates.forEach( photonMotionState => {

        if ( photonStateToInteractionMap.has( photonMotionState ) ) {
          if ( !photonsToRemove.includes( photon ) ) {
            const interaction = photonStateToInteractionMap.get( photonMotionState )!;

            if ( interaction.interactionType === PhotonInteractionValues.REFLECTED ) {

              assert && assert( interaction.reflectionInfo, 'reflection info missing' );

              // This photon state was reflected.  First step it to the reflection point.
              const dtToReflectionPoint =
                photonMotionState.position.distance( interaction.reflectionInfo!.reflectionPoint ) / Photon.PHOTON_SPEED;
              assert && assert( dtToReflectionPoint <= dt );
              photonMotionState.step( dtToReflectionPoint );

              // Change the direction of the photon to the reflection direction.
              photonMotionState.direction = interaction.reflectionInfo!.reflectionDirection;

              // Step the photon the remaining time.
              photonMotionState.step( dt - dtToReflectionPoint );
            }
            else if ( interaction.interactionType === PhotonInteractionValues.SPLIT ) {

              assert && assert( interaction.splitInfo, 'split info missing' );
              assert && assert( photon.possibleMotionStates.length === 1, 'there should be 1 motion state' );

              // The resulting interaction was a split of the photon state.  First, step the state to the split point.
              const dtToSplitPoint = photonMotionState.position.distance( interaction.splitInfo!.splitPoint ) / Photon.PHOTON_SPEED;
              assert && assert( dtToSplitPoint <= dt );
              photonMotionState.step( dtToSplitPoint );

              // Update the existing motion state based on the first split info element.
              photonMotionState.direction = interaction.splitInfo!.splitStates[ 0 ].direction;
              photonMotionState.probability = interaction.splitInfo!.splitStates[ 0 ].probability;

              // Add a new state to the photon for the second split info element.
              photon.addMotionState(
                photonMotionState.position,
                interaction.splitInfo!.splitStates[ 1 ].direction,
                interaction.splitInfo!.splitStates[ 1 ].probability
              );

              // Step the motion states the remaining time.
              photon.possibleMotionStates.forEach( state => state.step( dt - dtToSplitPoint ) );
            }
            else if ( interaction.interactionType === PhotonInteractionValues.DETECTOR_REACHED ) {

              const detector = interaction.detectionInfo!.detector;

              // Evaluate the detection result based on the probability of the photon being at this position.
              if ( dotRandom.nextDouble() < photonMotionState.probability ) {

                // The photon is being detected by this detector.
                photon.setMotionStateProbability( photonMotionState, 1 );
                detector.detectionCountProperty.value = Math.min( detector.detectionCountProperty.value + 1, PhotonDetector.COUNT_RANGE.max );
                detector.detectionRateProperty.countEvent();
              }
              else {

                // The photon reached the detector but was not detected.  This means that its state should collapse such
                // that there is a 100% probability of it being detected by the other detector.
                photon.setMotionStateProbability( photonMotionState, 0 );
              }

              photonMotionState.step( dt );
            }
            else if ( interaction.interactionType === PhotonInteractionValues.ABSORBED ) {

              // This interaction indicates that the photon was absorbed, so it should be removed from the photon
              // collection.
              photonsToRemove.push( photon );
            }
          }
        }
        else {

          // There was no interaction for this photon state, so just step it forward in time.
          photonMotionState.step( dt );
        }
      } );
    } );

    // Remove any photons that were absorbed during the interaction testing.
    photonsToRemove.forEach( photon => {
      this.photonCollection.removePhoton( photon );
    } );

    // Step the photon detectors.  This is just to update the counts and rates, but doesn't detect the photons.
    this.horizontalPolarizationDetector.step( dt );
    this.verticalPolarizationDetector.step( dt );
  }

  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      const timeScale = this.timeSpeedProperty.value === TimeSpeed.SLOW ? 0.4 : 1;
      this.stepForwardInTime( dt * timeScale );
    }
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneModel', PhotonsExperimentSceneModel );

export default PhotonsExperimentSceneModel;