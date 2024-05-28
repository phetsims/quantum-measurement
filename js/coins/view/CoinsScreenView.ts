// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsModel from 'model/CoinsModel.js';
import coinsScreenMockup_png from '../../../images/coinsScreenMockup_png.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Image } from '../../../../scenery/js/imports.js';
import ScreenView from '../../../../joist/js/ScreenView.js';

export default class CoinsScreenView extends QuantumMeasurementScreenView {

  public constructor( model: CoinsModel, tandem: Tandem ) {

    super( {
      mockupImage: new Image( coinsScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / coinsScreenMockup_png.width
      } ),
      tandem: tandem
    } );

  }
}

quantumMeasurement.register( 'CoinsScreenView', CoinsScreenView );