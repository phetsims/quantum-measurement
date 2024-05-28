// Copyright 2024, University of Colorado Boulder

import HSlider from '../../../sun/js/HSlider.js';
import mockupOpacityProperty from './mockupOpacityProperty.js';
import Range from '../../../dot/js/Range.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementConstants from './QuantumMeasurementConstants.js';
import { Image } from '../../../scenery/js/imports.js';
import ScreenView from '../../../joist/js/ScreenView.js';

/**
 * Define a slider that can be added to a screen view and will control the opacity of a Property that is used to display
 * mockups for the screens.
 *
 * TODO: This is done for the early development phase and should eventually be removed, see https://github.com/phetsims/quantum-measurement/issues/3.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

export default class MockupOpacitySlider extends HSlider {

  public constructor( mockupImage: Image ) {

    super( mockupOpacityProperty, new Range( 0, 1 ), {
      left: QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN,
      bottom: ScreenView.DEFAULT_LAYOUT_BOUNDS.height - QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
      thumbSize: new Dimension2( 10, 20 ),
      trackSize: new Dimension2( 50, 3 )
    } );

    // Update the mockup opacity.
    mockupOpacityProperty.link( opacity => {
      mockupImage.opacity = opacity;
    } );
  }
}

quantumMeasurement.register( 'MockupOpacitySlider', MockupOpacitySlider );