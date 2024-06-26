// Copyright 2024, University of Colorado Boulder

/**
 * Main model class for the "Coins" screen in this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TModel from '../../../../joist/js/TModel.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { SystemType, SystemTypeValues } from '../../common/model/SystemType.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import CoinsExperimentSceneModel from './CoinsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CoinsModel implements TModel {

  // The type of experiment being prepared and measured, either physical or quantum.
  public readonly experimentTypeProperty: Property<SystemType>;

  // This screen has two scenes, the "Physical Coin" scene and the "Quantum Coin" scene.  These are the models for each.
  public readonly physicalCoinExperimentSceneModel: CoinsExperimentSceneModel;
  public readonly quantumCoinExperimentSceneModel: CoinsExperimentSceneModel;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.physicalCoinExperimentSceneModel = new CoinsExperimentSceneModel( {
      tandem: providedOptions.tandem.createTandem( 'physicalCoinExperimentSceneModel' )
    } );
    this.quantumCoinExperimentSceneModel = new CoinsExperimentSceneModel( {
      systemType: 'quantum',
      initialBias: 0.8,
      tandem: providedOptions.tandem.createTandem( 'quantumCoinExperimentSceneModel' )
    } );

    this.experimentTypeProperty = new Property<SystemType>( 'physical', {
      tandem: providedOptions.tandem.createTandem( 'experimentTypeProperty' ),
      phetioValueType: StringUnionIO( SystemTypeValues )
    } );

    // Update the active scene model based on the experiment type.
    this.experimentTypeProperty.link( experimentType => {
      this.physicalCoinExperimentSceneModel.activeProperty.value = experimentType === 'physical';
      this.quantumCoinExperimentSceneModel.activeProperty.value = experimentType === 'quantum';
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.physicalCoinExperimentSceneModel.reset();
    this.quantumCoinExperimentSceneModel.reset();
    this.experimentTypeProperty.reset();
  }
}

quantumMeasurement.register( 'CoinsModel', CoinsModel );