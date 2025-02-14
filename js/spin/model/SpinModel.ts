// Copyright 2024-2025, University of Colorado Boulder

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
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlockingMode } from './BlockingMode.js';
import MeasurementDevice from './MeasurementDevice.js';
import { MultipleParticleCollection } from './MultipleParticleCollection.js';
import ParticleSourceModel from './ParticleSourceModel.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';
import { SingleParticleCollection } from './SingleParticleCollection.js';
import { SourceMode } from './SourceMode.js';
import { SpinDirection } from './SpinDirection.js';
import SpinExperiment from './SpinExperiment.js';
import SternGerlach from './SternGerlach.js';

type SelfOptions = EmptySelfOptions;

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants

const MAX_NUMBER_OF_SINGLE_PARTICLES = 50;
const MAX_NUMBER_OF_MULTIPLE_PARTICLES = 1250;

// blocker in front of Stern Gerlach (SG) exits
export const BLOCKER_OFFSET = new Vector2( 0.1, 0 );

export default class SpinModel implements TModel {

  // Bloch sphere that represents the current spin state
  public readonly blochSphere: SimpleBlochSphere;

  // alpha and beta squared values of the prepared state.
  // alpha^2 translates to the P(up) in a SG_Z
  public readonly alphaSquaredProperty: NumberProperty;
  public readonly betaSquaredProperty: NumberProperty;

  // spin property that is controlled by the buttons or sliders
  public readonly derivedSpinStateProperty: TReadOnlyProperty<Vector2>;

  // current experiment selected by the user
  public readonly currentExperimentProperty: Property<SpinExperiment>;
  public readonly isCustomExperimentProperty: TReadOnlyProperty<boolean>;

  // The particle collections, for single shooting mode, and continuous mode.
  public readonly singleParticlesCollection: SingleParticleCollection;
  public readonly multipleParticlesCollection: MultipleParticleCollection;

  // model for the particle shooting apparatus
  public readonly particleSourceModel: ParticleSourceModel;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly sternGerlachs: SternGerlach[];

  // invisible lines that trigger measurement of the particles when they fly through them
  public readonly measurementDevices: MeasurementDevice[];

  // expected percentage of particles that should be visible in the histogram
  public readonly expectedPercentageVisibleProperty: BooleanProperty;

  // boolean to control what exit to block in continuous mode
  public readonly isBlockingProperty: TReadOnlyProperty<boolean>;
  public readonly exitBlockerPositionProperty: TReadOnlyProperty<Vector2 | null>;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    // Preparation Area properties
    this.alphaSquaredProperty = new NumberProperty( 1, {
      tandem: providedOptions.tandem.createTandem( 'alphaSquaredProperty' )
    } );

    // Since both alpha and beta can be controlled via the slider they must be derived manually.
    this.betaSquaredProperty = new NumberProperty( 1 - this.alphaSquaredProperty.value );

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

    this.particleSourceModel = new ParticleSourceModel(
      new Vector2( -0.5, 0 ),
      providedOptions.tandem.createTandem( 'particleSourceModel' )
    );

    this.singleParticlesCollection = new SingleParticleCollection(
      this, MAX_NUMBER_OF_SINGLE_PARTICLES, providedOptions.tandem.createTandem( 'singleParticlesCollection' ) );
    this.multipleParticlesCollection = new MultipleParticleCollection(
      this, MAX_NUMBER_OF_MULTIPLE_PARTICLES, providedOptions.tandem.createTandem( 'multipleParticlesCollection' ) );

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

    this.blochSphere = new SimpleBlochSphere( this.derivedSpinStateProperty, {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
    } );

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

    // Three measurement devices: at the exit of the particle source, at the exit of SG0 and at the exit of SG1/2
    const measurementDevicesTandem = providedOptions.tandem.createTandem( 'measurementDevices' );
    this.measurementDevices = [
      new MeasurementDevice(
        new Vector2( ( this.particleSourceModel.exitPositionProperty.value.x + this.sternGerlachs[ 0 ].entrancePositionProperty.value.x ) / 2, 1 ),
        true, { tandem: measurementDevicesTandem.createTandem( 'firstMeasurementDevice' ) }
      ),
      new MeasurementDevice(
        new Vector2( ( this.sternGerlachs[ 0 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].entrancePositionProperty.value.x ) / 2, 1 ),
        true, { tandem: measurementDevicesTandem.createTandem( 'secondMeasurementDevice' ) }
      ),
      new MeasurementDevice(
        new Vector2( ( this.sternGerlachs[ 1 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].topExitPositionProperty.value.plusXY( 0.5, 0 ).x ) / 2, 1 ),
        false, { tandem: measurementDevicesTandem.createTandem( 'thirdMeasurementDevice' ) }
      )
    ];

    this.expectedPercentageVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'expectedPercentageVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Expected percentage of particles that would be counted in the histogram. Only for continuous mode.'
    } );

    // SGs are blocked for multi-SG experiments and continuous mode
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

    this.alphaSquaredProperty.link( alphaSquared => {
      if ( !changeHandlingInProgress ) {
        changeHandlingInProgress = true;
        this.betaSquaredProperty.value = 1 - alphaSquared;
        changeHandlingInProgress = false;
      }

      if ( this.isCustomExperimentProperty.value ) {
        // Set the spin direction
        const polarAngle = Math.PI * ( 1 - alphaSquared );
        this.particleSourceModel.customSpinStateProperty.value = new Vector2( Math.sin( polarAngle ), Math.cos( polarAngle ) );
      }

      this.prepare();
    } );
    this.betaSquaredProperty.link( betaSquared => {
      if ( !changeHandlingInProgress ) {
        changeHandlingInProgress = true;
        this.alphaSquaredProperty.value = 1 - betaSquared;
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

        if ( !isSettingPhetioStateProperty.value ) {
          this.singleParticlesCollection.clear();
          this.multipleParticlesCollection.clear();
        }

        // Conditions that determine visibility and state of the experiment components
        const customExperiment = experiment === SpinExperiment.CUSTOM;
        const singleParticle = sourceMode === SourceMode.SINGLE;
        const longExperiment = !experiment.usingSingleApparatus;

        this.measurementDevices[ 0 ].isActiveProperty.value = singleParticle;
        this.measurementDevices[ 1 ].isActiveProperty.value = singleParticle;
        this.measurementDevices[ 2 ].isActiveProperty.value = singleParticle && longExperiment;

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

    // Measure on the first SG, this will change its upProbabilityProperty.
    this.sternGerlachs[ 0 ].updateProbability( this.derivedSpinStateProperty.value );

    if ( !this.currentExperimentProperty.value.usingSingleApparatus ) {

      // Measure on the second SG according to the orientation of the first one.
      this.sternGerlachs[ 1 ].updateProbability(
        // SG0 passes the up-spin particles to SG1.
        SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS )
      );

      this.sternGerlachs[ 2 ].updateProbability(
        // SG0 passes the down-spin particles to SG2, and because X- is not in the initial spin values, we pass null.
        SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null )
      );
    }
  }

  public step( dt: number ): void {

    // Step each of the Stern Gerlach devices so their counters average over time.
    this.sternGerlachs.forEach( sternGerlach => sternGerlach.step( dt ) );

    // Step the particle collections, which is how they move forward in time.
    this.singleParticlesCollection.step( dt );
    this.multipleParticlesCollection.step( dt );
  }

  /**
   * Reset the model.
   */
  public reset(): void {
    this.measurementDevices.forEach( device => device.reset() );
    this.sternGerlachs.forEach( sternGerlach => sternGerlach.reset() );
    this.singleParticlesCollection.clear();
    this.multipleParticlesCollection.clear();
    this.currentExperimentProperty.reset();
    this.particleSourceModel.reset();
    this.expectedPercentageVisibleProperty.reset();
    this.alphaSquaredProperty.reset();
    this.betaSquaredProperty.reset();
    this.blochSphere.reset();
  }

}

quantumMeasurement.register( 'SpinModel', SpinModel );