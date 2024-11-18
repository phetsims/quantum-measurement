// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, NodeOptions, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import ExpectationValueControl from './ExpectationValueControl.js';
import NormalizedOutcomeVectorGraph from './NormalizedOutcomeVectorGraph.js';
import ObliquePolarizationAngleIndicator from './ObliquePolarizationAngleIndicator.js';
import PhotonDetectionProbabilityPanel from './PhotonDetectionProbabilityPanel.js';
import PhotonPolarizationAngleControl from './PhotonPolarizationAngleControl.js';
import PhotonsEquationNode from './PhotonsEquationNode.js';
import PhotonTestingArea from './PhotonTestingArea.js';

type SelfOptions = EmptySelfOptions;
type PhotonsExperimentSceneViewOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

const INSET = 10; // inset for nodes at edges of the view, in screen coordinates

export default class PhotonsExperimentSceneView extends Node {

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonsExperimentSceneViewOptions ) {

    const photonDetectionProbabilityPanel = new PhotonDetectionProbabilityPanel(
      model.laser.polarizationAngleProperty,
      {

        // Position empirically determined to match design doc.
        left: 55,
        top: 20,

        tandem: providedOptions.tandem.createTandem( 'photonDetectionProbabilityPanel' )
      }
    );

    const photonTestingArea = new PhotonTestingArea( model, {

      // center position empirically determined to match design doc
      center: new Vector2( 420, 225 ),

      tandem: providedOptions.tandem.createTandem( 'photonTestingArea' )
    } );

    const polarizationIndicator = new ObliquePolarizationAngleIndicator( model.laser.polarizationAngleProperty, {
      scale: 1.5,
      centerX: photonDetectionProbabilityPanel.centerX,
      y: photonTestingArea.y,
      tandem: providedOptions.tandem.createTandem( 'polarizationIndicator' )
    } );

    const photonPolarizationAngleControl = new PhotonPolarizationAngleControl( model.laser, {
        left: INSET,
        top: polarizationIndicator.bottom + 10,
        tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleControl' )
      }
    );

    // Create a sort of "title panel" for the area on the right that shows information about the detection statistics.
    const titleTextProperty = model.laser.emissionMode === 'singlePhoton' ?
                              QuantumMeasurementStrings.averagePolarizationStringProperty :
                              QuantumMeasurementStrings.averagePolarizationRateStringProperty;
    const averagePolarizationTitlePanel = new Panel(
      new Text( titleTextProperty, { font: new PhetFont( 18 ) } ),
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
      tandem: providedOptions.tandem.createTandem( 'equationsBox' )
    } );

    // Create the graph that indicates the relative proportions of vertical and horizontal detections.
    const normalizedOutcomeVectorGraph = new NormalizedOutcomeVectorGraph(
      model.normalizedOutcomeValueProperty,
      model.normalizedExpectationValueProperty,
      providedOptions.tandem.createTandem( 'normalizedOutcomeVectorGraph' )
    );

    const histogramTickMarkLabelProperty = model.laser.emissionMode === 'singlePhoton' ?
                                           new StringProperty( '1.0' ) :
                                           new DerivedProperty(
                                             [
                                               QuantumMeasurementStrings.eventsPerSecondPatternStringProperty,
                                               verticalValueProperty,
                                               horizontalValueProperty
                                             ],
                                             ( eventsPerSecondPatternString, verticalValue, horizontalValue ) => {
                                               const displayValue = Utils.roundSymmetric( verticalValue + horizontalValue );
                                               return StringUtils.fillIn( eventsPerSecondPatternString, { value: displayValue } );
                                             }
                                           );

    // Create the histogram that shows the detection counts for the vertical and horizontal detectors.
    const countHistogram = new QuantumMeasurementHistogram(
      verticalValueProperty,
      horizontalValueProperty,
      [
        new RichText(
          'V',
          {
            font: new PhetFont( { size: 17, weight: 'bold' } ),
            fill: QuantumMeasurementColors.verticalPolarizationColorProperty
          }
        ),
        new RichText(
          'H',
          {
            font: new PhetFont( { size: 17, weight: 'bold' } ),
            fill: QuantumMeasurementColors.horizontalPolarizationColorProperty
          } )
      ],
      {
        displayMode: model.laser.emissionMode === 'singlePhoton' ? 'fraction' : 'rate',
        orientation: 'horizontal',
        floatingLabels: true,
        matchLabelColors: true,
        leftFillColorProperty: QuantumMeasurementColors.verticalPolarizationColorProperty,
        rightFillColorProperty: QuantumMeasurementColors.horizontalPolarizationColorProperty,
        visibleProperty: new BooleanProperty( true ),
        topTickMarkTextProperty: histogramTickMarkLabelProperty,
        tandem: Tandem.OPT_OUT
      }
    );

    // Put the two dynamic data display nodes together in a horizontal box.
    const dynamicDataDisplayBox = new HBox( {
      children: [ normalizedOutcomeVectorGraph, countHistogram ],
      spacing: 20,
      align: 'center'
    } );

    const dataDashboardChildren: Node[] = [
      averagePolarizationTitlePanel,
      equationsBox,
      dynamicDataDisplayBox
    ];

    // Add the control that allows the user to show/hide the expectation value line.
    dataDashboardChildren.push( new ExpectationValueControl( normalizedOutcomeVectorGraph.showExpectationLineProperty, {

        // Don't show this control when there isn't a valid expectation value to display.
        visibleProperty: new DerivedProperty(
          [ model.normalizedExpectationValueProperty ],
          expectationValue => expectationValue !== null
        ),

        tandem: providedOptions.tandem.createTandem( 'expectationValueControl' )
      }
    ) );

    // Create the box that contains the graphs that display the measurement data from the photon experiments.
    const dataDashboardBox = new VBox( {
      children: dataDashboardChildren,
      align: 'left',
      spacing: 22,
      right: QuantumMeasurementConstants.LAYOUT_BOUNDS.right - 40,
      top: 0
    } );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, NodeOptions>()( {
      children: [
        photonDetectionProbabilityPanel,
        polarizationIndicator,
        photonPolarizationAngleControl,
        photonTestingArea,
        dataDashboardBox
      ]
    }, providedOptions );

    super( options );

    // Add a play/pause button to the view IF the model is in many-photon mode.
    if ( model.laser.emissionMode === 'manyPhotons' ) {
      const playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
        radius: 25,
        centerX: photonTestingArea.x,
        bottom: photonPolarizationAngleControl.bottom,
        tandem: providedOptions.tandem.createTandem( 'playPauseButton' )
      } );
      this.addChild( playPauseButton );
    }
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );