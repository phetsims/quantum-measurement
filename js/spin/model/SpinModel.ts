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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TModel from '../../../../joist/js/TModel.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';
import SpinExperiment from './SpinExperiment.js';
import SternGerlachModel from './SternGerlachModel.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;


export class SpinValue extends EnumerationValue {

  // TODO: This should go in the strings file https://github.com/phetsims/quantum-measurement/issues/53
  public static readonly Z_PLUS = new SpinValue( 'Z_PLUS', '"+Z"    ⟨Sz⟩ = +ħ/2', 'ZPlus' );
  public static readonly X_PLUS = new SpinValue( 'X_PLUS', '"+X"    ⟨Sz⟩ = 0', 'XPlus' );
  public static readonly Z_MINUS = new SpinValue( 'Z_MINUS', '"-Z"    ⟨Sz⟩ = -ħ/2', 'ZMinus' );

  public static readonly enumeration = new Enumeration( SpinValue );

  public constructor( public readonly value: string,
                      public readonly description: string | TReadOnlyProperty<string>,
                      public readonly tandemName: string ) {
    super();
  }
}

export class SourceMode extends EnumerationValue {
  
  public static readonly SINGLE = new SourceMode( 'Single Particle', 'singleParticle' );
  
  public static readonly CONTINUOUS = new SourceMode( 'Continuous', 'continuous' );
  
  public static readonly enumeration = new Enumeration( SourceMode );
  
  public constructor( public readonly sourceName: string | TReadOnlyProperty<string>, public readonly tandemName: string ) {
    super();
  }
}

export default class SpinModel implements TModel {

  public readonly sourceModeProperty: Property<SourceMode>;

  public readonly blochSphere: SimpleBlochSphere;

  public readonly currentExperimentProperty: Property<SpinExperiment>;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly firstSternGerlachModel: SternGerlachModel;
  public readonly secondSternGerlachModel: SternGerlachModel;
  public readonly thirdSternGerlachModel: SternGerlachModel;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.sourceModeProperty = new Property<SourceMode>( SourceMode.SINGLE );

    this.blochSphere = new SimpleBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
    } );

    this.currentExperimentProperty = new Property<SpinExperiment>( SpinExperiment.EXPERIMENT_1 );

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