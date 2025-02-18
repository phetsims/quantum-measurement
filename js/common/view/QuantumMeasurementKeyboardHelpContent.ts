// Copyright 2025, University of Colorado Boulder

/**
 * QuantumMeasurementKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimeControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class QuantumMeasurementKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // sections in the left column
    const leftSections = [
      new TimeControlsKeyboardHelpSection(),
      new SliderControlsKeyboardHelpSection()
    ];

    // sections in the right column
    const rightSections = [
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}

quantumMeasurement.register( 'QuantumMeasurementKeyboardHelpContent', QuantumMeasurementKeyboardHelpContent );