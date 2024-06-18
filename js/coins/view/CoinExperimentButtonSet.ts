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

type SelfOptions = EmptySelfOptions;
export type CoinExperimentButtonSetOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

const BUTTON_COLOR = new Color( '#0ffdfd' );
const BUTTON_FONT = new PhetFont( 14 );
const BUTTON_WIDTH = 160; // empirically determined to match spec
const COMMON_BUTTON_OPTIONS = {
  baseColor: BUTTON_COLOR,
  font: BUTTON_FONT,
  minWidth: BUTTON_WIDTH,
  maxWidth: BUTTON_WIDTH
};

export default class CoinExperimentButtonSet extends VBox {

  public constructor( systemType: SystemType,
                      experimentStateProperty: TProperty<CoinExperimentStates>,
                      prepareExperiment: ( revealWhenComplete?: boolean ) => void,
                      providedOptions: CoinExperimentButtonSetOptions ) {

    const revealHideButtonTextProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.hideStringProperty,
        QuantumMeasurementStrings.revealStringProperty,
        QuantumMeasurementStrings.observeStringProperty,
        experimentStateProperty
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

    // Create the button that will be used to hide and reveal the coin without flipping it.
    const revealHideButton = new TextPushButton(
      revealHideButtonTextProperty,
      combineOptions<TextPushButtonOptions>( COMMON_BUTTON_OPTIONS, {
        listener: () => {

          // TODO: See https://github.com/phetsims/quantum-measurement/issues/12.  Updating the experiment state
          //       directly here feels a little off to me.  Should this be read-only and set only by the scene model?
          if ( experimentStateProperty.value === 'hiddenAndStill' ) {
            experimentStateProperty.value = 'revealedAndStill';
          }
          else if ( experimentStateProperty.value === 'revealedAndStill' ) {
            experimentStateProperty.value = 'hiddenAndStill';
          }
        },
        tandem: providedOptions.tandem.createTandem( 'revealHideButton' )
      } )
    );

    const flipOrReprepareButton = new TextPushButton(
      systemType === 'physical' ?
      QuantumMeasurementStrings.flipStringProperty :
      QuantumMeasurementStrings.reprepareStringProperty,
      combineOptions<TextPushButtonOptions>( COMMON_BUTTON_OPTIONS, {
        listener: prepareExperiment,
        tandem: providedOptions.tandem.createTandem( 'flipOrReprepareButton' )
      } )
    );

    const flipOrReprepareAndRevealButton = new TextPushButton(
      systemType === 'physical' ?
      QuantumMeasurementStrings.flipAndRevealStringProperty :
      QuantumMeasurementStrings.reprepareAndRevealStringProperty,
      combineOptions<TextPushButtonOptions>( COMMON_BUTTON_OPTIONS, {
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