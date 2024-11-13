// Copyright 2024, University of Colorado Boulder

/**
 * NormalizedOutcomeVectorGraph is a view element that displays a graph of the normalized outcome value.  The graph
 * consists of a vertical axis with tick marks and labels, and a vector that represents the normalized outcome value.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, Node, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const HEIGHT = 200;
const TICK_MARK_LENGTH = 20;
const TICK_MARK_LINE_WIDTH = 1.5;
const EXPECTATION_VALUE_LINE_LENGTH = TICK_MARK_LENGTH * 1.5;
const LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const LABEL_SPACING = 7;

export default class NormalizedOutcomeVectorGraph extends Node {

  // Property that controls whether the expectation value line is visible when there is a valid expectation value.
  public readonly showExpectationLineProperty: BooleanProperty;

  public constructor( normalizedOutcomeValueProperty: TReadOnlyProperty<number>,
                      normalizedExpectationValueProperty: TReadOnlyProperty<number | null>,
                      tandem: Tandem ) {

    const verticalAxis = new Line( 0, -HEIGHT / 2, 0, HEIGHT / 2, {
      stroke: Color.BLACK,
      lineDash: [ 7, 4 ]
    } );

    const topTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.top,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const topTickMarkLabel = new Text( '+1', {
      font: LABEL_FONT,
      left: topTickMark.right + LABEL_SPACING,
      centerY: topTickMark.centerY
    } );

    const middleTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.centerY,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const middleTickMarkLabel = new Text( '0', {
      font: LABEL_FONT,
      left: middleTickMark.right + LABEL_SPACING,
      centerY: middleTickMark.centerY
    } );

    const bottomTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.bottom,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const bottomTickMarkLabel = new Text( '-1', {
      font: LABEL_FONT,
      left: bottomTickMark.right + LABEL_SPACING,
      centerY: bottomTickMark.centerY
    } );

    // Create the normalized outcome vector.  The initial position is arbitrary, it will be set by the link below.
    const normalizedOutcomeVector = new ArrowNode( 0, 0, 0, HEIGHT / 3, {
      stroke: null,
      fill: Color.BLACK,
      headWidth: 15,
      headHeight: 12,
      tailWidth: 4
    } );

    // Link the normalized outcome vector to the normalized outcome value property.
    normalizedOutcomeValueProperty.link( normalizedOutcomeValue => {
      if ( normalizedOutcomeValue === 0 ) {
        normalizedOutcomeVector.visible = false;
      }
      else {
        normalizedOutcomeVector.visible = true;
        normalizedOutcomeVector.setTip( 0, normalizedOutcomeValue * HEIGHT / 2 );
      }
    } );

    // Property that controls whether the expectation value line is visible when there is a valid expectation value.
    const showExpectationLineProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'showExpectationLineProperty' ),
      phetioReadOnly: true
    } );

    // The expectation value line can only be shown when there is a valid expectation value, so we need a derived
    // property that takes the value and the user setting into account.
    const expectationValueLineVisibleProperty = new DerivedProperty(
      [ normalizedExpectationValueProperty, showExpectationLineProperty ],
      ( normalizedExpectationValue, showExpectationLine ) => normalizedExpectationValue !== null && showExpectationLine
    );

    // Create the little line that will depict the expectation value.
    const expectationValueLine = new Line( -EXPECTATION_VALUE_LINE_LENGTH / 2, 0, EXPECTATION_VALUE_LINE_LENGTH / 2, 0, {
      centerY: verticalAxis.centerY,
      stroke: QuantumMeasurementColors.photonBaseColorProperty,
      lineWidth: TICK_MARK_LINE_WIDTH * 2,
      visibleProperty: expectationValueLineVisibleProperty
    } );

    // Update the position of the expectation value line as the expectation value changes.
    normalizedExpectationValueProperty.link( normalizedExpectationValue => {
      expectationValueLine.setTranslation(
        0,
        normalizedExpectationValue === null ? 0 : -normalizedExpectationValue * HEIGHT / 2
      );
    } );

    super( {
      children: [
        verticalAxis,
        expectationValueLine,
        topTickMark,
        topTickMarkLabel,
        middleTickMark,
        middleTickMarkLabel,
        bottomTickMark,
        bottomTickMarkLabel,
        normalizedOutcomeVector
      ],
      tandem: tandem
    } );

    this.showExpectationLineProperty = showExpectationLineProperty;
  }
}

quantumMeasurement.register( 'NormalizedOutcomeVectorGraph', NormalizedOutcomeVectorGraph );