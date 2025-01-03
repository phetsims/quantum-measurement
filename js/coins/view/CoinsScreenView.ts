// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import CoinsModel from 'model/CoinsModel.js';
import Multilink from '../../../../axon/js/Multilink.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import SceneSelectorRadioButtonGroup from '../../common/view/SceneSelectorRadioButtonGroup.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';

const SCENE_POSITION = new Vector2( 0, 90 ); // empirically determined to look decent
const SYSTEM_TYPE_TO_STRING_MAP = new Map<SystemType, LocalizedStringProperty>(
  [
    [ 'classical', QuantumMeasurementStrings.classicalCoinStringProperty ],
    [ 'quantum', QuantumMeasurementStrings.quantumCoinQuotedStringProperty ]
  ]
);

export default class CoinsScreenView extends QuantumMeasurementScreenView {

  private readonly model: CoinsModel;

  // the two scene views for the experiments
  private readonly classicalCoinsExperimentSceneView: CoinsExperimentSceneView;
  private readonly quantumCoinsExperimentSceneView: CoinsExperimentSceneView;

  public constructor( model: CoinsModel, tandem: Tandem ) {

    super( { tandem: tandem } );

    this.model = model;

    // Add the radio buttons at the top of the screen that will allow users to pick between classical and quantum coins.
    const experimentTypeRadioButtonGroup = new SceneSelectorRadioButtonGroup<SystemType>(
      model.experimentTypeProperty,
      SYSTEM_TYPE_TO_STRING_MAP,
      {
        centerX: this.layoutBounds.centerX,
        tandem: tandem.createTandem( 'experimentTypeRadioButtonGroup' )
      }
    );
    this.addChild( experimentTypeRadioButtonGroup );

    // Add the views for the two scenes that can be shown on this screen.
    this.classicalCoinsExperimentSceneView = new CoinsExperimentSceneView( model.classicalCoinExperimentSceneModel, {
      translation: SCENE_POSITION,
      tandem: tandem.createTandem( 'classicalCoinsExperimentSceneView' )
    } );
    this.addChild( this.classicalCoinsExperimentSceneView );
    this.quantumCoinsExperimentSceneView = new CoinsExperimentSceneView( model.quantumCoinExperimentSceneModel, {
      translation: SCENE_POSITION,
      tandem: tandem.createTandem( 'quantumCoinsExperimentSceneView' )
    } );
    this.addChild( this.quantumCoinsExperimentSceneView );

    // Changing the background color based on the experiment type
    Multilink.multilink(
      [
        model.experimentTypeProperty,
        QuantumMeasurementColors.classicalBackgroundColorProperty,
        QuantumMeasurementColors.quantumBackgroundColorProperty
      ],
      ( experimentType, classicalBackgroundColor, quantumBackgroundColor ) => {
        QuantumMeasurementColors.screenBackgroundColorProperty.value = experimentType === 'classical' ? classicalBackgroundColor : quantumBackgroundColor;
      } );
  }

  public override reset(): void {
    this.model.reset();
    this.classicalCoinsExperimentSceneView.reset();
    this.quantumCoinsExperimentSceneView.reset();
    super.reset();
  }
}

quantumMeasurement.register( 'CoinsScreenView', CoinsScreenView );