// Copyright 2024, University of Colorado Boulder

/**
 * Screen class for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import CoinsModel from './model/CoinsModel.js';
import CoinsScreenView from './view/CoinsScreenView.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementScreenOptions = SelfOptions & ScreenOptions;

export default class CoinsScreen extends Screen<CoinsModel, CoinsScreenView> {

  public constructor( providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {
      name: QuantumMeasurementStrings.screen.coinsStringProperty,
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new CoinsModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new CoinsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quantumMeasurement.register( 'CoinsScreen', CoinsScreen );