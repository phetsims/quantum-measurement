// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, RichText } from '../../../../scenery/js/imports.js';
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
      model.laser.presetPolarizationDirectionProperty,
      model.laser.customPolarizationAngleProperty,
      {

        // Position empirically determined to match design doc.
        left: 55,
        top: 90,

        tandem: providedOptions.tandem.createTandem( 'photonDetectionProbabilityPanel' )
      }
    );

    const photonPolarizationAngleControl = new PhotonPolarizationAngleControl(
      model.laser.presetPolarizationDirectionProperty,
      model.laser.customPolarizationAngleProperty,
      {
        left: INSET,
        bottom: QuantumMeasurementConstants.LAYOUT_BOUNDS.bottom - INSET,
        tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleControl' )
      }
    );

    // Derive the polarization angle from the model Properties.
    const polarizationAngleProperty = new DerivedProperty( [
      model.laser.customPolarizationAngleProperty,
      model.laser.presetPolarizationDirectionProperty
    ], ( customPolarizationAngle, presetPolarizationDirection ) => {
      return presetPolarizationDirection === 'vertical' ? 90 :
             presetPolarizationDirection === 'horizontal' ? 0 :
             presetPolarizationDirection === 'fortyFiveDegrees' ? 45 :
             customPolarizationAngle;
    } );

    const photonTestingArea = new PhotonTestingArea( model, {

      // center position empirically determined to match design doc
      center: new Vector2( 420, 335 ),

      tandem: providedOptions.tandem.createTandem( 'photonTestingArea' )
    } );

    const polarizationIndicator = new PolarizationPlaneRepresentation( polarizationAngleProperty, {
      scale: 1.5,
      centerX: photonDetectionProbabilityPanel.centerX,
      centerY: photonTestingArea.centerY,
      tandem: providedOptions.tandem.createTandem( 'polarizationIndicator' )
    } );

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
      } );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, NodeOptions>()( {
      children: [
        photonDetectionProbabilityPanel,
        polarizationIndicator,
        photonPolarizationAngleControl,
        photonTestingArea,
        countHistogram
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );