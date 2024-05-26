// Copyright 2024, University of Colorado Boulder

/**
 * Define an importable Property that can be used to set the opacity of mockup screenshots.
 *
 * TODO: This is done for the early development phase and should eventually be removed, see https://github.com/phetsims/quantum-measurement/issues/3.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';

const mockupOpacityProperty = new NumberProperty( 0.9 );

export default mockupOpacityProperty;