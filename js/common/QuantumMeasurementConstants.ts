// Copyright 2024-2025, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { PathOptions } from '../../../scenery/js/nodes/Path.js';
import Color from '../../../scenery/js/util/Color.js';
import { SliderOptions } from '../../../sun/js/Slider.js';
import Tandem from '../../../tandem/js/Tandem.js';
import { StateDirection } from '../bloch-sphere/model/StateDirection.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementColors from './QuantumMeasurementColors.js';

// credits are shared by other related sims
const CREDITS: CreditsData = {
  leadDesign: 'Ariel Paul, Amy Rouinfar',
  softwareDevelopment: 'John Blanco, Agust\u00edn Vallejo',
  team: 'Mike Bennet, Josh Combes, Aiko Kyle, Phil Makotyn, Kathy Perkins, Ana Maria Rey, Martin Veillette',
  contributors: 'Virginia Lorenz (University of Illinois Urbana-Champaign), Gina Passante (California State ' +
                'University, Fullerton), Steven Pollock (University of Colorado Boulder)',
  qualityAssurance: 'Matthew Moore, Ashton Morris, Valentina P\u00e9rez, Nancy Salpepi, Kathryn Woessner',
  graphicArts: '',
  soundDesign: '',
  thanks: 'We gratefully acknowledge support from NSF Quantum Leap Challenge Institute Award OMA - 2016244 through its funding of Q-SEnSE. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the authors and do not necessarily reflect the views of the National Science Foundation.'
};

const DEFAULT_CONTROL_SLIDER_OPTIONS: SliderOptions = {
  trackSize: new Dimension2( 150, 1 ),
  thumbSize: new Dimension2( 12, 26 ),
  majorTickLength: 10,
  tickLabelSpacing: 4,
  majorTickLineWidth: 1.5,
  minorTickStroke: 'grey',
  minorTickLength: 8,
  trackFillEnabled: Color.BLACK
};

const EXPECTED_PERCENTAGE_PATH_OPTIONS: PathOptions = {
  stroke: QuantumMeasurementColors.expectedPercentageFillProperty,
  lineWidth: 3
};

const PANEL_OPTIONS = {
  fill: QuantumMeasurementColors.controlPanelFillProperty,
  stroke: QuantumMeasurementColors.controlPanelStrokeProperty,
  yMargin: 10,
  xMargin: 10
};

// Normal fonts
const HEADER_FONT = new PhetFont( 20 );
const TITLE_FONT = new PhetFont( 16 );
const CONTROL_FONT = new PhetFont( 14 );
const SMALL_LABEL_FONT = new PhetFont( 12 );
const TINY_LABEL_FONT = new PhetFont( 8 );

// Bold fonts
const SCENE_SELECTOR_FONT = new PhetFont( { size: 26, weight: 'bold' } );
const BOLD_HEADER_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const BOLD_TITLE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const BOLD_CONTROL_FONT = new PhetFont( { size: 14, weight: 'bold' } );

const QuantumMeasurementConstants = {
  LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,
  CREDITS: CREDITS,
  COIN_SET_AREA_PROPORTION: 0.9, // Side of the explicit coin area with respect to the measurement area
  SCREEN_VIEW_X_MARGIN: 10,
  SCREEN_VIEW_Y_MARGIN: 10,
  SPIN_UP_ARROW_CHARACTER: '<b>\u2b61</b>',
  SPIN_DOWN_ARROW_CHARACTER: '<b>\u2b63</b>',
  CLASSICAL_UP_SYMBOL: '\uD83C\uDF1E\uFE0E\uFE0E', // 🌞 Sun symbol
  CLASSICAL_DOWN_SYMBOL: '\u263D', // 🌙 Moon Symbol
  KET: '\u27e9',
  HBAR: '\u210F',

  MAX_PRECESSION_RATE: Math.PI / 2, // in radians per second

  // common options for checkboxes
  CHECKBOX_BOX_WIDTH: 16,

  EXPECTED_PERCENTAGE_PATH_OPTIONS: EXPECTED_PERCENTAGE_PATH_OPTIONS,

  PANEL_OPTIONS: PANEL_OPTIONS,

  PLUS_DIRECTIONS: [
    StateDirection.X_PLUS,
    StateDirection.Y_PLUS,
    StateDirection.Z_PLUS
  ],

  CREATE_COLOR_SPAN: ( text: string, color: Color, bold = false ): string => {
    const weight = bold ? 'bold' : 'normal';
    return `<span style="font-weight: ${weight}; color: ${color.toCSS()};">${text}</span>`;
  },

  DEFAULT_CONTROL_SLIDER_OPTIONS: DEFAULT_CONTROL_SLIDER_OPTIONS,

  TITLE_AND_SLIDER_SPACING: 5,

  NUMBER_CONTROL_TITLE_OPTIONS: {
    font: CONTROL_FONT,
    maxWidth: 250, // empirically determined to work well with layout
    tandem: Tandem.OPT_OUT
  },

  // Normal fonts
  HEADER_FONT: HEADER_FONT,
  TITLE_FONT: TITLE_FONT,
  CONTROL_FONT: CONTROL_FONT,
  SMALL_LABEL_FONT: SMALL_LABEL_FONT,
  TINY_LABEL_FONT: TINY_LABEL_FONT,

  // Bold fonts
  SCENE_SELECTOR_FONT: SCENE_SELECTOR_FONT,
  BOLD_HEADER_FONT: BOLD_HEADER_FONT,
  BOLD_TITLE_FONT: BOLD_TITLE_FONT,
  BOLD_CONTROL_FONT: BOLD_CONTROL_FONT,

  CAMERA_SOLID_SHAPE_SVG: 'M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48z'
};

quantumMeasurement.register( 'QuantumMeasurementConstants', QuantumMeasurementConstants );
export default QuantumMeasurementConstants;