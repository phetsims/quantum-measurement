// Copyright 2024-2025, University of Colorado Boulder

/**
 * NormalizedOutcomeVectorGraph is a view element that displays a graph of the normalized outcome value.  The graph
 * consists of a vertical axis with tick marks and labels, and a vector that represents the normalized outcome value.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const HEIGHT = 150;
const TICK_MARK_LENGTH = 20;
const TICK_MARK_LINE_WIDTH = 1.5;
const EXPECTATION_VALUE_LINE_LENGTH = TICK_MARK_LENGTH * 1.5;
const LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const LABEL_SPACING = 7;

export default class NormalizedOutcomeVectorGraph extends Node {

  // Property that controls whether the expectation value line is visible when there is a valid expectation value.
  public readonly showExpectationValueProperty: BooleanProperty;

  // Property the controls whether the vector is shown on the number line.
  public readonly showVectorRepresentationProperty: BooleanProperty;

  public constructor( normalizedOutcomeValueProperty: TReadOnlyProperty<number>,
                      normalizedExpectationValueProperty: TReadOnlyProperty<number | null>,
                      displayNumericValueProperty: TReadOnlyProperty<boolean>,
                      tandem: Tandem ) {

    const showExpectationValueProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'showExpectationValueProperty' ),
      phetioFeatured: true
    } );
    const showVectorRepresentationProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'showVectorRepresentationProperty' ),
      phetioFeatured: true
    } );

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
      right: topTickMark.left - LABEL_SPACING,
      centerY: topTickMark.centerY
    } );

    const middleTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.centerY,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const middleTickMarkLabel = new Text( '0', {
      font: LABEL_FONT,
      right: middleTickMark.left - LABEL_SPACING,
      centerY: middleTickMark.centerY
    } );

    const bottomTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.bottom,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const bottomTickMarkLabel = new Text( '-1', {
      font: LABEL_FONT,
      right: bottomTickMark.left - LABEL_SPACING,
      centerY: bottomTickMark.centerY
    } );

    // Create the normalized outcome vector.  The initial position of the head is arbitrary, it will be set below.
    const normalizedOutcomeVector = new ArrowNode( 0, 0, 0, HEIGHT / 3, {
      stroke: null,
      fill: Color.BLACK,
      headWidth: 15,
      headHeight: 12,
      tailWidth: 4,
      visibleProperty: showVectorRepresentationProperty
    } );

    // Create a numeric display of the value of the normalized outcome value.
    const invertedNormalizedOutcomeValueProperty = new DerivedProperty(
      [ normalizedOutcomeValueProperty ],
      value => -value
    );

    // REVIEW: Suggested to rename showNumericValueProperty to numericValueVisibleProperty
    const showNumericValueProperty = DerivedProperty.and( [ showVectorRepresentationProperty, displayNumericValueProperty ] );
    const normalizedOutcomeValueDisplay = new NumberDisplay(
      invertedNormalizedOutcomeValueProperty,
      new Range( -1, 1 ),
      {
        decimalPlaces: 3,
        textOptions: {
          font: new PhetFont( 12 )
        },
        backgroundStroke: null,
        backgroundFill: Color.WHITE.withAlpha( 0.8 ),
        xMargin: 2,
        visibleProperty: showNumericValueProperty
      }
    );

    // Create the line that will visually connect the tip of the arrow to the numeric display of the normalized outcome.
    const lineToValueDisplay = new Line( 0, 0, 40, 0, {
      stroke: Color.BLACK,
      lineWidth: 1,
      right: 0,
      visibleProperty: showNumericValueProperty
    } );

    // Monitor the normalized outcome value and update the position of the arrow and the numeric display as it changes.
    normalizedOutcomeValueProperty.link( normalizedOutcomeValue => {
      const arrowTipYPosition = normalizedOutcomeValue * HEIGHT / 2;
      normalizedOutcomeVector.setTip( 0, arrowTipYPosition );
      lineToValueDisplay.centerY = arrowTipYPosition;
      normalizedOutcomeValueDisplay.right = lineToValueDisplay.left;
      normalizedOutcomeValueDisplay.centerY = arrowTipYPosition;
    } );

    // The expectation value line can only be shown when there is a valid expectation value, so we need a derived
    // property that takes the value and the user setting into account.
    const expectationValueLineVisibleProperty = new DerivedProperty(
      [ normalizedExpectationValueProperty, showExpectationValueProperty ],
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
        normalizedOutcomeVector,
        lineToValueDisplay,
        normalizedOutcomeValueDisplay
      ],
      tandem: tandem
    } );

    this.showExpectationValueProperty = showExpectationValueProperty;
    this.showVectorRepresentationProperty = showVectorRepresentationProperty;
  }

  public reset(): void {
    this.showExpectationValueProperty.reset();
    this.showVectorRepresentationProperty.reset();
  }
}

quantumMeasurement.register( 'NormalizedOutcomeVectorGraph', NormalizedOutcomeVectorGraph );