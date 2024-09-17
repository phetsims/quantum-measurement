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
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

export default class ProbabilityEquationsNode extends RichText {

  public constructor( biasProperty: TReadOnlyProperty<number>, systemType: SystemType ) {
    const equationsStringProperty = new DerivedProperty( [
      biasProperty,
      QuantumMeasurementStrings.classicalUpSymbolStringProperty,
      QuantumMeasurementStrings.classicalDownSymbolStringProperty,
      QuantumMeasurementStrings.quantumUpSymbolStringProperty,
      QuantumMeasurementStrings.quantumDownSymbolStringProperty
    ], ( bias, classicalUp, classicalDown, quantumUp, quantumDown ) => {
      const upperFunctionParameter = systemType === 'classical' ? classicalUp : quantumUp;
      const lowerFunctionParameter = systemType === 'classical' ? classicalDown : quantumDown;
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