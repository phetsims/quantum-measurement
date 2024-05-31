// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinsExperimentSceneView is the parent node in which the "Quantum Coin" scene is displayed.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { NodeOptions, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinsExperimentSceneView, { CoinsExperimentSceneViewOptions } from './CoinsExperimentSceneView.js';

type SelfOptions = EmptySelfOptions;
type QuantumCoinsExperimentSceneViewOptions = SelfOptions & CoinsExperimentSceneViewOptions;

export default class QuantumCoinsExperimentSceneView extends CoinsExperimentSceneView {

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: QuantumCoinsExperimentSceneViewOptions ) {

    const options = optionize<QuantumCoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      { visibleProperty: sceneModel.activeProperty },
      providedOptions
    );

    super( sceneModel, options );

    this.addChild( new Text( 'Quantum Coins', { font: new PhetFont( 40 ) } ) );
  }
}

quantumMeasurement.register( 'QuantumCoinsExperimentSceneView', QuantumCoinsExperimentSceneView );