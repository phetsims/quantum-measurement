// Copyright 2024, University of Colorado Boulder


/**
 * ProbabilityEquationsNode shows the probability settings (aka the bias) for the physical or quantum coins depending on
 * how it is configured.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { RichText } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { SystemType } from '../../common/model/SystemType.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';

const UP_ARROW_CHARACTER = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN_ARROW_CHARACTER = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;

export default class ProbabilityEquationsNode extends RichText {

  public constructor( biasProperty: TReadOnlyProperty<number>, systemType: SystemType ) {

    const upperFunctionParameter = systemType === 'physical' ? 'H' : UP_ARROW_CHARACTER;
    const lowerFunctionParameter = systemType === 'physical' ? 'T' : DOWN_ARROW_CHARACTER;

    const equationsStringProperty = new DerivedProperty( [ biasProperty ], bias => {
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