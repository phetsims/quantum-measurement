// Copyright 2024, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import { Color } from '../../../scenery/js/imports.js';
import quantumMeasurement from '../quantumMeasurement.js';

const QuantumMeasurementConstants = {
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,
  COIN_SET_AREA_PROPORTION: 0.9, // Side of the explicit coin area with respect to the measurement area
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  ALPHA: '\u03b1',
  BETA: '\u03b2',
  SPIN_UP_ARROW_CHARACTER: '\u2b61',
  SPIN_DOWN_ARROW_CHARACTER: '\u2b63',
  CLASSICAL_UP_SYMBOL: '\uD83C\uDF1E\uFE0E\uFE0E', // 🌞 Sun symbol
  CLASSICAL_DOWN_SYMBOL: '\u263D', // 🌙 Moon Symbol
  KET: '\u27e9',
  HBAR: '\u210F',

  CREATE_COLOR_SPAN: ( text: string, color: Color, bold = false ): string => {
    const weight = bold ? 'bold' : 'normal';
    return `<span style="font-weight: ${weight}; color: ${color.toCSS()};">${text}</span>`;
  }
};

quantumMeasurement.register( 'QuantumMeasurementConstants', QuantumMeasurementConstants );
export default QuantumMeasurementConstants;