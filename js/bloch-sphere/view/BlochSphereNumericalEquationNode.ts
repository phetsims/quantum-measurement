// Copyright 2024-2025, University of Colorado Boulder

/**
 * BlochSphereNumericalEquationNode displays the equation that is used to calculate the expected value of polarization.
 *
 * @author Agustín Vallejo
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
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ComplexBlochSphere from '../model/ComplexBlochSphere.js';
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

  public constructor( blochSphere: ComplexBlochSphere, providedOptions?: BlochSphereNumericalEquationNodeOptions ) {

    const options = optionize<BlochSphereNumericalEquationNodeOptions, SelfOptions, HBoxOptions>()( {
      align: 'center',
      basisProperty: new Property( StateDirection.Z_PLUS )
    }, providedOptions );

    const equationNode = new RichText( new DerivedStringProperty(
      [
        blochSphere.polarAngleProperty,
        blochSphere.azimuthalAngleProperty,
        blochSphere.rotatingSpeedProperty,
        options.basisProperty
      ],
      ( polarAngle, azimuthalAngle, rotatingSpeed, basis ) => {

        let upCoefficientValue;
        let downCoefficientValue;
        let azimuthalCoefficientValue;


        // Mapping from projection space [-1,1], temporarily to probability space [0,1],
        // and finally to coefficient space [0,1], which is the square root of the probability.
        const projectionToCoefficient = ( value: number ) => {
          return Math.sqrt( ( value + 1 ) / 2 );
        };

        // Equation coefficients in the Z basis, will be used for the basis transformations to X and Y basis.
        const a = Math.cos( polarAngle / 2 );
        const b = Math.sin( polarAngle / 2 );

        let phiPlus: number;
        let phiMinus: number;

        // These calculations are better described and discussed in https://github.com/phetsims/quantum-measurement/issues/82
        switch( basis ) {
          case StateDirection.X_PLUS:
            upCoefficientValue = projectionToCoefficient( Math.cos( azimuthalAngle ) * Math.sin( polarAngle ) );
            downCoefficientValue = projectionToCoefficient( -Math.cos( azimuthalAngle ) * Math.sin( polarAngle ) );

            phiPlus = Math.atan2( b * Math.sin( azimuthalAngle ), a + b * Math.cos( azimuthalAngle ) ) / Math.PI;
            phiMinus = Math.atan2( -b * Math.sin( azimuthalAngle ), a - b * Math.cos( azimuthalAngle ) ) / Math.PI;
            azimuthalCoefficientValue = phiMinus - phiPlus;

            break;
          case StateDirection.Y_PLUS:
            upCoefficientValue = projectionToCoefficient( Math.sin( azimuthalAngle ) * Math.sin( polarAngle ) );
            downCoefficientValue = projectionToCoefficient( -Math.sin( azimuthalAngle ) * Math.sin( polarAngle ) );

            phiPlus = Math.atan2( b * Math.cos( azimuthalAngle ), a + b * Math.sin( azimuthalAngle ) ) / Math.PI;
            phiMinus = Math.atan2( -b * Math.cos( azimuthalAngle ), a - b * Math.sin( azimuthalAngle ) ) / Math.PI;
            azimuthalCoefficientValue = phiMinus - phiPlus;
            break;
          default: // StateDirection.Z_PLUS
            upCoefficientValue = Math.abs( Math.cos( polarAngle / 2 ) );
            downCoefficientValue = Math.abs( Math.sin( polarAngle / 2 ) );
            azimuthalCoefficientValue = azimuthalAngle / Math.PI;
            break;
        }

        // Normalize the azimuthal coefficient to be between 0 and 2.
        azimuthalCoefficientValue < 0 ? azimuthalCoefficientValue += 2 : null;

        // Update the coefficients of the state equation.
        const upCoefficientString = Utils.toFixed( upCoefficientValue, 2 );
        const downCoefficientString = Utils.toFixed( downCoefficientValue, 2 );
        const azimuthalCoefficientString = Utils.toFixed( azimuthalCoefficientValue, 2 );

        const direction = basis.description.split( '' )[ 1 ];

        // Thresholds to avoid displaying the coefficients when they are 0 or 1.
        const zero = 1e-5;
        const one = 1 - zero;

        let upComponent = `${upCoefficientString} |${UP}<sub>${direction}</sub> ${KET}`;
        let downComponent = `${downCoefficientString}e<sup>i${azimuthalCoefficientString}${PI}</sup> |${DOWN}<sub>${direction}</sub> ${KET}`;
        let plus = ' + ';

        // If there is no rotation, allow some simplification of the equation
        // Usually, if one coefficient is 0, the other one is 1. But they are handled separately anyway.
        if ( rotatingSpeed === 0 ) {

          // Remove the entire component when the coefficient is aprox equal to 0. i.e.
          upCoefficientValue < zero ? upComponent = '' : null;
          downCoefficientValue < zero ? downComponent = '' : null;

          // Remove the plus sign when one of the coefficients is 0.
          upCoefficientValue < zero || downCoefficientValue < zero ? plus = '' : null;

          // Don't show the coefficient if it's aprox equal to 1. i.e. |psi>=|up_Z>
          upCoefficientValue > one ? upComponent = `|${UP}<sub>${direction}</sub> ${KET}` : null;
          downCoefficientValue > one ? downComponent = `|${DOWN}<sub>${direction}</sub> ${KET}` : null;
        }

        return `|${PSI}⟩ = ${upComponent}${plus}${downComponent}`;
      }
    ), { font: EQUATION_FONT } );

    super( options );

    this.addChild( equationNode );
  }
}

quantumMeasurement.register( 'BlochSphereNumericalEquationNode', BlochSphereNumericalEquationNode );