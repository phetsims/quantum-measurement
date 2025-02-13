// Copyright 2024, University of Colorado Boulder

/**
 * Screen for the Spin representation of a Quantum system.
 *
 * @author Agustín Vallejo
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import SpinModel from './model/SpinModel.js';
import SpinScreenView from './view/SpinScreenView.js';

type SelfOptions = EmptySelfOptions;

type QuantumMeasurementScreenOptions = SelfOptions & ScreenOptions;

export default class SpinScreen extends Screen<SpinModel, SpinScreenView> {

  public constructor( providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {
      name: QuantumMeasurementStrings.screen.spinStringProperty,
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty,

      // Limit the max time step to 2x the expected nominal value.  This helps prevent odd particle movement on long dt
      // values.
      maxDT: 1 / 30

    }, providedOptions );

    super(
      () => new SpinModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SpinScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quantumMeasurement.register( 'SpinScreen', SpinScreen );