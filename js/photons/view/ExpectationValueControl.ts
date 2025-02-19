// Copyright 2024-2025, University of Colorado Boulder

/**
 * ExpectationValueControl is a view element that allows the user to control the visibility of the expectation value
 * line in the normalized outcome vector graph. It also displays, under the right conditions, the expectation value.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = { checkboxOptions?: CheckboxOptions };
type ExpectationValueControlOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class ExpectationValueControl extends HBox {

  public constructor( expectationValueLineVisibleProperty: BooleanProperty,
                      normalizedExpectationValueProperty: TReadOnlyProperty<number | null>,
                      showDecimalValuesProperty: TReadOnlyProperty<boolean>,
                      providedOptions: ExpectationValueControlOptions ) {

    const options = optionize<ExpectationValueControlOptions, SelfOptions, HBoxOptions>()( {
      spacing: 8,
      checkboxOptions: {
        tandem: providedOptions.tandem.createTandem( 'expectationValueCheckbox' ),
        phetioVisiblePropertyInstrumented: false // Remove the whole control if checkbox isn't desired.
      }
    }, providedOptions );

    const expectationValueCheckbox = new Checkbox(
      expectationValueLineVisibleProperty,
      new Text( QuantumMeasurementStrings.expectationValueStringProperty, {
        font: new PhetFont( 18 ),
        maxWidth: 250
      } ),
      options.checkboxOptions
    );

    const expectationValueLineIcon = new Line( 0, 0, 30, 0, {
      stroke: QuantumMeasurementColors.photonBaseColorProperty,
      lineWidth: 3
    } );

    const expectationValueNumberDisplay = new NumberDisplay(
      normalizedExpectationValueProperty,
      new Range( -1, 1 ),
      {
        decimalPlaces: 2,
        backgroundStroke: null,
        visibleProperty: DerivedProperty.and( [ expectationValueLineVisibleProperty, showDecimalValuesProperty ] ),
        textOptions: {
          font: new PhetFont( 14 )
        }
      }
    );

    options.children = [ expectationValueCheckbox, expectationValueLineIcon, expectationValueNumberDisplay ];

    super( options );
  }
}

quantumMeasurement.register( 'ExpectationValueControl', ExpectationValueControl );