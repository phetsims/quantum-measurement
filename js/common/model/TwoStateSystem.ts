// Copyright 2024, University of Colorado Boulder

import Property from '../../../../axon/js/Property.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Range from '../../../../dot/js/Range.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';

/**
 * TwoStateSystem is a simple model for a system that can be in one of two states, and can be prepared (similar to
 * flipping a coin) and measured (similar to reading how the flip turned out).
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

type SelfOptions = {
  initialBias?: number;
};
type TwoStateSystemOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

const BIAS_RANGE = new Range( 0, 1 );

export default class TwoStateSystem<T extends string> extends PhetioObject {

  private readonly currentStateProperty: Property<T>;
  private readonly validValues: readonly T[];

  // The bias for this two-state system.  A value of 0.5 indicates no bias, a value of 0 means it is entirely biased in
  // one direction, and so forth.
  public readonly biasProperty: NumberProperty;

  public constructor( validValues: readonly T[], initialState: T, providedOptions: TwoStateSystemOptions ) {

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
    this.biasProperty = new NumberProperty( options.initialBias, {
      tandem: options.tandem.createTandem( 'biasProperty' ),
      range: BIAS_RANGE
    } );
  }

  /**
   * Prepare this system to be measured.  This is analogous to flipping a physical coin or setting up a quantum system
   * into a transposed state, except that we don't actually model the transposition - we just decide the outcome.
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