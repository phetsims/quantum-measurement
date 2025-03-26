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
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
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

class SpinModel implements TModel {

  // Bloch sphere that represents the current spin state
  public readonly blochSphere: SimpleBlochSphere;

  // alpha and beta squared values of the prepared state.
  // alpha^2 translates to the P(up) in a SG_Z
  public readonly alphaSquaredProperty: NumberProperty;
  public readonly betaSquaredProperty: NumberProperty;

  // spin property that is controlled by the buttons or sliders
  public readonly derivedSpinStateProperty: TReadOnlyProperty<Vector2>;

  // current experiment selected by the user
  public readonly experimentProperty: Property<SpinExperiment>;
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
  public readonly expectedPercentageVisibleProperty: Property<boolean>;

  // position of the exit blocker
  public readonly exitBlockerPositionProperty: TReadOnlyProperty<Vector2 | null>;

  // map to store the blocking mode of each experiment
  private readonly blockingModeMap: Map<SpinExperiment, Property<BlockingMode>>;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    // Preparation Area properties
    this.alphaSquaredProperty = new NumberProperty( 1, {
      tandem: providedOptions.tandem.createTandem( 'alphaSquaredProperty' ),
      range: new Range( 0, 1 )
    } );

    // Since both alpha and beta can be controlled via the slider they must be derived manually.
    this.betaSquaredProperty = new NumberProperty( 1 - this.alphaSquaredProperty.value );

    this.experimentProperty = new Property<SpinExperiment>( SpinExperiment.EXPERIMENT_1, {
      tandem: providedOptions.tandem.createTandem( 'experimentProperty' ),
      phetioValueType: EnumerationIO( SpinExperiment ),
      validValues: SpinExperiment.enumeration.values,
      phetioFeatured: true
    } );

    this.isCustomExperimentProperty = DerivedProperty.valueEqualsConstant( this.experimentProperty, SpinExperiment.CUSTOM );

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
      ( spinState, customSpinState, custom ) => {
        return custom ? customSpinState : SpinDirection.spinToVector( spinState );
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
        true,
        { tandem: measurementDevicesTandem.createTandem( 'firstMeasurementDevice' ) }
      ),
      new MeasurementDevice(
        new Vector2( ( this.sternGerlachs[ 0 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].entrancePositionProperty.value.x ) / 2, 1 ),
        true,
        { tandem: measurementDevicesTandem.createTandem( 'secondMeasurementDevice' ) }
      ),
      new MeasurementDevice(
        new Vector2( ( this.sternGerlachs[ 1 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].topExitPositionProperty.value.plusXY( 0.5, 0 ).x ) / 2, 1 ),
        false, { tandem: measurementDevicesTandem.createTandem( 'thirdMeasurementDevice' ) }
      )
    ];

    this.blockingModeMap = new Map();

    SpinExperiment.enumeration.values.forEach( experiment => {
      this.blockingModeMap.set( experiment, new EnumerationProperty( BlockingMode.BLOCK_UP ) );
    } );


    this.expectedPercentageVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'expectedPercentageVisibleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Expected percentage of particles that would be counted in the histogram. Only for continuous mode.'
    } );

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
        assert && assert( this.blockingModeMap.has( this.experimentProperty.value ), 'Experiment not found in map' );
        this.blockingModeMap.get( this.experimentProperty.value )!.value = blockingMode;
      }
      this.sternGerlachs[ 1 ].resetCounts();
      this.sternGerlachs[ 2 ].resetCounts();
    } );

    this.sternGerlachs.forEach( sternGerlach => {
      sternGerlach.isZOrientedProperty.link( () => {
        this.prepare();
      } );
    } );

    // Similar to the multilink below (and this will actually trigger that one)
    // but only for setting the blocking mode of the SG0 on experiment/source mode changes.
    // The blocking mode can be directly be set via a AquaRadioButton in the SternGerlachNode
    Multilink.multilink(
      [
        this.experimentProperty,
        this.particleSourceModel.sourceModeProperty
      ], ( experiment, sourceMode ) => {
        if ( sourceMode !== SourceMode.SINGLE && !experiment.usingSingleApparatus ) {
          assert && assert( this.blockingModeMap.has( experiment ), 'Experiment not found in map' );
          this.sternGerlachs[ 0 ].blockingModeProperty.value = this.blockingModeMap.get( experiment )!.value;
        }
        else {
          this.sternGerlachs[ 0 ].blockingModeProperty.value = BlockingMode.NO_BLOCKER;
        }
      } );

    // Multilink for changes in the experiment either via source mode or experiment selection.
    // The design rules for what'll happen to SGs is tricky, so buckle up and pay attention.
    // The following is a table between single and multi particle mode, vs single or multi apparatus mode:
    //
    //                       |  Single Particle             | Multi Particle                     |
    //    | Single Apparatus | MD0, SG0, MD1                | SG0+H                              |
    //    | Multi Apparatus  | MD0, SG0, MD1, SG1, SG2, MD2 | SG0+H (blockable), SG1+H*, SG2+H*  |
    //
    //    MD: Measurement Device (the camera with Bloch Sphere) in front of each SG phase.
    //    SG: Stern-Gerlach Apparatus: SG0 is the first one, SG1 is the second top, SG2 is the second bottom.
    //    +H: additional histogram on top of SGs in multi-particle mode.
    //    *: apparatus conditionally visible based on SG0 blocking mode (up, down)
    //
    //    Aditionally, on custom mode, the SGs will have their Z orientation controlled by the user.
    //
    Multilink.multilink(
      [
        this.experimentProperty,
        this.particleSourceModel.sourceModeProperty,
        this.sternGerlachs[ 0 ].blockingModeProperty
      ],
      ( experiment, sourceMode, blockingMode ) => {

        this.measurementDevices.forEach( device => device.reset() );

        // Conditions that determine visibility and state of the experiment components
        // Declared into variables for better readability
        const singleParticle = sourceMode === SourceMode.SINGLE;
        const multiApparatus = !experiment.usingSingleApparatus;
        const custom = experiment === SpinExperiment.CUSTOM;

        // Wether SGs will let themselves change their spin-measurement direction (Z or X): only in custom mode.
        // And for SG1, only in multi-particle, because in single-particle mode, both SG1 and SG2 are visible
        // and the direction is controlled by the buttons under SG2.
        this.sternGerlachs[ 0 ].isDirectionControllableProperty.value = custom;
        this.sternGerlachs[ 1 ].isDirectionControllableProperty.value = custom && !singleParticle;
        this.sternGerlachs[ 2 ].isDirectionControllableProperty.value = custom;

        // Multi-particle and multi-apparatus mode will allow for blocking of a side of the SG.
        // Here, we hide the SGs that are blocked.
        this.sternGerlachs[ 1 ].isVisibleProperty.value = multiApparatus &&
                                                          blockingMode !== BlockingMode.BLOCK_UP;

        this.sternGerlachs[ 2 ].isVisibleProperty.value = multiApparatus &&
                                                          blockingMode !== BlockingMode.BLOCK_DOWN;

        // Load the experiment settings into the Stern Gerlach devices
        experiment.experimentSetting.forEach( ( setting, index ) => {
          this.sternGerlachs[ index ].isZOrientedProperty.value = setting.isZOriented;
        } );

        // Visibility of measurement devices: Only show on single particle mode, and the third one only if using many SGs
        this.measurementDevices[ 0 ].isActiveProperty.value = singleParticle; // Exiting the particle source
        this.measurementDevices[ 1 ].isActiveProperty.value = singleParticle; // Exiting the first SG
        this.measurementDevices[ 2 ].isActiveProperty.value = singleParticle && multiApparatus; // Exiting the second SG

        this.prepare();
      }
    );

    // If there's a change in the spin state of particles, reprepare the experiment
    this.particleSourceModel.spinStateProperty.link( () => {
      this.prepare();
    } );

  }

  public prepare(): void {

    if ( !isSettingPhetioStateProperty.value ) {
      this.singleParticlesCollection.clear();
      this.multipleParticlesCollection.clear();
    }

    this.sternGerlachs.forEach( sternGerlach => sternGerlach.resetCounts() );

    // Clear data on the measuring devices
    this.measurementDevices.forEach( device => device.clearData() );

    // Measure on the first SG, this will change its upProbabilityProperty.
    this.sternGerlachs[ 0 ].updateProbability( this.derivedSpinStateProperty.value );

    if ( !this.experimentProperty.value.usingSingleApparatus ) {

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
    this.blockingModeMap.forEach( ( blockingMode, experiment ) => {
      this.blockingModeMap.get( experiment )!.reset();
    } );

    this.experimentProperty.reset();
    this.measurementDevices.forEach( device => device.reset() );
    this.singleParticlesCollection.clear();
    this.multipleParticlesCollection.clear();
    this.particleSourceModel.reset();
    this.expectedPercentageVisibleProperty.reset();
    this.alphaSquaredProperty.reset();
    this.betaSquaredProperty.reset();
    this.blochSphere.reset();
  }

}

quantumMeasurement.register( 'SpinModel', SpinModel );
export default SpinModel;