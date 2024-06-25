// Copyright 2024, University of Colorado Boulder

/**
 * TwoStateSystem is a simple model for a system that can be in one of two states, and can be prepared (similar to
 * flipping a coin) and measured (similar to reading how the flip turned out).
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { ExperimentMeasurementState, ExperimentMeasurementStateValues } from '../../coins/model/ExperimentMeasurementState.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import QuantumMeasurementConstants from '../QuantumMeasurementConstants.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';

type SelfOptions = {
  initialBias?: number;
};
type TwoStateSystemOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class TwoStateSystem<T extends string> extends PhetioObject {

  // the state of the measurement for this system
  public readonly measurementStateProperty: Property<ExperimentMeasurementState>;

  // valid values for a measurement
  public readonly validValues: readonly T[];

  // the value of most recent measurement, null indicates indeterminate
  public readonly measuredValueProperty: Property<T | null>;

  // Timeout for the preparingToBeMeasured state.
  private preparingToBeMeasuredTimeoutListener: null | TimerListener = null;

  // The bias for this two-state system, and specifically the probability of the system being found in the first of the
  // two provided values.  A value of 1 means it will always be found in the first provided state, 0 means always the
  // second, and 0.5 means no bias.
  public readonly biasProperty: NumberProperty;

  public constructor( stateValues: readonly T[],
                      initialState: T | null,
                      biasProperty: NumberProperty,
                      providedOptions: TwoStateSystemOptions ) {

    assert && assert( stateValues.length === 2, 'there must be exactly two valid values' );

    const options = optionize<TwoStateSystemOptions, SelfOptions, PhetioObjectOptions>()( {
      initialBias: 0.5
    }, providedOptions );

    super( options );

    this.validValues = stateValues;

    this.measurementStateProperty = new Property<ExperimentMeasurementState>( 'readyToBeMeasured', {
      tandem: options.tandem.createTandem( 'measurementStateProperty' ),
      phetioValueType: StringUnionIO( ExperimentMeasurementStateValues ),
      phetioReadOnly: true
    } );
    this.measuredValueProperty = new Property( initialState, {
      tandem: options.tandem.createTandem( 'measuredValueProperty' ),
      phetioValueType: NullableIO( StringUnionIO( stateValues ) ),
      validValues: [ ...stateValues, null ]
    } );
    this.biasProperty = biasProperty;
  }

  /**
   * Prepare this system to be measured.  This is analogous to initiating the flipping of a physical coin or setting up
   * a quantum system into a superimposed state.  After a timeout, this system will transition to a state where it is
   * ready to be measured.
   */
  public prepare( measureWhenPrepared = false ): void {

    // Set the state to preparingToBeMeasured and start a timeout for the state to end.
    this.measurementStateProperty.value = 'preparingToBeMeasured';
    this.measuredValueProperty.value = null; // indeterminate state until measured

    this.preparingToBeMeasuredTimeoutListener = stepTimer.setTimeout( () => {
      this.preparingToBeMeasuredTimeoutListener = null;
      this.measurementStateProperty.value = 'readyToBeMeasured';
      if ( measureWhenPrepared ) {
        this.measure();
      }
    }, QuantumMeasurementConstants.PREPARING_TO_BE_MEASURED_TIME * 1000 );
  }

  /**
   * Prepare the system for measurement without transitioning through the 'preparingToBeMeasured' state.  This is more
   * the exception than the rule, but is needed in a case or two.
   */
  public prepareInstantly(): void {
    this.measuredValueProperty.value = null; // indeterminate state until measured
    this.measurementStateProperty.value = 'readyToBeMeasured';
  }

  /**
   * Measure the system, which will either cause a value to be chosen if one hasn't been since the last preparation, or
   * will just return the value of the most recent measurement.
   */
  public measure(): T {
    assert && assert(
      this.measurementStateProperty.value !== 'preparingToBeMeasured',
      'The system should not be measured if it is not ready for measurement.'
    );

    if ( this.measuredValueProperty.value === null ) {

      // Make a new measurement, which essentially means to randomly choose a new value.
      const index = dotRandom.nextDouble() < this.biasProperty.value ? 0 : 1;
      this.measuredValueProperty.value = this.validValues[ index ];
    }
    this.measurementStateProperty.value = 'measuredAndRevealed';
    return this.measuredValueProperty.value;
  }

  /**
   * Go back to the 'readyToBeMeasured' state without re-preparing the measurement.
   */
  public hide(): void {
    this.measurementStateProperty.value = 'readyToBeMeasured';
  }

  /**
   * Set the measurement value immediately, i.e. without transitioning through the 'preparingToBeMeasured' state.
   */
  public setMeasurementValueImmediate( value: T ): void {
    if ( this.preparingToBeMeasuredTimeoutListener ) {
      stepTimer.clearTimeout( this.preparingToBeMeasuredTimeoutListener );
      this.preparingToBeMeasuredTimeoutListener = null;
    }
    this.measuredValueProperty.value = value;
    this.measurementStateProperty.value = 'readyToBeMeasured';
  }

  public reset(): void {
    this.measuredValueProperty.reset();
    this.measurementStateProperty.reset();
  }
}

quantumMeasurement.register( 'TwoStateSystem', TwoStateSystem );