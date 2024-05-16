// Copyright 2024, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementModel from './model/QuantumMeasurementModel.js';
import QuantumMeasurementScreenView from './view/QuantumMeasurementScreenView.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';

type SelfOptions = {
  //TODO add options that are specific to QuantumMeasurementScreen here
};

type QuantumMeasurementScreenOptions = SelfOptions & ScreenOptions;

export default class QuantumMeasurementScreen extends Screen<QuantumMeasurementModel, QuantumMeasurementScreenView> {

  public constructor( providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {
      name: QuantumMeasurementStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new QuantumMeasurementModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new QuantumMeasurementScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

quantumMeasurement.register( 'QuantumMeasurementScreen', QuantumMeasurementScreen );