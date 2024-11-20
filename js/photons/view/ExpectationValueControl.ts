// Copyright 2024, University of Colorado Boulder

/**
 * ExpectationValueControl is a view element that allows the user to control the visibility of the expectation value
 * line in the normalized outcome vector graph.  It also displays the equation for the expectation value.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Line, RichText, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
type ExpectationValueControlOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class ExpectationValueControl extends VBox {

  public constructor( expectationValueLineVisibleProperty: BooleanProperty,
                      providedOptions: ExpectationValueControlOptions ) {

    const expectationValueCheckbox = new Checkbox(
      expectationValueLineVisibleProperty,
      new Text( QuantumMeasurementStrings.expectationValueStringProperty, { font: new PhetFont( 18 ) } ),
      { tandem: providedOptions.tandem.createTandem( 'expectationValueCheckbox' ) }
    );
    const expectationValueLineIcon = new Line( 0, 0, 30, 0, {
      stroke: QuantumMeasurementColors.photonBaseColorProperty,
      lineWidth: 3
    } );
    const expectationValueControl = new HBox( {
      children: [ expectationValueCheckbox, expectationValueLineIcon ],
      spacing: 15
    } );

    const expectationValueEquationStringProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.polarizationStringProperty,
        QuantumMeasurementStrings.PStringProperty,
        QuantumMeasurementStrings.VStringProperty,
        QuantumMeasurementStrings.HStringProperty
      ],
      ( polarizationString, PString, VString, HString ) => {
        const colorizedVString = QuantumMeasurementConstants.CREATE_COLOR_SPAN(
          VString,
          QuantumMeasurementColors.verticalPolarizationColorProperty.value
        );
        const colorizedHString = QuantumMeasurementConstants.CREATE_COLOR_SPAN(
          HString,
          QuantumMeasurementColors.horizontalPolarizationColorProperty.value
        );
        return `<${polarizationString}> = ${PString}(${colorizedVString}) - ${PString}(${colorizedHString})`;
      }
    );
    const expectationValueEquationNode = new RichText( expectationValueEquationStringProperty, {
      font: new MathSymbolFont( 18 )
    } );

    const options = optionize<ExpectationValueControlOptions, SelfOptions, VBoxOptions>()( {
      children: [ expectationValueControl, expectationValueEquationNode ],
      spacing: 10
    }, providedOptions );


    super( options );
  }
}

quantumMeasurement.register( 'ExpectationValueControl', ExpectationValueControl );