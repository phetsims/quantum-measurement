// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonsScreen constructs both the model and the view for the "Photons" screen in the sim.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementScreenOptions = SelfOptions & ScreenOptions;

export default class PhotonsScreen extends Screen<PhotonsModel, PhotonsScreenView> {

  public constructor( providedOptions: QuantumMeasurementScreenOptions ) {

    const options = optionize<QuantumMeasurementScreenOptions, SelfOptions, ScreenOptions>()( {
      name: QuantumMeasurementStrings.screen.photonsStringProperty,
      backgroundColorProperty: QuantumMeasurementColors.screenBackgroundColorProperty,

      // Limit the max time step to 2x the nominal value.  This helps prevent add photon movements after screen changes.
      maxDT: 1 / 30
    }, providedOptions );

    super(
      () => new PhotonsModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new PhotonsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quantumMeasurement.register( 'PhotonsScreen', PhotonsScreen );