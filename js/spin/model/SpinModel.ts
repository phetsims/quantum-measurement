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
import SpinExperiments from './SpinExperiments.js';
import SternGerlachModel from './SternGerlachModel.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;


// TODO: Consider using EnumerationValues for these, see https://github.com/phetsims/quantum-measurement/issues/53
export const SpinValues = [ 'Z_PLUS', 'X_PLUS', 'Z_MINUS' ] as const;
export type SpinTypes = typeof SpinValues[number]; // Creates a union type of 'Z_PLUS' | 'Z_MINUS' | 'X_PLUS'

export const SourceModes = [ 'single', 'continuous' ] as const;
export type SourceModeTypes = typeof SourceModes[number];

export default class SpinModel implements TModel {

  public readonly sourceModeProperty: Property<SourceModeTypes>;

  public readonly blochSphere: SimpleBlochSphere;

  public readonly currentExperimentProperty: Property<SpinExperiments>;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly firstSternGerlachModel: SternGerlachModel;
  public readonly secondSternGerlachModel: SternGerlachModel;
  public readonly thirdSternGerlachModel: SternGerlachModel;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.sourceModeProperty = new Property<SourceModeTypes>( 'single' );

    this.blochSphere = new SimpleBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
    } );

    this.currentExperimentProperty = new Property<SpinExperiments>( SpinExperiments.EXPERIMENT_1 );

    const sternGerlachModelsTandem = providedOptions.tandem.createTandem( 'sternGerlachModels' );
    this.firstSternGerlachModel = new SternGerlachModel( true, sternGerlachModelsTandem.createTandem( 'firstSternGerlachModel' ) );
    this.secondSternGerlachModel = new SternGerlachModel( false, sternGerlachModelsTandem.createTandem( 'secondSternGerlachModel' ) );
    this.thirdSternGerlachModel = new SternGerlachModel( false, sternGerlachModelsTandem.createTandem( 'thirdSternGerlachModel' ) );

    const sternGerlachModels = [ this.firstSternGerlachModel, this.secondSternGerlachModel, this.thirdSternGerlachModel ];

    this.currentExperimentProperty.link( experiment => {
      sternGerlachModels.forEach( ( sternGerlachModel, index ) => {
        if ( experiment.experimentSettings.length > index ) {
          // TODO: Should visibility be only handled via the View? https://github.com/phetsims/quantum-measurement/issues/53
          sternGerlachModel.isVisibleProperty.set( experiment.experimentSettings[ index ].active );
          sternGerlachModel.isZOrientedProperty.set( experiment.experimentSettings[ index ].isZOriented );
        }
        else {
          sternGerlachModel.isVisibleProperty.set( false );
        }
      } );
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