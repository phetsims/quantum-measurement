// Copyright 2024, University of Colorado Boulder

/**
 * SternGerlachModel handles the internal states of the Stern Gerlach experiment. This includes:
 * - The direction of the experiment (currently constrained to X and +-Z)
 * - The state of the incoming particles
 * - The state of the particles after the experiment
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SpinValue } from './SpinModel.js';

export default class SternGerlachModel {

  public readonly isZOrientedProperty: BooleanProperty;

  public readonly isVisibleProperty: BooleanProperty;

  public readonly upProbabilityProperty: NumberProperty;
  public readonly downProbabilityProperty: TReadOnlyProperty<number>;

  public constructor( isZOriented: boolean, tandem: Tandem ) {

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

  }


  /**
   * Measures incoming particles with a given state (Z+, Z-, X+), and returns the probability of spin up
   * in the direction of the Stern Gerlach experiment.
   */
  public measure( incomingState: SpinValue | null ): number {

    // Using a XZ vector to calculate the projected probability.
    // The experiment has a measurement vector and the incoming state has a spin vector
    // Based on the dot product we'll obtain the probability

    const incomingStateVector = SpinValue.spinToVector( incomingState );

    const experimentMeasurementVector = this.isZOrientedProperty.value ? new Vector2( 0, 1 ) : new Vector2( 1, 0 );

    // <Z|Z> = 1, <Z|X> = 0, <-Z|Z> = -1 so we need to re-scale into the [0, 1] range
    this.upProbabilityProperty.value = ( incomingStateVector.dot( experimentMeasurementVector ) + 1 ) / 2;

    return this.upProbabilityProperty.value;
  }


  public reset(): void {
    // no-op TODO https://github.com/phetsims/quantum-measurement/issues/53
  }

}

quantumMeasurement.register( 'SternGerlachModel', SternGerlachModel );