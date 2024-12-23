// Copyright 2024, University of Colorado Boulder

/**
 * Main model for the Bloch Sphere screen that contains the Bloch Sphere representation and the logic for
 * measurements, equations and rotation under magnetic field.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ComplexBlochSphere from './ComplexBlochSphere.js';

type SelfOptions = EmptySelfOptions;

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BlochSphereModel implements TModel {

  public readonly blochSphere: ComplexBlochSphere;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.blochSphere = new ComplexBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    // no-op
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.blochSphere.step( dt );
  }
}

quantumMeasurement.register( 'BlochSphereModel', BlochSphereModel );