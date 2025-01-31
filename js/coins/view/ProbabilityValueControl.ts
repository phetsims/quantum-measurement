// Copyright 2024, University of Colorado Boulder


/**
 * ProbabilityValueControl is a UI component that allows the user to control the value of a NumberProperty whose value
 * ranges from 0 to 1. The control includes horizontal slider, arrow controls on each side of the slider for
 * fine-grained control, and a title that goes above it all.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import ArrowButton, { ArrowButtonOptions } from '../../../../sun/js/buttons/ArrowButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const TITLE_FONT = new PhetFont( 16 );
const TICK_MARK_FONT = new PhetFont( 14 );
const RANGE = new Range( 0, 1 );
const BUTTON_CHANGE_AMOUNT = 0.1;

export default class ProbabilityValueControl extends VBox {

  public constructor( titleStringProperty: TReadOnlyProperty<string> | string,
                      probabilityProperty: NumberProperty,
                      tandem: Tandem ) {

    const title = new RichText( titleStringProperty, {
      font: TITLE_FONT,
      maxWidth: 250
    } );

    // Create a slider surrounded by two buttons to control the probability value.
    const arrowButtonOptions = {
      size: new Dimension2( 20, 20 ),
      xMargin: 4,
      yMargin: 4,
      cornerRadius: 2
    };
    const leftArrowButton = new ArrowButton(
      'left',
      () => { probabilityProperty.value = Math.max( probabilityProperty.value - BUTTON_CHANGE_AMOUNT, 0 ); },
      combineOptions<ArrowButtonOptions>( {
        enabledProperty: new DerivedProperty( [ probabilityProperty ], probability => probability > 0 ),
        tandem: tandem.createTandem( 'leftArrowButton' )
      }, arrowButtonOptions )
    );
    const rightArrowButton = new ArrowButton(
      'right',
      () => { probabilityProperty.value = Math.min( probabilityProperty.value + BUTTON_CHANGE_AMOUNT, 1 ); },
      combineOptions<ArrowButtonOptions>( {
        enabledProperty: new DerivedProperty( [ probabilityProperty ], probability => probability < 1 ),
        tandem: tandem.createTandem( 'rightArrowButton' )
      }, arrowButtonOptions )
    );
    const slider = new HSlider( probabilityProperty, RANGE, {
      trackSize: new Dimension2( 150, 1 ),
      thumbSize: new Dimension2( 12, 26 ),
      majorTickLength: 10,
      tickLabelSpacing: 4,
      constrainValue: ( number: number ) => Utils.toFixedNumber( number, 2 ),
      tandem: tandem.createTandem( 'slider' )
    } );
    slider.addMajorTick( RANGE.min, new Text( RANGE.min.toString(), { font: TICK_MARK_FONT } ) );
    slider.addMajorTick( RANGE.max, new Text( RANGE.max.toString(), { font: TICK_MARK_FONT } ) );
    const sliderAndArrows = new HBox( {
      children: [ leftArrowButton, slider, rightArrowButton ],
      spacing: 5
    } );

    super( {
      children: [
        title,
        sliderAndArrows
      ],
      spacing: 5,
      tandem: tandem
    } );
  }
}

quantumMeasurement.register( 'ProbabilityValueControl', ProbabilityValueControl );