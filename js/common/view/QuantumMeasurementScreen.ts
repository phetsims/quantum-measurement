// Copyright 2025, University of Colorado Boulder

/**
 * QuantumMeasurementScreen is the base class for all Screens in this sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../../joist/js/Screen.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementColors from '../QuantumMeasurementColors.js';
import QuantumMeasurementKeyboardHelpContent from './QuantumMeasurementKeyboardHelpContent.js';

type SelfOptions = EmptySelfOptions;
export type QuantumMeasurementScreenOptions = SelfOptions & WithRequired<ScreenOptions, 'name' | 'homeScreenIcon' | 'screenButtonsHelpText' | 'tandem'>;

export default class QuantumMeasurementScreen<M extends TModel, V extends ScreenView> extends Screen<M, V> {

  protected constructor( createModel: () => M, createView: ( model: M ) => V, providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {

      // ScreenOptions
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty,
      showUnselectedHomeScreenIconFrame: true,
      showScreenIconFrameForNavigationBarFill: 'black',
      createKeyboardHelpNode: () => new QuantumMeasurementKeyboardHelpContent()
    }, providedOptions );

    super( createModel, createView, options );
  }
}

quantumMeasurement.register( 'QuantumMeasurementScreen', QuantumMeasurementScreen );