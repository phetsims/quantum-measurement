// Copyright 2024, University of Colorado Boulder


/**
 * CoinMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Color, HBox, Line, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import { SystemType } from '../../common/model/SystemType.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import Range from '../../../../dot/js/Range.js';

type SelfOptions = EmptySelfOptions;
export type CoinMeasurementHistogramOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const HISTOGRAM_SIZE = new Dimension2( 200, 180 ); // size excluding labels at bottom, in screen coordinates
const AXIS_STROKE = Color.BLACK;
const AXIS_LINE_WIDTH = 2;
const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const NUMBER_DISPLAY_RANGE = new Range( 0, 10000 );
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

export default class CoinMeasurementHistogram extends Node {

  public constructor( coinSet: TwoStateSystemSet<ClassicalCoinStates | QuantumCoinStates>,
                      systemType: SystemType,
                      providedOptions?: CoinMeasurementHistogramOptions ) {

    // Create a Property that controls whether the values should be displayed.
    const displayValuesProperty = DerivedProperty.valueEqualsConstant(
      coinSet.measurementStateProperty,
      'measuredAndRevealed'
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
    const xAxisLeftLabel = new Text(
      systemType === 'classical' ? 'H' : QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER,
      {
        font: LABEL_FONT
      }
    );
    const xAxisRightLabel = new Text(
      systemType === 'classical' ? 'T' : QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER,
      {
        font: LABEL_FONT,
        fill: Color.MAGENTA
      }
    );
    const xAxisLabels = new HBox( {
      children: [ xAxisLeftLabel, xAxisRightLabel ],
      spacing: HISTOGRAM_SIZE.width / 3,
      centerX: 0,
      top: xAxis.centerY + 6
    } );

    // Create the numeric displays for the right and left sides.
    const leftNumberProperty = new DerivedProperty(
      [ coinSet.numberOfActiveSystemsProperty, coinSet.measurementStateProperty ],
      ( numberOfActiveSystems, measurementState ) => {

        const testValue = systemType === 'classical' ? 'heads' : 'up';
        let total = 0;

        if ( measurementState === 'measuredAndRevealed' ) {
          const times = numberOfActiveSystems === QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS ? 1e4 : numberOfActiveSystems;
          _.times( times, i => {
            if ( coinSet.measuredValues[ i ] === testValue ) {
              total++;
            }
          } );
        }
        return total;
      }
    );
    const leftNumberDisplay = new NumberDisplay( leftNumberProperty, NUMBER_DISPLAY_RANGE, NUMBER_DISPLAY_OPTIONS );
    const rightNumberProperty = new DerivedProperty(
      [ coinSet.numberOfActiveSystemsProperty, coinSet.measurementStateProperty ],
      ( numberOfActiveSystems, measurementState ) => {

        const testValue = systemType === 'classical' ? 'tails' : 'down';
        let total = 0;

        if ( measurementState === 'measuredAndRevealed' ) {
          const times = numberOfActiveSystems === QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS ? 1e4 : numberOfActiveSystems;
          _.times( times, i => {
            if ( coinSet.measuredValues[ i ] === testValue ) {
              total++;
            }
          } );
        }
        return total;
      }
    );
    const rightNumberDisplay = new NumberDisplay( rightNumberProperty, NUMBER_DISPLAY_RANGE, NUMBER_DISPLAY_OPTIONS );

    const numberDisplays = new HBox( {
      children: [ leftNumberDisplay, rightNumberDisplay ],
      align: 'center',
      spacing: HISTOGRAM_SIZE.width / 3,
      centerX: yAxis.centerX,
      top: yAxis.top,
      visibleProperty: displayValuesProperty
    } );

    // Create the histogram bars for the right and left sides.
    const maxBarHeight = yAxis.height - leftNumberDisplay.height;
    const barCenterXDistanceFromCenter = HISTOGRAM_SIZE.width / 4;
    const leftHistogramBar = new Rectangle( 0, 0, HISTOGRAM_BAR_WIDTH, maxBarHeight, {
      fill: Color.BLACK,
      centerX: -barCenterXDistanceFromCenter,
      bottom: xAxis.centerY
    } );
    leftNumberProperty.link( leftNumber => {
      const numberOfSystems = coinSet.numberOfActiveSystemsProperty.value === QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS ? 1e4 : coinSet.numberOfActiveSystemsProperty.value;
      const proportion = leftNumber / numberOfSystems;
      leftHistogramBar.setRectHeightFromBottom( proportion * maxBarHeight );
    } );
    const rightHistogramBar = new Rectangle( 0, 0, HISTOGRAM_BAR_WIDTH, maxBarHeight, {
      fill: Color.MAGENTA,
      centerX: barCenterXDistanceFromCenter,
      bottom: xAxis.centerY
    } );
    rightNumberProperty.link( rightNumber => {
      const numberOfSystems = coinSet.numberOfActiveSystemsProperty.value === QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS ? 1e4 : coinSet.numberOfActiveSystemsProperty.value;
      const proportion = rightNumber / numberOfSystems;
      rightHistogramBar.setRectHeightFromBottom( proportion * maxBarHeight );
    } );

    const options = optionize<CoinMeasurementHistogramOptions, SelfOptions, NodeOptions>()( {
      children: [ leftHistogramBar, rightHistogramBar, yAxis, xAxis, xAxisLabels, numberDisplays ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'CoinMeasurementHistogram', CoinMeasurementHistogram );