// Copyright 2024, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../quantumMeasurement.js';
import ScreenView from '../../../joist/js/ScreenView.js';

const QuantumMeasurementConstants = {
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  ALPHA: '\u03b1',
  BETA: '\u03b2',
  SPIN_UP_ARROW_CHARACTER: '\u2b61',
  SPIN_DOWN_ARROW_CHARACTER: '\u2b63',
  KET: '\u27e9'
};

quantumMeasurement.register( 'QuantumMeasurementConstants', QuantumMeasurementConstants );
export default QuantumMeasurementConstants;