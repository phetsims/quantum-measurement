// Copyright 2024, University of Colorado Boulder

/**
 * ExpectationValueControl is a view element that allows the user to control the visibility of the expectation value
 * line in the normalized outcome vector graph.  It also displays, under the right conditions, the expectation value.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, HBoxOptions, Line, Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
type ExpectationValueControlOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class ExpectationValueControl extends HBox {

  public constructor( expectationValueLineVisibleProperty: BooleanProperty,
                      normalizedExpectationValueProperty: TReadOnlyProperty<number | null>,
                      showDecimalValuesProperty: TReadOnlyProperty<boolean>,
                      providedOptions: ExpectationValueControlOptions ) {

    const expectationValueCheckbox = new Checkbox(
      expectationValueLineVisibleProperty,
      new Text( QuantumMeasurementStrings.expectationValueStringProperty, { font: new PhetFont( 18 ) } ),
      {
        tandem: providedOptions.tandem.createTandem( 'expectationValueCheckbox' ),
        phetioVisiblePropertyInstrumented: false // Remove the whole control if checkbox isn't desired.
      }
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

    const options = optionize<ExpectationValueControlOptions, SelfOptions, HBoxOptions>()( {
      children: [ expectationValueCheckbox, expectationValueLineIcon, expectationValueNumberDisplay ],
      spacing: 8
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'ExpectationValueControl', ExpectationValueControl );