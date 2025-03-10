// Copyright 2024-2025, University of Colorado Boulder

/**
 * QuantumCoinNode portrays a single "quantum" coin in the view, allowing users to see its orientation, e.g. spin up,
 * spin down, or superposed somewhere in between.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import CoinNode, { CoinFaceParameters } from './CoinNode.js';

const MIN_MARGIN_FACTOR = 0.35;

export default class QuantumCoinNode extends CoinNode {

  public readonly showSuperpositionProperty: BooleanProperty;

  public constructor( coinStateProperty: TReadOnlyProperty<QuantumCoinStates>,
                      stateProbabilityProperty: TReadOnlyProperty<number>,
                      radius: number,
                      tandem: Tandem ) {

    // Calculate the attributes for the arrow that will be used to represent the coin faces based on the coin radius.
    // The values here were empirically determined to look good.
    const arrowLength = radius * 1.2;
    const arrowNodeCommonOptions: ArrowNodeOptions = {
      headHeight: arrowLength / 3.5,
      headWidth: arrowLength / 1.75,
      tailWidth: arrowLength / 7,
      stroke: null
    };

    const upFaceOptions: CoinFaceParameters = {
      fill: QuantumMeasurementColors.upFillColorProperty,
      stroke: QuantumMeasurementColors.upColorProperty,
      content: new ArrowNode( 0, arrowLength, 0, 0, combineOptions<ArrowNodeOptions>( arrowNodeCommonOptions, {
        fill: QuantumMeasurementColors.upColorProperty
      } ) ),
      minYMarginFactor: MIN_MARGIN_FACTOR
    };

    const downFaceOptions: CoinFaceParameters = {
      fill: QuantumMeasurementColors.downFillColorProperty,
      stroke: QuantumMeasurementColors.downColorProperty,
      content: new ArrowNode( 0, 0, 0, arrowLength, combineOptions<ArrowNodeOptions>( arrowNodeCommonOptions, {
        fill: QuantumMeasurementColors.downColorProperty
      } ) ),
      minYMarginFactor: MIN_MARGIN_FACTOR
    };

    const showSuperpositionProperty = new BooleanProperty( true );
    const crossFadeProperty = new DerivedProperty(
      [ coinStateProperty, stateProbabilityProperty, showSuperpositionProperty ],
      ( coinState, stateProbability, showSuperposition ) => {
        return showSuperposition ? stateProbability :
               coinState === 'up' ? 1 : 0;
      }
    );

    super( radius, crossFadeProperty, [ upFaceOptions, downFaceOptions ], { tandem: tandem } );

    this.showSuperpositionProperty = showSuperpositionProperty;
  }
}

quantumMeasurement.register( 'QuantumCoinNode', QuantumCoinNode );