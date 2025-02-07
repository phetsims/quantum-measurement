// Copyright 2024-2025, University of Colorado Boulder

/**
 * ProbabilityEquationsNode shows the probability settings (aka the bias) for the classical or quantum coins depending
 * on how it is configured.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
type ProbabilityEquationsNodeOptions = & PickRequired<NodeOptions, 'tandem'>;

export default class ProbabilityEquationsNode extends Node {

  public constructor( biasProperty: TReadOnlyProperty<number>,
                      systemType: SystemType,
                      providedOptions: ProbabilityEquationsNodeOptions ) {

    const equationsStringProperty = new DerivedProperty(
      [
        biasProperty,
        QuantumMeasurementColors.tailsColorProperty,
        QuantumMeasurementColors.downColorProperty
      ],
      ( bias, tailsColor, downColor ) => {
        const upperFunctionParameter = systemType === 'classical' ? QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL : QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
        const lowerFunctionParameter = systemType === 'classical' ? QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL : QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
        const upperEquation = `P(<b>${upperFunctionParameter}</b>) = ${Utils.toFixed( bias, 2 )}`;
        const COLOR_SPAN = ( text: string ) => ProbabilityEquationsNode.COLOR_SPAN( text, systemType === 'classical' ? tailsColor : downColor );
        const lowerEquation = `P(<b>${COLOR_SPAN( lowerFunctionParameter )}</b>) = ${COLOR_SPAN( Utils.toFixed( 1 - bias, 2 ) )}`;
        return `${upperEquation}<br>${lowerEquation}`;
      }
    );

    const probabilitiesText = new RichText( equationsStringProperty, {
      font: new PhetFont( 18 ),
      leading: 7
    } );

    const options = optionize<ProbabilityEquationsNodeOptions, SelfOptions, RichTextOptions>()( {
      children: [ probabilitiesText ]
    }, providedOptions );

    super( options );
  }

  public static COLOR_SPAN( text: string, color: Color ): string {
    return `<span style="color: ${color.toCSS()};">${text}</span>`;
  }
}

quantumMeasurement.register( 'ProbabilityEquationsNode', ProbabilityEquationsNode );