// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import CoinsModel from 'model/CoinsModel.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
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
    const experimentModeRadioButtonGroup = new SceneSelectorRadioButtonGroup<SystemType>(
      model.experimentModeProperty,
      { tandem: tandem.createTandem( 'experimentModeRadioButtonGroup' ) }
    );

    // Put the radio button group in an align box so that it will stay centered horizontally when strings change.
    const experimentModeRadioButtonGroupAlignBox = new AlignBox( experimentModeRadioButtonGroup, {
      alignBounds: new Bounds2(
        QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN,
        QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
        QuantumMeasurementConstants.LAYOUT_BOUNDS.maxX - QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN,
        QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN + experimentModeRadioButtonGroup.height
      )
    } );

    // Change the background color based on the experiment mode.  This was a design request to make it more obvious to
    // the user when they are in the classical or quantum mode.
    Multilink.multilink(
      [
        model.experimentModeProperty,
        QuantumMeasurementColors.classicalSceneBackgroundColorProperty,
        QuantumMeasurementColors.quantumSceneBackgroundColorProperty
      ],
      ( experimentType, classicalBackgroundColor, quantumBackgroundColor ) => {
        if ( experimentType === SystemType.CLASSICAL ) {
          backgroundColorProperty.value = classicalBackgroundColor;
        }
        else {
          backgroundColorProperty.value = quantumBackgroundColor;
        }
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
        experimentModeRadioButtonGroupAlignBox,
        classicalCoinsExperimentSceneView,
        quantumCoinsExperimentSceneView
      ]
    } );

    this.classicalCoinsExperimentSceneView = classicalCoinsExperimentSceneView;
    this.quantumCoinsExperimentSceneView = quantumCoinsExperimentSceneView;
    this.model = model;

    this.pdomPlayAreaNode.pdomOrder = [
      classicalCoinsExperimentSceneView,
      experimentModeRadioButtonGroupAlignBox,
      quantumCoinsExperimentSceneView
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