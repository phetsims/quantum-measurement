// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Spin" screen.
 *
 * @author Agustín Vallejo
 */

import { Color, Line } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SpinModel from '../model/SpinModel.js';
import SpinMeasurementArea from './SpinMeasurementArea.js';
import SpinStatePreparationArea from './SpinStatePreparationArea.js';

export default class SpinScreenView extends QuantumMeasurementScreenView {

  private spinMeasurementArea: SpinMeasurementArea;

  public constructor( public readonly model: SpinModel, tandem: Tandem ) {

    super( {
      initialMockupOpacity: 0,
      tandem: tandem
    } );

    const spinStatePreparationArea = new SpinStatePreparationArea(
      model,
      this.layoutBounds,
      tandem.createTandem( 'spinStatePreparationArea' )
    );
    this.addChild( spinStatePreparationArea );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLineX = 300; // empirically determined
    const dividingLine = new Line( dividingLineX, 90, dividingLineX, 600, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineDash: [ 6, 5 ]
    } );
    this.addChild( dividingLine );

    this.spinMeasurementArea = new SpinMeasurementArea( model, this, this.layoutBounds, tandem.createTandem( 'spinMeasurementArea' ) );
    this.spinMeasurementArea.left = dividingLineX;
    this.addChild( this.spinMeasurementArea );

    model.currentExperimentProperty.notifyListenersStatic();
  }

  public override reset(): void {
    this.model.reset();
    super.reset();
    this.spinMeasurementArea.reset();
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.spinMeasurementArea.step( dt );
  }
}

quantumMeasurement.register( 'SpinScreenView', SpinScreenView );