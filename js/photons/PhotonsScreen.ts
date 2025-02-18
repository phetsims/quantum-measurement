// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonsScreen constructs both the model and the view for the "Photons" screen in the sim.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import QuantumMeasurementKeyboardHelpContent from '../common/view/QuantumMeasurementKeyboardHelpContent.js';
import QuantumMeasurementScreen from '../common/view/QuantumMeasurementScreen.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';

export default class PhotonsScreen extends QuantumMeasurementScreen<PhotonsModel, PhotonsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
        name: QuantumMeasurementStrings.screen.photonsStringProperty,
      homeScreenIcon: createScreenIcon(),
      createKeyboardHelpNode: () => new QuantumMeasurementKeyboardHelpContent( { includeTimeControlsKeyboardHelp: true } ),

      // Limit the max time step to 2x the nominal value.  This helps prevent add photon movements after screen changes.
      maxDT: 1 / 30,

      tandem: tandem
    };

    super(
      () => new PhotonsModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new PhotonsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

const createScreenIcon = (): ScreenIcon => {

  // TODO: Fill this in with the real deal, see https://github.com/phetsims/quantum-measurement/issues/88.
  const iconNode = new Rectangle( 1, 1, 100, 100, { fill: QuantumMeasurementColors.photonBaseColorProperty } );
  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 0.85,
    fill: QuantumMeasurementColors.quantumBackgroundColorProperty
  } );
};

quantumMeasurement.register( 'PhotonsScreen', PhotonsScreen );