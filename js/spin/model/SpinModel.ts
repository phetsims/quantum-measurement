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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlockingMode } from './BlockingMode.js';
import MeasurementDevice from './MeasurementDevice.js';
import ParticleSourceModel from './ParticleSourceModel.js';
import { ParticleSystem } from './ParticleSystem.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';
import { SourceMode } from './SourceMode.js';
import { SpinDirection } from './SpinDirection.js';
import SpinExperiment from './SpinExperiment.js';
import SternGerlach from './SternGerlach.js';

type SelfOptions = {
  // TODO add options that are specific to QuantumMeasurementModel here, see see https://github.com/phetsims/quantum-measurement/issues/1.
};

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// Constants
export const BLOCKER_OFFSET = new Vector2( 0.1, 0 );

export default class SpinModel implements TModel {

  // Bloch Sphere that represents the current spin state
  public readonly blochSphere: SimpleBlochSphere;

  // The probability of the 'up' state. The 'down' probability will be 1 - this.
  public readonly upProbabilityProperty: NumberProperty;
  public readonly downProbabilityProperty: NumberProperty;

  // Spin property that is controlled by the buttons or sliders
  public readonly derivedSpinStateProperty: TReadOnlyProperty<Vector2>;

  // Current experiment selected by the user
  public readonly currentExperimentProperty: Property<SpinExperiment>;
  public readonly isCustomExperimentProperty: TReadOnlyProperty<boolean>;

  public readonly particleSystem: ParticleSystem;

  // Model for the particle shooting apparatus
  public readonly particleSourceModel: ParticleSourceModel;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly sternGerlachs: SternGerlach[];

  // Invisible lines that trigger measurement of the particles when they fly through them
  public readonly measurementLines: MeasurementDevice[];

  // Expected percentage of particles that should be visible in the histogram
  public readonly expectedPercentageVisibleProperty: BooleanProperty;

  // Boolean to control what exit to block in continuous mode
  public readonly isBlockingProperty: TReadOnlyProperty<boolean>;
  public readonly exitBlockerPositionProperty: TReadOnlyProperty<Vector2 | null>;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.currentExperimentProperty = new Property<SpinExperiment>( SpinExperiment.EXPERIMENT_1, {
      tandem: providedOptions.tandem.createTandem( 'currentExperimentProperty' ),
      phetioValueType: EnumerationIO( SpinExperiment ),
      validValues: SpinExperiment.enumeration.values,
      phetioFeatured: true
    } );
    this.isCustomExperimentProperty = new DerivedProperty(
      [ this.currentExperimentProperty ],
      ( experiment: SpinExperiment ) => experiment === SpinExperiment.CUSTOM
    );

    this.particleSourceModel = new ParticleSourceModel( new Vector2( -0.5, 0 ), providedOptions.tandem.createTandem( 'particleSourceModel' ) );

    this.particleSystem = new ParticleSystem( this, providedOptions.tandem );

    this.derivedSpinStateProperty = new DerivedProperty(
      [
        this.particleSourceModel.spinStateProperty,
        this.particleSourceModel.customSpinStateProperty,
        this.isCustomExperimentProperty
      ],
      ( spinState, customSpinState, customExperiment ) => {
        return customExperiment ? customSpinState : SpinDirection.spinToVector( spinState );
      }
    );

    this.blochSphere = new SimpleBlochSphere(
      this.derivedSpinStateProperty, { tandem: providedOptions.tandem.createTandem( 'blochSphere' ) }
    );

    this.upProbabilityProperty = new NumberProperty( 1, {
      tandem: providedOptions.tandem.createTandem( 'upProbabilityProperty' )
    } );

    // Create a Property with the inverse probability as the provided one and hook the two Properties up to one another.
    // This is needed for the number sliders to work properly.
    this.downProbabilityProperty = new NumberProperty( 1 - this.upProbabilityProperty.value );

    const sternGerlachsTandem = providedOptions.tandem.createTandem( 'sternGerlachs' );
    this.sternGerlachs = [
      new SternGerlach( new Vector2( 0.8, 0 ), true, sternGerlachsTandem.createTandem( 'firstSternGerlach' ) ),
      new SternGerlach( new Vector2( 2, 0.3 ), false, sternGerlachsTandem.createTandem( 'secondSternGerlach' ) ),
      new SternGerlach( new Vector2( 2, -0.3 ), false, sternGerlachsTandem.createTandem( 'thirdSternGerlach' ) )
    ];

    // SG1 and SG2 should have matching Z orientations
    this.sternGerlachs[ 2 ].isZOrientedProperty.link( isZOriented => {
      this.sternGerlachs[ 1 ].isZOrientedProperty.value = isZOriented;
    } );

    const measurementLinesTandem = providedOptions.tandem.createTandem( 'measurementLines' );
    this.measurementLines = [
      new MeasurementDevice(
        new Vector2( ( this.particleSourceModel.exitPositionProperty.value.x + this.sternGerlachs[ 0 ].entrancePositionProperty.value.x ) / 2, 1 ),
        true, { tandem: measurementLinesTandem.createTandem( 'firstMeasurementDevice' ) }
      ),
      new MeasurementDevice(
        new Vector2( ( this.sternGerlachs[ 0 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].entrancePositionProperty.value.x ) / 2, 1 ),
        true, { tandem: measurementLinesTandem.createTandem( 'secondMeasurementDevice' ) }
      ),
      new MeasurementDevice(
        new Vector2( ( this.sternGerlachs[ 1 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].topExitPositionProperty.value.plusXY( 1, 0 ).x ) / 2, 1 ),
        false, { tandem: measurementLinesTandem.createTandem( 'thirdMeasurementDevice' ) }
      )
    ];

    this.expectedPercentageVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'expectedPercentageVisibleProperty' )
    } );

    this.isBlockingProperty = new DerivedProperty(
      [
        this.particleSourceModel.sourceModeProperty,
        this.currentExperimentProperty
      ],
      ( sourceMode, currentExperiment ) => {
        return sourceMode === SourceMode.CONTINUOUS && !currentExperiment.usingSingleApparatus;
      }
    );

    this.exitBlockerPositionProperty = new DerivedProperty(
      [
        this.sternGerlachs[ 0 ].blockingModeProperty,
        this.sternGerlachs[ 0 ].topExitPositionProperty,
        this.sternGerlachs[ 0 ].bottomExitPositionProperty
      ],
      ( blockingMode, topExit, bottomExit ) => {
        if ( blockingMode !== BlockingMode.NO_BLOCKER ) {
          const offset = BLOCKER_OFFSET;
          const position = blockingMode === BlockingMode.BLOCK_UP ? topExit : bottomExit;
          return position.plus( offset );
        }
        else {
          return null;
        }
      }
    );

    let changeHandlingInProgress = false;

    this.upProbabilityProperty.link( upProbability => {
      if ( !changeHandlingInProgress ) {
        changeHandlingInProgress = true;
        this.downProbabilityProperty.value = 1 - upProbability;
        changeHandlingInProgress = false;
      }

      if ( this.isCustomExperimentProperty.value ) {
        // Set the spin direction
        const polarAngle = Math.PI * ( 1 - upProbability );
        this.particleSourceModel.customSpinStateProperty.value = new Vector2( Math.sin( polarAngle ), Math.cos( polarAngle ) );
      }

      this.prepare();
    } );
    this.downProbabilityProperty.link( downProbability => {
      if ( !changeHandlingInProgress ) {
        changeHandlingInProgress = true;
        this.upProbabilityProperty.value = 1 - downProbability;
        changeHandlingInProgress = false;
      }
    } );

    // Saving the blocking mode into the experiment
    this.sternGerlachs[ 0 ].blockingModeProperty.link( blockingMode => {
      if ( blockingMode !== BlockingMode.NO_BLOCKER ) {
        this.currentExperimentProperty.value.blockingModeProperty.value = blockingMode;
      }
    } );

    Multilink.multilink(
      [
        this.currentExperimentProperty,
        this.particleSourceModel.sourceModeProperty
      ],
      ( experiment, sourceMode ) => {
        if ( sourceMode === SourceMode.CONTINUOUS && !experiment.usingSingleApparatus ) {
          this.sternGerlachs[ 0 ].blockingModeProperty.value = experiment.blockingModeProperty.value;
        }
        else {
          this.sternGerlachs[ 0 ].blockingModeProperty.value = BlockingMode.NO_BLOCKER;
        }
      }
    );

    // Multilink for changes in the experiment either via source mode or experiment selection
    Multilink.multilink(
      [
        this.currentExperimentProperty,
        this.particleSourceModel.sourceModeProperty,
        this.particleSourceModel.spinStateProperty,
        this.sternGerlachs[ 0 ].blockingModeProperty
      ],
      ( experiment, sourceMode, spinState, blockingMode ) => {

        // Clearing the particle system and Stern-Gerlachs for a new experiment
        this.sternGerlachs.forEach( sternGerlach => sternGerlach.reset() );
        this.particleSystem.reset();

        // Conditions that determine visibility and state of the experiment components
        const customExperiment = experiment === SpinExperiment.CUSTOM;
        const singleParticle = sourceMode === SourceMode.SINGLE;
        const longExperiment = !experiment.usingSingleApparatus;

        this.measurementLines[ 0 ].isActiveProperty.value = singleParticle;
        this.measurementLines[ 1 ].isActiveProperty.value = singleParticle;
        this.measurementLines[ 2 ].isActiveProperty.value = singleParticle && longExperiment;

        this.sternGerlachs[ 0 ].isDirectionControllableProperty.value = customExperiment;
        this.sternGerlachs[ 1 ].isDirectionControllableProperty.value = customExperiment && !singleParticle;
        this.sternGerlachs[ 2 ].isDirectionControllableProperty.value = customExperiment;

        this.sternGerlachs[ 1 ].isVisibleProperty.value = longExperiment &&
                                                          blockingMode !== BlockingMode.BLOCK_UP;

        this.sternGerlachs[ 2 ].isVisibleProperty.value = longExperiment &&
                                                          blockingMode !== BlockingMode.BLOCK_DOWN;

        experiment.experimentSetting.forEach( ( setting, index ) => {
          this.sternGerlachs[ index ].isZOrientedProperty.value = setting.isZOriented;
        } );


        // Set the probabilities of the experiment. In the continuous case, this immediately alters the shown rays
        // In the single case, this prepares the probabilities for the particle that will be shot
        this.prepare();
      }
    );

    this.sternGerlachs.forEach( sternGerlach => {
      sternGerlach.isZOrientedProperty.link( () => {
        this.prepare();
      } );
    } );
  }

  public prepare(): void {
    // Measure on the first SG, this will change its upProbabilityProperty
    this.sternGerlachs[ 0 ].updateProbability( this.derivedSpinStateProperty.value );

    if ( !this.currentExperimentProperty.value.usingSingleApparatus ) {
      // Measure on the second SG according to the orientation of the first one
      this.sternGerlachs[ 1 ].updateProbability(
        // SG0 passes the up-spin particles to SG1
        SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS )
      );

      this.sternGerlachs[ 2 ].updateProbability(
        // SG0 passes the down-spin particles to SG2, and because X- is not in the initial spin values, we pass null
        SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null )
      );

    }
  }

  public step( dt: number ): void {
    // Stepping the Stern Gerlachs so their counters average over time
    this.sternGerlachs.forEach( sternGerlach => sternGerlach.step( dt ) );

    this.particleSystem.step( dt );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.measurementLines.forEach( line => line.reset() );
    this.sternGerlachs.forEach( sternGerlach => sternGerlach.reset() );
    this.particleSystem.reset();
    this.currentExperimentProperty.reset();
    this.particleSourceModel.reset();
  }

}

quantumMeasurement.register( 'SpinModel', SpinModel );