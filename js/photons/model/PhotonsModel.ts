// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsModel is the primary model class for the Photons screen.  It manages the general model state and behavior for
 * the photons that travel from the source to the detectors.
 *
 * Part of what this model does is move photons in two-dimensional space.  This space is set up to center on the
 * polarizing beam splitter, which is at the center of the screen.  The x-axis is horizontal and the y-axis is vertical.
 * Units are in meters.  The photons are emitted from a source, travel to the polarizing beam splitter, and then are
 * either reflected or transmitted.  The photons are then detected by two photon detectors.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonDetector from './PhotonDetector.js';
import PhotonsExperimentSceneModel from './PhotonsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type PhotonsModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export const PhotonInteractionTypeValues = [

  // The photon was reflected by something, such as a mirror.
  'reflected',

  // The photon was split into two possible state.
  'split',

  // The photon reached a detector.  If the photon is in a superposed state, it may or may not be detected, and the
  // client code will need to decide what to do.
  'detectorReached',

  // The photon was absorbed by something, such as a detector.
  'absorbed'
] as const;
export type PhotonInteractionTypes = ( typeof PhotonInteractionTypeValues )[number];
export type PhotonInteractionTestResult = {
  interactionType: PhotonInteractionTypes;
  detectionInfo?: {
    detector: PhotonDetector;
  };
  reflectionInfo?: {
    reflectionPoint: Vector2;
    reflectionDirection: Vector2;
  };
  splitInfo?: {
    splitPoint: Vector2;
    splitStates: {
      direction: Vector2;
      probability: number;
    }[];
  };
};

export const ExperimentModeTypeValues = [ 'singlePhoton', 'manyPhotons' ] as const;
export type ExperimentModeType = ( typeof ExperimentModeTypeValues )[number];

export default class PhotonsModel implements TModel {

  // The experiment mode, either single-photon or multiple-photon.
  public readonly experimentModeProperty: Property<ExperimentModeType>;

  // The two scene models for the Photons screen.
  public readonly singlePhotonSceneModel: PhotonsExperimentSceneModel;
  public readonly manyPhotonsExperimentSceneModel: PhotonsExperimentSceneModel;

  public constructor( providedOptions: PhotonsModelOptions ) {

    this.experimentModeProperty = new Property<ExperimentModeType>( 'singlePhoton', {
      tandem: providedOptions.tandem.createTandem( 'experimentModeProperty' ),
      phetioValueType: StringUnionIO( ExperimentModeTypeValues ),
      validValues: ExperimentModeTypeValues,
      phetioFeatured: true
    } );
    this.singlePhotonSceneModel = new PhotonsExperimentSceneModel( {
      photonEmissionMode: 'singlePhoton',
      tandem: providedOptions.tandem.createTandem( 'singlePhotonSceneModel' )
    } );
    this.manyPhotonsExperimentSceneModel = new PhotonsExperimentSceneModel( {
      photonEmissionMode: 'manyPhotons',
      tandem: providedOptions.tandem.createTandem( 'manyPhotonsExperimentSceneModel' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.experimentModeProperty.reset();
    this.singlePhotonSceneModel.reset();
    this.manyPhotonsExperimentSceneModel.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.experimentModeProperty.value === 'singlePhoton' ) {
      this.singlePhotonSceneModel.step( dt );
    }
    else {
      this.manyPhotonsExperimentSceneModel.step( dt );
    }
  }
}

quantumMeasurement.register( 'PhotonsModel', PhotonsModel );