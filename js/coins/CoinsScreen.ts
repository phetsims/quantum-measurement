// Copyright 2024, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities, see https://github.com/phetsims/quantum-measurement/issues/1.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../quantumMeasurement.js';
import CoinsModel from './model/CoinsModel.js';
import CoinsScreenView from './view/CoinsScreenView.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';

type SelfOptions = {
  //TODO add options that are specific to QuantumMeasurementScreen here, see https://github.com/phetsims/quantum-measurement/issues/1.
};

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