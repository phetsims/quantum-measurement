// Copyright 2024, University of Colorado Boulder
/**
 * QuantumMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, Color, HBox, Line, Node, NodeOptions, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import { MAX_COINS } from '../../coins/model/CoinsExperimentSceneModel.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementColors from '../QuantumMeasurementColors.js';

type SelfOptions = {
  orientation?: 'horizontal' | 'vertical';
  leftFillColorProperty?: TReadOnlyProperty<Color>;
  rightFillColorProperty?: TReadOnlyProperty<Color>;
};
export type QuantumMeasurementHistogramOptions = SelfOptions & WithRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const HISTOGRAM_SIZE = new Dimension2( 200, 160 ); // size excluding labels at bottom, in screen coordinates
const AXIS_STROKE = Color.BLACK;
const AXIS_LINE_WIDTH = 2;
const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const NUMBER_DISPLAY_RANGE = new Range( 0, MAX_COINS );
const NUMBER_DISPLAY_MAX_WIDTH = HISTOGRAM_SIZE.width / 2 * 0.85;
const HISTOGRAM_BAR_WIDTH = HISTOGRAM_SIZE.width / 6;
const NUMBER_DISPLAY_OPTIONS: NumberDisplayOptions = {
  align: 'center',
  xMargin: 0,
  backgroundStroke: null,
  textOptions: {
    maxWidth: NUMBER_DISPLAY_MAX_WIDTH,
    font: LABEL_FONT
  }
};

export default class QuantumMeasurementHistogram extends Node {

  protected xAxis: Line;
  protected yAxis: Line;

  public constructor( leftNumberProperty: NumberProperty,
                      rightNumberProperty: NumberProperty,
                      providedXAxisLabels: [ RichText, RichText ],
                      displayValuesProperty: TReadOnlyProperty<boolean>,
                      providedOptions: QuantumMeasurementHistogramOptions ) {

    const options = optionize<QuantumMeasurementHistogramOptions, SelfOptions, NodeOptions>()( {
      orientation: 'vertical',
      leftFillColorProperty: QuantumMeasurementColors.headsColorProperty,
      rightFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
      children: []
    }, providedOptions );

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

    // Create the labels for the X axis.
    const xAxisLeftLabel = providedXAxisLabels[ 0 ];
    const xAxisRightLabel = providedXAxisLabels[ 1 ];

    // Create the textual displays for the numbers.
    const leftNumberDisplay = new NumberDisplay( leftNumberProperty, NUMBER_DISPLAY_RANGE, NUMBER_DISPLAY_OPTIONS );
    const rightNumberDisplay = new NumberDisplay( rightNumberProperty, NUMBER_DISPLAY_RANGE, NUMBER_DISPLAY_OPTIONS );

    // Create the histogram bars for the right and left sides.
    const maxBarHeight = yAxis.height - leftNumberDisplay.height;
    const leftFillColorProperty = options.leftFillColorProperty;
    const rightFillColorProperty = options.rightFillColorProperty;
    const leftHistogramBar = new Rectangle( 0, 0, HISTOGRAM_BAR_WIDTH, maxBarHeight, { fill: leftFillColorProperty } );
    const rightHistogramBar = new Rectangle( 0, 0, HISTOGRAM_BAR_WIDTH, maxBarHeight, { fill: rightFillColorProperty } );

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
      top: yAxis.top,
      visibleProperty: displayValuesProperty
    } );
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

    leftNumberProperty.link( leftNumber => {
      const proportion = totalNumberProperty.value ? leftNumber / totalNumberProperty.value : 0;
      leftHistogramBar.setRect( 0, 0, HISTOGRAM_BAR_WIDTH, proportion * maxBarHeight );
      numberBars.bottom = xAxis.centerY;
    } );
    rightNumberProperty.link( rightNumber => {
      const proportion = totalNumberProperty.value ? rightNumber / totalNumberProperty.value : 0;
      rightHistogramBar.setRect( 0, 0, HISTOGRAM_BAR_WIDTH, proportion * maxBarHeight );
      numberBars.bottom = xAxis.centerY; // TODO: This is being called twice! https://github.com/phetsims/quantum-measurement/issues/22
    } );

    options.children = [
      numberBars,
      yAxis,
      xAxis,
      xAxisLabels,
      numberDisplays
    ];

    super( options );

    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }
}

quantumMeasurement.register( 'QuantumMeasurementHistogram', QuantumMeasurementHistogram );