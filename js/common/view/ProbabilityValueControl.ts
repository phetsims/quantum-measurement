// Copyright 2024-2025, University of Colorado Boulder

/**
 * ProbabilityValueControl is a UI component that allows the user to control the value of a NumberProperty whose value
 * ranges from 0 to 1. The control includes horizontal slider, arrow controls on each side of the slider for
 * fine-grained control, and a title that goes above it all.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const TITLE_FONT = new PhetFont( 16 );
const TICK_MARK_FONT = new PhetFont( 14 );
const RANGE = new Range( 0, 1 );
const BUTTON_CHANGE_AMOUNT = 0.05;

type SelfOptions = EmptySelfOptions;
type ProbabilityValueControlOptions = SelfOptions & NumberControlOptions;

export default class ProbabilityValueControl extends NumberControl {

  public constructor( titleStringProperty: TReadOnlyProperty<string> | string,
                      probabilityProperty: NumberProperty,
                      tandem: Tandem,
                      providedOptions?: ProbabilityValueControlOptions
                      ) {

    super( titleStringProperty, probabilityProperty, RANGE, optionize<ProbabilityValueControlOptions, SelfOptions, NumberControlOptions>()( {

      // REVIEW: Add documentation describing why you need to create provide your own layoutFunction.
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        assert && assert( leftArrowButton && rightArrowButton );
        return new VBox( {
          children: [
            titleNode,
            new HBox( {
              spacing: 8,
              resize: false, // prevent sliders from causing a resize when thumb is at min or max
              children: [ leftArrowButton!, slider, rightArrowButton! ]
            } )
          ]
        } );
      },
      numberDisplayOptions: { // Although we don't use a numberDisplay, these options are for a11y
        decimalPlaces: 2
      },
      useRichText: true,
      titleNodeOptions: {
        font: TITLE_FONT,
        maxWidth: 250 // empirically determined to work well with layout
      },
      sliderOptions: {
        trackSize: new Dimension2( 150, 1 ),
        thumbSize: new Dimension2( 12, 26 ),
        majorTickLength: 10,
        tickLabelSpacing: 4,
        keyboardStep: BUTTON_CHANGE_AMOUNT,
        shiftKeyboardStep: BUTTON_CHANGE_AMOUNT / 5,
        pageKeyboardStep: BUTTON_CHANGE_AMOUNT * 4,
        constrainValue: ( number: number ) => toFixedNumber( number, 2 ),
        majorTicks: [
          { value: RANGE.min, label: new Text( RANGE.min.toString(), { font: TICK_MARK_FONT } ) },
          { value: RANGE.max, label: new Text( RANGE.max.toString(), { font: TICK_MARK_FONT } ) }
        ]
      },
      delta: BUTTON_CHANGE_AMOUNT,
      tandem: tandem
    }, providedOptions ) );
  }
}

quantumMeasurement.register( 'ProbabilityValueControl', ProbabilityValueControl );