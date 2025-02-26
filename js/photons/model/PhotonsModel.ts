// Copyright 2024-2025, University of Colorado Boulder

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

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ExperimentModeValues from './ExperimentModeValues.js';
import PhotonDetector from './PhotonDetector.js';
import PhotonsExperimentSceneModel from './PhotonsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type PhotonsModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export class PhotonInteractionValues extends EnumerationValue {
  public static readonly REFLECTED = new PhotonInteractionValues();
  public static readonly SPLIT = new PhotonInteractionValues();
  public static readonly DETECTOR_REACHED = new PhotonInteractionValues();
  public static readonly ABSORBED = new PhotonInteractionValues();

  public constructor() {
    super();
  }
}

export type PhotonInteractionTestResult = {
  interactionType: PhotonInteractionValues;
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

export default class PhotonsModel implements TModel {

  // The experiment mode, either single-photon or multiple-photon.
  public readonly experimentModeProperty: Property<ExperimentModeValues>;

  // The two scene models for the Photons screen.
  public readonly singlePhotonSceneModel: PhotonsExperimentSceneModel;
  public readonly manyPhotonsExperimentSceneModel: PhotonsExperimentSceneModel;

  public constructor( providedOptions: PhotonsModelOptions ) {

    this.experimentModeProperty = new EnumerationProperty( ExperimentModeValues.SINGLE_PHOTON, {
      tandem: providedOptions.tandem.createTandem( 'experimentModeProperty' ),
      phetioFeatured: true
    } );
    this.singlePhotonSceneModel = new PhotonsExperimentSceneModel( {
      photonEmissionMode: ExperimentModeValues.SINGLE_PHOTON,
      tandem: providedOptions.tandem.createTandem( 'singlePhotonSceneModel' )
    } );
    this.manyPhotonsExperimentSceneModel = new PhotonsExperimentSceneModel( {
      photonEmissionMode: ExperimentModeValues.MANY_PHOTONS,
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
    if ( this.experimentModeProperty.value === ExperimentModeValues.SINGLE_PHOTON ) {
      this.singlePhotonSceneModel.step( dt );
    }
    else {
      this.manyPhotonsExperimentSceneModel.step( dt );
    }
  }
}

quantumMeasurement.register( 'PhotonsModel', PhotonsModel );