// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main model class for the "Classical Coin" and "Quantum Coin" scenes on the "Coins" screen. This manages the
 * preparation and measurement phases for the experiments.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStateValues } from './ClassicalCoinStates.js';
import Coin from './Coin.js';
import { CoinFaceStates } from './CoinFaceStates.js';
import CoinSet from './CoinSet.js';

type SelfOptions = {
  initiallyActive?: boolean;
  initialBias?: number;
  systemType?: SystemType;
};
type CoinExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants

// Uncollapsed states when preparing the coin
const QuantumUncollapsedCoinStateValues = [ 'up', 'down', 'superposed' ] as const;
export type QuantumUncollapsedCoinStates = ( typeof QuantumUncollapsedCoinStateValues )[number];

// allowed values for the number of coins to use in the multi-coin experiment
export const MULTI_COIN_EXPERIMENT_QUANTITIES = [ 10, 100, 10000 ];

// Excluding the 10000 as they are represented as pixels
export const MULTI_COIN_ANIMATION_QUANTITIES = MULTI_COIN_EXPERIMENT_QUANTITIES.filter( quantity => quantity !== 10000 );

// max coins used in any of the experiments
export const MAX_COINS = Math.max( ...MULTI_COIN_EXPERIMENT_QUANTITIES );

class CoinsExperimentSceneModel extends PhetioObject {

  // whether this scene is active, which is mostly about whether it is shown in the view
  public readonly activeProperty: BooleanProperty;

  // The type of system - classical or quantum - that is being modeled in this scene.
  public readonly systemType: SystemType;

  // This BooleanProperty is used to control whether the experiment is being prepared (true) or measured (false).
  public readonly preparingExperimentProperty: BooleanProperty;

  // The coins that are flipped/prepared and then measured during the experiment.
  public readonly singleCoin: Coin;
  public readonly coinSet: CoinSet;

  // The initial state of the coin(s) before any flipping or other experiment preparation occurs.
  public readonly initialCoinFaceStateProperty: Property<CoinFaceStates>;

  // The probability of the 'up' state. The 'down' probability will be (1 - thisValue).
  public readonly upProbabilityProperty: NumberProperty;

  public constructor( providedOptions: CoinExperimentSceneModelOptions ) {

    const options = optionize<CoinExperimentSceneModelOptions, SelfOptions, PhetioObjectOptions>()( {
      systemType: 'classical',
      initiallyActive: false,
      initialBias: 0.5,
      phetioState: false
    }, providedOptions );

    super( options );

    this.systemType = options.systemType;

    this.activeProperty = new BooleanProperty( options.initiallyActive, {
      tandem: options.tandem.createTandem( 'activeProperty' ),
      phetioReadOnly: true
    } );
    this.preparingExperimentProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'preparingExperimentProperty' )
    } );
    this.upProbabilityProperty = new NumberProperty( options.initialBias, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'upProbabilityProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The probability of the "up" state for the coin(s) in this scene.'
    } );
    const singleCoinTandem = options.tandem.createTandem( 'singleCoin' );
    const coinSetTandem = options.tandem.createTandem( 'coinSet' );
    if ( options.systemType === 'classical' ) {
      this.initialCoinFaceStateProperty = new Property<CoinFaceStates>( 'heads', {
        tandem: options.tandem.createTandem( 'initialCoinFaceStateProperty' ),
        phetioDocumentation: 'This is the initial orientation of the classical coin',
        phetioValueType: StringUnionIO( ClassicalCoinStateValues ),
        validValues: ClassicalCoinStateValues,
        phetioFeatured: true
      } );
      this.singleCoin = new Coin(
        'classical',
        'heads',
        this.upProbabilityProperty,
        { tandem: singleCoinTandem }
      );
      this.coinSet = new CoinSet(
        'classical',
        MAX_COINS,
        MULTI_COIN_EXPERIMENT_QUANTITIES[ 1 ], // use the middle value as the default
        'heads',
        this.upProbabilityProperty,
        { tandem: coinSetTandem }
      );
    }
    else {
      assert && assert( options.systemType === 'quantum', 'unhandled system type' );
      this.initialCoinFaceStateProperty = new Property<CoinFaceStates>( 'up', {
        tandem: options.tandem.createTandem( 'initialCoinFaceStateProperty' ),
        phetioValueType: StringUnionIO( QuantumUncollapsedCoinStateValues ),
        phetioDocumentation: 'This is the basis state of the quantum coin',
        phetioReadOnly: true,
        validValues: QuantumUncollapsedCoinStateValues,
        phetioFeatured: true
      } );
      this.singleCoin = new Coin(
        'quantum',
        'up',
        this.upProbabilityProperty,
        { tandem: singleCoinTandem }
      );
      this.coinSet = new CoinSet(
        'quantum',
        MAX_COINS,
        MULTI_COIN_EXPERIMENT_QUANTITIES[ 1 ], // use the middle value as the default
        'up',
        this.upProbabilityProperty,
        { tandem: coinSetTandem }
      );
    }

    this.preparingExperimentProperty.lazyLink( preparingExperiment => {

      if ( preparingExperiment ) {

        // Set the coin measurement states back to their initial values.
        this.singleCoin.prepareNow();
        this.coinSet.prepareNow();
      }
      else {

        // The scene is moving from preparation mode to measurement mode. Set the coins to be in the initial state
        // chosen by the user.  If these are quantum coins and the initial state is set to superposed, set an arbitrary
        // initial state.  This is okay because the values won't be shown to the user.
        const initialState: CoinFaceStates = this.initialCoinFaceStateProperty.value === 'superposed' ?
                                             'up' :
                                             this.initialCoinFaceStateProperty.value;
        // TODO: How can this be better and avoid the "as never" weirdness?  See https://github.com/phetsims/quantum-measurement/issues/42.
        this.singleCoin.setMeasurementValuesImmediate( initialState );
        this.coinSet.setMeasurementValuesImmediate( initialState );
      }
    } );

    // If this is a quantum system, changing the initial state of the coin sets the bias to match that coin.
    if ( this.systemType === 'quantum' ) {
      this.initialCoinFaceStateProperty.lazyLink( initialCoinState => {
        if ( initialCoinState !== 'superposed' ) {
          this.upProbabilityProperty.value = initialCoinState === 'up' ? 1 : 0;
        }
      } );

      this.upProbabilityProperty.lazyLink( bias => {
        if ( bias !== 0 && bias !== 1 ) {
          this.initialCoinFaceStateProperty.value = 'superposed';
        }
        else {
          this.initialCoinFaceStateProperty.value = bias === 1 ? 'up' : 'down';
        }
      } );
    }
  }

  public reset(): void {
    this.preparingExperimentProperty.reset();
    this.initialCoinFaceStateProperty.reset();
    this.upProbabilityProperty.reset();
    this.singleCoin.reset();
    this.coinSet.reset();
  }
}

quantumMeasurement.register( 'CoinsExperimentSceneModel', CoinsExperimentSceneModel );

export default CoinsExperimentSceneModel;