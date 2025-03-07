// Copyright 2024-2025, University of Colorado Boulder

/**
 * QuantumMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import { MAX_COINS } from '../../coins/model/CoinsExperimentSceneModel.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import QuantumMeasurementColors from '../QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../QuantumMeasurementConstants.js';
import FractionNode from './FractionNode.js';

type SelfOptions = {

  size?: Dimension2; // size excluding labels at bottom, in screen coordinates
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

  // proportionate position of the center of the histogram bars; 0.5 is centered, 0.25 is 1/4 of the way from the
  // center, etc.
  barPositionProportion?: number;

  // Show the bar values on top of the middle axis
  showCentralNumberDisplaysProperty?: TReadOnlyProperty<boolean>;
};
export type QuantumMeasurementHistogramOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export const DEFAULT_HISTOGRAM_SIZE = new Dimension2( 200, 160 );
const AXIS_STROKE = Color.BLACK;
const AXIS_LINE_WIDTH = 2;
const LABEL_FONT = QuantumMeasurementConstants.BOLD_HEADER_FONT;
const TICK_MARK_LENGTH = 20;
const TICK_MARK_FONT = QuantumMeasurementConstants.CONTROL_FONT;
const NUMBER_DISPLAY_RANGE = new Range( 0, MAX_COINS );
const NUMBER_DISPLAY_MAX_WIDTH = DEFAULT_HISTOGRAM_SIZE.width / 2 * 0.85;
const FLOATING_LABEL_MARGIN = 5;
const DEFAULT_HISTOGRAM_BAR_WIDTH = DEFAULT_HISTOGRAM_SIZE.width / 6;

class QuantumMeasurementHistogram extends Node {

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

    // Create properties that represent the relative proportions of the left and right values.
    const relativeLeftNumberProperty = new DerivedProperty(
      [ leftNumberProperty, totalNumberProperty ],
      ( leftNumber, totalNumber ) => totalNumber ? leftNumber / totalNumber : 0
    );

    const relativeRightNumberProperty = new DerivedProperty(
      [ rightNumberProperty, totalNumberProperty ],
      ( rightNumber, totalNumber ) => totalNumber ? rightNumber / totalNumber : 0
    );

    // Create a property that indicates whether the number displays should be visible.  They should only be visible
    // when the total of the left and right values is greater than zero.
    const numberDisplaysVisibleProperty = new DerivedProperty( [ totalNumberProperty ], totalNumber => totalNumber > 0 );

    const options = optionize<QuantumMeasurementHistogramOptions, SelfOptions, NodeOptions>()( {
      size: DEFAULT_HISTOGRAM_SIZE,
      orientation: 'vertical',
      displayMode: 'number',
      matchLabelColors: false,
      barWidth: DEFAULT_HISTOGRAM_BAR_WIDTH,
      barPositionProportion: 0.5,
      leftFillColorProperty: QuantumMeasurementColors.headsColorProperty,
      rightFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
      showTickMarks: true,
      topTickMarkTextProperty: new StringProperty( '' ),
      floatingLabels: false,
      showCentralNumberDisplaysProperty: new BooleanProperty( false ),
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
    const xAxis = new Line( 0, 0, options.size.width, 0, {
      stroke: AXIS_STROKE,
      lineWidth: AXIS_LINE_WIDTH,
      x: -options.size.width / 2,
      centerY: 0
    } );

    const yAxis = new Line( 0, 0, 0, options.size.height, {
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

      // Assume no one will ever have the patience to shoot more than 1000 photons.
      const fractionTermsRange = new Range( 0, 999 );

      leftNumberDisplay = new NumberDisplay(
        leftNumberProperty,
        fractionTermsRange,
        combineOptions<NumberDisplayOptions>( {}, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.leftFillColorProperty : 'black', font: fractionFont }
        } )
      );
      rightNumberDisplay = new NumberDisplay(
        rightNumberProperty,
        fractionTermsRange,
        combineOptions<NumberDisplayOptions>( {}, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.rightFillColorProperty : 'black', font: fractionFont }
        } )
      );

      const denominatorNumberDisplay = new NumberDisplay(
        totalNumberProperty,
        fractionTermsRange,
        combineOptions<NumberDisplayOptions>( {}, options.numberDisplayOptions, {
          textOptions: { font: fractionFont }
        } )
      );

      leftNumberDisplay = new FractionNode( leftNumberDisplay, denominatorNumberDisplay, {
        fractionLineMargin: 0,
        rotation: textRotation,
        visibleProperty: numberDisplaysVisibleProperty
      } );
      rightNumberDisplay = new FractionNode( rightNumberDisplay, denominatorNumberDisplay, {
        fractionLineMargin: 0,
        rotation: textRotation,
        visibleProperty: numberDisplaysVisibleProperty
      } );
    }
    else if ( options.displayMode === 'percent' ) {
      const percentDisplayOptions: NumberDisplayOptions = {
        numberFormatter: value => `${toFixed( value * 100, 1 )}%`
      };
      leftNumberDisplay = new NumberDisplay(
        relativeLeftNumberProperty,
        new Range( 0, 1 ),
        combineOptions<NumberDisplayOptions>( percentDisplayOptions, options.numberDisplayOptions )
      );

      rightNumberDisplay = new NumberDisplay(
        relativeRightNumberProperty,
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

    const leftHistogramBarCenterX = -options.barPositionProportion * options.size.width / 2;
    const rightHistogramBarCenterX = options.barPositionProportion * options.size.width / 2;

    // Create the histogram bars for the right and left sides.
    const maxBarHeight = yAxis.height;
    const leftFillColorProperty = options.leftFillColorProperty;
    const rightFillColorProperty = options.rightFillColorProperty;
    const leftHistogramBar = new Rectangle( 0, 0, options.barWidth, maxBarHeight, {
      fill: leftFillColorProperty,
      centerX: leftHistogramBarCenterX
    } );
    const rightHistogramBar = new Rectangle( 0, 0, options.barWidth, maxBarHeight, {
      fill: rightFillColorProperty,
      centerX: rightHistogramBarCenterX
    } );

    // Create the number displays of the center axis, one corresponding to each histogram bar
    const centralLinesWidth = 30;
    const createCentralNumberDisplay = ( valueProperty: TReadOnlyProperty<number>, fillColorProperty: TReadOnlyProperty<Color>, left: boolean ) => {
      return new Node( {
        visibleProperty: DerivedProperty.and(
          [ options.showCentralNumberDisplaysProperty, DerivedProperty.valueNotEqualsConstant( totalNumberProperty, 0 ) ]
        ),
        children: [
          new Path( new Shape().moveTo( 0, 0 ).lineTo( left ? -centralLinesWidth : centralLinesWidth, 0 ), {
            stroke: fillColorProperty,
            lineWidth: 2,
            centerX: 0
          } ),
          new NumberDisplay(
            valueProperty,
            new Range( 0, 1 ),
            {
              textOptions: { fill: fillColorProperty, font: QuantumMeasurementConstants.CONTROL_FONT },
              centerX: left ? -centralLinesWidth : centralLinesWidth,
              rotation: textRotation,
              backgroundFill: new Color( 255, 255, 255, 0.8 ),
              backgroundStroke: null,
              centerY: 0,
              numberFormatter: value => toFixed( value, 3 )
            }
          )
        ]
      } );
    };
    const leftNumberCenterDisplay = createCentralNumberDisplay( relativeLeftNumberProperty, leftFillColorProperty, true );
    const rightNumberCenterDisplay = createCentralNumberDisplay( relativeRightNumberProperty, rightFillColorProperty, false );

    // Create and position the labels for the X axis.
    const axisLabelMargin = 6;
    const xAxisLeftLabel = providedXAxisLabels[ 0 ];
    const xAxisRightLabel = providedXAxisLabels[ 1 ];
    xAxisLeftLabel.rotation = textRotation;
    xAxisRightLabel.rotation = textRotation;
    xAxisLeftLabel.centerX = leftHistogramBarCenterX;
    xAxisLeftLabel.top = xAxis.centerY + axisLabelMargin;
    xAxisRightLabel.centerX = rightHistogramBarCenterX;
    xAxisRightLabel.top = xAxis.centerY + axisLabelMargin;

    const leftPercentageProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'leftPercentageProperty' ),
      range: new Range( 0, 100 ),
      units: '%',
      phetioReadOnly: true
    } );
    const rightPercentageProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'rightPercentageProperty' ),
      range: new Range( 0, 100 ),
      units: '%',
      phetioReadOnly: true
    } );

    Multilink.multilink(
      [
        leftNumberProperty,
        rightNumberProperty
      ],
      ( leftNumber, rightNumber ) => {
        const leftProportion = totalNumberProperty.value ? leftNumber / totalNumberProperty.value : 0;
        leftPercentageProperty.value = clamp( leftProportion * 100, 0, 100 );
        leftHistogramBar.setRect( 0, 0, options.barWidth, leftProportion * maxBarHeight );
        leftHistogramBar.bottom = xAxis.centerY;
        const rightProportion = totalNumberProperty.value ? rightNumber / totalNumberProperty.value : 0;
        rightPercentageProperty.value = clamp( rightProportion * 100, 0, 100 );
        rightHistogramBar.setRect( 0, 0, options.barWidth, rightProportion * maxBarHeight );
        rightHistogramBar.bottom = xAxis.centerY;

        // Update the position of the labels for each of the bars.
        leftNumberDisplay.centerX = leftHistogramBarCenterX;
        rightNumberDisplay.centerX = rightHistogramBarCenterX;
        if ( options.floatingLabels ) {
          leftNumberDisplay.bottom = leftHistogramBar.top - FLOATING_LABEL_MARGIN;
          rightNumberDisplay.bottom = rightHistogramBar.top - FLOATING_LABEL_MARGIN;
        }
        else {
          leftNumberDisplay.bottom = yAxis.top;
          rightNumberDisplay.bottom = yAxis.top;
        }

        leftNumberCenterDisplay.centerY = -leftProportion * maxBarHeight;
        rightNumberCenterDisplay.centerY = -rightProportion * maxBarHeight;
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
          rightNumberDisplay,
          leftNumberCenterDisplay,
          rightNumberCenterDisplay
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

export default QuantumMeasurementHistogram;