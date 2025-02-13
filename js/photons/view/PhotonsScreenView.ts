// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view class for the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
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

class PhotonsScreenView extends QuantumMeasurementScreenView {

  private readonly model: PhotonsModel;
  private readonly singlePhotonExperimentSceneView: PhotonsExperimentSceneView;
  private readonly manyPhotonsExperimentSceneView: PhotonsExperimentSceneView;

  public constructor( model: PhotonsModel, tandem: Tandem ) {

    // Create the radio buttons that will sit at the top of the screen and will allow users to pick between the single-
    // photon and many-photons experiment modes.
    const experimentModeRadioButtonGroup = new SceneSelectorRadioButtonGroup<ExperimentModeType>(
      model.experimentModeProperty,
      EXPERIMENT_MODE_TO_STRING_MAP,
      {
        centerX: QuantumMeasurementConstants.LAYOUT_BOUNDS.centerX,
        top: QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
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
    const manyPhotonsExperimentSceneView = new PhotonsExperimentSceneView( model.manyPhotonsExperimentSceneModel, {
      visibleProperty: new DerivedProperty(
        [ model.experimentModeProperty ],
        experimentMode => experimentMode === 'manyPhotons'
      ),
      translation: sceneTranslation,
      tandem: tandem.createTandem( 'manyPhotonsExperimentSceneView' )
    } );

    super( {
      children: [ experimentModeRadioButtonGroup, singlePhotonExperimentSceneView, manyPhotonsExperimentSceneView ],
      tandem: tandem
    } );

    this.model = model;
    this.singlePhotonExperimentSceneView = singlePhotonExperimentSceneView;
    this.manyPhotonsExperimentSceneView = manyPhotonsExperimentSceneView;

    // Set the order for alt-input navigation.
    this.pdomPlayAreaNode.pdomOrder = [
      experimentModeRadioButtonGroup,
      singlePhotonExperimentSceneView,
      manyPhotonsExperimentSceneView
    ];
  }

  public override reset(): void {
    this.model.reset();
    this.singlePhotonExperimentSceneView.reset();
    this.manyPhotonsExperimentSceneView.reset();
    super.reset();
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.singlePhotonExperimentSceneView.update();
    this.manyPhotonsExperimentSceneView.update();
  }
}

quantumMeasurement.register( 'PhotonsScreenView', PhotonsScreenView );

export default PhotonsScreenView;