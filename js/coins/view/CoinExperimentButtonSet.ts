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
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = {
  singleCoin: boolean;
};
export type CoinExperimentButtonSetOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const BUTTON_FONT = new PhetFont( 14 );
const BUTTON_WIDTH = 160; // empirically determined to match spec

export default class CoinExperimentButtonSet extends VBox {

  public constructor( coinSet: TwoStateSystemSet<string>,
                      coinSetInTestBoxProperty: TProperty<boolean>,
                      providedOptions: CoinExperimentButtonSetOptions ) {

    // Create an enabledProperty for the buttons, since interaction with the test boxes is only possible if they have
    // coins in them and the coins are not in the process of being prepared (e.g. flipped).
    const buttonsEnabledProperty = new DerivedProperty(
      [ coinSetInTestBoxProperty, coinSet.measurementStateProperty ],
      ( coinSetInTestBox, coinState ) => coinSetInTestBox && coinState !== 'preparingToBeMeasured'
    );

    // common options for all buttons in the set
    const commonButtonOptions: TextPushButtonOptions = {
      baseColor: QuantumMeasurementColors.experimentButtonColorProperty,
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
        coinSet.measurementStateProperty
      ],
      ( hideString, revealString, observeString, experimentState ) => {
        let labelString;
        if ( experimentState === 'revealed' ) {
          labelString = hideString;
        }
        else if ( coinSet.systemType === 'classical' ) {
          labelString = revealString;
        }
        else {
          labelString = observeString;
        }
        return labelString;
      }
    );

    const coinOrCoins = providedOptions.singleCoin ? 'coin' : 'coins';
    const coinOrSetOfCoins = providedOptions.singleCoin ? 'coin' : 'set of coins';

    // Create the button that will be used to hide and reveal the coin without re-preparing it.
    const revealHideButton = new TextPushButton(
      revealHideButtonTextProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => {
          if ( coinSet.measurementStateProperty.value === 'readyToBeMeasured' ||
               coinSet.measurementStateProperty.value === 'measuredAndHidden' ) {

            coinSet.reveal();
          }
          else if ( coinSet.measurementStateProperty.value === 'revealed' ) {
            coinSet.hide();
          }
        },
        tandem: providedOptions.tandem.createTandem( 'revealHideButton' ),
        accessibleName: revealHideButtonTextProperty,
        helpText: coinSet.systemType === 'classical' ?
                  `Show or hide the ${coinOrCoins}` : `Observe or hide the ${coinOrCoins}`

      } )
    );

    const flipOrReprepareButton = new TextPushButton(
      coinSet.systemType === 'classical' ?
      QuantumMeasurementStrings.flipStringProperty :
      QuantumMeasurementStrings.reprepareStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => coinSet.prepare(),
        tandem: providedOptions.tandem.createTandem( 'flipOrReprepareButton' ),
        accessibleName: coinSet.systemType === 'classical' ?
                        QuantumMeasurementStrings.flipStringProperty :
                        QuantumMeasurementStrings.reprepareStringProperty,
        helpText: coinSet.systemType === 'classical' ?
                  `Flip the ${coinOrCoins} and hide the result` : `Prepare a new ${coinOrSetOfCoins} for observation`
      } )
    );

    const flipOrReprepareAndRevealButton = new TextPushButton(
      coinSet.systemType === 'classical' ?
      QuantumMeasurementStrings.flipAndRevealStringProperty :
      QuantumMeasurementStrings.reprepareAndRevealStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => coinSet.prepare( true ),
        tandem: providedOptions.tandem.createTandem( 'flipOrReprepareAndRevealButton' ),
        accessibleName: coinSet.systemType === 'classical' ?
                        QuantumMeasurementStrings.flipAndRevealStringProperty :
                        QuantumMeasurementStrings.reprepareAndRevealStringProperty,
        helpText: coinSet.systemType === 'classical' ?
                  `Flip the ${coinOrCoins} and reveal the result` : `Reprepare a new ${coinOrSetOfCoins} and observe it`
      } )
    );

    const options = optionize<CoinExperimentButtonSetOptions, SelfOptions, VBoxOptions>()( {
      spacing: 10,
      children: [
        revealHideButton,
        flipOrReprepareButton,
        flipOrReprepareAndRevealButton
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'CoinExperimentButtonSet', CoinExperimentButtonSet );