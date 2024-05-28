// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Bloch Sphere" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import BlochSphereModel from 'model/BlochSphereModel.js';
import blochSphereScreenMockup_png from '../../../images/blochSphereScreenMockup_png.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Image } from '../../../../scenery/js/imports.js';
import ScreenView from '../../../../joist/js/ScreenView.js';

export default class BlochSphereScreenView extends QuantumMeasurementScreenView {

  public constructor( model: BlochSphereModel, tandem: Tandem ) {

    super( {
      mockupImage: new Image( blochSphereScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / blochSphereScreenMockup_png.width
      } ),
      tandem: tandem
    } );

  }
}

quantumMeasurement.register( 'BlochSphereScreenView', BlochSphereScreenView );