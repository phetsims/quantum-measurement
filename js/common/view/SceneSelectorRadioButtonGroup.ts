// Copyright 2024-2025, University of Colorado Boulder

/**
 * SceneSelectorRadioButtons is a radio button group with two buttons that allows users to select between two scenes.
 * It was created to meet the design requirements of the first two screens of the Quantum Measurement simulation, but
 * could be generalized if needed.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
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

class SceneSelectorRadioButtonGroup<T extends string> extends RectangularRadioButtonGroup<T> {

  public constructor( property: PhetioProperty<T>,
                      valueToStringMap: Map<T, LocalizedStringProperty>,
                      providedOptions: SceneSelectorRadioButtonGroupOptions ) {

    // REVIEW: This assertion is odd... why are you not able to have multiple radio buttons if the Property supports it?
    assert && assert( valueToStringMap.size === 2, 'SceneSelectorRadioButtonGroup requires exactly two items' );

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
    valueToStringMap.forEach( ( stringProperty, value ) => {
      items.push( {
        createNode: () => {
          return new Text(
            stringProperty,
            {
              font: new PhetFont( { size: 26, weight: 'bold' } ),
              fill: value === 'quantum' ?
                    QuantumMeasurementColors.quantumSceneTextColorProperty :
                    QuantumMeasurementColors.classicalSceneTextColorProperty,
              maxWidth: 300
            }
          );
        },
        value: value,
        tandemName: `${value}RadioButton`,
        options: { minWidth: 80 }
      } );
    } );

    super( property, items, options );
  }
}

quantumMeasurement.register( 'SceneSelectorRadioButtonGroup', SceneSelectorRadioButtonGroup );
export default SceneSelectorRadioButtonGroup;