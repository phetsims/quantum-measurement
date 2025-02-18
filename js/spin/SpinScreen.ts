// Copyright 2024-2025, University of Colorado Boulder

/**
 * Screen for the Spin representation of a Quantum system.
 *
 * @author Agustín Vallejo
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import QuantumMeasurementScreen from '../common/view/QuantumMeasurementScreen.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import SpinModel from './model/SpinModel.js';
import SpinScreenView from './view/SpinScreenView.js';

export default class SpinScreen extends QuantumMeasurementScreen<SpinModel, SpinScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: QuantumMeasurementStrings.screen.spinStringProperty,
      homeScreenIcon: createScreenIcon(),

      // Limit the max time step to 2x the nominal value.  This helps prevent add photon movements after screen changes.
      maxDT: 1 / 30,

      tandem: tandem
    };

    super(
      () => new SpinModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new SpinScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

const createScreenIcon = (): ScreenIcon => {

  // TODO: Fill this in with the real deal, see https://github.com/phetsims/quantum-measurement/issues/88.
  const iconNode = new Rectangle( 1, 1, 100, 100, { fill: QuantumMeasurementColors.particleColorProperty } );
  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 0.85,
    fill: QuantumMeasurementColors.quantumBackgroundColorProperty
  } );
};

quantumMeasurement.register( 'SpinScreen', SpinScreen );