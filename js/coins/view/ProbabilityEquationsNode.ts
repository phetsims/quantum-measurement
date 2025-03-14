// Copyright 2024-2025, University of Colorado Boulder

/**
 * ProbabilityEquationsNode shows the probability settings (aka the bias) for the classical or quantum coins.
 *
 * @author Agustín Vallejo
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ProbabilityOfSymbolBox from './ProbabilityOfSymbolBox.js';

type SelfOptions = EmptySelfOptions;
type ProbabilityEquationsNodeOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class ProbabilityEquationsNode extends VBox {

  public constructor( biasProperty: TReadOnlyProperty<number>,
                      systemType: SystemType,
                      providedOptions: ProbabilityEquationsNodeOptions ) {

    let upProbabilityNode: Node;
    let downProbabilityNode: Node;
    if ( systemType === SystemType.CLASSICAL ) {
      upProbabilityNode = new ProbabilityOfSymbolBox( 'heads', QuantumMeasurementConstants.TITLE_FONT );
      downProbabilityNode = new ProbabilityOfSymbolBox( 'tails', QuantumMeasurementConstants.TITLE_FONT );
    }
    else {
      upProbabilityNode = new ProbabilityOfSymbolBox( 'up', QuantumMeasurementConstants.TITLE_FONT );
      downProbabilityNode = new ProbabilityOfSymbolBox( 'down', QuantumMeasurementConstants.TITLE_FONT );
    }

    const upProbabilityStringProperty = new DerivedProperty(
      [ biasProperty ], bias => `= ${toFixed( bias, 2 )}`
    );

    const downProbabilityStringProperty = new DerivedProperty(
      [
        biasProperty,
        QuantumMeasurementColors.tailsColorProperty,
        QuantumMeasurementColors.downColorProperty
      ],
      ( bias, tailsColor, downColor ) => {
        const spanColor = systemType === SystemType.CLASSICAL ? tailsColor : downColor;
        return `= ${ProbabilityEquationsNode.COLOR_SPAN( toFixed( 1 - bias, 2 ), spanColor )}`;
      } );

    const upProbabilityResultNode = new RichText( upProbabilityStringProperty,
      { font: QuantumMeasurementConstants.TITLE_FONT } );
    const downProbabilityResultNode = new RichText( downProbabilityStringProperty,
      { font: QuantumMeasurementConstants.TITLE_FONT } );

    const upEquation = new HBox( { children: [ upProbabilityNode, upProbabilityResultNode ], spacing: 5 } );
    const downEquation = new HBox( { children: [ downProbabilityNode, downProbabilityResultNode ], spacing: 5 } );

    super( combineOptions<VBoxOptions>( {
      spacing: 10,
      children: [
        upEquation,
        downEquation
      ]
    }, providedOptions ) );
  }

  public static COLOR_SPAN( text: string, color: Color ): string {
    return `<span style="color: ${color.toCSS()};">${text}</span>`;
  }
}

quantumMeasurement.register( 'ProbabilityEquationsNode', ProbabilityEquationsNode );