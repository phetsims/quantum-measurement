// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, HBoxOptions, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import PhotonPolarizationAngleControl from './PhotonPolarizationAngleControl.js';
import PhotonTestingArea from './PhotonTestingArea.js';

type SelfOptions = EmptySelfOptions;
type PhotonsExperimentSceneViewOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class PhotonsExperimentSceneView extends HBox {

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonsExperimentSceneViewOptions ) {

    const photonPolarizationAngleControl = new PhotonPolarizationAngleControl(
      model.laser.presetPolarizationDirectionProperty,
      model.laser.customPolarizationAngleProperty,
      {
        tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleControl' )
      }
    );

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

    const leftProperty = new NumberProperty( 10 );
    const rightProperty = new NumberProperty( 30 );
    const countHistogram = new QuantumMeasurementHistogram( leftProperty, rightProperty, new BooleanProperty( true ),
      [
        new RichText( 'V', { font: new PhetFont( { size: 17, weight: 'bold' } ), fill: QuantumMeasurementColors.verticalPolarizationColorProperty } ),
        new RichText( 'H', { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
      ],
      {
        displayMode: 'fraction',
        orientation: 'horizontal',
        matchLabelColors: true,
        leftFillColorProperty: QuantumMeasurementColors.verticalPolarizationColorProperty,
        rightFillColorProperty: QuantumMeasurementColors.horizontalPolarizationColorProperty,
        visibleProperty: new BooleanProperty( true ),
        tandem: Tandem.OPT_OUT
      } );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, HBoxOptions>()( {
      children: [ photonPolarizationAngleControl, photonTestingArea, testRect3, countHistogram ],
      spacing: 3,
      align: 'bottom'
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );