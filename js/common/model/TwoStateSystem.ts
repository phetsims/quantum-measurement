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
import TwoStateSystemSet, { TwoStateSystemSetOptions } from './TwoStateSystemSet.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';

type SelfOptions = EmptySelfOptions;
type TwoStateSystemOptions = SelfOptions & StrictOmit<TwoStateSystemSetOptions, 'maxNumberOfSystems'>;

export default class TwoStateSystem<T extends string> extends TwoStateSystemSet<T> {

  // the value of most recent measurement, null indicates indeterminate
  public readonly measuredValueProperty: Property<T>;

  public constructor( stateValues: readonly T[],
                      initialState: T,
                      biasProperty: NumberProperty,
                      providedOptions: TwoStateSystemOptions ) {

    const options = optionize<TwoStateSystemOptions, SelfOptions, TwoStateSystemSetOptions>()( {
      maxNumberOfSystems: 1
    }, providedOptions );

    super( stateValues, initialState, biasProperty, options );

    this.measuredValueProperty = new Property( initialState, {
      tandem: options.tandem.createTandem( 'measuredValueProperty' ),
      phetioValueType: StringUnionIO( stateValues ),
      validValues: [ ...stateValues ]
    } );

    // Hook up to the data-changed emitter to update the data Property.
    this.measuredDataChangedEmitter.addListener( () => {
      this.measuredValueProperty.value = this.measuredValues[ 0 ];
    } );
  }
}

quantumMeasurement.register( 'TwoStateSystem', TwoStateSystem );