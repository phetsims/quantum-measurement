// Copyright 2024, University of Colorado Boulder

/**
 * SternGerlach handles the internal states of the Stern Gerlach experiment. This includes:
 * - The direction of the experiment (currently constrained to X and +-Z)
 * - The state of the incoming particles
 * - The state of the particles after the experiment
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import AveragingCounterNumberProperty from '../../common/model/AveragingCounterNumberProperty.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlockingMode } from './BlockingMode.js';

export default class SternGerlach {

  // Position of the Stern Gerlach (SG) apparatus in the model coordinates
  public readonly positionProperty: Vector2Property;

  // Wether the SG measures in the Z or X direction
  public readonly isZOrientedProperty: BooleanProperty;

  // Wether the direction of the SG is controllable
  public readonly isDirectionControllableProperty: BooleanProperty;

  // Visibility of the SG apparatus
  public readonly isVisibleProperty: BooleanProperty;

  // Whether the apparatus is blocked and which exit would be blocked
  public readonly blockingModeProperty: Property<BlockingMode>;

  // Probability of a particle to be measured in the up and down states
  public readonly upProbabilityProperty: NumberProperty;
  public readonly downProbabilityProperty: TReadOnlyProperty<number>;

  // Counts how many particles have been measured in the up and down states
  public readonly upCounterProperty: AveragingCounterNumberProperty;
  public readonly downCounterProperty: AveragingCounterNumberProperty;

  // Local position vectors
  public entranceLocalPosition: Vector2;
  public topExitLocalPosition: Vector2;
  public bottomExitLocalPosition: Vector2;

  // Local position properties
  public entrancePositionProperty: TReadOnlyProperty<Vector2>;
  public topExitPositionProperty: TReadOnlyProperty<Vector2>;
  public bottomExitPositionProperty: TReadOnlyProperty<Vector2>;

  // Constants
  public static readonly STERN_GERLACH_WIDTH = 150 / 200;
  public static readonly STERN_GERLACH_HEIGHT = 100 / 200;
  public static readonly PARTICLE_HOLE_WIDTH = 5 / 200;
  public static readonly PARTICLE_HOLE_HEIGHT = 20 / 200;

  public constructor( position: Vector2, isZOriented: boolean, tandem: Tandem ) {

    this.positionProperty = new Vector2Property( position, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    this.entranceLocalPosition = new Vector2(
      -SternGerlach.STERN_GERLACH_WIDTH / 2 - SternGerlach.PARTICLE_HOLE_WIDTH / 2, 0 );

    this.topExitLocalPosition = new Vector2(
      SternGerlach.STERN_GERLACH_WIDTH / 2 + SternGerlach.PARTICLE_HOLE_WIDTH / 2, SternGerlach.STERN_GERLACH_HEIGHT / 4 );

    this.bottomExitLocalPosition = new Vector2(
      SternGerlach.STERN_GERLACH_WIDTH / 2 + SternGerlach.PARTICLE_HOLE_WIDTH / 2, -SternGerlach.STERN_GERLACH_HEIGHT / 4 );

    this.entrancePositionProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {
      return position.plus( this.entranceLocalPosition );
    } );

    this.topExitPositionProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {
      return position.plus( this.topExitLocalPosition );
    } );

    this.bottomExitPositionProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {
      return position.plus( this.bottomExitLocalPosition );
    } );

    this.blockingModeProperty = new Property<BlockingMode>( BlockingMode.NO_BLOCKER, {
      tandem: tandem.createTandem( 'blockingModeProperty' ),
      phetioValueType: EnumerationIO<BlockingMode>( {
        enumeration: BlockingMode.enumeration
      } )
    } );

    this.isDirectionControllableProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isDirectionControllableProperty' )
    } );

    this.isZOrientedProperty = new BooleanProperty( isZOriented, {
      tandem: tandem.createTandem( 'isZOrientedProperty' )
    } );

    this.isVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isVisibleProperty' )
    } );

    this.upProbabilityProperty = new NumberProperty( 0.5, {
      tandem: tandem.createTandem( 'upProbabilityProperty' )
    } );

    this.downProbabilityProperty = new DerivedProperty( [ this.upProbabilityProperty ], upProbability => 1 - upProbability );

    const totalAveragingPeriod = 3;
    const countSamplePeriod = 0.5;
    this.upCounterProperty = new AveragingCounterNumberProperty( {
      tandem: tandem.createTandem( 'upCounterProperty' ),
      totalAveragingPeriod: totalAveragingPeriod,
      countSamplePeriod: countSamplePeriod
    } );

    this.downCounterProperty = new AveragingCounterNumberProperty( {
      tandem: tandem.createTandem( 'downCounterProperty' ),
      totalAveragingPeriod: totalAveragingPeriod,
      countSamplePeriod: countSamplePeriod
    } );

    this.isZOrientedProperty.link( () => {
      this.resetCounts();
    } );

  }

  // Updates the counters so they average properly
  public step( dt: number ): void {
    this.upCounterProperty.step( dt );
    this.downCounterProperty.step( dt );
  }

  /**
   * Prepares and returns the probability distribution of a Stern-Gerlach
   * spin measurement of particles with a given state (Z+, Z-, X+, X-) passing
   * through the apparatus.
   */
  public calculateProbability( incomingStateVector: Vector2 ): number {
    // Using a XZ vector to calculate the projected probability.
    // The experiment has a measurement vector and the incoming state has a spin vector
    // Based on the dot product we'll obtain the probability

    const experimentMeasurementVector = this.isZOrientedProperty.value ? new Vector2( 0, 1 ) : new Vector2( 1, 0 );

    // <Z|Z> = 1, <Z|X> = 0, <-Z|Z> = -1 so we need to re-scale into the [0, 1] range
    return ( incomingStateVector.dot( experimentMeasurementVector ) + 1 ) / 2;
  }

  public updateProbability( incomingStateVector: Vector2 ): void {
    this.upProbabilityProperty.value = this.calculateProbability( incomingStateVector );
  }

  // Provided a boolean value, increments the counter of the up or down particles
  public count( isSpinUp: boolean ): void {
    if ( isSpinUp ) {
      this.upCounterProperty.countEvent();
    }
    else {
      this.downCounterProperty.countEvent();
    }
  }

  public resetCounts(): void {
    this.upCounterProperty.reset();
    this.downCounterProperty.reset();
  }

  public reset(): void {
    this.isZOrientedProperty.reset();
    this.upProbabilityProperty.reset();
    this.resetCounts();
  }

}

quantumMeasurement.register( 'SternGerlach', SternGerlach );