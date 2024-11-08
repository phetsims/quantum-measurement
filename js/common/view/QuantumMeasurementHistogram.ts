// Copyright 2024, University of Colorado Boulder
/**
 * QuantumMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, Color, HBox, Line, Node, NodeOptions, Rectangle, RichText } from '../../../../scenery/js/imports.js';
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
};
export type QuantumMeasurementHistogramOptions = SelfOptions & WithRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const HISTOGRAM_SIZE = new Dimension2( 200, 160 ); // size excluding labels at bottom, in screen coordinates
const AXIS_STROKE = Color.BLACK;
const AXIS_LINE_WIDTH = 2;
const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const NUMBER_DISPLAY_RANGE = new Range( 0, MAX_COINS );
const NUMBER_DISPLAY_MAX_WIDTH = HISTOGRAM_SIZE.width / 2 * 0.85;
export const HISTOGRAM_BAR_WIDTH = HISTOGRAM_SIZE.width / 6;

export default class QuantumMeasurementHistogram extends Node {

  protected readonly xAxis: Line;
  protected readonly yAxis: Line;

  protected readonly leftHistogramBar: Rectangle;
  protected readonly rightHistogramBar: Rectangle;

  protected readonly maxBarHeight: number;

  public constructor( leftNumberProperty: TReadOnlyProperty<number>,
                      rightNumberProperty: TReadOnlyProperty<number>,
                      displayValuesProperty: TReadOnlyProperty<boolean>,
                      providedXAxisLabels: [ RichText, RichText ],
                      providedOptions: QuantumMeasurementHistogramOptions ) {

    const options = optionize<QuantumMeasurementHistogramOptions, SelfOptions, NodeOptions>()( {
      orientation: 'vertical',
      displayMode: 'number',
      matchLabelColors: false,
      barWidth: HISTOGRAM_BAR_WIDTH,
      leftFillColorProperty: QuantumMeasurementColors.headsColorProperty,
      rightFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
      children: [],
      numberDisplayOptions: {
        align: 'center',
        xMargin: 0,
        backgroundStroke: null,
        textOptions: {
          maxWidth: NUMBER_DISPLAY_MAX_WIDTH,
          font: LABEL_FONT
        }
      }
    }, providedOptions );

    options.rotation = options.orientation === 'vertical' ? 0 : Math.PI / 2;

    const totalNumberProperty = new DerivedProperty(
      [ leftNumberProperty, rightNumberProperty ],
      ( leftNumber, rightNumber ) => leftNumber + rightNumber
    );

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
        rotation: options.orientation === 'vertical' ? 0 : -Math.PI / 2
      } );
      rightNumberDisplay = new FractionNode( rightNumberDisplay, totalNumberDisplay, {
        fractionLineMargin: 0,
        rotation: options.orientation === 'vertical' ? 0 : -Math.PI / 2
      } );
    }
    else if ( options.displayMode === 'percent' ) {
      const percentDisplayOptions: NumberDisplayOptions = {
        numberFormatter: value => `${Utils.toFixed( value * 100, 1 )}%`
      };
      leftNumberDisplay = new NumberDisplay( new DerivedProperty(
        [ leftNumberProperty, totalNumberProperty ],
        ( leftNumber, totalNumber ) => totalNumber ? leftNumber / totalNumber : 0
      ), new Range( 0, 1 ), combineOptions<NumberDisplayOptions>( percentDisplayOptions, options.numberDisplayOptions ) );

      rightNumberDisplay = new NumberDisplay( new DerivedProperty(
        [ rightNumberProperty, totalNumberProperty ],
        ( rightNumber, totalNumber ) => totalNumber ? rightNumber / totalNumber : 0
      ), new Range( 0, 1 ), combineOptions<NumberDisplayOptions>( percentDisplayOptions, options.numberDisplayOptions ) );
    }
    else if ( options.displayMode === 'rate' ) {
      const rateDisplayOptions: NumberDisplayOptions = {
        valuePattern: QuantumMeasurementStrings.eventsPerSecondPatternStringProperty,
        rotation: options.orientation === 'vertical' ? 0 : -Math.PI / 2
      };
      leftNumberDisplay = new NumberDisplay( leftNumberProperty, NUMBER_DISPLAY_RANGE, combineOptions<NumberDisplayOptions>(
        rateDisplayOptions, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.leftFillColorProperty : 'black' }
        } ) );
      rightNumberDisplay = new NumberDisplay( rightNumberProperty, NUMBER_DISPLAY_RANGE, combineOptions<NumberDisplayOptions>(
        rateDisplayOptions, options.numberDisplayOptions, {
          textOptions: { fill: options.matchLabelColors ? options.rightFillColorProperty : 'black' }
        } ) );
    }
  else {
      leftNumberDisplay = new NumberDisplay( leftNumberProperty, NUMBER_DISPLAY_RANGE, combineOptions<NumberDisplayOptions>(
        {}, options.numberDisplayOptions, {
          rotation: options.orientation === 'vertical' ? 0 : -Math.PI / 2,
          textOptions: { fill: options.matchLabelColors ? options.leftFillColorProperty : 'black' }
        } ) );
      rightNumberDisplay = new NumberDisplay( rightNumberProperty, NUMBER_DISPLAY_RANGE, combineOptions<NumberDisplayOptions>(
        {}, options.numberDisplayOptions, {
          rotation: options.orientation === 'vertical' ? 0 : -Math.PI / 2,
          textOptions: { fill: options.matchLabelColors ? options.rightFillColorProperty : 'black' }
        } ) );
    }


    // Create the histogram bars for the right and left sides.
    const maxBarHeight = yAxis.height - leftNumberDisplay.height;
    const leftFillColorProperty = options.leftFillColorProperty;
    const rightFillColorProperty = options.rightFillColorProperty;
    const leftHistogramBar = new Rectangle( 0, 0, options.barWidth, maxBarHeight, { fill: leftFillColorProperty } );
    const rightHistogramBar = new Rectangle( 0, 0, options.barWidth, maxBarHeight, { fill: rightFillColorProperty } );

    const leftAlignGroup = new AlignGroup( { matchVertical: false } );
    const rightAlignGroup = new AlignGroup( { matchVertical: false } );

    const SPACING = HISTOGRAM_SIZE.width / 4;

    const numberDisplays = new HBox( {
      children: [
        new AlignBox( leftNumberDisplay, { group: leftAlignGroup } ),
        new AlignBox( rightNumberDisplay, { group: rightAlignGroup } )
      ],
      centerX: 0,
      spacing: SPACING,
      top: yAxis.top - 10,
      visibleProperty: displayValuesProperty
    } );

    // Create the labels for the X axis.
    const xAxisLeftLabel = providedXAxisLabels[ 0 ];
    const xAxisRightLabel = providedXAxisLabels[ 1 ];

    xAxisLeftLabel.rotation = options.orientation === 'vertical' ? 0 : -Math.PI / 2;
    xAxisRightLabel.rotation = options.orientation === 'vertical' ? 0 : -Math.PI / 2;

    const xAxisLabels = new HBox( {
      children: [
        new AlignBox( xAxisLeftLabel, { group: leftAlignGroup } ),
        new AlignBox( xAxisRightLabel, { group: rightAlignGroup } )
      ],
      centerX: 0,
      spacing: SPACING,
      top: xAxis.centerY + 6
    } );
    const numberBars = new HBox( {
      children: [
        new AlignBox( leftHistogramBar, { group: leftAlignGroup } ),
        new AlignBox( rightHistogramBar, { group: rightAlignGroup } )
      ],
      align: 'bottom',
      centerX: 0,
      spacing: SPACING,
      bottom: xAxis.centerY,
      stretch: false
    } );

    Multilink.multilink(
      [
        leftNumberProperty,
        rightNumberProperty
      ],
      ( leftNumber, rightNumber ) => {
        const leftProportion = totalNumberProperty.value ? leftNumber / totalNumberProperty.value : 0;
        leftHistogramBar.setRect( 0, 0, options.barWidth, leftProportion * maxBarHeight );
        numberBars.bottom = xAxis.centerY;
        const rightProportion = totalNumberProperty.value ? rightNumber / totalNumberProperty.value : 0;
        rightHistogramBar.setRect( 0, 0, options.barWidth, rightProportion * maxBarHeight );
        numberBars.bottom = xAxis.centerY;
      }
    );

    // TODO: Why do alignboxes treat us so poorly? https://github.com/phetsims/quantum-measurement/issues/22
    options.children = [
      new Node( {
        children: [
          numberBars,
          yAxis,
          xAxis,
          xAxisLabels,
          numberDisplays
        ]
      } )
    ];

    super( options );

    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.leftHistogramBar = leftHistogramBar;
    this.rightHistogramBar = rightHistogramBar;
    this.maxBarHeight = maxBarHeight;
  }
}

quantumMeasurement.register( 'QuantumMeasurementHistogram', QuantumMeasurementHistogram );