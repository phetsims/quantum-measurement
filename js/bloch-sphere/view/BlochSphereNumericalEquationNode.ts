// Copyright 2024, University of Colorado Boulder

/**
 * BlochSphereNumericalEquationNode displays the equation that is used to calculate the expected value of polarization.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import { HBox, HBoxOptions, RichText } from '../../../../scenery/js/imports.js';
import AbstractBlochSphere from '../../common/model/AbstractBlochSphere.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { StateDirection } from '../model/StateDirection.js';

type SelfOptions = {
  basisProperty?: TReadOnlyProperty<StateDirection>;
};
type BlochSphereNumericalEquationNodeOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

const EQUATION_FONT = new MathSymbolFont( 17 );
const PI = QuantumMeasurementConstants.PI;
const PSI = QuantumMeasurementConstants.PSI;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class BlochSphereNumericalEquationNode extends HBox {

  public constructor( blochSphere: AbstractBlochSphere, providedOptions?: BlochSphereNumericalEquationNodeOptions ) {

    const options = optionize<BlochSphereNumericalEquationNodeOptions, SelfOptions, HBoxOptions>()( {
      align: 'center',
      basisProperty: new Property( StateDirection.Z_PLUS )
    }, providedOptions );

    const equationNode = new RichText( new DerivedStringProperty(
      [
        blochSphere.polarAngleProperty,
        blochSphere.azimuthalAngleProperty,
        options.basisProperty
      ],
      ( polarAngle, azimuthalAngle, basisProperty ) => {

        // Update the coefficients of the state equation.
        const upCoefficientString = Utils.toFixed( Math.cos( polarAngle / 2 ), 2 );
        const downCoefficientString = Utils.toFixed( Math.sin( polarAngle / 2 ), 2 );
        const azimuthalCoefficientString = Utils.toFixed( azimuthalAngle / Math.PI, 2 );

        const direction = basisProperty.description.split( '' )[ 1 ];

        return `|${PSI}⟩ = ${upCoefficientString} |${UP}<sub>${direction}</sub> ${KET} + ` +
               `${downCoefficientString}e<sup>i${azimuthalCoefficientString}${PI}</sup> |${DOWN}<sub>${direction}</sub> ${KET}`;
      }
    ), { font: EQUATION_FONT } );

    super( options );

    this.addChild( equationNode );
  }
}

quantumMeasurement.register( 'BlochSphereNumericalEquationNode', BlochSphereNumericalEquationNode );