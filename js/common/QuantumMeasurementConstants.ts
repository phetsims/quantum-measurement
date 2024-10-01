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
  CLASSICAL_UP_SYMBOL: '\uD83C\uDF1E\uFE0E\uFE0E', // 🌞 Sun symbol
  CLASSICAL_DOWN_SYMBOL: '\u263D', // 🌙 Moon Symbol
  KET: '\u27e9',
  COIN_SET_AREA_PROPORTION: 0.9, // Side of the explicit coin area with respect to the measurement area

  HOLLYWOODED_MAX_COINS_RADII: 2,
  HOLLYWOODED_MAX_COINS: 121 // This number should be used when *showing* fewer coins than the max allowed.
  /**
   * TODO: Temporary list of square numbers for the hollywooded number of coins above. https://github.com/phetsims/quantum-measurement/issues/39
   * N  N*N
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