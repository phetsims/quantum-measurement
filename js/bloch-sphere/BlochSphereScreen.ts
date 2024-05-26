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
import BlochSphereModel from './model/BlochSphereModel.js';
import BlochSphereScreenView from './view/BlochSphereScreenView.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';

type SelfOptions = {
  //TODO add options that are specific to QuantumMeasurementScreen here, see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementScreenOptions = SelfOptions & ScreenOptions;

export default class BlochSphereScreen extends Screen<BlochSphereModel, BlochSphereScreenView> {

  public constructor( providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {
      name: QuantumMeasurementStrings.screen.blochSphereStringProperty,

      //TODO add default values for optional SelfOptions here, see https://github.com/phetsims/quantum-measurement/issues/1

      //TODO add default values for optional ScreenOptions here, see https://github.com/phetsims/quantum-measurement/issues/1
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new BlochSphereModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new BlochSphereScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

quantumMeasurement.register( 'BlochSphereScreen', BlochSphereScreen );