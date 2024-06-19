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

type SelfOptions = {
  initialBias?: number;
};
type TwoStateSystemOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class TwoStateSystem<T extends string> extends PhetioObject {

  public readonly currentStateProperty: Property<T>;
  public readonly validValues: readonly T[];

  // The bias for this two-state system, and specifically the probability of the system being found in the first of the
  // two provided values.  A value of 1 means it will always be found in the first provided state, 0 means always the
  // second, and 0.5 means no bias.
  public readonly biasProperty: NumberProperty;

  public constructor( validValues: readonly T[],
                      initialState: T,
                      biasProperty: NumberProperty,
                      providedOptions: TwoStateSystemOptions ) {

    assert && assert( validValues.length === 2, 'there must be exactly two valid values' );

    const options = optionize<TwoStateSystemOptions, SelfOptions, PhetioObjectOptions>()( {
      initialBias: 0.5
    }, providedOptions );

    super( options );

    this.validValues = validValues;

    this.currentStateProperty = new Property( initialState, {
      tandem: options.tandem.createTandem( 'currentStateProperty' ),
      phetioValueType: StringUnionIO( validValues ),
      validValues: validValues
    } );
    this.biasProperty = biasProperty;
  }

  /**
   * Prepare this system to be measured.  This is analogous to flipping a physical coin or setting up a quantum system
   * into a superimposed state, except that we don't actually model the superposition - we just decide the outcome.
   */
  public prepare(): void {
    const index = dotRandom.nextDouble() < this.biasProperty.value ? 0 : 1;
    this.currentStateProperty.value = this.validValues[ index ];
  }

  /**
   * Measure the system, which simply means to get its current value.
   */
  public measure(): T {
    return this.currentStateProperty.value;
  }

  public reset(): void {
    this.biasProperty.reset();
    this.currentStateProperty.reset();
  }

}

quantumMeasurement.register( 'TwoStateSystem', TwoStateSystem );