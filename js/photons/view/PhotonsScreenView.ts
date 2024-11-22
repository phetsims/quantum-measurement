// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import SceneSelectorRadioButtonGroup from '../../common/view/SceneSelectorRadioButtonGroup.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhotonsModel, { ExperimentModeType } from '../model/PhotonsModel.js';
import PhotonsExperimentSceneView from './PhotonsExperimentSceneView.js';

const EXPERIMENT_MODE_TO_STRING_MAP = new Map<ExperimentModeType, LocalizedStringProperty>(
  [
    [ 'singlePhoton', QuantumMeasurementStrings.singlePhotonStringProperty ],
    [ 'manyPhotons', QuantumMeasurementStrings.manyPhotonsStringProperty ]
  ]
);

export default class PhotonsScreenView extends QuantumMeasurementScreenView {

  private readonly model: PhotonsModel;

  public constructor( model: PhotonsModel, tandem: Tandem ) {

    // Create the radio buttons that will sit at the top of the screen and will allow users to pick between the single-
    // photon and many-photons experiment modes.
    const experimentModeRadioButtonGroup = new SceneSelectorRadioButtonGroup<ExperimentModeType>(
      model.experimentModeProperty,
      EXPERIMENT_MODE_TO_STRING_MAP,
      {
        centerX: QuantumMeasurementConstants.LAYOUT_BOUNDS.centerX,
        top: 15, // empirically determined to match design doc
        tandem: tandem.createTandem( 'experimentModeRadioButtonGroup' )
      }
    );

    // Create an "anchor point" for the scenes that is fixed relative to the screen.  This helps with the layout of the
    // scenes - it keeps them in the same place relative to the screen regardless of the screen's size.
    const sceneTranslation = new Vector2( 0, experimentModeRadioButtonGroup.bottom + 10 );

    // Create the views for the two scenes that can be shown on this screen.
    const singlePhotonExperimentSceneView = new PhotonsExperimentSceneView( model.singlePhotonSceneModel, {
      visibleProperty: new DerivedProperty(
        [ model.experimentModeProperty ],
        experimentMode => experimentMode === 'singlePhoton'
      ),
      translation: sceneTranslation,
      tandem: tandem.createTandem( 'singlePhotonExperimentSceneView' )
    } );
    const manyPhotonExperimentSceneView = new PhotonsExperimentSceneView( model.manyPhotonsExperimentSceneModel, {
      visibleProperty: new DerivedProperty(
        [ model.experimentModeProperty ],
        experimentMode => experimentMode === 'manyPhotons'
      ),
      translation: sceneTranslation,
      tandem: tandem.createTandem( 'manyPhotonExperimentSceneView' )
    } );

    super( {
      children: [ experimentModeRadioButtonGroup, singlePhotonExperimentSceneView, manyPhotonExperimentSceneView ],
      initialMockupOpacity: 0,
      tandem: tandem
    } );

    this.model = model;
  }

  public override reset(): void {
    this.model.reset();
    super.reset();
  }
}

quantumMeasurement.register( 'PhotonsScreenView', PhotonsScreenView );