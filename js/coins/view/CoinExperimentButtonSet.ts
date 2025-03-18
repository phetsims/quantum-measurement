// Copyright 2024-2025, University of Colorado Boulder


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
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinSet from '../model/CoinSet.js';

type SelfOptions = {
  singleCoin: boolean;
};
export type CoinExperimentButtonSetOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const BUTTON_FONT = QuantumMeasurementConstants.CONTROL_FONT;
const BUTTON_WIDTH = 180; // empirically determined to match spec

export default class CoinExperimentButtonSet extends VBox {

  // Exposing the revealHideButton to focus it.
  public readonly focusOnRevealButton: () => void;

  public constructor( coinSet: CoinSet,
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
        else if ( coinSet.coinType === SystemType.CLASSICAL ) {
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
        tandem: providedOptions.tandem.createTandem(
          coinSet.coinType === SystemType.CLASSICAL ? 'revealHideButton' : 'observeHideButton'
        ),
        accessibleName: revealHideButtonTextProperty,
        accessibleHelpText: coinSet.coinType === SystemType.CLASSICAL ?
                            `Show or hide the ${coinOrCoins}` :
                            `Observe or hide the ${coinOrCoins}`

      } )
    );

    const flipButton = new TextPushButton(
      coinSet.coinType === SystemType.CLASSICAL ?
      QuantumMeasurementStrings.flipStringProperty :
      QuantumMeasurementStrings.reprepareStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => coinSet.prepare(),
        tandem: providedOptions.tandem.createTandem(
          coinSet.coinType === SystemType.CLASSICAL ? 'flipButton' : 'reprepareButton'
        ),
        accessibleName: coinSet.coinType === SystemType.CLASSICAL ?
                        QuantumMeasurementStrings.flipStringProperty :
                        QuantumMeasurementStrings.reprepareStringProperty,
        accessibleHelpText: coinSet.coinType === SystemType.CLASSICAL ?
                            `Flip the ${coinOrCoins} and hide the result` : `Prepare a new ${coinOrSetOfCoins} for observation`
      } )
    );

    const flipAndRevealButton = new TextPushButton(
      coinSet.coinType === SystemType.CLASSICAL ?
      QuantumMeasurementStrings.flipAndRevealStringProperty :
      QuantumMeasurementStrings.reprepareAndRevealStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => coinSet.prepare( true ),
        tandem: providedOptions.tandem.createTandem(
          coinSet.coinType === SystemType.CLASSICAL ? 'flipAndRevealButton' : 'reprepareAndObserveButton'
        ),
        accessibleName: coinSet.coinType === SystemType.CLASSICAL ?
                        QuantumMeasurementStrings.flipAndRevealStringProperty :
                        QuantumMeasurementStrings.reprepareAndRevealStringProperty,
        accessibleHelpText: coinSet.coinType === SystemType.CLASSICAL ?
                            `Flip the ${coinOrCoins} and reveal the result` : `Reprepare a new ${coinOrSetOfCoins} and observe it`
      } )
    );

    const options = optionize<CoinExperimentButtonSetOptions, SelfOptions, VBoxOptions>()( {
      spacing: 10,
      children: [
        revealHideButton,
        flipButton,
        flipAndRevealButton
      ]
    }, providedOptions );

    super( options );

    // Brings alt input focus to this button. See https://github.com/phetsims/quantum-measurement/issues/89
    this.focusOnRevealButton = () => {
      revealHideButton.focus();
    };
  }
}

quantumMeasurement.register( 'CoinExperimentButtonSet', CoinExperimentButtonSet );