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
import QuantumMeasurementConstants from '../QuantumMeasurementConstants.js';
import { MULTI_COIN_EXPERIMENT_QUANTITIES } from '../../coins/model/CoinsExperimentSceneModel.js';

type SelfOptions = {
  initialBias?: number;
  maxNumberOfSystems?: number;
};
export type TwoStateSystemSetOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export type StateSetMeasurementResult<T> = {
  length: number;
  measuredValues: Array<T | null>;
};

// REVIEW: Should T only extend string or some system type? See https://github.com/phetsims/quantum-measurement/issues/20
export default class TwoStateSystemSet<T extends string> extends PhetioObject {

  // the state of the measurement for this system
  public readonly measurementStateProperty: Property<ExperimentMeasurementState>;

  // valid values for a measurement
  public readonly validValues: readonly T[];

  // REVIEW: Any reason why here it's Array<> and above is T[]? https://github.com/phetsims/quantum-measurement/issues/20
  // the values of most recent measurement, null indicates indeterminate
  public readonly measuredValues: Array<T | null>;

  // The number of systems that will be measured each time a measurement is made.
  public readonly numberOfActiveSystemsProperty: NumberProperty;

  // Timeout for the preparingToBeMeasured state.
  private preparingToBeMeasuredTimeoutListener: null | TimerListener = null;

  // The bias for each two-state system, and specifically the probability of the system being found in the first of the
  // two provided values. A value of 1 means it will always be found in the first provided state, 0 means always the
  // second, and 0.5 means no bias.
  public readonly biasProperty: NumberProperty;

  public constructor( stateValues: readonly T[],
                      initialState: T | null,
                      biasProperty: NumberProperty,
                      providedOptions: TwoStateSystemSetOptions ) {

    assert && assert( stateValues.length === 2, 'there must be exactly two valid values' );

    const options = optionize<TwoStateSystemSetOptions, SelfOptions, PhetioObjectOptions>()( {
      initialBias: 0.5,
      maxNumberOfSystems: 10000,
      phetioState: false
    }, providedOptions );

    super( options );

    this.validValues = stateValues;

    this.numberOfActiveSystemsProperty = new NumberProperty( MULTI_COIN_EXPERIMENT_QUANTITIES[ 1 ], {
      range: new Range( 1, options.maxNumberOfSystems ),
      tandem: options.tandem.createTandem( 'numberOfActiveSystemsProperty' )
    } );

    this.measurementStateProperty = new Property<ExperimentMeasurementState>( 'readyToBeMeasured', {
      tandem: options.tandem.createTandem( 'measurementStateProperty' ),
      phetioValueType: StringUnionIO( ExperimentMeasurementStateValues ),
      phetioReadOnly: true
    } );
    this.measuredValues = new Array<T | null>( options.maxNumberOfSystems );
    _.times( options.maxNumberOfSystems, i => {
      this.measuredValues[ i ] = initialState;
    } );
    this.biasProperty = biasProperty;
  }

  /**
   * Prepare this system to be measured. This is analogous to initiating the flipping of a classical coin or setting up
   * a quantum system into a superposed state. After a timeout, this system will transition to a state where it is
   * ready to be measured.
   */
  public prepare( measureWhenPrepared = false ): void {

    // Set the state to preparingToBeMeasured and start a timeout for the state to end.
    this.measurementStateProperty.value = 'preparingToBeMeasured';

    // Set the measured values to an indeterminate state until they are measured.
    _.times( this.measuredValues.length, i => {
      this.measuredValues[ i ] = null;
    } );

    // REVIEW: Document how the stepTimer operates here https://github.com/phetsims/quantum-measurement/issues/20
    this.preparingToBeMeasuredTimeoutListener = stepTimer.setTimeout( () => {
      this.preparingToBeMeasuredTimeoutListener = null;
      this.measurementStateProperty.value = 'readyToBeMeasured';
      if ( measureWhenPrepared ) {
        this.measure();
      }
    }, QuantumMeasurementConstants.PREPARING_TO_BE_MEASURED_TIME * 1000 );
  }

  /**
   * Prepare the system for measurement without transitioning through the 'preparingToBeMeasured' state. This is more
   * the exception than the rule, but is needed in a case or two.
   */
  public prepareInstantly(): void {

    // Set the measured values to an indeterminate state until they are measured.
    _.times( this.measuredValues.length, i => {
      this.measuredValues[ i ] = null;
    } );
    this.measurementStateProperty.value = 'readyToBeMeasured';
  }

  /**
   * Measure the system, which will either cause a value to be chosen if one hasn't been since the last preparation, or
   * will just return the value of the most recent measurement.
   *
   * REVIEW TODO: The return value of this method is never used anywhere! See https://github.com/phetsims/quantum-measurement/issues/20
   */
  public measure(): StateSetMeasurementResult<T> {
    assert && assert(
      this.measurementStateProperty.value === 'readyToBeMeasured' || this.measurementStateProperty.value === 'measuredAndRevealed',
      'The system should be ready for measurement or have already been measured.'
    );

    _.times( this.numberOfActiveSystemsProperty.value, i => {

      // Only make a new measurement if one doesn't exist for this element. Otherwise, just keep the existing value.
      if ( this.measuredValues[ i ] === null ) {
        const valueSetIndex = dotRandom.nextDouble() < this.biasProperty.value ? 0 : 1;
        this.measuredValues[ i ] = this.validValues[ valueSetIndex ];
      }
    } );

    this.measurementStateProperty.value = 'measuredAndRevealed';
    return {
      length: this.numberOfActiveSystemsProperty.value,
      measuredValues: this.measuredValues
    };
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
    this.measurementStateProperty.value = 'readyToBeMeasured';
  }

  /**
   * Go back to the 'readyToBeMeasured' state without re-preparing the measurement.
   */
  public hide(): void {
    this.measurementStateProperty.value = 'readyToBeMeasured';
  }

  public reset(): void {
    this.measurementStateProperty.reset();
    this.numberOfActiveSystemsProperty.reset();
  }
}

quantumMeasurement.register( 'TwoStateSystemSet', TwoStateSystemSet );