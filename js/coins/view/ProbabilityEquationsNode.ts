// Copyright 2024, University of Colorado Boulder


/**
 * ProbabilityEquationsNode shows the probability settings (aka the bias) for the classical or quantum coins depending
 * on how it is configured.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class ProbabilityEquationsNode extends RichText {

  public constructor( biasProperty: TReadOnlyProperty<number>, systemType: SystemType ) {
    const equationsStringProperty = new DerivedProperty( [ biasProperty ], bias => {

      // TODO: Include color into the span https://github.com/phetsims/quantum-measurement/issues/49

      const upperFunctionParameter = systemType === 'classical' ? QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL : QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
      const lowerFunctionParameter = systemType === 'classical' ? QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL : QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
      const upperEquation = `P(<b>${upperFunctionParameter}</b>) = ${Utils.toFixed( bias, 2 )}`;
      const lowerEquation = `P(<span style="color: magenta;"><b>${lowerFunctionParameter}</b></span>) = <span style="color: magenta;">${Utils.toFixed( 1 - bias, 2 )}</span>`;
      return `${upperEquation}<br>${lowerEquation}`;
    } );

    super( equationsStringProperty, {
      font: new PhetFont( 18 ),
      leading: 7
    } );
  }
}

quantumMeasurement.register( 'ProbabilityEquationsNode', ProbabilityEquationsNode );