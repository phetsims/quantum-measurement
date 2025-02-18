// Copyright 2025, University of Colorado Boulder

/**
 * QuantumMeasurementKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TimeControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export type QuantumMeasurementKeyboardHelpContentOptions = {
  includeTimeControlsKeyboardHelp?: boolean;
};

export default class QuantumMeasurementKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor( providedOptions?: QuantumMeasurementKeyboardHelpContentOptions ) {

    const options = combineOptions<QuantumMeasurementKeyboardHelpContentOptions>( {
      includeTimeControlsKeyboardHelp: false
    }, providedOptions );

    // sections in the left column
    let leftSections;
    if ( options.includeTimeControlsKeyboardHelp ) {
      leftSections = [
        new TimeControlsKeyboardHelpSection(),
        new SliderControlsKeyboardHelpSection()
      ];
    }
    else {
      leftSections = [
        new SliderControlsKeyboardHelpSection()
      ];
    }

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