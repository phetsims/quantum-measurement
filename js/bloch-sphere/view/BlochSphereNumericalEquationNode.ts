// Copyright 2024-2025, University of Colorado Boulder

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
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HBoxOptions, RichText } from '../../../../scenery/js/imports.js';
import AbstractBlochSphere from '../../common/model/AbstractBlochSphere.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { StateDirection } from '../model/StateDirection.js';

type SelfOptions = {
  basisProperty?: TReadOnlyProperty<StateDirection>;
};
type BlochSphereNumericalEquationNodeOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

const EQUATION_FONT = new PhetFont( 17 );
const PI = MathSymbols.PI;
const PSI = MathSymbols.PSI;
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
      ( polarAngle, azimuthalAngle, basis ) => {

        let upCoefficientValue;
        let downCoefficientValue;
        let azimuthalCoefficientValue;

        const projectionToCoefficient = ( value: number ) => {
          return Math.sqrt( ( value + 1 ) / 2 );
        };

        switch( basis ) {
          case StateDirection.X_PLUS:
            upCoefficientValue = projectionToCoefficient( Math.cos( azimuthalAngle ) * Math.sin( polarAngle ) );
            downCoefficientValue = projectionToCoefficient( -Math.cos( azimuthalAngle ) * Math.sin( polarAngle ) );
            azimuthalCoefficientValue = 0;
            break;
          case StateDirection.Y_PLUS:
            upCoefficientValue = projectionToCoefficient( Math.sin( azimuthalAngle ) * Math.sin( polarAngle ) );
            downCoefficientValue = projectionToCoefficient( -Math.sin( azimuthalAngle ) * Math.sin( polarAngle ) );
            azimuthalCoefficientValue = 0;
            break;
          default: // StateDirection.Z_PLUS
            upCoefficientValue = Math.abs( Math.cos( polarAngle / 2 ) );
            downCoefficientValue = Math.abs( Math.sin( polarAngle / 2 ) );
            azimuthalCoefficientValue = azimuthalAngle / Math.PI;
            break;
        }

        // Update the coefficients of the state equation.
        const upCoefficientString = Utils.toFixed( upCoefficientValue, 2 );
        const downCoefficientString = Utils.toFixed( downCoefficientValue, 2 );
        const azimuthalCoefficientString = Utils.toFixed( azimuthalCoefficientValue, 2 );

        const direction = basis.description.split( '' )[ 1 ];

        const zero = 1e-5;
        const one = 1 - zero;
        const upPart = upCoefficientValue > zero ? upCoefficientValue < one ?
                                                        `${upCoefficientString} |${UP}<sub>${direction}</sub> ${KET}` :
                                                        `|${UP}<sub>${direction}</sub> ${KET}` :
                                                        '';
        const plus = upCoefficientValue > zero && downCoefficientValue > zero ? ' + ' : '';
        const downPart = downCoefficientValue > zero ? downCoefficientValue < one ?
                                                              `${downCoefficientString}e<sup>i${azimuthalCoefficientString}${PI}</sup> |${DOWN}<sub>${direction}</sub> ${KET}` :
                                                              `|${DOWN}<sub>${direction}</sub> ${KET}` :
                                                              '';

        return `|${PSI}⟩ = ${upPart}${plus}${downPart}`;
      }
    ), { font: EQUATION_FONT } );

    super( options );

    this.addChild( equationNode );
  }
}

quantumMeasurement.register( 'BlochSphereNumericalEquationNode', BlochSphereNumericalEquationNode );