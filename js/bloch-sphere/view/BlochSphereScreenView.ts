// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view class for the "Bloch Sphere" screen.
 *
 * @author Agustín Vallejo
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import BlochSphereMeasurementArea from './BlochSphereMeasurementArea.js';
import BlochSpherePreparationArea from './BlochSpherePreparationArea.js';

class BlochSphereScreenView extends QuantumMeasurementScreenView {

  private readonly model: BlochSphereModel;

  public constructor( model: BlochSphereModel, tandem: Tandem ) {

    super( { tandem: tandem } );

    this.model = model;

    const preparationArea = new BlochSpherePreparationArea( model, this, {
      left: this.layoutBounds.left + QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
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

    const measurementArea = new BlochSphereMeasurementArea( model, {
      tandem: tandem.createTandem( 'measurementArea' ),
      left: dividingLineX + 20,
      top: this.layoutBounds.top + 40
    } );
    this.addChild( measurementArea );

    this.pdomPlayAreaNode.pdomOrder = [
      preparationArea,
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

export default BlochSphereScreenView;