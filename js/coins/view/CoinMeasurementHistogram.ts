// Copyright 2024, University of Colorado Boulder


/**
 * CoinMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { NodeOptions, RichText } from '../../../../scenery/js/imports.js';
import { SystemType } from '../../common/model/SystemType.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';

type SelfOptions = EmptySelfOptions;
export type CoinMeasurementHistogramOptions = SelfOptions & WithRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );

export default class CoinMeasurementHistogram extends QuantumMeasurementHistogram {

  public constructor( coinSet: TwoStateSystemSet<ClassicalCoinStates | QuantumCoinStates>,
                      systemType: SystemType,
                      providedOptions: CoinMeasurementHistogramOptions ) {

    // Create the labels for the X axis.
    const xAxisLabels = [
      new RichText(
        systemType === 'classical' ?
        QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL :
        QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER,
        {
          font: LABEL_FONT,
          fill: systemType === 'classical' ? QuantumMeasurementColors.headsColorProperty : QuantumMeasurementColors.upColorProperty
        }
      ),
      new RichText(
        systemType === 'classical' ?
        QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL :
        QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER,
        {
          font: LABEL_FONT,
          fill: systemType === 'classical' ? QuantumMeasurementColors.tailsColorProperty : QuantumMeasurementColors.downColorProperty
        }
      )
    ];

    super( coinSet, systemType, xAxisLabels as [RichText, RichText], providedOptions );
  }
}

quantumMeasurement.register( 'CoinMeasurementHistogram', CoinMeasurementHistogram );