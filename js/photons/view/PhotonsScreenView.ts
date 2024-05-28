// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsModel from '../model/PhotonsModel.js';
import photonsScreenMockup_png from '../../../images/photonsScreenMockup_png.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import { Image } from '../../../../scenery/js/imports.js';
import ScreenView from '../../../../joist/js/ScreenView.js';

export default class PhotonsScreenView extends QuantumMeasurementScreenView {

  public constructor( model: PhotonsModel, tandem: Tandem ) {

    super( {
      mockupImage: new Image( photonsScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / photonsScreenMockup_png.width
      } ),
      tandem: tandem
    } );

  }
}

quantumMeasurement.register( 'PhotonsScreenView', PhotonsScreenView );