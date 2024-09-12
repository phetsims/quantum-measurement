// Copyright 2024, University of Colorado Boulder

/**
 * Main model class for the "Classical Coin" and "Quantum Coin" scenes on the "Coins" screen. This manages the
 * preparation and measurement phases for the experiments.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import TwoStateSystem from '../../common/model/TwoStateSystem.js';
import { ClassicalCoinStates, ClassicalCoinStateValues } from './ClassicalCoinStates.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { QuantumCoinStates, QuantumCoinStateValues } from './QuantumCoinStates.js';
import { SystemType } from '../../common/model/SystemType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';

type SelfOptions = {
  initiallyActive?: boolean;
  initialBias?: number;
  systemType?: SystemType;
};
type CoinExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CoinsExperimentSceneModel extends PhetioObject {

  // whether this scene is active, which is mostly about whether it is shown in the view
  public readonly activeProperty: BooleanProperty;

  // The type of system - classical or quantum - that is being modeled in this scene.
  public readonly systemType: SystemType;

  // This BooleanProperty is used to control whether the experiment is being prepared (true) or measured (false).
  public readonly preparingExperimentProperty: BooleanProperty;

  // The coins that are flipped/prepared and then measured during the experiment.
  public readonly singleCoin: TwoStateSystem<ClassicalCoinStates> | TwoStateSystem<QuantumCoinStates>;

  public readonly coinSet: TwoStateSystemSet<ClassicalCoinStates | QuantumCoinStates>;

  // The initial state of the coin(s) before any flipping or other experiment preparation occurs.
  public readonly initialCoinStateProperty: Property<ClassicalCoinStates> | Property<QuantumCoinStates>;

  // The bias towards one outcome or another in the initially prepared state, from 0 to 1.
  public readonly stateBiasProperty: NumberProperty;

  public constructor( providedOptions: CoinExperimentSceneModelOptions ) {

    const options = optionize<CoinExperimentSceneModelOptions, SelfOptions, PhetioObjectOptions>()( {
      systemType: 'classical',
      initiallyActive: false,
      initialBias: 0.5
    }, providedOptions );

    super( options );

    this.systemType = options.systemType;

    this.activeProperty = new BooleanProperty( options.initiallyActive, {
      tandem: options.tandem.createTandem( 'activeProperty' )
    } );
    this.preparingExperimentProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'preparingExperimentProperty' )
    } );
    this.stateBiasProperty = new NumberProperty( options.initialBias, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'stateBiasProperty' )
    } );
    const singleCoinTandem = options.tandem.createTandem( 'singleCoin' );
    if ( options.systemType === 'classical' ) {
      this.initialCoinStateProperty = new Property<ClassicalCoinStates>( 'heads', {
        tandem: options.tandem.createTandem( 'initialCoinStateProperty' ),
        phetioValueType: StringUnionIO( ClassicalCoinStateValues ),
        validValues: ClassicalCoinStateValues
      } );
      this.singleCoin = new TwoStateSystem<ClassicalCoinStates>(
        ClassicalCoinStateValues,
        'heads',
        this.stateBiasProperty,
        { tandem: singleCoinTandem }
      );
      this.coinSet = new TwoStateSystemSet<ClassicalCoinStates>(
        ClassicalCoinStateValues,
        'heads',
        this.stateBiasProperty,
        { tandem: singleCoinTandem }
      );
    }
    else {
      assert && assert( options.systemType === 'quantum', 'unhandled system type' );
      this.initialCoinStateProperty = new Property<QuantumCoinStates>( 'up', {
        tandem: options.tandem.createTandem( 'initialCoinStateProperty' ),
        phetioValueType: StringUnionIO( QuantumCoinStateValues ),
        validValues: QuantumCoinStateValues
      } );
      this.singleCoin = new TwoStateSystem<QuantumCoinStates>(
        QuantumCoinStateValues,
        'up',
        this.stateBiasProperty,
        { tandem: singleCoinTandem }
      );
      this.coinSet = new TwoStateSystemSet<QuantumCoinStates>(
        QuantumCoinStateValues,
        'up',
        this.stateBiasProperty,
        { tandem: singleCoinTandem }
      );
    }

    this.preparingExperimentProperty.lazyLink( preparingExperiment => {

      if ( preparingExperiment ) {

        // Set the coin measurement states back to their initial values.
        this.singleCoin.prepareInstantly();
        this.coinSet.prepareInstantly();
      }
      else {

        // The scene is moving from preparation mode to measurement mode. Force the coins to be in the initial state
        // chosen by the user so that it will match when it animates into the test box and be correct if revealed right
        // away.
        this.singleCoin.setMeasurementValueImmediate( this.initialCoinStateProperty.value as never );
        this.coinSet.setMeasurementValuesImmediate( this.initialCoinStateProperty.value );
      }
    } );

    // If this is a quantum system, changing the initial state of the coin sets the bias to match that coin.
    if ( this.systemType === 'quantum' ) {
      this.initialCoinStateProperty.lazyLink( initialCoinState => {
        this.stateBiasProperty.value = initialCoinState === 'up' ? 1 : 0;
      } );
    }
  }

  /**
   * Prepare the single coin for measurement. For the classical coin, this is essentially starting to flip it.
   */
  public prepareSingleCoinExperiment( revealWhenComplete = false ): void {
    this.singleCoin.prepare( revealWhenComplete );
  }

  public reset(): void {
    this.preparingExperimentProperty.reset();
    this.initialCoinStateProperty.reset();
    this.stateBiasProperty.reset();
    this.singleCoin.reset();
    this.coinSet.reset();
  }
}

quantumMeasurement.register( 'CoinsExperimentSceneModel', CoinsExperimentSceneModel );