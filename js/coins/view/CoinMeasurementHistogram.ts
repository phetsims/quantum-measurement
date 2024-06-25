// Copyright 2024, University of Colorado Boulder


/**
 * CoinMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple physical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Color, HBox, Line, Node, NodeOptions, Text, TPaint } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import { PhysicalCoinStates } from '../model/PhysicalCoinStates.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import { SystemType } from '../../common/model/SystemType.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

// type for specifying the attributes for one face of the coin
export type CoinFaceParameters = {
  stroke?: TPaint;
  fill?: TPaint;
  content?: Node;
};

type SelfOptions = EmptySelfOptions;
export type CoinMeasurementHistogramOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const HISTOGRAM_SIZE = new Dimension2( 100, 180 ); // size excluding labels at bottom, in screen coordinates
const AXIS_STROKE = Color.BLACK;
const AXIS_LINE_WIDTH = 2;
const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );

export default class CoinMeasurementHistogram extends Node {

  public constructor( coinSet: TwoStateSystemSet<PhysicalCoinStates | QuantumCoinStates>,
                      systemType: SystemType,
                      providedOptions?: CoinMeasurementHistogramOptions ) {

    const verticalAxis = new Line( 0, 0, 0, HISTOGRAM_SIZE.height, {
      stroke: AXIS_STROKE,
      lineWidth: AXIS_LINE_WIDTH,
      centerX: 0,
      bottom: 0
    } );

    const horizontalAxis = new Line( 0, 0, HISTOGRAM_SIZE.width, 0, {
      stroke: AXIS_STROKE,
      lineWidth: AXIS_LINE_WIDTH,
      x: -HISTOGRAM_SIZE.width / 2,
      centerY: 0
    } );

    const xAxisLeftLabel = new Text(
      systemType === 'physical' ? 'H' : QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER,
      {
        font: LABEL_FONT
      }
    );
    const xAxisRightLabel = new Text(
      systemType === 'physical' ? 'T' : QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER,
      {
        font: LABEL_FONT,
        fill: Color.MAGENTA
      }
    );

    const xAxisLabelsHBox = new HBox( {
      children: [ xAxisLeftLabel, xAxisRightLabel ],
      spacing: HISTOGRAM_SIZE.width / 3,
      centerX: 0,
      top: horizontalAxis.centerY + 6
    } );

    const options = optionize<CoinMeasurementHistogramOptions, SelfOptions, NodeOptions>()( {
      children: [ verticalAxis, horizontalAxis, xAxisLabelsHBox ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'CoinMeasurementHistogram', CoinMeasurementHistogram );