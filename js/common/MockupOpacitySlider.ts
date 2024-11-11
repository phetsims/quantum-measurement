// Copyright 2024, University of Colorado Boulder

/**
 * Define a slider that can be added to a screen view and will control the opacity of a Property that is used to display
 * mockups for the screens.
 *
 * TODO: This is done for the early development phase and should eventually be removed, see https://github.com/phetsims/quantum-measurement/issues/3.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import { Image } from '../../../scenery/js/imports.js';
import HSlider from '../../../sun/js/HSlider.js';
import Tandem from '../../../tandem/js/Tandem.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementConstants from './QuantumMeasurementConstants.js';

export default class MockupOpacitySlider extends HSlider {

  public constructor( opacityProperty: NumberProperty, mockupImage: Image ) {

    super( opacityProperty, new Range( 0, 1 ), {
      right: QuantumMeasurementConstants.LAYOUT_BOUNDS.width - 65,
      bottom: ScreenView.DEFAULT_LAYOUT_BOUNDS.height,
      thumbSize: new Dimension2( 10, 20 ),
      trackSize: new Dimension2( 50, 3 ),
      tandem: Tandem.OPT_OUT
    } );

    // Update the mockup opacity.
    opacityProperty.link( opacity => {
      mockupImage.opacity = opacity;
    } );
  }
}

quantumMeasurement.register( 'MockupOpacitySlider', MockupOpacitySlider );