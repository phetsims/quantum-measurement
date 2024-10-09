// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Spin" screen.
 *
 * @author Agustín Vallejo
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import { Color, Image, Line } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import spinScreenMockup_png from '../../../images/spinScreenMockup_png.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SpinModel from '../model/SpinModel.js';
import SpinMeasurementArea from './SpinMeasurementArea.js';
import SpinStatePreparationArea from './SpinStatePreparationArea.js';

export default class SpinScreenView extends QuantumMeasurementScreenView {

  public constructor( model: SpinModel, tandem: Tandem ) {

    super( {
      initialMockupOpacity: 0,
      mockupImage: new Image( spinScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / spinScreenMockup_png.width
      } ),
      tandem: tandem
    } );

    const spinStatePreparationArea = new SpinStatePreparationArea( model.blochSphere, tandem.createTandem( 'spinStatePreparationArea' ) );
    this.addChild( spinStatePreparationArea );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLineX = 300; // empirically determined
    const dividingLine = new Line( dividingLineX, 90, dividingLineX, 600, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineDash: [ 6, 5 ]
    } );
    this.addChild( dividingLine );

    const spinMeasurementArea = new SpinMeasurementArea( model, this, tandem.createTandem( 'spinMeasurementArea' ) );
    spinMeasurementArea.centerX = 2 * dividingLineX;
    this.addChild( spinMeasurementArea );

    // TODO: This is a temporary workaround to make the mockup opacity work. We need to refactor this to use the mockup https://github.com/phetsims/quantum-measurement/issues/53
    this.mockupOpacityProperty && this.mockupOpacityProperty.link( opacity => {
      spinStatePreparationArea.opacity = 1 - opacity;
      spinMeasurementArea.opacity = 1 - opacity;
    } );
  }

  public override reset(): void {
    super.reset();
  }
}

quantumMeasurement.register( 'SpinScreenView', SpinScreenView );