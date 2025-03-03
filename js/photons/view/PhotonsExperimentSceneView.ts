// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Panel from '../../../../sun/js/Panel.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import ExperimentModeValues from '../model/ExperimentModeValues.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import AveragePolarizationCheckboxGroup from './AveragePolarizationCheckboxGroup.js';
import ExpectationValueCheckboxDecorationNode from './ExpectationValueCheckboxDecorationNode.js';
import NormalizedOutcomeVectorGraph from './NormalizedOutcomeVectorGraph.js';
import ObliquePolarizationAngleIndicator from './ObliquePolarizationAngleIndicator.js';
import PhotonDetectionProbabilityPanel from './PhotonDetectionProbabilityPanel.js';
import PhotonPolarizationAngleControl from './PhotonPolarizationAngleControl.js';
import PhotonsEquationNode from './PhotonsEquationNode.js';
import PhotonTestingArea from './PhotonTestingArea.js';

type SelfOptions = EmptySelfOptions;
type PhotonsExperimentSceneViewOptions = SelfOptions & WithRequired<NodeOptions, 'tandem' | 'translation'>;

const X_INSET = QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN;
const STEP_FORWARD_TIME = 2 / 60; // empirically determined, in seconds, adjust as desired

class PhotonsExperimentSceneView extends Node {

  // The area on the screen where the actual experiment is conducted, which shows the photons, beam splitters, mirror,
  // and detectors.
  private readonly experimentArea: PhotonTestingArea;

  // The normalized outcome vector graph shows the relative proportions of vertical and horizontal detections.
  private readonly normalizedOutcomeVectorGraph: NormalizedOutcomeVectorGraph;

  // Property that controls whether decimal values are shown in the average polarization area.
  private readonly showDecimalValuesProperty: BooleanProperty;

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonsExperimentSceneViewOptions ) {

    const showDecimalValuesProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'showDecimalValuesProperty' ),
      phetioFeatured: true
    } );

    const photonDetectionProbabilityAccordionBox = new PhotonDetectionProbabilityPanel(
      model.laser.polarizationAngleProperty,
      model.isProbabilityAccordionExpandedProperty,
      {

        // Position empirically determined to match design doc.
        left: 55,
        top: 20,

        tandem: providedOptions.tandem.createTandem( 'photonDetectionProbabilityAccordionBox' )
      }
    );

    const experimentArea = new PhotonTestingArea( model, {

      // center position empirically determined to match design doc
      center: new Vector2( 420, 225 ),
      phetioVisiblePropertyInstrumented: false,
      tandem: providedOptions.tandem.createTandem( 'experimentArea' )
    } );

    const polarizationIndicator = new ObliquePolarizationAngleIndicator( model.laser.polarizationAngleProperty, {
      scale: 1.5,
      centerX: photonDetectionProbabilityAccordionBox.centerX,
      y: experimentArea.y,
      tandem: providedOptions.tandem.createTandem( 'polarizationIndicator' )
    } );

    const photonPolarizationAngleControl = new PhotonPolarizationAngleControl( model.laser, {
        left: X_INSET,
        bottom: QuantumMeasurementConstants.LAYOUT_BOUNDS.height -
                providedOptions.translation.y -
                QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
        tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleControl' ),
        phetioFeatured: true
      }
    );

    // Create a sort of "title panel" for the area on the right that shows information about the detection statistics.
    const titleTextProperty = model.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ?
                              QuantumMeasurementStrings.averagePolarizationStringProperty :
                              QuantumMeasurementStrings.averagePolarizationRateStringProperty;
    const averagePolarizationTitlePanel = new Panel(
      new Text( titleTextProperty, { font: new PhetFont( 18 ), maxWidth: 250 } ),
      {
        fill: QuantumMeasurementColors.controlPanelFillColorProperty,
        stroke: null,
        minWidth: 325,
        cornerRadius: 5,
        xMargin: 20,
        yMargin: 10,
        align: 'center'
      }
    );

    // Create the equation representation that shows the detection counts for the vertical and horizontal detectors.
    const verticalValueProperty = model.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ?
                                  model.verticalPolarizationDetector.detectionCountProperty :
                                  model.verticalPolarizationDetector.detectionRateProperty;
    const horizontalValueProperty = model.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ?
                                    model.horizontalPolarizationDetector.detectionCountProperty :
                                    model.horizontalPolarizationDetector.detectionRateProperty;

    const equationsBox = new PhotonsEquationNode( verticalValueProperty, horizontalValueProperty, {
      tandem: providedOptions.tandem.createTandem( 'equationsBox' ),
      phetioFeatured: true
    } );

    // Put the title and the equations together in a vertical box.
    const titleAndEquationsBox = new VBox( {
      children: [ averagePolarizationTitlePanel, equationsBox ],
      spacing: 10,
      align: 'left',
      right: QuantumMeasurementConstants.LAYOUT_BOUNDS.width - X_INSET,
      top: 0
    } );

    // Create the graph that indicates the relative proportions of vertical and horizontal detections.
    const normalizedOutcomeVectorGraph = new NormalizedOutcomeVectorGraph(
      model.normalizedOutcomeValueProperty,
      model.normalizedExpectationValueProperty,
      showDecimalValuesProperty,
      providedOptions.tandem.createTandem( 'normalizedOutcomeVectorGraph' )
    );

    const histogramTickMarkLabelProperty = model.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ?
                                           new StringProperty( '1.0' ) :
                                           new StringProperty( '' );

    // Create the histogram that shows the detection counts for the vertical and horizontal detectors.
    const histogram = new QuantumMeasurementHistogram(
      verticalValueProperty,
      horizontalValueProperty,
      [
        new RichText(
          QuantumMeasurementStrings.VStringProperty,
          {
            font: new PhetFont( { size: 17, weight: 'bold' } ),
            fill: QuantumMeasurementColors.verticalPolarizationColorProperty,
            maxWidth: 15
          }
        ),
        new RichText(
          QuantumMeasurementStrings.HStringProperty,
          {
            font: new PhetFont( { size: 17, weight: 'bold' } ),
            fill: QuantumMeasurementColors.horizontalPolarizationColorProperty,
            maxWidth: 15
          } )
      ],
      {
        displayMode: model.laser.emissionMode === ExperimentModeValues.SINGLE_PHOTON ? 'fraction' : 'rate',
        orientation: 'horizontal',
        floatingLabels: true,
        matchLabelColors: true,
        showCentralNumberDisplaysProperty: showDecimalValuesProperty,
        leftFillColorProperty: QuantumMeasurementColors.verticalPolarizationColorProperty,
        rightFillColorProperty: QuantumMeasurementColors.horizontalPolarizationColorProperty,
        topTickMarkTextProperty: histogramTickMarkLabelProperty,
        barPositionProportion: 0.75,
        tandem: providedOptions.tandem.createTandem( 'histogram' )
      }
    );

    // Put the two dynamic data display nodes together in a horizontal box.  The center of this box will be aligned
    // with the center of the emitted photon beam.
    const dynamicDataDisplayBox = new HBox( {
      children: [ normalizedOutcomeVectorGraph, histogram ],
      spacing: 20,
      align: 'center',
      resize: false,
      left: titleAndEquationsBox.left - 20,
      centerY: experimentArea.y
    } );

    // Create the checkbox group that allows the user to control some aspects of what is shown in the average
    // polarization area.
    const averagePolarizationCheckboxGroup = new AveragePolarizationCheckboxGroup(
      [
        {
          labelStringProperty: QuantumMeasurementStrings.vectorRepresentationStringProperty,
          property: normalizedOutcomeVectorGraph.showVectorRepresentationProperty,
          decorationNode: new ArrowNode( 0, 0, 26, 0, {
            fill: Color.BLACK,
            tailWidth: 3,
            headWidth: 12
          } ),
          tandemControlName: 'vectorRepresentationControl'
        },
        {
          labelStringProperty: QuantumMeasurementStrings.expectationValueStringProperty,
          property: normalizedOutcomeVectorGraph.showExpectationValueProperty,
          decorationNode: new ExpectationValueCheckboxDecorationNode(
            model.normalizedExpectationValueProperty,
            normalizedOutcomeVectorGraph.showExpectationValueProperty,
            showDecimalValuesProperty
          ),
          visibleProperty: DerivedProperty.valueNotEqualsConstant( model.normalizedExpectationValueProperty, null ),
          tandemControlName: 'expectationValueControl'
        },
        {
          labelStringProperty: QuantumMeasurementStrings.decimalValuesStringProperty,
          property: showDecimalValuesProperty,
          tandemControlName: 'decimalValuesControl'
        }
      ],
      {
        left: titleAndEquationsBox.left,
        top: dynamicDataDisplayBox.bottom + 30,
        tandem: providedOptions.tandem.createTandem( 'averagePolarizationCheckboxGroup' )
      }
    );

    // Create a play/pause/step time control.
    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      // optional Normal/Slow radio buttons
      timeSpeedProperty: model.timeSpeedProperty,
      flowBoxSpacing: 15,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => { model.stepForwardInTime( STEP_FORWARD_TIME ); }
        },
        playPauseButtonOptions: {
          radius: 25
        }
      },
      centerX: experimentArea.x + 70,
      bottom: photonPolarizationAngleControl.bottom - 6, // vertically aligned with reset all button
      tandem: providedOptions.tandem.createTandem( 'timeControlNode' )
    } );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, NodeOptions>()( {
      children: [
        photonDetectionProbabilityAccordionBox,
        polarizationIndicator,
        photonPolarizationAngleControl,
        experimentArea,
        titleAndEquationsBox,
        dynamicDataDisplayBox,
        averagePolarizationCheckboxGroup,
        timeControlNode
      ]
    }, providedOptions );

    super( options );

    this.experimentArea = experimentArea;
    this.normalizedOutcomeVectorGraph = normalizedOutcomeVectorGraph;
    this.showDecimalValuesProperty = showDecimalValuesProperty;
  }

  public update(): void {
    this.experimentArea.update();
  }

  public reset(): void {
    this.normalizedOutcomeVectorGraph.reset();
    this.showDecimalValuesProperty.reset();
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );

export default PhotonsExperimentSceneView;