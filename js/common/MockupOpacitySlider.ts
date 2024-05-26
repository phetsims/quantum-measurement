// Copyright 2024, University of Colorado Boulder

import HSlider from '../../../sun/js/HSlider.js';
import mockupOpacityProperty from './mockupOpacityProperty.js';
import Range from '../../../dot/js/Range.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import quantumMeasurement from '../quantumMeasurement.js';

/**
 * Define a slider that can be added to a screen view and will control the opacity of a Property that is used to display
 * mockups for the screens.
 *
 * TODO: This is done for the early development phase and should eventually be removed, see https://github.com/phetsims/quantum-measurement/issues/3.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

export default class MockupOpacitySlider extends HSlider {

  public constructor( resetAllButtonBounds: Bounds2 ) {
    super( mockupOpacityProperty, new Range( 0, 1 ), {
      left: 10,
      bottom: resetAllButtonBounds.bottom,
      thumbSize: new Dimension2( 10, 20 ),
      trackSize: new Dimension2( 50, 3 )
    } );
  }

}

quantumMeasurement.register( 'MockupOpacitySlider', MockupOpacitySlider );