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
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsExperimentSceneModel from './PhotonsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type PhotonsModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

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
      phetioValueType: StringUnionIO( ExperimentModeTypeValues )
    } );
    this.singlePhotonSceneModel = new PhotonsExperimentSceneModel( {
      tandem: providedOptions.tandem.createTandem( 'singlePhotonSceneModel' )
    } );
    this.manyPhotonsExperimentSceneModel = new PhotonsExperimentSceneModel( {
      tandem: providedOptions.tandem.createTandem( 'manyPhotonsExperimentSceneModel' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.experimentModeProperty.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }
}

quantumMeasurement.register( 'PhotonsModel', PhotonsModel );