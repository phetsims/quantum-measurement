// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import { Image } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import photonsScreenMockup_png from '../../../images/photonsScreenMockup_png.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import SceneSelectorRadioButtonGroup from '../../common/view/SceneSelectorRadioButtonGroup.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhotonsModel, { ExperimentModeType } from '../model/PhotonsModel.js';

const EXPERIMENT_MODE_TO_STRING_MAP = new Map<ExperimentModeType, LocalizedStringProperty>(
  [
    [ 'singlePhoton', QuantumMeasurementStrings.singlePhotonStringProperty ],
    [ 'multiplePhotons', QuantumMeasurementStrings.manyPhotonsStringProperty ]
  ]
);

export default class PhotonsScreenView extends QuantumMeasurementScreenView {

  private readonly model: PhotonsModel;

  public constructor( model: PhotonsModel, tandem: Tandem ) {

    super( {
      mockupImage: new Image( photonsScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / photonsScreenMockup_png.width
      } ),
      initialMockupOpacity: 0,
      tandem: tandem
    } );

    this.model = model;

    // Add the radio buttons at the top of the screen that will allow users to pick between the single-photon and
    // multi-photon experiment modes.
    const experimentModeRadioButtonGroup = new SceneSelectorRadioButtonGroup<ExperimentModeType>(
      model.experimentModeProperty,
      EXPERIMENT_MODE_TO_STRING_MAP,
      {
        centerX: this.layoutBounds.centerX,
        tandem: tandem.createTandem( 'experimentModeRadioButtonGroup' )
      }
    );
    this.addChild( experimentModeRadioButtonGroup );
  }

  public override reset(): void {
    this.model.reset();
    super.reset();
  }
}

quantumMeasurement.register( 'PhotonsScreenView', PhotonsScreenView );