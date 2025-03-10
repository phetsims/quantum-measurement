// Copyright 2024-2025, University of Colorado Boulder

/**
 * Screen for the Bloch Sphere representation of a Quantum system.
 *
 * @author Agustín Vallejo
 */

import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import BlochSphereNode from '../common/view/BlochSphereNode.js';
import QuantumMeasurementScreen from '../common/view/QuantumMeasurementScreen.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import BlochSphereModel from './model/BlochSphereModel.js';
import ComplexBlochSphere from './model/ComplexBlochSphere.js';
import BlochSphereScreenView from './view/BlochSphereScreenView.js';

export default class BlochSphereScreen extends QuantumMeasurementScreen<BlochSphereModel, BlochSphereScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: QuantumMeasurementStrings.screen.blochSphereStringProperty,
      homeScreenIcon: createScreenIcon(),
      // TODO: Fill this in with the real help text, see https://github.com/phetsims/quantum-measurement/issues/126
      screenButtonsHelpText: 'fill me in',
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

  const dummyBlochSphereModel = new ComplexBlochSphere( {
    initialPolarAngle: Math.PI / 4,
    initialAzimuthalAngle: 0.2 * Math.PI,
    tandem: Tandem.OPT_OUT
  } );
  const iconNode = new BlochSphereNode( dummyBlochSphereModel, {
    drawKets: false,
    drawTitle: false,
    drawAngleIndicators: true,
    tandem: Tandem.OPT_OUT
  } );
  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 0.85,
    fill: QuantumMeasurementColors.quantumBackgroundColorProperty
  } );
};


quantumMeasurement.register( 'BlochSphereScreen', BlochSphereScreen );