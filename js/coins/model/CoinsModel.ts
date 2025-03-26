// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main model class for the "Coins" screen in this simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel from './CoinsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CoinsModel implements TModel {

  // The type, or "mode", of experiment being prepared and measured, either classical or quantum.
  public readonly experimentModeProperty: Property<SystemType>;

  // This screen has two scenes, the "Classical Coin" scene and the "Quantum Coin" scene. These are the models for each.
  public readonly classicalCoinExperimentSceneModel: CoinsExperimentSceneModel;
  public readonly quantumCoinExperimentSceneModel: CoinsExperimentSceneModel;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.classicalCoinExperimentSceneModel = new CoinsExperimentSceneModel( {
      tandem: providedOptions.tandem.createTandem( 'classicalCoinExperimentSceneModel' )
    } );
    this.quantumCoinExperimentSceneModel = new CoinsExperimentSceneModel( {
      systemType: SystemType.QUANTUM,
      tandem: providedOptions.tandem.createTandem( 'quantumCoinExperimentSceneModel' )
    } );

    this.experimentModeProperty = new EnumerationProperty( SystemType.CLASSICAL, {
      tandem: providedOptions.tandem.createTandem( 'experimentModeProperty' ),
      phetioFeatured: true
    } );

    // Update the active scene model based on the experiment type.
    this.experimentModeProperty.link( experimentType => {
      this.classicalCoinExperimentSceneModel.activeProperty.value = experimentType === SystemType.CLASSICAL;
      this.quantumCoinExperimentSceneModel.activeProperty.value = experimentType === SystemType.QUANTUM;
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.classicalCoinExperimentSceneModel.reset();
    this.quantumCoinExperimentSceneModel.reset();
    this.experimentModeProperty.reset();
  }
}

quantumMeasurement.register( 'CoinsModel', CoinsModel );