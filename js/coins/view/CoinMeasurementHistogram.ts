// Copyright 2024, University of Colorado Boulder


/**
 * CoinMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, AlignGroup, Color, HBox, Line, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import { SystemType } from '../../common/model/SystemType.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import { MAX_COINS } from '../model/CoinsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
export type CoinMeasurementHistogramOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const HISTOGRAM_SIZE = new Dimension2( 200, 180 ); // size excluding labels at bottom, in screen coordinates
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
      systemType === 'classical' ?
      QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL :
      QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER,
      {
        font: LABEL_FONT
      }
    );
    const xAxisRightLabel = new Text(
      systemType === 'classical' ?
      QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL :
      QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER,
      {
        font: LABEL_FONT,
        fill: Color.MAGENTA
      }
    );

    // Create the numeric displays for the right and left sides.
    const leftNumberProperty = new DerivedProperty(
      [ coinSet.numberOfActiveSystemsProperty, coinSet.measurementStateProperty ],
      ( numberOfActiveSystems, measurementState ) => {

        const testValue = systemType === 'classical' ? 'heads' : 'up';
        let total = 0;

        if ( measurementState === 'measuredAndRevealed' ) {
          _.times( numberOfActiveSystems, i => {
            if ( coinSet.measuredValues[ i ] === testValue ) {
              total++;
            }
          } );
        }
        return total;
      }
    );

    const rightNumberProperty = new DerivedProperty(
      [ coinSet.numberOfActiveSystemsProperty, coinSet.measurementStateProperty ],
      ( numberOfActiveSystems, measurementState ) => {

        const testValue = systemType === 'classical' ? 'tails' : 'down';
        let total = 0;

        if ( measurementState === 'measuredAndRevealed' ) {
          _.times( numberOfActiveSystems, i => {
            if ( coinSet.measuredValues[ i ] === testValue ) {
              total++;
            }
          } );
        }
        return total;
      }
    );
    const leftNumberDisplay = new NumberDisplay( leftNumberProperty, NUMBER_DISPLAY_RANGE, NUMBER_DISPLAY_OPTIONS );
    const rightNumberDisplay = new NumberDisplay( rightNumberProperty, NUMBER_DISPLAY_RANGE, NUMBER_DISPLAY_OPTIONS );

    // Create the histogram bars for the right and left sides.
    const maxBarHeight = yAxis.height - leftNumberDisplay.height;
    const leftHistogramBar = new Rectangle( 0, 0, HISTOGRAM_BAR_WIDTH, maxBarHeight, { fill: Color.BLACK } );
    const rightHistogramBar = new Rectangle( 0, 0, HISTOGRAM_BAR_WIDTH, maxBarHeight, { fill: Color.MAGENTA } );

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
      const proportion = leftNumber / coinSet.numberOfActiveSystemsProperty.value;
      leftHistogramBar.setRect( 0, 0, HISTOGRAM_BAR_WIDTH, proportion * maxBarHeight );
      numberBars.bottom = xAxis.centerY;
    } );
    rightNumberProperty.link( rightNumber => {
      const proportion = rightNumber / coinSet.numberOfActiveSystemsProperty.value;
      rightHistogramBar.setRect( 0, 0, HISTOGRAM_BAR_WIDTH, proportion * maxBarHeight );
      numberBars.bottom = xAxis.centerY; // TODO: This is being called twice! https://github.com/phetsims/quantum-measurement/issues/22
    } );

    const options = optionize<CoinMeasurementHistogramOptions, SelfOptions, NodeOptions>()( {
      children: [
        numberBars,
        yAxis,
        xAxis,
        xAxisLabels,
        numberDisplays
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'CoinMeasurementHistogram', CoinMeasurementHistogram );