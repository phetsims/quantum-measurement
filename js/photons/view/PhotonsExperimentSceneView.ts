// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PlayPauseStepButtonGroup from '../../../../scenery-phet/js/buttons/PlayPauseStepButtonGroup.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import ExpectationValueControl from './ExpectationValueControl.js';
import ExpectationValueVectorControl from './ExpectationValueVectorControl.js';
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
const CHECKBOX_TEXT_FONT = new PhetFont( 18 );
const CHECKBOX_GROUP_SPACING = 10;
const CHECKBOX_GROUP_POINTER_DILATION = CHECKBOX_GROUP_SPACING / 2;

class PhotonsExperimentSceneView extends Node {

  // The photon testing area is the part of the scene where photons are produced, reflected, and detected.
  private readonly photonTestingArea: PhotonTestingArea;

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

    const photonTestingArea = new PhotonTestingArea( model, {

      // center position empirically determined to match design doc
      center: new Vector2( 420, 225 ),
      phetioVisiblePropertyInstrumented: false,
      tandem: providedOptions.tandem.createTandem( 'photonTestingArea' )
    } );

    const polarizationIndicator = new ObliquePolarizationAngleIndicator( model.laser.polarizationAngleProperty, {
      scale: 1.5,
      centerX: photonDetectionProbabilityAccordionBox.centerX,
      y: photonTestingArea.y,
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
    const titleTextProperty = model.laser.emissionMode === 'singlePhoton' ?
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
    const verticalValueProperty = model.laser.emissionMode === 'singlePhoton' ?
                                  model.verticalPolarizationDetector.detectionCountProperty :
                                  model.verticalPolarizationDetector.detectionRateProperty;
    const horizontalValueProperty = model.laser.emissionMode === 'singlePhoton' ?
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

    const histogramTickMarkLabelProperty = model.laser.emissionMode === 'singlePhoton' ?
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
        displayMode: model.laser.emissionMode === 'singlePhoton' ? 'fraction' : 'rate',
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
      centerY: photonTestingArea.y
    } );

    const vectorRepresentationControl = new ExpectationValueVectorControl(
      normalizedOutcomeVectorGraph.showVectorProperty,
      {
        checkboxOptions: {
          mouseAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
          mouseAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION,
          touchAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
          touchAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION
        },
        tandem: providedOptions.tandem.createTandem( 'vectorRepresentationControl' )
      }
    );

    const expectationValueControlTandem = providedOptions.tandem.createTandem( 'expectationValueControl' );
    const expectationValueControl = new ExpectationValueControl(
      normalizedOutcomeVectorGraph.showExpectationLineProperty,
      model.normalizedExpectationValueProperty,
      showDecimalValuesProperty,
      {
        tandem: expectationValueControlTandem,
        visibleProperty: new GatedVisibleProperty( new DerivedProperty(
          [ model.normalizedExpectationValueProperty ],
          expectationValue => expectationValue !== null
        ), expectationValueControlTandem ),
        checkboxOptions: {
          mouseAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
          mouseAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION,
          touchAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
          touchAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION
        }
      }
    );

    const decimalValuesCheckbox = new Checkbox(
      showDecimalValuesProperty,
      new Text( QuantumMeasurementStrings.decimalValuesStringProperty, {
        font: CHECKBOX_TEXT_FONT,
        maxWidth: 200
      } ),
      {
        mouseAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
        mouseAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION,
        touchAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
        touchAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION,
        tandem: providedOptions.tandem.createTandem( 'decimalValuesCheckbox' )
      }
    );

    // Assemble the controls that allow the users to set what is and isn't shown in the "average polarization" area.
    const averagePolarizationDisplayControls = new VBox( {
      children: [ vectorRepresentationControl, expectationValueControl, decimalValuesCheckbox ],
      spacing: CHECKBOX_GROUP_SPACING,
      align: 'left',
      left: titleAndEquationsBox.left,
      top: dynamicDataDisplayBox.bottom + 30
    } );

    // Create a play/pause/step time control.
    const playPauseStepButtonGroup = new PlayPauseStepButtonGroup( model.isPlayingProperty, {
      stepForwardButtonOptions: {
        listener: () => { model.stepForwardInTime( STEP_FORWARD_TIME ); }
      },
      playPauseButtonOptions: {
        radius: 25
      },
      centerX: photonTestingArea.x + 20, // centered beneath the beam splitter
      bottom: photonPolarizationAngleControl.bottom - 6, // vertically aligned with reset all button
      tandem: providedOptions.tandem.createTandem( 'playPauseStepButtonGroup' )
    } );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, NodeOptions>()( {
      children: [
        photonDetectionProbabilityAccordionBox,
        polarizationIndicator,
        photonPolarizationAngleControl,
        photonTestingArea,
        titleAndEquationsBox,
        dynamicDataDisplayBox,
        averagePolarizationDisplayControls,
        playPauseStepButtonGroup
      ]
    }, providedOptions );

    super( options );

    this.photonTestingArea = photonTestingArea;
    this.normalizedOutcomeVectorGraph = normalizedOutcomeVectorGraph;
    this.showDecimalValuesProperty = showDecimalValuesProperty;
  }

  public update(): void {
    this.photonTestingArea.update();
  }

  public reset(): void {
    this.normalizedOutcomeVectorGraph.reset();
    this.showDecimalValuesProperty.reset();
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );

export default PhotonsExperimentSceneView;