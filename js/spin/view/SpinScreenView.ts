// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main screen view class for the "Spin" screen.
 *
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import ExperimentDividingLine from '../../common/view/ExperimentDividingLine.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SpinModel from '../model/SpinModel.js';
import SpinMeasurementArea from './SpinMeasurementArea.js';
import SpinStatePreparationArea from './SpinStatePreparationArea.js';

export default class SpinScreenView extends QuantumMeasurementScreenView {

  private readonly spinMeasurementArea: SpinMeasurementArea;

  public constructor( public readonly model: SpinModel, tandem: Tandem ) {

    super( { tandem: tandem } );

    const spinStatePreparationArea = new SpinStatePreparationArea(
      model,
      QuantumMeasurementConstants.LAYOUT_BOUNDS,
      tandem.createTandem( 'spinStatePreparationArea' )
    );
    this.addChild( spinStatePreparationArea );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLineX = 300; // empirically determined
    const dividingLine = new ExperimentDividingLine( dividingLineX );
    dividingLine.top = 70;
    this.addChild( dividingLine );

    this.spinMeasurementArea = new SpinMeasurementArea(
      model,
      this,
      QuantumMeasurementConstants.LAYOUT_BOUNDS,
      tandem.createTandem( 'spinMeasurementArea' )
    );
    this.spinMeasurementArea.left = dividingLineX;
    this.addChild( this.spinMeasurementArea );

    this.pdomPlayAreaNode.pdomOrder = [
      spinStatePreparationArea,
      this.spinMeasurementArea
    ];

    this.pdomControlAreaNode.pdomOrder = [
      this.resetAllButton
    ];

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