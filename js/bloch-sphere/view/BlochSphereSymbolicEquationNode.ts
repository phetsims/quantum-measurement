// Copyright 2024, University of Colorado Boulder

/**
 * BlochSphereSymbolicEquationNode displays the equation that is used to calculate the expected value of polarization.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import { HBox, HBoxOptions, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import FractionNode from '../../common/view/FractionNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
type BlochSphereSymbolicEquationNodeOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

const EQUATION_FONT = new MathSymbolFont( 17 );
const THETA = QuantumMeasurementConstants.THETA;
const PHI = QuantumMeasurementConstants.PHI;
const PSI = QuantumMeasurementConstants.PSI;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class BlochSphereSymbolicEquationNode extends HBox {

  public constructor( providedOptions?: BlochSphereSymbolicEquationNodeOptions ) {

    const richTextEquationOptions = { font: EQUATION_FONT };
    const newRichText = ( text: string ) => new RichText( text, richTextEquationOptions );
    const psiEqualsCos = newRichText( `|${PSI}⟩ = cos` );
    const upPlusSin = newRichText( `|${UP}${KET} + sin` );
    const downKet = newRichText( `e<sup>i${PHI}</sup>|${DOWN}${KET}` );

    const parenthesesOptions: RichTextOptions = {
      font: new MathSymbolFont( 17 ),
      scale: new Vector2( 1, 2 )
    };

    const options = optionize<BlochSphereSymbolicEquationNodeOptions, SelfOptions, HBoxOptions>()( {
      spacing: 3,
      align: 'center',
      children: [
        psiEqualsCos,
        new RichText( '(', parenthesesOptions ),
        new FractionNode( newRichText( THETA ), newRichText( '2' ), { scale: 0.8 } ),
        new RichText( ')', parenthesesOptions ),
        upPlusSin,
        new RichText( '(', parenthesesOptions ),
        new FractionNode( newRichText( THETA ), newRichText( '2' ), { scale: 0.8 } ),
        new RichText( ')', parenthesesOptions ),
        downKet
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'BlochSphereSymbolicEquationNode', BlochSphereSymbolicEquationNode );