// Copyright 2024-2025, University of Colorado Boulder

/**
 * Screen for the Bloch Sphere representation of a Quantum system.
 *
 * @author Agustín Vallejo
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import BlochSphereModel from './model/BlochSphereModel.js';
import BlochSphereScreenView from './view/BlochSphereScreenView.js';

type SelfOptions = EmptySelfOptions;

type QuantumMeasurementScreenOptions = SelfOptions & ScreenOptions;

export default class BlochSphereScreen extends Screen<BlochSphereModel, BlochSphereScreenView> {

  public constructor( providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {
      name: QuantumMeasurementStrings.screen.blochSphereStringProperty,
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new BlochSphereModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new BlochSphereScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quantumMeasurement.register( 'BlochSphereScreen', BlochSphereScreen );