// Copyright 2024, University of Colorado Boulder

/**
 * TODO: See https://github.com/phetsims/quantum-measurement/issues/1.  At the time of this writing I (jbphet) am not
 *        sure if this will be the base class for the two scenes on the "Coins" screen or a configurable class.  Update
 *        this header when that decision is made.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import { CoinExperimentStates, CoinExperimentStateValues } from './CoinExperimentStates.js';
import TwoStateSystem from '../../common/model/TwoStateSystem.js';
import { PhysicalCoinStates, PhysicalCoinStateValues } from './PhysicalCoinStates.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { QuantumCoinStates, QuantumCoinStateValues } from './QuantumCoinStates.js';
import { SystemType } from '../../common/model/SystemType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

type SelfOptions = {
  initiallyActive?: boolean;
  systemType?: SystemType;
};
type CoinExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const FLIPPING_TIME_RANGE = new Range( 0.5, 1.3 ); // time that coins are in the flipping state, in seconds

export default class CoinsExperimentSceneModel extends PhetioObject {

  // whether this scene is active, which is mostly about whether it is shown in the view
  public readonly activeProperty: BooleanProperty;

  // The type of system - physical or quantum - that is being modeled in this scene.
  public readonly systemType: SystemType;

  // This BooleanProperty is used to control whether the experiment is being prepared (true) or measured (false).
  public readonly preparingExperimentProperty: BooleanProperty;

  // current state of the single- and multi-coin experiments
  public readonly singleCoinExperimentStateProperty: Property<CoinExperimentStates>;
  public readonly multiCoinExperimentStateProperty: Property<CoinExperimentStates>;

  // The coins that are flipped/prepared and then measured during the experiment.
  public readonly singleCoin: TwoStateSystem<PhysicalCoinStates> | TwoStateSystem<QuantumCoinStates>;

  // The initial state of the coin(s) before any flipping occurs.
  public readonly initialCoinStateProperty: Property<PhysicalCoinStates> | Property<QuantumCoinStates>;

  // The bias towards one outcome or another in the initially prepared state, from 0 to 1.
  public readonly stateBiasProperty: NumberProperty;

  // Timeout for the flipping state.
  private flippingTimeout: null | TimerListener = null;

  public constructor( providedOptions: CoinExperimentSceneModelOptions ) {

    const options = optionize<CoinExperimentSceneModelOptions, SelfOptions, PhetioObjectOptions>()( {
      systemType: 'physical',
      initiallyActive: false
    }, providedOptions );

    super( options );

    this.systemType = options.systemType;

    this.activeProperty = new BooleanProperty( options.initiallyActive, {
      tandem: options.tandem.createTandem( 'activeProperty' )
    } );
    this.preparingExperimentProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'preparingExperimentProperty' )
    } );
    this.stateBiasProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'stateBiasProperty' )
    } );
    this.singleCoinExperimentStateProperty = new Property<CoinExperimentStates>( 'hiddenAndStill', {
      phetioValueType: StringUnionIO( CoinExperimentStateValues ),
      tandem: options.tandem.createTandem( 'singleCoinExperimentStateProperty' )
    } );
    this.multiCoinExperimentStateProperty = new Property<CoinExperimentStates>( 'hiddenAndStill', {
      phetioValueType: StringUnionIO( CoinExperimentStateValues ),
      tandem: options.tandem.createTandem( 'multiCoinExperimentStateProperty' )
    } );
    const singleCoinTandem = options.tandem.createTandem( 'singleCoin' );
    if ( options.systemType === 'physical' ) {
      this.singleCoin = new TwoStateSystem<PhysicalCoinStates>(
        PhysicalCoinStateValues,
        'heads',
        this.stateBiasProperty,
        { tandem: singleCoinTandem } );
      this.initialCoinStateProperty = new Property<PhysicalCoinStates>( 'heads', {
        tandem: options.tandem.createTandem( 'initialCoinStateProperty' ),
        phetioValueType: StringUnionIO( PhysicalCoinStateValues ),
        validValues: PhysicalCoinStateValues
      } );
    }
    else {
      assert && assert( options.systemType === 'quantum', 'unhandled system type' );
      this.singleCoin = new TwoStateSystem<QuantumCoinStates>(
        QuantumCoinStateValues,
        'up',
        this.stateBiasProperty,
        { tandem: singleCoinTandem } );
      this.initialCoinStateProperty = new Property<QuantumCoinStates>( 'up', {
        tandem: options.tandem.createTandem( 'initialCoinStateProperty' ),
        phetioValueType: StringUnionIO( QuantumCoinStateValues ),
        validValues: QuantumCoinStateValues
      } );
    }

    this.preparingExperimentProperty.lazyLink( preparingExperiment => {

      if ( preparingExperiment ) {

        // Set the experiment states back to their initial values.
        this.singleCoinExperimentStateProperty.reset();
        this.multiCoinExperimentStateProperty.reset();
      }
      else {

        // Set the coins that will be measured into their initial states when transitioning from preparation to
        // measurement.
        this.singleCoin.currentStateProperty.value = this.initialCoinStateProperty.value;
      }
    } );

    // If this is a quantum system, changing the initial state of the coin sets the bias to match that coin.
    if ( this.systemType === 'quantum' ) {
      this.initialCoinStateProperty.link( initialCoinState => {
        this.stateBiasProperty.value = initialCoinState === 'up' ? 0 : 1;
      } );
    }
  }

  /**
   * Prepare the single coin for measurement.  This is essentially the flipping of the coin.
   */
  public prepareSingleCoinExperiment( revealWhenComplete = false ): void {

    // Ignore any requests to prepare the experiment if the preparation is already in progress.
    if ( this.singleCoinExperimentStateProperty.value === 'flipping' ) {
      return;
    }

    // Set the state to flipping and start a timeout for the flipping to end.
    this.singleCoinExperimentStateProperty.value = 'flipping';
    this.flippingTimeout = stepTimer.setTimeout( () => {
      this.singleCoin.prepare();
      this.singleCoinExperimentStateProperty.value = revealWhenComplete ? 'revealedAndStill' : 'hiddenAndStill';
      this.flippingTimeout = null;
    }, dotRandom.nextDoubleInRange( FLIPPING_TIME_RANGE ) * 1000 );
  }

  public reset(): void {
    if ( this.flippingTimeout ) {
      stepTimer.clearTimeout( this.flippingTimeout );
      this.flippingTimeout = null;
    }
    this.preparingExperimentProperty.reset();
    this.singleCoinExperimentStateProperty.reset();
    this.multiCoinExperimentStateProperty.reset();
    this.initialCoinStateProperty.reset();
    this.singleCoin.reset();
  }
}

quantumMeasurement.register( 'CoinsExperimentSceneModel', CoinsExperimentSceneModel );