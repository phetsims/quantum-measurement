// Copyright 2024, University of Colorado Boulder

/**
 * The SpinModel handles the state and behavior for the "Spin" screen.
 * In here, the user will select between initial spin values of incoming particles, represented via a Bloch Sphere.
 * The particles will pass across a series of Stern Gerlach experiments, and the final state will be displayed.
 *
 * This model is responsible for managing the selected spin state, or the experiment.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

const EXPERIMENTS = [
  'Experiment 1 [SGz]',
  'Experiment 2 [SGx]',
  'Experiment 3 [Sz, Sx]',
  'Experiment 4 [Sz, Sz]',
  'Experiment 5 [Sx, Sz]',
  'Experiment 6 [Sx, Sx]',
  'Custom'
] as const;
type ValidExperiments = typeof EXPERIMENTS[number];

export const SpinValues = [ 'Z_PLUS', 'Z_MINUS', 'X_PLUS' ] as const;
export type SpinTypes = typeof SpinValues[number]; // Creates a union type of 'Z_PLUS' | 'Z_MINUS' | 'X_PLUS'

export default class SpinModel implements TModel {

  public readonly blochSphere: SimpleBlochSphere;

  public readonly experiments = EXPERIMENTS;
  public readonly currentExperimentProperty: Property<ValidExperiments>;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.blochSphere = new SimpleBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
    } );

    this.currentExperimentProperty = new Property<ValidExperiments>( 'Experiment 1 [SGz]' );
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