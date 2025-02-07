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
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import QuantumMeasurementPreferences from '../../common/model/QuantumMeasurementPreferences.js';
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
        options.basisProperty,
        QuantumMeasurementPreferences.showGlobalPhaseProperty
      ],
      ( polarAngle, azimuthalAngle, rotatingSpeed, basis, showGlobalPhase ) => {

        // Helper function that maps from projection space [-1,1], temporarily to probability space [0,1],
        // and finally to coefficient space [0,1], which is the square root of the probability.
        const projectionToCoefficient = ( value: number ) => {
          // Convert [-1, 1] projection to [0,1] probability, then take sqrt => amplitude
          return Math.sqrt( ( value + 1 ) / 2 );
        };

        // Equation coefficients in the Z basis
        const a = Math.cos( polarAngle / 2 );
        const b = Math.sin( polarAngle / 2 );

        let upCoefficientValue = 0;
        let downCoefficientValue = 0;
        let azimuthalCoefficientValue = 0;

        // phiPlus, phiMinus for factoring out the global phase in X or Y directions
        let phiPlus = 0;
        let phiMinus = 0;

        // These calculations are better described and discussed in https://github.com/phetsims/quantum-measurement/issues/82
        switch( basis ) {

          case StateDirection.X_PLUS:
            upCoefficientValue = projectionToCoefficient( Math.cos( azimuthalAngle ) * Math.sin( polarAngle ) );
            downCoefficientValue = projectionToCoefficient( -Math.cos( azimuthalAngle ) * Math.sin( polarAngle ) );

            // These come from the spherical/bloch geometry for X
            phiPlus = Math.atan2( b * Math.sin( azimuthalAngle ), a + b * Math.cos( azimuthalAngle ) ) / Math.PI;
            phiMinus = Math.atan2( -b * Math.sin( azimuthalAngle ), a - b * Math.cos( azimuthalAngle ) ) / Math.PI;

            // The relative phase used in the second ket component
            azimuthalCoefficientValue = phiMinus - phiPlus;
            break;

          case StateDirection.Y_PLUS:
            upCoefficientValue = projectionToCoefficient( Math.sin( azimuthalAngle ) * Math.sin( polarAngle ) );
            downCoefficientValue = projectionToCoefficient( -Math.sin( azimuthalAngle ) * Math.sin( polarAngle ) );

            // These come from the spherical/bloch geometry for Y
            phiPlus = Math.atan2( b * Math.cos( azimuthalAngle ), a + b * Math.sin( azimuthalAngle ) ) / Math.PI;
            phiMinus = Math.atan2( -b * Math.cos( azimuthalAngle ), a - b * Math.sin( azimuthalAngle ) ) / Math.PI;

            // The relative phase used in the second ket component
            azimuthalCoefficientValue = phiMinus - phiPlus;
            break;

          default: // StateDirection.Z_PLUS
            upCoefficientValue = Math.abs( Math.cos( polarAngle / 2 ) );
            downCoefficientValue = Math.abs( Math.sin( polarAngle / 2 ) );
            azimuthalCoefficientValue = azimuthalAngle / Math.PI;
            break;
        }

        // Normalize the relative phase to be between 0 and 2, so it doesn't appear negative
        if ( azimuthalCoefficientValue < 0 ) {
          azimuthalCoefficientValue += 2;
        }

        // Convert numbers to strings
        const upCoefficientString = Utils.toFixed( upCoefficientValue, 2 );
        const downCoefficientString = Utils.toFixed( downCoefficientValue, 2 );
        const azimuthalCoefficientString = Utils.toFixed( azimuthalCoefficientValue, 2 );

        // Basis letter: e.g. "X_PLUS" => 'X', "Z_PLUS" => 'Z', etc.
        const direction = basis.description.split( '' )[ 1 ];

        // For threshold-based simplifications (coefficient ~ 0 or ~ 1)
        const zero = 1e-5;
        const one = 1 - zero;

        // Construct the usual "up + down e^{i phase}" parts
        let upComponent = `${upCoefficientString} |${UP}<sub>${direction}</sub> ${KET}`;
        let downComponent = `${downCoefficientString}e<sup>i${azimuthalCoefficientString}${PI}</sup> |${DOWN}<sub>${direction}</sub> ${KET}`;
        let plus = ' + ';

        // If rotatingSpeed === 0, we allow simplification of near-zero or near-1 coefficients
        if ( rotatingSpeed === 0 ) {

          // Hide an entire term if its amplitude is ~ 0
          if ( upCoefficientValue < zero ) {
            upComponent = '';
          }
          if ( downCoefficientValue < zero ) {
            downComponent = '';
          }

          // Hide the plus sign if one term is omitted
          if ( upCoefficientValue < zero || downCoefficientValue < zero ) {
            plus = '';
          }

          // If amplitude ~ 1, we omit the numeric coefficient
          if ( upCoefficientValue > one ) {
            upComponent = `|${UP}<sub>${direction}</sub> ${KET}`;
          }
          if ( downCoefficientValue > one ) {
            downComponent = `|${DOWN}<sub>${direction}</sub> ${KET}`;
          }
        }

        // If showGlobalPhaseProperty is true and basis is X or Y,
        // Show the factored out global phase e^{i phiPlus pi} over the entire state.
        let globalPhasePart = '';
        let finalEquation = `|${PSI}⟩ = ${upComponent}${plus}${downComponent}`;
        if ( showGlobalPhase && ( basis === StateDirection.X_PLUS || basis === StateDirection.Y_PLUS ) ) {

          // Format the global phase as e^{i phiPlus pi} (factored out in front)
          phiPlus < 0 ? phiPlus += 2 : phiPlus;
          const globalPhaseString = Utils.toFixed( phiPlus, 2 );
          globalPhasePart = `e<sup>i${globalPhaseString}${PI}</sup> `;

          finalEquation = `|${PSI}⟩ = (${upComponent}${plus}${downComponent})${globalPhasePart}`;
        }

        return finalEquation;
      }
    ), {
      font: EQUATION_FONT
    } );

    super( options );

    // Add the RichText equation node to this container
    this.addChild( equationNode );
  }
}

quantumMeasurement.register( 'BlochSphereNumericalEquationNode', BlochSphereNumericalEquationNode );