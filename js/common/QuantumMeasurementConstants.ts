// Copyright 2024-2025, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenView from '../../../joist/js/ScreenView.js';
import { Color } from '../../../scenery/js/imports.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementColors from './QuantumMeasurementColors.js';

const QuantumMeasurementConstants = {
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,
  COIN_SET_AREA_PROPORTION: 0.9, // Side of the explicit coin area with respect to the measurement area
  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  ALPHA: '\u03b1',
  BETA: '\u03b2',
  THETA: '\u03b8',
  PHI: '\u03c6',
  PI: '\u03c0',
  PSI: '\u03c8',
  SPIN_UP_ARROW_CHARACTER: '\u2b61',
  SPIN_DOWN_ARROW_CHARACTER: '\u2b63',
  CLASSICAL_UP_SYMBOL: '\uD83C\uDF1E\uFE0E\uFE0E', // 🌞 Sun symbol
  CLASSICAL_DOWN_SYMBOL: '\u263D', // 🌙 Moon Symbol
  KET: '\u27e9',
  HBAR: '\u210F',

  expectedPercentagePathOptions: {
    stroke: '#0a0',
    lineWidth: 5
  },

  panelOptions: {
    fill: QuantumMeasurementColors.controlPanelFillColorProperty,
    stroke: QuantumMeasurementColors.controlPanelStrokeColorProperty,
    yMargin: 10,
    xMargin: 10
  },

  CREATE_COLOR_SPAN: ( text: string, color: Color, bold = false ): string => {
    const weight = bold ? 'bold' : 'normal';
    return `<span style="font-weight: ${weight}; color: ${color.toCSS()};">${text}</span>`;
  },

  CAMERA_SOLID_SHAPE_SVG: 'M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48z'
};

quantumMeasurement.register( 'QuantumMeasurementConstants', QuantumMeasurementConstants );
export default QuantumMeasurementConstants;