// Copyright 2024, University of Colorado Boulder

/**
 * Main model class for the "Coins" screen in this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { SystemType, SystemTypeValues } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel from './CoinsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CoinsModel implements TModel {

  // The type of experiment being prepared and measured, either classical or quantum.
  public readonly experimentTypeProperty: Property<SystemType>;

  // This screen has two scenes, the "Classical Coin" scene and the "Quantum Coin" scene. These are the models for each.
  public readonly classicalCoinExperimentSceneModel: CoinsExperimentSceneModel;
  public readonly quantumCoinExperimentSceneModel: CoinsExperimentSceneModel;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.classicalCoinExperimentSceneModel = new CoinsExperimentSceneModel( {
      tandem: providedOptions.tandem.createTandem( 'classicalCoinExperimentSceneModel' )
    } );
    this.quantumCoinExperimentSceneModel = new CoinsExperimentSceneModel( {
      systemType: 'quantum',
      initialBias: 0.5,
      tandem: providedOptions.tandem.createTandem( 'quantumCoinExperimentSceneModel' )
    } );

    this.experimentTypeProperty = new Property<SystemType>( 'classical', {
      tandem: providedOptions.tandem.createTandem( 'experimentTypeProperty' ),
      phetioValueType: StringUnionIO( SystemTypeValues )
    } );

    // Update the active scene model based on the experiment type.
    this.experimentTypeProperty.link( experimentType => {
      this.classicalCoinExperimentSceneModel.activeProperty.value = experimentType === 'classical';
      this.quantumCoinExperimentSceneModel.activeProperty.value = experimentType === 'quantum';
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.classicalCoinExperimentSceneModel.reset();
    this.quantumCoinExperimentSceneModel.reset();
    this.experimentTypeProperty.reset();
  }
}

quantumMeasurement.register( 'CoinsModel', CoinsModel );