// Copyright 2024-2025, University of Colorado Boulder

/**
 * Screen class for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Property from '../../../axon/js/Property.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Color from '../../../scenery/js/util/Color.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import QuantumMeasurementScreen, { QuantumMeasurementScreenOptions } from '../common/view/QuantumMeasurementScreen.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import CoinsModel from './model/CoinsModel.js';
import { QuantumCoinStates } from './model/QuantumCoinStates.js';
import CoinsScreenView from './view/CoinsScreenView.js';
import QuantumCoinNode from './view/QuantumCoinNode.js';

export default class CoinsScreen extends QuantumMeasurementScreen<CoinsModel, CoinsScreenView> {

  public constructor( tandem: Tandem ) {

    const options: QuantumMeasurementScreenOptions = {
      name: QuantumMeasurementStrings.screen.coinsStringProperty,
      homeScreenIcon: createScreenIcon(),
      // TODO: Fill this in with the real help text, see https://github.com/phetsims/quantum-measurement/issues/92
      screenButtonsHelpText: 'fill me in',
      tandem: tandem,
      backgroundColorProperty: new Property<Color>( Color.WHITE ) // Placeholder color property that will be changed by scene changes
    };

    super(
      () => new CoinsModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new CoinsScreenView( model, this.backgroundColorProperty, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

const createScreenIcon = (): ScreenIcon => {

  // Create a stubbed quantum coin node for the icon.
  const iconNode = new QuantumCoinNode(
    new Property<QuantumCoinStates>( 'superposition' ),
    new Property<number>( 0.5 ),
    50,
    Tandem.OPT_OUT
  );
  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 0.85,
    fill: QuantumMeasurementColors.screenBackgroundColorProperty
  } );
};

quantumMeasurement.register( 'CoinsScreen', CoinsScreen );