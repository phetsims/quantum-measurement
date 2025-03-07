// Copyright 2024-2025, University of Colorado Boulder

/**
 * ProbabilityEquationsNode shows the probability settings (aka the bias) for the classical or quantum coins.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
type ProbabilityEquationsNodeOptions = SelfOptions & WithRequired<RichTextOptions, 'tandem'>;

export default class ProbabilityEquationsNode extends RichText {

  public constructor( biasProperty: TReadOnlyProperty<number>,
                      systemType: SystemType,
                      providedOptions: ProbabilityEquationsNodeOptions ) {

    // Set up the parameters that will be used in the equations.
    const upperFunctionParameter = systemType === SystemType.CLASSICAL ?
                                   QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL :
                                   QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
    const lowerFunctionParameter = systemType === SystemType.CLASSICAL ?
                                   QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL :
                                   QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;

    // Set up the string that will be displayed in the RichText node as a Property.
    const equationsStringProperty = new DerivedProperty(
      [
        biasProperty,
        QuantumMeasurementStrings.PStringProperty, // function symbol, "P" in English for probability
        QuantumMeasurementColors.tailsColorProperty,
        QuantumMeasurementColors.downColorProperty
      ],
      ( bias, pString, tailsColor, downColor ) => {
        const upperEquation = `${pString}(<b>${upperFunctionParameter}</b>) = ${toFixed( bias, 2 )}`;
        const COLOR_SPAN = ( text: string ) =>
          ProbabilityEquationsNode.COLOR_SPAN( text, systemType === SystemType.CLASSICAL ? tailsColor : downColor );
        const lowerEquation = `${pString}(<b>${COLOR_SPAN( lowerFunctionParameter )}</b>) = ${COLOR_SPAN( toFixed( 1 - bias, 2 ) )}`;
        return `${upperEquation}<br>${lowerEquation}`;
      }
    );

    const options = optionize<ProbabilityEquationsNodeOptions, SelfOptions, RichTextOptions>()( {
      font: QuantumMeasurementConstants.SUPER_TITLE_FONT,
      align: 'center',
      leading: 7
    }, providedOptions );

    super( equationsStringProperty, options );
  }

  public static COLOR_SPAN( text: string, color: Color ): string {
    return `<span style="color: ${color.toCSS()};">${text}</span>`;
  }
}

quantumMeasurement.register( 'ProbabilityEquationsNode', ProbabilityEquationsNode );