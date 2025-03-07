// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view class for the "Bloch Sphere" screen.
 *
 * @author Agustín Vallejo
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import ExperimentDividingLine from '../../common/view/ExperimentDividingLine.js';
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
      tandem: tandem.createTandem( 'preparationArea' )
    } );
    this.addChild( preparationArea );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLineX = 350; // empirically determined
    const dividingLine = new ExperimentDividingLine( dividingLineX );
    dividingLine.top = 70;
    this.addChild( dividingLine );

    preparationArea.localBoundsProperty.link( () => {
      preparationArea.centerX = this.layoutBounds.left + ( dividingLine.left - this.layoutBounds.left ) / 2;
      preparationArea.top = this.layoutBounds.top + QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    const measurementArea = new BlochSphereMeasurementArea( model, {
      tandem: tandem.createTandem( 'measurementArea' ),
      left: dividingLineX + 40,
      top: this.layoutBounds.top + QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN
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