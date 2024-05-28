// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Spin" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import SpinModel from '../model/SpinModel.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import spinScreenMockup_png from '../../../images/spinScreenMockup_png.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Image } from '../../../../scenery/js/imports.js';
import ScreenView from '../../../../joist/js/ScreenView.js';

export default class SpinScreenView extends QuantumMeasurementScreenView {

  public constructor( model: SpinModel, tandem: Tandem ) {

    super( {
      mockupImage: new Image( spinScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / spinScreenMockup_png.width
      } ),
      tandem: tandem
    } );

  }
}

quantumMeasurement.register( 'SpinScreenView', SpinScreenView );