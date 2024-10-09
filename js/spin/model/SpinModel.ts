// Copyright 2024, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities. See https://github.com/phetsims/quantum-measurement/issues/1
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export const SpinValues = [ 'Z_PLUS', 'Z_MINUS', 'X_PLUS' ] as const;
export type SpinTypes = typeof SpinValues[number]; // Creates a union type of 'Z_PLUS' | 'Z_MINUS' | 'X_PLUS'

export default class SpinModel implements TModel {

  public readonly blochSphere: SimpleBlochSphere;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.blochSphere = new SimpleBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    // TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }
}

quantumMeasurement.register( 'SpinModel', SpinModel );