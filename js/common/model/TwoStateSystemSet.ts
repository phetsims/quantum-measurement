// Copyright 2024, University of Colorado Boulder

/**
 * TwoStateSystemSet is a simple model for a set of values that can be in one of two states when measured.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { ExperimentMeasurementState, ExperimentMeasurementStateValues } from '../../coins/model/ExperimentMeasurementState.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { MULTI_COIN_EXPERIMENT_QUANTITIES } from '../../coins/model/CoinsExperimentSceneModel.js';
import { SystemType } from './SystemType.js';
import Random from '../../../../dot/js/Random.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import Emitter from '../../../../axon/js/Emitter.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

type SelfOptions = {
  systemType?: SystemType;
  initialBias?: number;
  maxNumberOfSystems?: number;
};
export type TwoStateSystemSetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type StateSetMeasurementResult<T> = {
  length: number;
  measuredValues: Array<T | null>;
};

// Define the time that it will take to prepare a measurement, in seconds.  This is empirically determined.
export const MEASUREMENT_PREPARATION_TIME = 1;

// TODO AV: Should T only extend string or some system type? See https://github.com/phetsims/quantum-measurement/issues/20
export default class TwoStateSystemSet<T extends string> extends PhetioObject {

  public readonly systemType: SystemType;

  // the state of the measurement for this system
  public readonly measurementStateProperty: Property<ExperimentMeasurementState>;

  // valid values for a measurement
  public readonly validValues: readonly T[];

  // The values of most recent measurement.  These are only valid in some - and not all - measurement states.
  public readonly measuredValues: Array<T>;

  // The number of systems that will be measured each time a measurement is made.
  public readonly numberOfActiveSystemsProperty: NumberProperty;

  // Timeout for the preparingToBeMeasured state.
  private preparingToBeMeasuredTimeoutListener: null | TimerListener = null;

  // The bias for each two-state system, and specifically the probability of the system being found in the first of the
  // two provided values. A value of 1 means it will always be found in the first provided state, 0 means always the
  // second, and 0.5 means no bias.
  public readonly biasProperty: NumberProperty;

  // The seed that was used to generate the most recent set of measured values.  This exists solely to support phet-io -
  // it is conveyed in the state information and used to regenerate the data when phet-io state is set.  This is done
  // to avoid sending values for every individual measurement, which could be 10000 values.
  public readonly seedProperty: NumberProperty;

  // An emitter that fires when the measured data changed, which is essentially any time a new measurement is made after
  // the system has been prepared for measurement.  This is intended to be used as a signal to the view that and update
  // of the information being presented to the user is needed.
  public readonly measuredDataChanged: TEmitter = new Emitter();

  public constructor( stateValues: readonly T[],
                      initialState: T,
                      biasProperty: NumberProperty,
                      providedOptions: TwoStateSystemSetOptions ) {

    assert && assert( stateValues.length === 2, 'there must be exactly two valid values' );

    const options = optionize<TwoStateSystemSetOptions, SelfOptions, PhetioObjectOptions>()( {
      systemType: 'quantum',
      initialBias: 0.5,
      maxNumberOfSystems: 10000,
      phetioState: false
    }, providedOptions );

    super( options );

    this.validValues = stateValues;

    this.systemType = options.systemType;

    // TODO: This isn't how we should do this.  See https://github.com/phetsims/quantum-measurement/issues/43.
    const initialNumberOfActiveSystems = options.maxNumberOfSystems === 1 ? 1 : MULTI_COIN_EXPERIMENT_QUANTITIES[ 1 ];

    this.numberOfActiveSystemsProperty = new NumberProperty( initialNumberOfActiveSystems, {
      range: new Range( 1, options.maxNumberOfSystems ),
      tandem: options.tandem.createTandem( 'numberOfActiveSystemsProperty' )
    } );

    // The initial system state differs for classical versus quantum systems.
    const initialMeasurementState = this.systemType === 'classical' ? 'measuredAndHidden' : 'readyToBeMeasured';
    this.measurementStateProperty = new Property<ExperimentMeasurementState>( initialMeasurementState, {
      tandem: options.tandem.createTandem( 'measurementStateProperty' ),
      phetioValueType: StringUnionIO( ExperimentMeasurementStateValues ),
      phetioReadOnly: true
    } );

    this.measuredValues = new Array<T>( options.maxNumberOfSystems );
    _.times( options.maxNumberOfSystems, i => {
      this.measuredValues[ i ] = initialState;
    } );

    this.biasProperty = biasProperty;

    // Create the seed Property.
    this.seedProperty = new NumberProperty( 1, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'seedProperty' )
    } );

    // Monitor the seed for the random number generator.  If this changes while setting phet-io state, the data will
    // need to be updated.
    this.seedProperty.lazyLink( seed => {

      if ( isSettingPhetioStateProperty.value && this.measurementStateProperty.value === 'revealed' ) {

        this.generateNewMeasurementValues();

        // Create the measured values.
        const random = new Random( { seed: seed } );
        _.times( this.numberOfActiveSystemsProperty.value, i => {

          // Only make a new measurement if one doesn't exist for this element. Otherwise, just keep the existing value.
          const valueSetIndex = random.nextDouble() < this.biasProperty.value ? 0 : 1;
          this.measuredValues[ i ] = this.validValues[ valueSetIndex ];
        } );

        // Signal that the data has been updated.
        this.measuredDataChanged.emit();
      }
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

    if ( this.systemType === 'classical' ) {

      // Classical systems have deterministic values when measured.
      this.generateNewMeasurementValues();
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
      assert && assert( this.systemType === 'quantum', 'This point should only be reached for quantum systems' );
      this.generateNewMeasurementValues();
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
  public measure(): StateSetMeasurementResult<T> {

    assert && assert(
      this.measurementStateProperty.value !== 'preparingToBeMeasured',
      'The system should be ready for measurement or have already been measured.'
    );

    // If the system is ready to be measured, but hasn't yet been, do it now.
    if ( this.measurementStateProperty.value === 'readyToBeMeasured' ) {

      this.generateNewMeasurementValues();

      // Change the state to represent that this system has now been measured.
      this.measurementStateProperty.value = 'revealed';
    }

    return {
      length: this.numberOfActiveSystemsProperty.value,
      measuredValues: this.measuredValues
    };
  }

  private generateNewMeasurementValues(): void {

    // Generate a new seed that will subsequently be used to generate the random data.
    this.seedProperty.value = dotRandom.nextDouble();

    // Create the measured values.
    const random = new Random( { seed: this.seedProperty.value } );
    _.times( this.numberOfActiveSystemsProperty.value, i => {
      const valueSetIndex = random.nextDouble() < this.biasProperty.value ? 0 : 1;
      this.measuredValues[ i ] = this.validValues[ valueSetIndex ];
    } );

    // Signal that the data has been updated.
    this.measuredDataChanged.emit();
  }

  /**
   * Set the measurement value immediately for all elements in this set without transitioning through the
   * 'preparingToBeMeasured' state.
   */
  public setMeasurementValuesImmediate( value: T ): void {
    if ( this.preparingToBeMeasuredTimeoutListener ) {
      stepTimer.clearTimeout( this.preparingToBeMeasuredTimeoutListener );
      this.preparingToBeMeasuredTimeoutListener = null;
    }
    _.times( this.numberOfActiveSystemsProperty.value, i => {
      this.measuredValues[ i ] = value;
    } );
    this.measurementStateProperty.value = this.systemType === 'classical' ? 'measuredAndHidden' : 'readyToBeMeasured';
  }

  public reset(): void {
    this.measurementStateProperty.reset();
    this.numberOfActiveSystemsProperty.reset();
  }
}

quantumMeasurement.register( 'TwoStateSystemSet', TwoStateSystemSet );