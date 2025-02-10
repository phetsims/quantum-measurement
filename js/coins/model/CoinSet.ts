// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinSet models a set of classical or quantum coins.  The face of each of these coins can be in one of two states or,
 * in the quantum case, in a superposed state.  The coin set can be prepared for measurement (similar to flipping a
 * coin) and subsequently measured (similar to reading how the flip turned out).
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Random from '../../../../dot/js/Random.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ClassicalCoinStateValues } from './ClassicalCoinStates.js';
import { MULTI_COIN_EXPERIMENT_QUANTITIES } from './CoinsExperimentSceneModel.js';
import { CoinStates } from './CoinStates.js';
import { ExperimentMeasurementState, ExperimentMeasurementStateValues } from './ExperimentMeasurementState.js';
import { QuantumCoinStateValues } from './QuantumCoinStates.js';

type SelfOptions = {
  initialBias?: number;
};
export type CoinSetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type StateSetMeasurementResult = {
  length: number;
  measuredValues: CoinStates[];
};

// Define the time that it will take to prepare a measurement, in seconds.  This is empirically determined.
export const MEASUREMENT_PREPARATION_TIME = 1;

// Valid values for the coin faces for each system type.
const MAP_OF_VALID_VALUES_FOR_COIN_TYPE = new Map<SystemType, CoinStates[]>( [
  [ 'classical', [ ...ClassicalCoinStateValues ] ],
  [ 'quantum', QuantumCoinStateValues.filter( stateValue => stateValue !== 'superposed' ) ]
] );

class CoinSet extends PhetioObject {

  // the type of this coin, either classical or quantum
  public readonly coinType: SystemType;

  // the state of the measurement for this system
  public readonly measurementStateProperty: Property<ExperimentMeasurementState>;

  // valid values for a measurement
  public readonly validValues: readonly CoinStates[];

  // The values of most recent measurement.  These are only valid in some - and not all - measurement states.
  public readonly measuredValues: CoinStates[] = [];

  // The number of coins that will be measured when a measurement is made.
  public readonly numberOfActiveCoinsProperty: NumberProperty;

  // Timeout for the preparingToBeMeasured state.
  private preparingToBeMeasuredTimeoutListener: null | TimerListener = null;

  // The bias for each two-state system, and specifically the probability of the system being found in the first of the
  // two provided values. A value of 1 means it will always be found in the first provided state, 0 means always the
  // second, and 0.5 means no bias.
  public readonly biasProperty: NumberProperty;

  // The seed that is used to generate the most recent set of measured values.  This exists primarily as a way to
  // support phet-io - it is conveyed in the state information and used to generate the data when phet-io state is set.
  // This is done to avoid sending values for every individual measurement, which could be 10000 values.
  //
  // The contained value ranges from 0 to 1 inclusive, and 0 and 1 have special meaning - they indicate that all
  // measurement values should be set to either the 0th or 1st valid value.  All other values are used as a seed to a
  // random number generator to produce random measurement values.
  public readonly seedProperty: NumberProperty;

  // An emitter that fires when the measured data changed, which is essentially any time a new measurement is made after
  // the system has been prepared for measurement.  This is intended to be used as a signal to the view that and update
  // of the information being presented to the user is needed.
  public readonly measuredDataChangedEmitter: TEmitter = new Emitter();

  /**
   * @param coinType - The type of system that is being modeled by this set of coins, either classical or quantum.
   * @param maxNumberOfActiveCoins - The maximum number of coins that can be active at one time.
   * @param initialNumberOfActiveCoins - The initial number of coins that are active in this set.
   * @param initialFaceState - The initial state of the face of the coin(s) before any flipping or other experiment.
   * @param biasProperty - The bias for the measurement outcomes for this set of coins.
   * @param providedOptions
   */
  public constructor( coinType: SystemType,
                      maxNumberOfActiveCoins: number,
                      initialNumberOfActiveCoins: number,
                      initialFaceState: CoinStates,
                      biasProperty: NumberProperty,
                      providedOptions: CoinSetOptions ) {

    const options = optionize<CoinSetOptions, SelfOptions, PhetioObjectOptions>()( {
      initialBias: 0.5,
      phetioState: false
    }, providedOptions );

    super( options );

    this.coinType = coinType;

    assert && assert( MAP_OF_VALID_VALUES_FOR_COIN_TYPE.has( coinType ), 'Invalid coin type' );
    this.validValues = MAP_OF_VALID_VALUES_FOR_COIN_TYPE.get( coinType )!;

    // The phet-io nature of the number of active systems Property is different for the single coin versus the
    // multi-coin case.
    if ( maxNumberOfActiveCoins === 1 ) {
      this.numberOfActiveCoinsProperty = new NumberProperty( initialNumberOfActiveCoins, {
        tandem: Tandem.OPT_OUT
      } );
    }
    else {
      this.numberOfActiveCoinsProperty = new NumberProperty( initialNumberOfActiveCoins, {
        tandem: options.tandem.createTandem( 'numberOfActiveCoinsProperty' ),
        phetioFeatured: true,
        validValues: MULTI_COIN_EXPERIMENT_QUANTITIES
      } );
    }

    // The initial system state differs for classical versus quantum systems.
    const initialMeasurementState = this.coinType === 'classical' ? 'revealed' : 'readyToBeMeasured';
    this.measurementStateProperty = new Property<ExperimentMeasurementState>( initialMeasurementState, {
      tandem: options.tandem.createTandem( 'measurementStateProperty' ),
      phetioValueType: StringUnionIO( ExperimentMeasurementStateValues ),
      phetioReadOnly: true,

      // Set the valid values for the measurement state.  Note that there is one value that is only used in the quantum
      // case.
      validValues: coinType === 'classical' ?
                   _.without( ExperimentMeasurementStateValues, 'readyToBeMeasured' ) :
                   ExperimentMeasurementStateValues
    } );

    this.biasProperty = biasProperty;

    // Create the seed Property.  Its initial value is controlled by the specified initial value for measurements.
    this.seedProperty = new NumberProperty( this.validValues.indexOf( initialFaceState ), {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'seedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'The seed that is used to generate the most recent set of measured values.'
    } );

    // Monitor the seed that is used to create the measurement values.
    this.seedProperty.link( seed => {

      // Handle the "special case" values of 0 and 1, which sets all measurement values to one of the two valid values.
      if ( seed === 0 || seed === 1 ) {
        const valueToSet = this.validValues[ seed ];
        _.times( maxNumberOfActiveCoins, i => {
          this.measuredValues[ i ] = valueToSet;
        } );
      }
      else {

        // Use the seed value to generate random values.
        const random = new Random( { seed: seed } );
        _.times( this.numberOfActiveCoinsProperty.value, i => {
          const valueSetIndex = random.nextDouble() < this.biasProperty.value ? 0 : 1;
          this.measuredValues[ i ] = this.validValues[ valueSetIndex ];
        } );
      }

      // Fire the emitter that signals a change to the data.
      this.measuredDataChangedEmitter.emit();
    } );
  }

  /**
   * Prepare this system to be measured. This is analogous to initiating the flipping of a classical coin or setting up
   * a quantum system into a superposed state. After a timeout, this system will transition to a state where it is
   * ready to be measured.
   */
  public prepare( revealWhenPrepared = false ): void {

    // Set the state to preparingToBeMeasured and start a timeout for the state to end.
    this.measurementStateProperty.value = 'preparingToBeMeasured';

    // Set a timeout for the preparation interval and automatically move to the next state when it fires.
    this.preparingToBeMeasuredTimeoutListener = stepTimer.setTimeout( () => {
      this.preparingToBeMeasuredTimeoutListener = null;
      this.prepareNow();

      if ( revealWhenPrepared ) {
        this.reveal();
      }
    }, MEASUREMENT_PREPARATION_TIME * 1000 );
  }

  /**
   * Prepare the system for measurement now, i.e. without transitioning through the 'preparingToBeMeasured' state.
   */
  public prepareNow(): void {

    if ( this.coinType === 'classical' ) {

      // Classical systems have deterministic values when measured.
      this.generateNewRandomMeasurementValues();
      this.measurementStateProperty.value = 'measuredAndHidden';
    }
    else {

      // Quantum systems don't create values until revealed, so mark it as 'readyToBeMeasured';
      this.measurementStateProperty.value = 'readyToBeMeasured';
    }
  }

  /**
   * Set the system into a state that indicates that its values are revealed to the world.  For a quantum system, this
   * may cause new measured values to be set.
   */
  public reveal(): void {

    // state checking
    assert && assert(
      this.measurementStateProperty.value === 'measuredAndHidden' ||
      this.measurementStateProperty.value === 'readyToBeMeasured',
      'This system is not in an appropriate state to be revealed'
    );

    if ( this.measurementStateProperty.value === 'readyToBeMeasured' ) {
      assert && assert( this.coinType === 'quantum', 'This point should only be reached for quantum systems' );
      this.generateNewRandomMeasurementValues();
    }

    // Update the measurement state to indicate revealed.  When this happens, the view should present the values to the
    // observer(s).
    this.measurementStateProperty.value = 'revealed';
  }

  /**
   * Set the system into a state where its values are hidden from the world.
   */
  public hide(): void {

    // state checking
    assert && assert(
      this.measurementStateProperty.value === 'revealed',
      'This system is not in an appropriate state to be hidden'
    );

    this.measurementStateProperty.value = 'measuredAndHidden';
  }

  /**
   * Measure the system, which will either cause a value to be chosen if one hasn't been since the last preparation, or
   * will just return the value of the most recent measurement.
   */
  public measure(): StateSetMeasurementResult {

    assert && assert(
      this.measurementStateProperty.value !== 'preparingToBeMeasured',
      'The system should be ready for measurement or have already been measured.'
    );

    // If the system is ready to be measured, but hasn't yet been, do it now.
    if ( this.measurementStateProperty.value === 'readyToBeMeasured' ) {

      this.generateNewRandomMeasurementValues();

      // Change the state to represent that this system has now been measured.
      this.measurementStateProperty.value = 'revealed';
    }

    return {
      length: this.numberOfActiveCoinsProperty.value,
      measuredValues: this.measuredValues
    };
  }

  /**
   * Generate new random measured values for this system.
   */
  private generateNewRandomMeasurementValues(): void {

    // New values are generated by creating a new random seed and setting the value of a Property.  A listener for this
    // Property does the actual generation of the values.  Note that the value of 0 is not allowed for the random seed
    // because it has special significance - it means all the values should be set to 0.
    let newSeed;
    do {
      newSeed = dotRandom.nextDouble();
    } while ( newSeed === 0 );
    this.seedProperty.value = newSeed;
  }

  /**
   * Set the measurement values immediately to the provided value for all elements in this set without transitioning
   * through the 'preparingToBeMeasured' state.
   */
  public setMeasurementValuesImmediate( value: CoinStates ): void {

    assert && assert( this.validValues.includes( value ), 'Invalid value for this type of coin.' );

    // Cancel any in-progress preparation.
    if ( this.preparingToBeMeasuredTimeoutListener ) {
      stepTimer.clearTimeout( this.preparingToBeMeasuredTimeoutListener );
      this.preparingToBeMeasuredTimeoutListener = null;
    }

    // Set the seed value to the value that will incite its listener to update the data to the provided value.
    const valueIndex = this.validValues.indexOf( value );
    assert && assert( valueIndex === 0 || valueIndex === 1 );
    this.seedProperty.value = valueIndex;

    // Update the measurement state.
    this.measurementStateProperty.value = this.coinType === 'classical' ? 'revealed' : 'readyToBeMeasured';
  }

  public reset(): void {
    this.measurementStateProperty.reset();
    this.numberOfActiveCoinsProperty.reset();
    this.seedProperty.reset();
  }
}

quantumMeasurement.register( 'CoinSet', CoinSet );

export default CoinSet;