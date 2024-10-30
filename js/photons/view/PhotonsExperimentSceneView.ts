// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, RichText, Text } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import PhotonDetectionProbabilityPanel from './PhotonDetectionProbabilityPanel.js';
import PhotonPolarizationAngleControl from './PhotonPolarizationAngleControl.js';
import PhotonTestingArea from './PhotonTestingArea.js';
import PolarizationPlaneRepresentation from './PolarizationPlaneRepresentation.js';

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
      center: new Vector2( 420, 270 ),

      tandem: providedOptions.tandem.createTandem( 'photonTestingArea' )
    } );

    const polarizationIndicator = new PolarizationPlaneRepresentation( model.laser.polarizationAngleProperty, {
      scale: 1.5,
      centerX: photonDetectionProbabilityPanel.centerX,
      centerY: photonTestingArea.centerY,
      tandem: providedOptions.tandem.createTandem( 'polarizationIndicator' )
    } );

    const photonPolarizationAngleControl = new PhotonPolarizationAngleControl( model.laser, {
        left: INSET,
        top: polarizationIndicator.bottom + 20,
        tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleControl' )
      }
    );

    // Create a sort of "title panel" for the area on the right that shows information about the detection statistics.
    const averagePolarizationRateTitlePanel = new Panel(
      new Text( 'Average Polarization Rate', { font: new PhetFont( 18 ) } ),
      {
        fill: QuantumMeasurementColors.controlPanelFillColorProperty,
        stroke: null,
        cornerRadius: 4,
        xMargin: 20,
        yMargin: 10,
        align: 'center',
        right: QuantumMeasurementConstants.LAYOUT_BOUNDS.right - 20,
        top: 0
      }
    );

    // Create the histogram that shows the detection counts for the vertical and horizontal detectors.
    const leftProperty = model.laser.emissionMode === 'singlePhoton' ? model.verticalPolarizationDetector.detectionCountProperty : model.verticalPolarizationDetector.detectionRateProperty;
    const rightProperty = model.laser.emissionMode === 'singlePhoton' ? model.horizontalPolarizationDetector.detectionCountProperty : model.horizontalPolarizationDetector.detectionRateProperty;
    const countHistogram = new QuantumMeasurementHistogram(
      leftProperty,
      rightProperty,
      new BooleanProperty( true ),
      [
        new RichText( 'V', { font: new PhetFont( { size: 17, weight: 'bold' } ), fill: QuantumMeasurementColors.verticalPolarizationColorProperty } ),
        new RichText( 'H', { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
      ],
      {
        right: QuantumMeasurementConstants.LAYOUT_BOUNDS.right - 180,
        centerY: photonTestingArea.centerY,
        displayMode: model.laser.emissionMode === 'singlePhoton' ? 'fraction' : 'rate',
        orientation: 'horizontal',
        matchLabelColors: true,
        leftFillColorProperty: QuantumMeasurementColors.verticalPolarizationColorProperty,
        rightFillColorProperty: QuantumMeasurementColors.horizontalPolarizationColorProperty,
        visibleProperty: new BooleanProperty( true ),
        tandem: Tandem.OPT_OUT
      }
    );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, NodeOptions>()( {
      children: [
        photonDetectionProbabilityPanel,
        polarizationIndicator,
        photonPolarizationAngleControl,
        photonTestingArea,
        averagePolarizationRateTitlePanel,
        countHistogram
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );