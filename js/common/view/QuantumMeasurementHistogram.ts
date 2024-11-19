// Copyright 2024, University of Colorado Boulder
/**
 * QuantumMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, Node, NodeOptions, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import { MAX_COINS } from '../../coins/model/CoinsExperimentSceneModel.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import QuantumMeasurementColors from '../QuantumMeasurementColors.js';
import FractionNode from './FractionNode.js';

type SelfOptions = {
  orientation?: 'horizontal' | 'vertical'; // If the histogram is pointing up or sideways
  displayMode?: 'number' | 'fraction' | 'percent' | 'rate';
  matchLabelColors?: boolean; // If the labels should match the colors of the bars
  leftFillColorProperty?: TReadOnlyProperty<Color>;
  rightFillColorProperty?: TReadOnlyProperty<Color>;
  numberDisplayOptions?: NumberDisplayOptions;
  barWidth?: number;

  // Whether to display tick marks.  When true, the histogram will display one tick mark halfway along the Y axis and
  // another at the top of the Y axis.  Both will be labeled.
  showTickMarks?: boolean;

  // Whether the labels should float above the bars (vertical orientation) or beside the bars (horizontal orientation).
  floatingLabels?: boolean;

  // label for the top tick mark, if present
  topTickMarkTextProperty?: TReadOnlyProperty<string>;
};
export type QuantumMeasurementHistogramOptions = SelfOptions & WithRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const HISTOGRAM_SIZE = new Dimension2( 200, 160 ); // size excluding labels at bottom, in screen coordinates
const RIGHT_HISTOGRAM_BAR_CENTER_X = HISTOGRAM_SIZE.width / 4;
const LEFT_HISTOGRAM_BAR_CENTER_X = -HISTOGRAM_SIZE.width / 4;
const AXIS_STROKE = Color.BLACK;
const AXIS_LINE_WIDTH = 2;
const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const TICK_MARK_LENGTH = 20;
const TICK_MARK_FONT = new PhetFont( 14 );
const NUMBER_DISPLAY_RANGE = new Range( 0, MAX_COINS );
const NUMBER_DISPLAY_MAX_WIDTH = HISTOGRAM_SIZE.width / 2 * 0.85;
const FLOATING_LABEL_MARGIN = 5;
export const HISTOGRAM_BAR_WIDTH = HISTOGRAM_SIZE.width / 6;

export default class QuantumMeasurementHistogram extends Node {

  protected readonly xAxis: Line;
  protected readonly yAxis: Line;

  protected readonly maxBarHeight: number;

  public constructor( leftNumberProperty: TReadOnlyProperty<number>,
                      rightNumberProperty: TReadOnlyProperty<number>,
                      providedXAxisLabels: [ RichText, RichText ],
                      providedOptions: QuantumMeasurementHistogramOptions ) {

    // Create a property that represents the total of the left and right values.
    const totalNumberProperty = new DerivedProperty(
      [ leftNumberProperty, rightNumberProperty ],
      ( leftNumber, rightNumber ) => leftNumber + rightNumber
    );

    // Create a property that indicates whether the number displays should be visible.  They should only be visible
    // when the total of the left and right values is greater than zero.
    const numberDisplaysVisibleProperty = new DerivedProperty( [ totalNumberProperty ], totalNumber => totalNumber > 0 );

    const options = optionize<QuantumMeasurementHistogramOptions, SelfOptions, NodeOptions>()( {
      orientation: 'vertical',
      displayMode: 'number',
      matchLabelColors: false,
      barWidth: HISTOGRAM_BAR_WIDTH,
      leftFillColorProperty: QuantumMeasurementColors.headsColorProperty,
      rightFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
      showTickMarks: true,
      topTickMarkTextProperty: new StringProperty( '' ),
      floatingLabels: false,
      children: [],
      numberDisplayOptions: {
        align: 'center',
        xMargin: 0,
        backgroundStroke: null,
        textOptions: {
          maxWidth: NUMBER_DISPLAY_MAX_WIDTH,
          font: LABEL_FONT
        },
        visibleProperty: numberDisplaysVisibleProperty
      }
    }, providedOptions );

    options.rotation = options.orientation === 'vertical' ? 0 : Math.PI / 2;
    const textRotation = options.orientation === 'vertical' ? 0 : -Math.PI / 2;

    // Create the X and Y axes.
    const xAxis = new Line( 0, 0, HISTOGRAM_SIZE.width, 0, {
      stroke: AXIS_STROKE,
      lineWidth: AXIS_LINE_WIDTH,
      x: -HISTOGRAM_SIZE.width / 2,
      centerY: 0
    } );

    const yAxis = new Line( 0, 0, 0, HISTOGRAM_SIZE.height, {
      stroke: AXIS_STROKE,
      lineWidth: AXIS_LINE_WIDTH,
      centerX: 0,
      bottom: 0
    } );

    // Create the textual displays for the numbers.
    let leftNumberDisplay: Node;
    let rightNumberDisplay: Node;

    if ( options.displayMode === 'fraction' ) {

      const fractionFont = new PhetFont( { size: 15, weight: 'bold' } );

      leftNumberDisplay = new NumberDisplay( leftNumberProperty, NUMBER_DISPLAY_RANGE, combineOptions<NumberDisplayOptions>(
        {}, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.leftFillColorProperty : 'black', font: fractionFont }
        } ) );
      rightNumberDisplay = new NumberDisplay( rightNumberProperty, NUMBER_DISPLAY_RANGE, combineOptions<NumberDisplayOptions>(
        {}, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.rightFillColorProperty : 'black', font: fractionFont }
        } ) );

      const totalNumberDisplay = new NumberDisplay( totalNumberProperty, NUMBER_DISPLAY_RANGE, combineOptions<NumberDisplayOptions>(
        {}, options.numberDisplayOptions, {
          textOptions: { font: fractionFont }
        } ) );

      leftNumberDisplay = new FractionNode( leftNumberDisplay, totalNumberDisplay, {
        fractionLineMargin: 0,
        rotation: textRotation,
        visibleProperty: numberDisplaysVisibleProperty
      } );
      rightNumberDisplay = new FractionNode( rightNumberDisplay, totalNumberDisplay, {
        fractionLineMargin: 0,
        rotation: textRotation,
        visibleProperty: numberDisplaysVisibleProperty
      } );
    }
    else if ( options.displayMode === 'percent' ) {
      const percentDisplayOptions: NumberDisplayOptions = {
        numberFormatter: value => `${Utils.toFixed( value * 100, 1 )}%`
      };
      leftNumberDisplay = new NumberDisplay(
        new DerivedProperty(
          [ leftNumberProperty, totalNumberProperty ],
          ( leftNumber, totalNumber ) => totalNumber ? leftNumber / totalNumber : 0
        ),
        new Range( 0, 1 ),
        combineOptions<NumberDisplayOptions>( percentDisplayOptions, options.numberDisplayOptions )
      );

      rightNumberDisplay = new NumberDisplay(
        new DerivedProperty(
          [ rightNumberProperty, totalNumberProperty ],
          ( rightNumber, totalNumber ) => totalNumber ? rightNumber / totalNumber : 0
        ),
        new Range( 0, 1 ),
        combineOptions<NumberDisplayOptions>( percentDisplayOptions, options.numberDisplayOptions )
      );
    }
    else if ( options.displayMode === 'rate' ) {
      const rateDisplayOptions: NumberDisplayOptions = {
        valuePattern: QuantumMeasurementStrings.eventsPerSecondPatternStringProperty,
        rotation: textRotation
      };
      leftNumberDisplay = new NumberDisplay(
        leftNumberProperty,
        NUMBER_DISPLAY_RANGE,
        combineOptions<NumberDisplayOptions>( rateDisplayOptions, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.leftFillColorProperty : 'black' }
        } )
      );
      rightNumberDisplay = new NumberDisplay(
        rightNumberProperty,
        NUMBER_DISPLAY_RANGE,
        combineOptions<NumberDisplayOptions>( rateDisplayOptions, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.rightFillColorProperty : 'black' }
        } )
      );
    }
    else {
      leftNumberDisplay = new NumberDisplay(
        leftNumberProperty,
        NUMBER_DISPLAY_RANGE,
        combineOptions<NumberDisplayOptions>( {}, options.numberDisplayOptions, {
          rotation: textRotation,
          textOptions: { fill: options.matchLabelColors ? options.leftFillColorProperty : 'black' }
        } )
      );
      rightNumberDisplay = new NumberDisplay(
        rightNumberProperty,
        NUMBER_DISPLAY_RANGE,
        combineOptions<NumberDisplayOptions>( {}, options.numberDisplayOptions, {
          rotation: textRotation,
          textOptions: { fill: options.matchLabelColors ? options.rightFillColorProperty : 'black' }
        } )
      );
    }

    // Create the histogram bars for the right and left sides.
    const maxBarHeight = yAxis.height;
    const leftFillColorProperty = options.leftFillColorProperty;
    const rightFillColorProperty = options.rightFillColorProperty;
    const leftHistogramBar = new Rectangle( 0, 0, options.barWidth, maxBarHeight, {
      fill: leftFillColorProperty,
      centerX: LEFT_HISTOGRAM_BAR_CENTER_X
    } );
    const rightHistogramBar = new Rectangle( 0, 0, options.barWidth, maxBarHeight, {
      fill: rightFillColorProperty,
      centerX: RIGHT_HISTOGRAM_BAR_CENTER_X
    } );

    // Create and position the labels for the X axis.
    const axisLabelMargin = 6;
    const xAxisLeftLabel = providedXAxisLabels[ 0 ];
    xAxisLeftLabel.centerX = LEFT_HISTOGRAM_BAR_CENTER_X;
    xAxisLeftLabel.top = xAxis.centerY + axisLabelMargin;
    const xAxisRightLabel = providedXAxisLabels[ 1 ];
    xAxisRightLabel.centerX = RIGHT_HISTOGRAM_BAR_CENTER_X;
    xAxisRightLabel.top = xAxis.centerY + axisLabelMargin;

    xAxisLeftLabel.rotation = textRotation;
    xAxisRightLabel.rotation = textRotation;

    Multilink.multilink(
      [
        leftNumberProperty,
        rightNumberProperty
      ],
      ( leftNumber, rightNumber ) => {
        const leftProportion = totalNumberProperty.value ? leftNumber / totalNumberProperty.value : 0;
        leftHistogramBar.setRect( 0, 0, options.barWidth, leftProportion * maxBarHeight );
        leftHistogramBar.bottom = xAxis.centerY;
        const rightProportion = totalNumberProperty.value ? rightNumber / totalNumberProperty.value : 0;
        rightHistogramBar.setRect( 0, 0, options.barWidth, rightProportion * maxBarHeight );
        rightHistogramBar.bottom = xAxis.centerY;

        // Update the position of the labels for each of the bars.
        leftNumberDisplay.centerX = LEFT_HISTOGRAM_BAR_CENTER_X;
        rightNumberDisplay.centerX = RIGHT_HISTOGRAM_BAR_CENTER_X;
        if ( options.floatingLabels ) {
          leftNumberDisplay.bottom = leftHistogramBar.top - FLOATING_LABEL_MARGIN;
          rightNumberDisplay.bottom = rightHistogramBar.top - FLOATING_LABEL_MARGIN;
        }
        else {
          leftNumberDisplay.bottom = yAxis.top;
          rightNumberDisplay.bottom = yAxis.top;
        }
      }
    );

    // If tick marks are to be displayed, create them.
    const tickMarkRelatedChildren = [];
    if ( options.showTickMarks ) {
      const halfHeightTickMark = new Line( 0, 0, TICK_MARK_LENGTH, 0, {
        stroke: AXIS_STROKE,
        centerX: yAxis.centerX,
        centerY: -maxBarHeight / 2
      } );
      tickMarkRelatedChildren.push( halfHeightTickMark );
      const topTickMark = new Line( 0, 0, TICK_MARK_LENGTH, 0, {
        stroke: AXIS_STROKE,
        centerX: yAxis.centerX,
        centerY: -maxBarHeight
      } );
      tickMarkRelatedChildren.push( topTickMark );
      const topTickMarkLabel = new RichText( options.topTickMarkTextProperty, {
        font: TICK_MARK_FONT,
        left: topTickMark.right + 3,
        centerY: topTickMark.centerY,
        rotation: textRotation
      } );
      tickMarkRelatedChildren.push( topTickMarkLabel );
    }

    options.children = [
      new Node( {
        children: [
          leftHistogramBar,
          rightHistogramBar,
          yAxis,
          ...tickMarkRelatedChildren,
          xAxis,
          xAxisLeftLabel,
          xAxisRightLabel,
          leftNumberDisplay,
          rightNumberDisplay
        ]
      } )
    ];

    super( options );

    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.maxBarHeight = maxBarHeight;
  }
}

quantumMeasurement.register( 'QuantumMeasurementHistogram', QuantumMeasurementHistogram );