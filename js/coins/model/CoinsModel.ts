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
import CoinExperimentSceneModel from './CoinExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CoinsModel implements TModel {

  // the type of experiment being prepared and measured, either physical or quantum
  public readonly experimentModeProperty: Property<SystemType>;

  public readonly physicalCoinExperimentSceneModel: CoinExperimentSceneModel;
  public readonly quantumCoinExperimentSceneModel: CoinExperimentSceneModel;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.experimentModeProperty = new Property<SystemType>( 'physical', {
      tandem: providedOptions.tandem.createTandem( 'experimentModeProperty' ),
      phetioValueType: StringUnionIO( SystemTypeValues )
    } );

    this.physicalCoinExperimentSceneModel = new CoinExperimentSceneModel( {
      tandem: providedOptions.tandem.createTandem( 'physicalCoinExperimentSceneModel' )
    } );
    this.quantumCoinExperimentSceneModel = new CoinExperimentSceneModel( {
      tandem: providedOptions.tandem.createTandem( 'quantumCoinExperimentSceneModel' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.experimentModeProperty.reset();
  }
}

quantumMeasurement.register( 'CoinsModel', CoinsModel );