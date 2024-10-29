// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, HBoxOptions, Rectangle, RichText, VBox } from '../../../../scenery/js/imports.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import PhotonDetectionProbabilityPanel from './PhotonDetectionProbabilityPanel.js';
import PhotonPolarizationAngleControl from './PhotonPolarizationAngleControl.js';
import PhotonTestingArea from './PhotonTestingArea.js';
import PolarizationPlaneRepresentation from './PolarizationPlaneRepresentation.js';

type SelfOptions = EmptySelfOptions;
type PhotonsExperimentSceneViewOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class PhotonsExperimentSceneView extends HBox {

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonsExperimentSceneViewOptions ) {

    const photonDetectionProbabilityPanel = new PhotonDetectionProbabilityPanel(
      model.laser.presetPolarizationDirectionProperty,
      model.laser.customPolarizationAngleProperty
    );

    const photonPolarizationAngleControl = new PhotonPolarizationAngleControl(
      model.laser.presetPolarizationDirectionProperty,
      model.laser.customPolarizationAngleProperty,
      {
        tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleControl' )
      }
    );

    const polarizationAngleProperty = new DerivedProperty( [
      model.laser.customPolarizationAngleProperty,
      model.laser.presetPolarizationDirectionProperty
    ], ( customPolarizationAngle, presetPolarizationDirection ) => {
      return presetPolarizationDirection === 'vertical' ? 90 :
             presetPolarizationDirection === 'horizontal' ? 0 :
             presetPolarizationDirection === 'fortyFiveDegrees' ? 45 :
             customPolarizationAngle;
    } );

    const polarizationPlane = new PolarizationPlaneRepresentation(
      polarizationAngleProperty, { scale: 2, tandem: providedOptions.tandem.createTandem( 'polarizationPlane' ) }
    );
    const polarizationAngleControlBox = new VBox( {
      children: [
        photonDetectionProbabilityPanel,
        polarizationPlane,
        new Slider( polarizationPlane.xAxisOffsetAngleProperty, new Range( 0, 2 * Math.PI ), {
          tandem: Tandem.OPT_OUT
        } ),
        photonPolarizationAngleControl
      ],
      align: 'center'
    } );

    const photonTestingArea = new PhotonTestingArea( model, {
      tandem: providedOptions.tandem.createTandem( 'photonTestingArea' )
    } );

    // TODO: These rectangles are placeholders for working on layout, see https://github.com/phetsims/quantum-measurement/issues/52
    const testRectHeight = 510;
    const testRect3 = new Rectangle( 0, 0, 180, testRectHeight, {
      fill: new Color( '#44673A' ),
      stroke: new Color( '#44673A' ).darkerColor( 0.5 ),
      lineWidth: 2,
      opacity: 0.1
    } );

    const leftProperty = model.laser.emissionMode === 'singlePhoton' ? model.verticalPolarizationDetector.detectionCountProperty : model.verticalPolarizationDetector.detectionRateProperty;
    const rightProperty = model.laser.emissionMode === 'singlePhoton' ? model.horizontalPolarizationDetector.detectionCountProperty : model.horizontalPolarizationDetector.detectionRateProperty;
    const countHistogram = new QuantumMeasurementHistogram( leftProperty, rightProperty, new BooleanProperty( true ),
      [
        new RichText( 'V', { font: new PhetFont( { size: 17, weight: 'bold' } ), fill: QuantumMeasurementColors.verticalPolarizationColorProperty } ),
        new RichText( 'H', { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
      ],
      {
        displayMode: model.laser.emissionMode === 'singlePhoton' ? 'fraction' : 'rate',
        orientation: 'horizontal',
        matchLabelColors: true,
        leftFillColorProperty: QuantumMeasurementColors.verticalPolarizationColorProperty,
        rightFillColorProperty: QuantumMeasurementColors.horizontalPolarizationColorProperty,
        visibleProperty: new BooleanProperty( true ),
        tandem: Tandem.OPT_OUT
      } );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, HBoxOptions>()( {
      children: [ polarizationAngleControlBox, photonTestingArea, testRect3, countHistogram ],
      spacing: 3,
      align: 'bottom'
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );