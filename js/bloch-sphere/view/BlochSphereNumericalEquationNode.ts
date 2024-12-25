// Copyright 2024, University of Colorado Boulder

/**
 * BlochSphereNumericalEquationNode displays the equation that is used to calculate the expected value of polarization.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import { HBox, HBoxOptions, RichText } from '../../../../scenery/js/imports.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import BlochSphereModel from '../model/BlochSphereModel.js';

type SelfOptions = EmptySelfOptions;
type BlochSphereNumericalEquationNodeOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

const EQUATION_FONT = new MathSymbolFont( 17 );
const PI = QuantumMeasurementConstants.PI;
const PSI = QuantumMeasurementConstants.PSI;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class BlochSphereNumericalEquationNode extends HBox {

  public constructor( model: BlochSphereModel, providedOptions?: BlochSphereNumericalEquationNodeOptions ) {

    const equationNode = new RichText( new DerivedStringProperty(
      [
        model.upCoefficientProperty,
        model.downCoefficientProperty,
        model.phaseFactorProperty
      ],
      ( upCoefficient: number, downCoefficient: number, phaseFactor: number ) => {
        const upCoefficientString = Utils.toFixed( upCoefficient, 2 );
        const downCoefficientString = Utils.toFixed( downCoefficient, 2 );
        const azimuthalCoefficientString = Utils.toFixed( phaseFactor, 2 );

        return `|${PSI}⟩ = ${upCoefficientString}|${UP}${KET} + ${downCoefficientString}e<sup>i${azimuthalCoefficientString}${PI}</sup>|${DOWN}${KET}`;
      }
    ), { font: EQUATION_FONT } );

    const options = optionize<BlochSphereNumericalEquationNodeOptions, SelfOptions, HBoxOptions>()( {
      align: 'center',
      children: [ equationNode ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'BlochSphereNumericalEquationNode', BlochSphereNumericalEquationNode );