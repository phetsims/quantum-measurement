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
import quantumMeasurement from '../../quantumMeasurement.js';
import { SpinDirection } from './SpinDirection.js';

export default class SternGerlach {

  // TODO: Document! https://github.com/phetsims/quantum-measurement/issues/53
  //
  public readonly positionProperty: Vector2Property;

  public readonly isZOrientedProperty: BooleanProperty;

  public readonly isVisibleProperty: BooleanProperty;

  public readonly upProbabilityProperty: NumberProperty;
  public readonly downProbabilityProperty: TReadOnlyProperty<number>;
  public readonly expectedSpinProperty: Property<SpinDirection>;

  // Local position vectors
  public entranceLocalPosition: Vector2;
  public topExitLocalPosition: Vector2;
  public bottomExitLocalPosition: Vector2;

  // Local position properties
  public entrancePositionProperty: TReadOnlyProperty<Vector2>;
  public topExitPositionProperty: TReadOnlyProperty<Vector2>;
  public bottomExitPositionProperty: TReadOnlyProperty<Vector2>;


  // Constants
  public readonly STERN_GERLACH_WIDTH = 150 / 200;
  public readonly STERN_GERLACH_HEIGHT = 100 / 200;
  public readonly PARTICLE_HOLE_WIDTH = 5 / 200;
  public readonly PARTICLE_HOLE_HEIGHT = 20 / 200;

  public constructor( position: Vector2, isZOriented: boolean, tandem: Tandem ) {

    this.positionProperty = new Vector2Property( position, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    this.entranceLocalPosition = new Vector2(
      -this.STERN_GERLACH_WIDTH / 2 - this.PARTICLE_HOLE_WIDTH / 2, 0 );

    this.topExitLocalPosition = new Vector2(
      this.STERN_GERLACH_WIDTH / 2 + this.PARTICLE_HOLE_WIDTH / 2, this.STERN_GERLACH_HEIGHT / 4 );

    this.bottomExitLocalPosition = new Vector2(
      this.STERN_GERLACH_WIDTH / 2 + this.PARTICLE_HOLE_WIDTH / 2, -this.STERN_GERLACH_HEIGHT / 4 );

    this.entrancePositionProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {
      return position.plus( this.entranceLocalPosition );
    } );

    this.topExitPositionProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {
      return position.plus( this.topExitLocalPosition );
    } );

    this.bottomExitPositionProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {
      return position.plus( this.bottomExitLocalPosition );
    } );


    this.isZOrientedProperty = new BooleanProperty( isZOriented, {
      tandem: tandem.createTandem( 'isZOrientedProperty' )
    } );

    this.isVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isVisibleProperty' )
    } );

    this.expectedSpinProperty = new Property<SpinDirection>( SpinDirection.Z_PLUS, {
      validValues: SpinDirection.enumeration.values
    } );

    this.upProbabilityProperty = new NumberProperty( 0.5, {
      tandem: tandem.createTandem( 'upProbabilityProperty' )
    } );

    this.downProbabilityProperty = new DerivedProperty( [ this.upProbabilityProperty ], upProbability => 1 - upProbability );

  }


  /**
   * Prepares and returns the probability distribution of a Stern-Gerlach
   * spin measurement of particles with a given state (Z+, Z-, X+, X-) passing
   * through the apparatus.
   */
  public prepare( incomingState: SpinDirection | null ): number {

    // Using a XZ vector to calculate the projected probability.
    // The experiment has a measurement vector and the incoming state has a spin vector
    // Based on the dot product we'll obtain the probability

    const incomingStateVector = SpinDirection.spinToVector( incomingState );

    const experimentMeasurementVector = this.isZOrientedProperty.value ? new Vector2( 0, 1 ) : new Vector2( 1, 0 );

    // <Z|Z> = 1, <Z|X> = 0, <-Z|Z> = -1 so we need to re-scale into the [0, 1] range
    this.upProbabilityProperty.value = ( incomingStateVector.dot( experimentMeasurementVector ) + 1 ) / 2;

    // TODO this is wrong! https://github.com/phetsims/quantum-measurement/issues/53
    this.expectedSpinProperty.value = this.isZOrientedProperty.value ?
                                      this.upProbabilityProperty.value === 0.5 ? SpinDirection.X_PLUS : SpinDirection.Z_MINUS :
                                      this.upProbabilityProperty.value === 0.5 ? SpinDirection.Z_PLUS : SpinDirection.Z_MINUS;

    return this.upProbabilityProperty.value;
  }


  public reset(): void {
    this.upProbabilityProperty.reset();
    this.expectedSpinProperty.reset();
  }

}

quantumMeasurement.register( 'SternGerlach', SternGerlach );