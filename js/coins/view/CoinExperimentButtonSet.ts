// Copyright 2024, University of Colorado Boulder


/**
 * CoinExperimentButtonSet is a UI component that triggers the actions that can occur in the coin experiments, such as
 * flipping the coin and revealing the result.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, Node, Color, NodeOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import { SystemType } from '../../common/model/SystemType.js';
import TwoStateSystem from '../../common/model/TwoStateSystem.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
export type CoinExperimentButtonSetOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const BUTTON_COLOR = new Color( '#0ffdfd' );
const BUTTON_FONT = new PhetFont( 14 );
const BUTTON_WIDTH = 160; // empirically determined to match spec

export default class CoinExperimentButtonSet extends VBox {

  public constructor( system: TwoStateSystem<string> | TwoStateSystemSet<string>,
                      systemType: SystemType,
                      testBoxReadyProperty: TProperty<boolean>,
                      providedOptions: CoinExperimentButtonSetOptions ) {

    // Create an enabledProperty for the buttons, since interaction with the test boxes is only possible if they have
    // coins in them and the coins are not in the process of being prepared (e.g. flipped).
    const buttonsEnabledProperty = new DerivedProperty(
      [ testBoxReadyProperty, system.measurementStateProperty ],
      ( testBoxReady, coinState ) => testBoxReady && coinState !== 'preparingToBeMeasured'
    );

    // common options for all buttons in the set
    const commonButtonOptions: TextPushButtonOptions = {
      baseColor: BUTTON_COLOR,
      font: BUTTON_FONT,
      minWidth: BUTTON_WIDTH,
      maxWidth: BUTTON_WIDTH,
      enabledProperty: buttonsEnabledProperty
    };

    // Create the text for the button whose label changes based on the state.
    const revealHideButtonTextProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.hideStringProperty,
        QuantumMeasurementStrings.revealStringProperty,
        QuantumMeasurementStrings.observeStringProperty,
        system.measurementStateProperty
      ],
      ( hideString, revealString, observeString, experimentState ) => {
        let labelString;
        if ( experimentState === 'measuredAndRevealed' ) {
          labelString = hideString;
        }
        else if ( systemType === 'classical' ) {
          labelString = revealString;
        }
        else {
          labelString = observeString;
        }
        return labelString;
      }
    );

    // Create the button that will be used to hide and reveal the coin without re-preparing it.
    const revealHideButton = new TextPushButton(
      revealHideButtonTextProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => {
          if ( system.measurementStateProperty.value === 'readyToBeMeasured' ) {
            system.measure();
          }
          else if ( system.measurementStateProperty.value === 'measuredAndRevealed' ) {
            system.hide();
          }
        },
        tandem: providedOptions.tandem.createTandem( 'revealHideButton' )
      } )
    );

    const flipOrReprepareButton = new TextPushButton(
      systemType === 'classical' ?
      QuantumMeasurementStrings.flipStringProperty :
      QuantumMeasurementStrings.reprepareStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => system.prepare(),
        tandem: providedOptions.tandem.createTandem( 'flipOrReprepareButton' )
      } )
    );

    const flipOrReprepareAndRevealButton = new TextPushButton(
      systemType === 'classical' ?
      QuantumMeasurementStrings.flipAndRevealStringProperty :
      QuantumMeasurementStrings.reprepareAndRevealStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => system.prepare( true ),
        tandem: providedOptions.tandem.createTandem( 'flipOrReprepareAndRevealButton' )
      } )
    );

    const numberOfCoinsStringProperty = new DerivedStringProperty(
      [ system.numberOfActiveSystemsProperty ],
      numberOfCoins => StringUtils.fillIn(
        QuantumMeasurementStrings.numberOfCoinsPatternStringProperty,
        { number: numberOfCoins }
      )
    );

    const numberOfSystemsText = system.numberOfActiveSystemsProperty.value !== 1 ?
                                new Text( numberOfCoinsStringProperty, { font: new PhetFont( 16 ) } ) : new Node();

    const options = optionize<CoinExperimentButtonSetOptions, SelfOptions, VBoxOptions>()( {
      spacing: 10,
      children: [
        numberOfSystemsText,
        revealHideButton,
        flipOrReprepareButton,
        flipOrReprepareAndRevealButton
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'CoinExperimentButtonSet', CoinExperimentButtonSet );