// Copyright 2024, University of Colorado Boulder

/**
 * TwoStateSystem is a model for a system that can be in one of two states, and can be prepared (similar to flipping a
 * coin) and measured (similar to reading how the flip turned out).
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import TwoStateSystemSet, { StateSetMeasurementResult, TwoStateSystemSetOptions } from './TwoStateSystemSet.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';

type SelfOptions = EmptySelfOptions;
type TwoStateSystemOptions = SelfOptions & StrictOmit<TwoStateSystemSetOptions, 'maxNumberOfSystems'>;

export default class TwoStateSystem<T extends string> extends TwoStateSystemSet<T> {

  // the value of most recent measurement, null indicates indeterminate
  public readonly measuredValueProperty: Property<T | null>;

  public constructor( stateValues: readonly T[],
                      initialState: T | null,
                      biasProperty: NumberProperty,
                      providedOptions: TwoStateSystemOptions ) {

    const options = optionize<TwoStateSystemOptions, SelfOptions, TwoStateSystemSetOptions>()( {
      maxNumberOfSystems: 1
    }, providedOptions );

    super( stateValues, initialState, biasProperty, options );

    this.measuredValueProperty = new Property( initialState, {
      tandem: options.tandem.createTandem( 'measuredValueProperty' ),
      phetioValueType: NullableIO( StringUnionIO( stateValues ) ),
      validValues: [ ...stateValues, null ]
    } );
  }

  /**
   * Measure the system, which will either cause a value to be chosen if one hasn't been since the last preparation or
   * will just return the value of the most recent measurement.
   */
  public measureSystem(): T {
    const result = super.measure();
    assert && assert( result.length === 1, 'unexpected length for measurement set' );
    assert && assert( result.measuredValues[ 0 ] !== null, 'measurement result should not be indeterminate' );
    const measurementValue: T = result.measuredValues[ 0 ]!;
    this.measuredValueProperty.set( measurementValue );
    return measurementValue;
  }

  /**
   * Override the measure function
   */
  public override measure(): StateSetMeasurementResult<T> {
    const measurementResults = super.measure();
    assert && assert( measurementResults.length === 1, 'unexpected length for measurement set' );
    assert && assert( measurementResults.measuredValues[ 0 ] !== null, 'measurement result should not be indeterminate' );
    this.measuredValueProperty.set( measurementResults.measuredValues[ 0 ] );
    return measurementResults;
  }

  /**
   * Set the measurement value immediately for this system without transitioning through the 'preparingToBeMeasured'
   * state.
   */
  public setMeasurementValueImmediate( value: T ): void {
    super.setMeasurementValuesImmediate( value );
  }
}

quantumMeasurement.register( 'TwoStateSystem', TwoStateSystem );