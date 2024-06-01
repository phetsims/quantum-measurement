// Copyright 2024, University of Colorado Boulder

/**
 * CoinsExperimentSceneView is the base class for the scene views on the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, Line, Node, NodeOptions, VBox } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = EmptySelfOptions;
export type CoinsExperimentSceneViewOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const SCENE_WIDTH = QuantumMeasurementConstants.LAYOUT_BOUNDS.width;
const DIVIDER_X_POSITION_DURING_PREPARATION = ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.38;
const DIVIDER_X_POSITION_DURING_MEASUREMENT = ScreenView.DEFAULT_LAYOUT_BOUNDS.width * 0.2;
const DIVIDER_HEIGHT = 500; // empirically determined

export default class CoinsExperimentSceneView extends Node {

  // These scenes have two areas, one for preparing the experiment and one for running it a measuring the results.
  // These are the root nodes for each of these areas.
  protected readonly preparationArea = new VBox();
  protected readonly measurementArea = new VBox();

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: CoinsExperimentSceneViewOptions ) {

    const options = optionize<CoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      {
        visibleProperty: sceneModel.activeProperty
      },
      providedOptions
    );

    super( options );

    // Add the two areas of activity to the scene view.
    this.addChild( this.preparationArea );
    this.addChild( this.measurementArea );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLine = new Line( 0, 0, 0, DIVIDER_HEIGHT, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineDash: [ 6, 5 ]
    } );
    this.addChild( dividingLine );

    // Add the button for switching from preparation mode to measurement mode.
    const startMeasurementButton = new RectangularPushButton( {
      baseColor: Color.GREEN,
      content: new ArrowNode( 0, 0, 60, 0, {
        headWidth: 20,
        headHeight: 15
      } ),
      listener: () => { sceneModel.preparingExperimentProperty.value = false; },
      visibleProperty: sceneModel.preparingExperimentProperty,
      centerY: 245 // empirically determined
    } );
    this.addChild( startMeasurementButton );

    // Position the dividing line and the two areas based on whether the user is preparing the experiment or running it.
    sceneModel.preparingExperimentProperty.link( preparingExperiment => {
      const dividerXPosition = preparingExperiment ?
                               DIVIDER_X_POSITION_DURING_PREPARATION :
                               DIVIDER_X_POSITION_DURING_MEASUREMENT;
      dividingLine.centerX = dividerXPosition;
      startMeasurementButton.centerX = dividerXPosition;
    } );

    Multilink.multilink(
      [
        this.preparationArea.boundsProperty,
        dividingLine.boundsProperty
      ],
      () => {
        startMeasurementButton.centerX = dividingLine.centerX;
        this.preparationArea.centerX = dividingLine.centerX / 2;
      }
    );

    Multilink.multilink(
      [
        this.measurementArea.boundsProperty,
        dividingLine.boundsProperty
      ],
      () => {
        startMeasurementButton.centerX = dividingLine.centerX;
        this.measurementArea.centerX = dividingLine.centerX + ( SCENE_WIDTH - dividingLine.centerX ) / 2;
      }
    );
  }
}

quantumMeasurement.register( 'CoinsExperimentSceneView', CoinsExperimentSceneView );