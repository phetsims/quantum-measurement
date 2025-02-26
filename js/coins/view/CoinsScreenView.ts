// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import CoinsModel from 'model/CoinsModel.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import SceneSelectorRadioButtonGroup from '../../common/view/SceneSelectorRadioButtonGroup.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';

const SCENE_POSITION = new Vector2( 0, 90 ); // empirically determined to look decent

export default class CoinsScreenView extends QuantumMeasurementScreenView {

  private readonly model: CoinsModel;

  // the two scene views for the experiments
  private readonly classicalCoinsExperimentSceneView: CoinsExperimentSceneView;
  private readonly quantumCoinsExperimentSceneView: CoinsExperimentSceneView;

  public constructor( model: CoinsModel, tandem: Tandem ) {

    // Add the radio buttons at the top of the screen that will allow users to pick between classical and quantum coins.
    const experimentTypeRadioButtonGroup = new SceneSelectorRadioButtonGroup<SystemType>(
      model.experimentTypeProperty,
      {
        centerX: QuantumMeasurementConstants.LAYOUT_BOUNDS.centerX,
        top: QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'experimentTypeRadioButtonGroup' )
      }
    );

    // Add the views for the two scenes that can be shown on this screen.
    const classicalCoinsExperimentSceneView = new CoinsExperimentSceneView( model.classicalCoinExperimentSceneModel, {
      translation: SCENE_POSITION,
      tandem: tandem.createTandem( 'classicalCoinsExperimentSceneView' )
    } );
    const quantumCoinsExperimentSceneView = new CoinsExperimentSceneView( model.quantumCoinExperimentSceneModel, {
      translation: SCENE_POSITION,
      tandem: tandem.createTandem( 'quantumCoinsExperimentSceneView' )
    } );

    super( {
      tandem: tandem,
      children: [
        experimentTypeRadioButtonGroup,
        classicalCoinsExperimentSceneView,
        quantumCoinsExperimentSceneView
      ]
    } );

    this.classicalCoinsExperimentSceneView = classicalCoinsExperimentSceneView;
    this.quantumCoinsExperimentSceneView = quantumCoinsExperimentSceneView;
    this.model = model;

    this.pdomPlayAreaNode.pdomOrder = [
      classicalCoinsExperimentSceneView,
      quantumCoinsExperimentSceneView,
      experimentTypeRadioButtonGroup
    ];

    // Changing the background color based on the experiment type
    Multilink.multilink(
      [
        model.experimentTypeProperty,
        QuantumMeasurementColors.classicalBackgroundColorProperty,
        QuantumMeasurementColors.quantumBackgroundColorProperty
      ],
      ( experimentType, classicalBackgroundColor, quantumBackgroundColor ) => {
        QuantumMeasurementColors.screenBackgroundColorProperty.value = experimentType === SystemType.CLASSICAL ? classicalBackgroundColor : quantumBackgroundColor;
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