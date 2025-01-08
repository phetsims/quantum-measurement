// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view class for the "Bloch Sphere" screen.
 *
 * @author Agustín Vallejo
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import BlochSphereMeasurementArea from './BlochSphereMeasurementArea.js';
import BlochSpherePreparationArea from './BlochSpherePreparationArea.js';

export default class BlochSphereScreenView extends QuantumMeasurementScreenView {

  private readonly model: BlochSphereModel;

  public constructor( model: BlochSphereModel, tandem: Tandem ) {

    super( { tandem: tandem } );

    this.model = model;

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

    const showMagneticFieldCheckbox = new Checkbox(
      model.showMagneticFieldProperty,
      new Text( 'Show Magnetic Field', { font: new PhetFont( { size: 16 } ) } ),
      {
        tandem: tandem.createTandem( 'showMagneticFieldCheckbox' ),
        spacing: 10,
        centerX: this.layoutBounds.centerX + 150,
        top: this.layoutBounds.top + 20
      } );
    this.addChild( showMagneticFieldCheckbox );


    const measurementArea = new BlochSphereMeasurementArea( model, {
      tandem: tandem.createTandem( 'measurementArea' ),
      left: dividingLineX + 20,
      top: showMagneticFieldCheckbox.bottom + 20
    } );
    this.addChild( measurementArea );

    this.pdomPlayAreaNode.pdomOrder = [
      preparationArea,
      showMagneticFieldCheckbox,
      measurementArea
    ];

    this.pdomControlAreaNode.pdomOrder = [
      this.resetAllButton
    ];
  }

  public override reset(): void {
    this.model.reset();
    super.reset();
  }
}

quantumMeasurement.register( 'BlochSphereScreenView', BlochSphereScreenView );