// Copyright 2024-2025, University of Colorado Boulder

/**
 * ProbabilityValueControl is a UI component that allows the user to control the value of a NumberProperty whose value
 * ranges from 0 to 1. The control includes horizontal slider, arrow controls on each side of the slider for
 * fine-grained control, and a title that goes above it all.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions, NumberControlSliderOptions } from '../../../../scenery-phet/js/NumberControl.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementConstants from '../QuantumMeasurementConstants.js';

const TICK_MARK_FONT = QuantumMeasurementConstants.CONTROL_FONT;
const RANGE = new Range( 0, 1 );

type SelfOptions = EmptySelfOptions;
type ProbabilityValueControlOptions = SelfOptions & NumberControlOptions;

class ProbabilityValueControl extends NumberControl {

  public constructor( titleNode: Node,
                      probabilityProperty: NumberProperty,
                      tandem: Tandem,
                      providedOptions?: ProbabilityValueControlOptions ) {

    const sliderStep = 0.05;

    const options = optionize<ProbabilityValueControlOptions, SelfOptions, NumberControlOptions>()( {

      // Creating our own layout function because NumberControl doesn't have a native support for
      //  < ------|------ >, and we want to use a Node for the title, which isn't currently supported.
      layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => {
        assert && assert( leftArrowButton && rightArrowButton );
        const buttonsAndSlider = new HBox( {
          spacing: 8,
          resize: false, // prevent sliders from causing a resize when thumb is at min or max
          children: [ leftArrowButton!, slider, rightArrowButton! ]
        } );
        return new VBox( {
          children: [ titleNode, buttonsAndSlider ],
          spacing: QuantumMeasurementConstants.TITLE_AND_SLIDER_SPACING,
          align: 'center'
        } );
      },
      numberDisplayOptions: { // Although we don't use a numberDisplay, these options are for a11y
        decimalPlaces: 2,
        tandem: Tandem.OPT_OUT
      },
      titleNodeOptions: {
        tandem: Tandem.OPT_OUT
      },
      sliderOptions: combineOptions<NumberControlSliderOptions>( {
        constrainValue: ( number: number ) => roundToInterval( number, sliderStep ),
        keyboardStep: sliderStep,
        shiftKeyboardStep: sliderStep / 5,
        pageKeyboardStep: sliderStep * 5,
        minorTickSpacing: RANGE.max * 0.25,
        majorTicks: [
          { value: RANGE.min, label: new Text( RANGE.min.toString(), { font: TICK_MARK_FONT } ) },
          { value: RANGE.max, label: new Text( RANGE.max.toString(), { font: TICK_MARK_FONT } ) }
        ]
      }, QuantumMeasurementConstants.DEFAULT_CONTROL_SLIDER_OPTIONS as NumberControlSliderOptions ),
      delta: sliderStep / 5,
      tandem: tandem
    }, providedOptions );

    super( titleNode, probabilityProperty, RANGE, options );
  }
}

quantumMeasurement.register( 'ProbabilityValueControl', ProbabilityValueControl );

export default ProbabilityValueControl;