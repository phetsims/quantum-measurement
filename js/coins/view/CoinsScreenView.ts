// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import CoinsModel from 'model/CoinsModel.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import SceneSelectorRadioButtonGroup from '../../common/view/SceneSelectorRadioButtonGroup.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';

type ColorType = Property<Color> | Property<string> | Property<Color | string>;

const SCENE_POSITION = new Vector2( 0, 75 ); // empirically determined to look decent

export default class CoinsScreenView extends QuantumMeasurementScreenView {

  private readonly model: CoinsModel;

  // the two scene views for the experiments
  private readonly classicalCoinsExperimentSceneView: CoinsExperimentSceneView;
  private readonly quantumCoinsExperimentSceneView: CoinsExperimentSceneView;

  public constructor( model: CoinsModel, backgroundColorProperty: ColorType, tandem: Tandem ) {

    // Add the radio buttons at the top of the screen that will allow users to pick between classical and quantum coins.
    const experimentTypeRadioButtonGroup = new SceneSelectorRadioButtonGroup<SystemType>(
      model.experimentTypeProperty,
      {
        centerX: QuantumMeasurementConstants.LAYOUT_BOUNDS.centerX,
        top: QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: tandem.createTandem( 'experimentTypeRadioButtonGroup' )
      }
    );

    // Design request to change the backgruond color based on the scene selection,
    // and since the Screen Background color is set outside the Screen View, we pass it here and modify it.
    Multilink.multilink( [
      model.experimentTypeProperty,
      QuantumMeasurementColors.classicalBackgroundColorProperty,
      QuantumMeasurementColors.quantumBackgroundColorProperty
    ], ( experimentType, classicalBackgroundColor, quantumBackgroundColor ) => {
      if ( experimentType === SystemType.CLASSICAL ) {
        backgroundColorProperty.value = classicalBackgroundColor;
      }
      else {
        backgroundColorProperty.value = quantumBackgroundColor;
      }
    } );


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
  }

  public override reset(): void {
    this.model.reset();
    this.classicalCoinsExperimentSceneView.reset();
    this.quantumCoinsExperimentSceneView.reset();
    super.reset();
  }
}

quantumMeasurement.register( 'CoinsScreenView', CoinsScreenView );