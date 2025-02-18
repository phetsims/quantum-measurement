// Copyright 2024-2025, University of Colorado Boulder

/**
 * Screen for the Bloch Sphere representation of a Quantum system.
 *
 * @author Agustín Vallejo
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../scenery/js/util/Color.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import QuantumMeasurementScreen from '../common/view/QuantumMeasurementScreen.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import BlochSphereModel from './model/BlochSphereModel.js';
import BlochSphereScreenView from './view/BlochSphereScreenView.js';

export default class BlochSphereScreen extends QuantumMeasurementScreen<BlochSphereModel, BlochSphereScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: QuantumMeasurementStrings.screen.blochSphereStringProperty,
      homeScreenIcon: createScreenIcon(),
      tandem: tandem
    };

    super(
      () => new BlochSphereModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new BlochSphereScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

const createScreenIcon = (): ScreenIcon => {

  // TODO: Fill this in with the real deal, see https://github.com/phetsims/quantum-measurement/issues/88.
  const iconNode = new Rectangle( 1, 1, 100, 100, { fill: Color.CYAN } );
  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 0.85,
    fill: QuantumMeasurementColors.quantumBackgroundColorProperty
  } );
};


quantumMeasurement.register( 'BlochSphereScreen', BlochSphereScreen );