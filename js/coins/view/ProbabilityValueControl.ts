// Copyright 2024, University of Colorado Boulder


/**
 * ProbabilityValueControl is a UI component that allows the user to control the value of a NumberProperty whose value
 * ranges from 0 to 1.  The control includes horizontal slider, arrow controls on each side of the slider for
 * fine-grained control, and a title that goes above it all.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { HBox, RichText, VBox } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

const TITLE_FONT = new PhetFont( 16 );
const RANGE = new Range( 0, 1 );

export default class ProbabilityValueControl extends VBox {

  public constructor( titleStringProperty: TReadOnlyProperty<string>,
                      probabilityProperty: NumberProperty ) {

    const title = new RichText( titleStringProperty, {
      font: TITLE_FONT
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
      () => console.log( 'left button pressed' ),
      arrowButtonOptions
    );
    const rightArrowButton = new ArrowButton(
      'right',
      () => console.log( 'right button pressed' ),
      arrowButtonOptions
    );
    const slider = new HSlider( probabilityProperty, RANGE, {
      trackSize: new Dimension2( 150, 1 ),
      thumbSize: new Dimension2( 12, 26 )
    } );
    const sliderAndArrows = new HBox( {
      children: [ leftArrowButton, slider, rightArrowButton ],
      spacing: 5
    } );

    super( {
      children: [
        title,
        sliderAndArrows
      ],
      spacing: 5
    } );
  }
}

quantumMeasurement.register( 'ProbabilityValueControl', ProbabilityValueControl );