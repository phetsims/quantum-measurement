// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Bloch Sphere" screen.
 *
 * @author Agustín Vallejo
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Image, Line, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import blochSphereScreenMockup_png from '../../../images/blochSphereScreenMockup_png.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlochSphereScene } from '../model/BlochSphereScene.js';
import BlochSphereMeasurementArea from './BlochSphereMeasurementArea.js';
import BlochSpherePreparationArea from './BlochSpherePreparationArea.js';

export default class BlochSphereScreenView extends QuantumMeasurementScreenView {

  public constructor( model: BlochSphereModel, tandem: Tandem ) {

    super( {
      initialMockupOpacity: 0,
      mockupImage: new Image( blochSphereScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / blochSphereScreenMockup_png.width
      } ),
      tandem: tandem
    } );

    const preparationArea = new BlochSpherePreparationArea( model, this, {
      left: this.layoutBounds.left + 20,
      top: this.layoutBounds.top + 20,
      tandem: tandem.createTandem( 'preparationArea' )
    } );
    this.addChild( preparationArea );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLineX = 350; // empirically determined
    const dividingLine = new Line( dividingLineX, 90, dividingLineX, 600, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineDash: [ 6, 5 ]
    } );
    this.addChild( dividingLine );

    const comboBoxItems: ComboBoxItem<BlochSphereScene>[] = BlochSphereScene.enumeration.values.map( scene => {
      return {
        value: scene,
        createNode: () => new Text( scene.description, { font: new PhetFont( 16 ) } )
      };
    } );

    const sceneSelectionComboBox = new ComboBox( model.selectedSceneProperty, comboBoxItems, this, {
      tandem: tandem.createTandem( 'sceneSelectionComboBox' )
    } );

    const measurementAreaTitleAndComboBox = new VBox( {
      children: [
        new Text( 'Spin Measurement', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),
        sceneSelectionComboBox
      ],
      spacing: 10,
      centerX: this.layoutBounds.centerX + 150,
      top: this.layoutBounds.top + 20
    } );

    this.addChild( measurementAreaTitleAndComboBox );

    const measurementArea = new BlochSphereMeasurementArea( model, {
      tandem: tandem.createTandem( 'measurementArea' ),
      left: dividingLineX + 20,
      top: measurementAreaTitleAndComboBox.bottom + 20
    } );
    this.addChild( measurementArea );

  }

  public override reset(): void {
    super.reset();
  }
}

quantumMeasurement.register( 'BlochSphereScreenView', BlochSphereScreenView );