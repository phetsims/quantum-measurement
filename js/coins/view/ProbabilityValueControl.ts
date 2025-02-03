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
import Utils from '../../../../dot/js/Utils.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const TITLE_FONT = new PhetFont( 16 );
const TICK_MARK_FONT = new PhetFont( 14 );
const RANGE = new Range( 0, 1 );
const BUTTON_CHANGE_AMOUNT = 0.1;

export default class ProbabilityValueControl extends NumberControl {

  public constructor( titleStringProperty: TReadOnlyProperty<string> | string,
                      probabilityProperty: NumberProperty,
                      tandem: Tandem ) {

    super( titleStringProperty, probabilityProperty, RANGE, {
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
      useRichText: true,
      titleNodeOptions: {
        font: TITLE_FONT
      },
      sliderOptions: {
        trackSize: new Dimension2( 150, 1 ),
        thumbSize: new Dimension2( 12, 26 ),
        majorTickLength: 10,
        tickLabelSpacing: 4,
        constrainValue: ( number: number ) => Utils.toFixedNumber( number, 2 ),
        majorTicks: [
          { value: RANGE.min, label: new Text( RANGE.min.toString(), { font: TICK_MARK_FONT } ) },
          { value: RANGE.max, label: new Text( RANGE.max.toString(), { font: TICK_MARK_FONT } ) }
        ]
      },
      delta: BUTTON_CHANGE_AMOUNT,
      tandem: tandem
    } );
  }
}

quantumMeasurement.register( 'ProbabilityValueControl', ProbabilityValueControl );