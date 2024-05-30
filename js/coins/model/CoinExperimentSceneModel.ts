// Copyright 2024, University of Colorado Boulder

/**
 * TODO: See https://github.com/phetsims/quantum-measurement/issues/1.  At the time of this writing I (jbphet) am not
 *        sure if this will be the base class for the two scenes on the "Coins" screen or a configurable class.  Update
 *        this header when the decision is made.
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
import { PhysicalCoinStates, PhysicalCoinStateValues } from '../../common/model/PhysicalCoinStates.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';

type SelfOptions = {
  initiallyVisible?: boolean;
};
type CoinExperimentSceneModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class CoinExperimentSceneModel extends PhetioObject {

  // whether this scene is active, which is mostly about whether it is shown in the view
  public readonly activeProperty: BooleanProperty;

  // This BooleanProperty is used to control whether the experiment is being prepared (true) or measured (false).
  public readonly preparingExperimentProperty: BooleanProperty;

  // current state of the single- and multi-coin experiments
  public readonly singleCoinExperimentStateProperty: Property<CoinExperimentStates>;
  public readonly multiCoinExperimentStateProperty: Property<CoinExperimentStates>;

  // The coins that are flipped/prepared and then measured during the experiment.
  public readonly singleCoin: TwoStateSystem<PhysicalCoinStates>;

  public constructor( providedOptions: CoinExperimentSceneModelOptions ) {

    const options = optionize<CoinExperimentSceneModelOptions, SelfOptions, PhetioObjectOptions>()( {
      initiallyVisible: false
    }, providedOptions );

    super( options );

    this.activeProperty = new BooleanProperty( options.initiallyVisible, {
      tandem: options.tandem.createTandem( 'activeProperty' )
    } );
    this.preparingExperimentProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'preparingExperimentProperty' )
    } );
    this.singleCoinExperimentStateProperty = new Property<CoinExperimentStates>( 'hiddenAndStill', {
      phetioValueType: StringUnionIO( CoinExperimentStateValues ),
      tandem: options.tandem.createTandem( 'singleCoinExperimentStateProperty' )
    } );
    this.multiCoinExperimentStateProperty = new Property<CoinExperimentStates>( 'hiddenAndStill', {
      phetioValueType: StringUnionIO( CoinExperimentStateValues ),
      tandem: options.tandem.createTandem( 'multiCoinExperimentStateProperty' )
    } );
    this.singleCoin = new TwoStateSystem<PhysicalCoinStates>(
      PhysicalCoinStateValues,
      'heads',
      { tandem: options.tandem.createTandem( 'singleCoin' ) }
    );
  }

  public reset(): void {
    this.activeProperty.reset();
    this.singleCoinExperimentStateProperty.reset();
    this.multiCoinExperimentStateProperty.reset();
    this.singleCoin.reset();
  }
}

quantumMeasurement.register( 'CoinExperimentSceneModel', CoinExperimentSceneModel );