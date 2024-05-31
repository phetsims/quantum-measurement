// Copyright 2024, University of Colorado Boulder

/**
 * CoinsExperimentSceneView is the base class for the scene views on the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
export type CoinsExperimentSceneViewOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class CoinsExperimentSceneView extends Node {

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: CoinsExperimentSceneViewOptions ) {

    const options = optionize<CoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      {
        visibleProperty: sceneModel.activeProperty
      },
      providedOptions
    );

    super( options );
  }
}

quantumMeasurement.register( 'CoinsExperimentSceneView', CoinsExperimentSceneView );