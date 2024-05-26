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
import SpinModel from './model/SpinModel.js';
import SpinScreenView from './view/SpinScreenView.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';

type SelfOptions = {
  //TODO add options that are specific to QuantumMeasurementScreen here, see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementScreenOptions = SelfOptions & ScreenOptions;

export default class SpinScreen extends Screen<SpinModel, SpinScreenView> {

  public constructor( providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {
      name: QuantumMeasurementStrings.screen.spinStringProperty,

      //TODO add default values for optional SelfOptions here, see https://github.com/phetsims/quantum-measurement/issues/1

      //TODO add default values for optional ScreenOptions here, see https://github.com/phetsims/quantum-measurement/issues/1
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new SpinModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SpinScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

quantumMeasurement.register( 'SpinScreen', SpinScreen );