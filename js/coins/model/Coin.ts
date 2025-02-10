// Copyright 2024-2025, University of Colorado Boulder

/**
 * The Coin class is a model for a classical or quantum coin whose face can be in one of two states or, in the quantum
 * case, in a superposed state.  The coin can be prepared for measurement (similar to flipping a coin) and then measured
 * (similar to reading how the flip turned out).
 *
 * The Coin class is implemented as a specialization of the CoinSet class with a single coin.  This is done for
 * simplicity of the code base and for consistency of the phet-io serialization and state behavior.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { CoinStates } from './CoinStates.js';
import CoinSet, { TwoStateSystemSetOptions } from './CoinSet.js';

type SelfOptions = EmptySelfOptions;
type TwoStateSystemOptions = SelfOptions & TwoStateSystemSetOptions;

export default class Coin extends CoinSet {

  // the value of most recent measurement, null indicates indeterminate
  public readonly measuredValueProperty: Property<CoinStates>;

  public constructor( coinType: SystemType,
                      initialState: CoinStates,
                      biasProperty: NumberProperty,
                      providedOptions: TwoStateSystemOptions ) {

    const options = optionize<TwoStateSystemOptions, SelfOptions, TwoStateSystemSetOptions>()( {}, providedOptions );

    super( coinType, 1, 1, initialState, biasProperty, options );

    this.measuredValueProperty = new Property( initialState, {
      tandem: options.tandem.createTandem( 'measuredValueProperty' ),
      phetioValueType: StringUnionIO( this.validValues ),
      validValues: [ ...this.validValues ],
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    // Hook up to the data-changed emitter to update the data Property.
    this.measuredDataChangedEmitter.addListener( () => {
      this.measuredValueProperty.value = this.measuredValues[ 0 ];
    } );
  }
}

quantumMeasurement.register( 'Coin', Coin );