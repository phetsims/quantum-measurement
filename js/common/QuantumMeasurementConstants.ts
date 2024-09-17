// Copyright 2024, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import quantumMeasurement from '../quantumMeasurement.js';

const QuantumMeasurementConstants = {
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  ALPHA: '\u03b1',
  BETA: '\u03b2',
  SPIN_UP_ARROW_CHARACTER: '\u2b61',
  SPIN_DOWN_ARROW_CHARACTER: '\u2b63',
  KET: '\u27e9',

  PREPARING_TO_BE_MEASURED_TIME: 1, // in seconds
  HOLLYWOODED_MAX_COINS: 900, //
  HOLLYWOODED_MAX_COINS_RADII: 2
  /**
   * 20 400
   * 25 625
   * 30 900
   * 35 1225
   * 40 1600
   * 50 2500
   * 60 3600
   * 70 4900
   * 90 8100
   * 100  10000
   */
};

quantumMeasurement.register( 'QuantumMeasurementConstants', QuantumMeasurementConstants );
export default QuantumMeasurementConstants;