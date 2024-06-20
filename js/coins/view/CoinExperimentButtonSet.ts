// Copyright 2024, University of Colorado Boulder


/**
 * CoinExperimentButtonSet is a UI component that triggers the actions that can occur in the coin experiments, such as
 * flipping the coin and revealing the result.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Color, NodeOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SystemType } from '../../common/model/SystemType.js';
import TextPushButton, { TextPushButtonOptions } from '../../../../sun/js/buttons/TextPushButton.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { CoinExperimentStates } from '../model/CoinExperimentStates.js';
import TProperty from '../../../../axon/js/TProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
export type CoinExperimentButtonSetOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const BUTTON_COLOR = new Color( '#0ffdfd' );
const BUTTON_FONT = new PhetFont( 14 );
const BUTTON_WIDTH = 160; // empirically determined to match spec

export default class CoinExperimentButtonSet extends VBox {

  public constructor( systemType: SystemType,
                      coinStateProperty: TProperty<CoinExperimentStates>,
                      testBoxReadyProperty: TProperty<boolean>,
                      prepareExperiment: ( revealWhenComplete?: boolean ) => void,
                      providedOptions: CoinExperimentButtonSetOptions ) {

    // Create an enabledProperty for the buttons, since interaction with the test boxes is only possible if they have
    // coins in them and the coins are not in the process of being prepared (e.g. flipped).
    const buttonsEnabledProperty = new DerivedProperty(
      [ testBoxReadyProperty, coinStateProperty ],
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
        coinStateProperty
      ],
      ( hideString, revealString, observeString, experimentState ) => {
        let labelString;
        if ( experimentState === 'revealedAndStill' ) {
          labelString = hideString;
        }
        else if ( systemType === 'physical' ) {
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

          // TODO: See https://github.com/phetsims/quantum-measurement/issues/12.  Updating the experiment state
          //       directly here feels a little off to me.  Should this be read-only and set only by the scene model?
          if ( coinStateProperty.value === 'hiddenAndStill' ) {
            coinStateProperty.value = 'revealedAndStill';
          }
          else if ( coinStateProperty.value === 'revealedAndStill' ) {
            coinStateProperty.value = 'hiddenAndStill';
          }
        },
        tandem: providedOptions.tandem.createTandem( 'revealHideButton' )
      } )
    );

    const flipOrReprepareButton = new TextPushButton(
      systemType === 'physical' ?
      QuantumMeasurementStrings.flipStringProperty :
      QuantumMeasurementStrings.reprepareStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: prepareExperiment,
        tandem: providedOptions.tandem.createTandem( 'flipOrReprepareButton' )
      } )
    );

    const flipOrReprepareAndRevealButton = new TextPushButton(
      systemType === 'physical' ?
      QuantumMeasurementStrings.flipAndRevealStringProperty :
      QuantumMeasurementStrings.reprepareAndRevealStringProperty,
      combineOptions<TextPushButtonOptions>( commonButtonOptions, {
        listener: () => { prepareExperiment( true ); },
        tandem: providedOptions.tandem.createTandem( 'flipOrReprepareAndRevealButton' )
      } )
    );

    const options = optionize<CoinExperimentButtonSetOptions, SelfOptions, VBoxOptions>()( {
      spacing: 10,
      children: [ revealHideButton, flipOrReprepareButton, flipOrReprepareAndRevealButton ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'CoinExperimentButtonSet', CoinExperimentButtonSet );