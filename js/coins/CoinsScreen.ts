// Copyright 2024-2025, University of Colorado Boulder

/**
 * Screen class for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import QuantumMeasurementScreen from '../common/view/QuantumMeasurementScreen.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import CoinsModel from './model/CoinsModel.js';
import CoinsScreenView from './view/CoinsScreenView.js';

export default class CoinsScreen extends QuantumMeasurementScreen<CoinsModel, CoinsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: QuantumMeasurementStrings.screen.coinsStringProperty,
      homeScreenIcon: createScreenIcon(),
      // TODO: Fill this in with the real help text, see https://github.com/phetsims/quantum-measurement/issues/92
      screenButtonsHelpText: 'fill me in',
      tandem: tandem
    };

    super(
      () => new CoinsModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new CoinsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

const createScreenIcon = (): ScreenIcon => {

  // TODO: Fill this in with the real deal, see https://github.com/phetsims/quantum-measurement/issues/88.
  const iconNode = new Rectangle( 1, 1, 100, 100, { fill: QuantumMeasurementColors.headsFillColorProperty } );
  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 0.85,
    fill: QuantumMeasurementColors.quantumBackgroundColorProperty
  } );
};

quantumMeasurement.register( 'CoinsScreen', CoinsScreen );