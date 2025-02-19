// Copyright 2025, University of Colorado Boulder

/**
 * ExpectationValueVectorControl is a view element that allows the user to control the visibility of the expectation
 * value vector in another view component. It is basically just a checkbox with an arrow that represents the vector.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = { checkboxOptions?: CheckboxOptions };
type ExpectationValueVectorControlOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class ExpectationValueVectorControl extends HBox {

  public constructor( vectorVisibleProperty: BooleanProperty,
                      providedOptions: ExpectationValueVectorControlOptions ) {

    const options = optionize<ExpectationValueVectorControlOptions, SelfOptions, HBoxOptions>()( {
      spacing: 10,
      checkboxOptions: {
        tandem: providedOptions.tandem.createTandem( 'vectorRepresentationCheckbox' ),
        phetioVisiblePropertyInstrumented: false // Remove the whole control if checkbox isn't desired.
      }
    }, providedOptions );

    const expectationValueCheckbox = new Checkbox(
      vectorVisibleProperty,
      new Text( QuantumMeasurementStrings.vectorRepresentationStringProperty, {
        font: new PhetFont( 18 ),
        maxWidth: 250
      } ),
      options.checkboxOptions
    );
    const vectorIcon = new ArrowNode( 0, 0, 26, 0, {
      fill: Color.BLACK,
      tailWidth: 3,
      headWidth: 12
    } );

    options.children = [ expectationValueCheckbox, vectorIcon ];

    super( options );
  }
}

quantumMeasurement.register( 'ExpectationValueVectorControl', ExpectationValueVectorControl );