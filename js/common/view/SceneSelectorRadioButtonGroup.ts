// Copyright 2024-2025, University of Colorado Boulder

/**
 * SceneSelectorRadioButtons is a radio button group with two buttons that allows users to select between two scenes.
 * It was created to meet the design requirements of the first two screens of the Quantum Measurement simulation, but
 * could be generalized if needed.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementColors from '../QuantumMeasurementColors.js';

type SelfOptions = EmptySelfOptions;
export type SceneSelectorRadioButtonGroupOptions = SelfOptions & WithRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

// constants
const DESELECTED_RADIO_BUTTON_OPACITY = 0.3;

// Type constraint for EnumerationValue with title
type EnumerationValueWithTitle = EnumerationValue & {
  readonly title: TReadOnlyProperty<string>;
  readonly tandemName: string;
};

class SceneSelectorRadioButtonGroup<T extends EnumerationValueWithTitle> extends RectangularRadioButtonGroup<T> {

  public constructor( property: PhetioProperty<T>,
                      providedOptions: SceneSelectorRadioButtonGroupOptions ) {

    // Get the enumeration values from the property's current value
    const enumValues = property.value.enumeration.values;

    // Assert that there are exactly two values
    assert && assert( enumValues.length === 2, 'SceneSelectorRadioButtonGroup requires exactly two items' );

    const options = optionize<SceneSelectorRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {
      orientation: 'horizontal',
      spacing: 3,
      y: 10,
      radioButtonOptions: {
        xMargin: 10,
        baseColor: QuantumMeasurementColors.selectorButtonSelectedColorProperty,
        stroke: QuantumMeasurementColors.selectorButtonSelectedStrokeProperty,
        buttonAppearanceStrategyOptions: {
          deselectedButtonOpacity: DESELECTED_RADIO_BUTTON_OPACITY,
          deselectedFill: QuantumMeasurementColors.selectorButtonDeselectedColorProperty,
          deselectedStroke: QuantumMeasurementColors.selectorButtonDeselectedStrokeProperty
        },
        contentAppearanceStrategyOptions: {
          deselectedContentOpacity: DESELECTED_RADIO_BUTTON_OPACITY
        }
      }
    }, providedOptions );

    const items: RectangularRadioButtonGroupItem<T>[] = [];

    // Create radio buttons for each enumeration value
    enumValues.forEach( value => {
      items.push( {
        createNode: () => {
          return new Text(
            value.title,
            {
              font: new PhetFont( { size: 26, weight: 'bold' } ),
              // Determine fill color based on value name
              fill: value.name === 'SINGLE_PHOTON' ?
                    QuantumMeasurementColors.quantumSceneTextColorProperty :
                    QuantumMeasurementColors.classicalSceneTextColorProperty,
              maxWidth: 300
            }
          );
        },
        value: value,
        tandemName: `${value.tandemName}RadioButton`,
        options: { minWidth: 80 }
      } );
    } );

    super( property, items, options );
  }
}

quantumMeasurement.register( 'SceneSelectorRadioButtonGroup', SceneSelectorRadioButtonGroup );
export default SceneSelectorRadioButtonGroup;