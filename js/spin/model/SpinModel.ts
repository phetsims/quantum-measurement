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
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import MeasurementLine, { MeasurementState } from './MeasurementLine.js';
import ParticleRays from './ParticleRays.js';
import ParticleSourceModel from './ParticleSourceModel.js';
import { ParticleWithSpin } from './ParticleWithSpin.js';
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

const MAX_NUMBER_OF_SINGLE_PARTICLES = 50;
const MAX_NUMBER_OF_MULTIPLE_PARTICLES = 5000;
const PARTICLE_RAY_WIDTH = 0.02;
const MAX_PARTICLE_CREATION_RATE = 5; // max rate of particles created per second
export const BLOCKER_OFFSET = new Vector2( 0.1, 0 );

export default class SpinModel implements TModel {

  // Bloch Sphere that represents the current spin state
  public readonly blochSphere: SimpleBlochSphere;

  // The probability of the 'up' state. The 'down' probability will be 1 - this.
  public readonly upProbabilityProperty: NumberProperty;
  public readonly downProbabilityProperty: NumberProperty;

  // Single particles shot by the user
  public readonly singleParticles: ParticleWithSpin[];

  // Particle beam for the continuous source mode
  public readonly multipleParticles: ParticleWithSpin[];

  // Current experiment selected by the user
  public readonly currentExperimentProperty: Property<SpinExperiment>;
  public readonly isCustomExperimentProperty: TReadOnlyProperty<boolean>;

  // MODEL ELEMENTS OF UI COMPONENTS ------------------------------------------------

  // Information of the particle paths
  public readonly particleRays: ParticleRays;

  // Model for the particle shooting apparatus
  public readonly particleSourceModel: ParticleSourceModel;

  // Models for the three available Stern-Gerlach experiments. Second and Third are counted top to bottom.
  public readonly sternGerlachs: SternGerlach[];

  // Invisible lines that trigger measurement of the particles when they fly through them
  public readonly measurementLines: MeasurementLine[];

  // Expected percentage of particles that should be visible in the histogram
  public readonly expectedPercentageVisibleProperty: BooleanProperty;

  // Boolean to control what exit to block in continuous mode
  public readonly isBlockingProperty: TReadOnlyProperty<boolean>;
  public readonly blockUpperExitProperty: BooleanProperty;
  public readonly exitBlockerPositionProperty: TReadOnlyProperty<Vector2>;

  // The fractional accumulator for the emission rate, which is used to determine how many particles to create each step.
  private fractionalEmissionAccumulator = 0;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.currentExperimentProperty = new Property<SpinExperiment>( SpinExperiment.CUSTOM );
    this.isCustomExperimentProperty = new DerivedProperty(
      [ this.currentExperimentProperty ],
      ( experiment: SpinExperiment ) => experiment === SpinExperiment.CUSTOM
    );

    this.particleSourceModel = new ParticleSourceModel( new Vector2( -0.5, 0 ), providedOptions.tandem.createTandem( 'particleSourceModel' ) );

    this.blochSphere = new SimpleBlochSphere(
      this.particleSourceModel.customSpinStateProperty, { tandem: providedOptions.tandem.createTandem( 'blochSphere' ) }
    );

    this.upProbabilityProperty = new NumberProperty( 1, {
      tandem: providedOptions.tandem.createTandem( 'upProbabilityProperty' )
    } );

    // Create a Property with the inverse probability as the provided one and hook the two Properties up to one another.
    // This is needed for the number sliders to work properly.
    this.downProbabilityProperty = new NumberProperty( 1 - this.upProbabilityProperty.value );

    const sternGerlachsTandem = providedOptions.tandem.createTandem( 'SternGerlachs' );
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
      new MeasurementLine(
        new Vector2( ( this.particleSourceModel.exitPositionProperty.value.x + this.sternGerlachs[ 0 ].entrancePositionProperty.value.x ) / 2, 1 ),
        { tandem: measurementLinesTandem.createTandem( 'firstMeasurementLine' ) }
      ),
      new MeasurementLine(
        new Vector2( ( this.sternGerlachs[ 0 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].entrancePositionProperty.value.x ) / 2, 1 ),
        { tandem: measurementLinesTandem.createTandem( 'secondMeasurementLine' ) }
      ),
      new MeasurementLine(
        new Vector2( ( this.sternGerlachs[ 1 ].topExitPositionProperty.value.x + this.sternGerlachs[ 1 ].topExitPositionProperty.value.plusXY( 1, 0 ).x ) / 2, 1 ),
        { tandem: measurementLinesTandem.createTandem( 'thirdMeasurementLine' ) }
      )
    ];

    this.particleRays = new ParticleRays( this.particleSourceModel, this.sternGerlachs );

    // Create all particles that will be used in the experiment.  It works better for phet-io if these are created at
    // construction time and activated and deactivated as needed, rather than creating and destroying them.
    this.singleParticles = _.times( MAX_NUMBER_OF_SINGLE_PARTICLES, () => {
      return new ParticleWithSpin( Vector2.ZERO );
    } );
    this.multipleParticles = _.times( MAX_NUMBER_OF_MULTIPLE_PARTICLES, () => {
      return new ParticleWithSpin( new Vector2( PARTICLE_RAY_WIDTH * ( dotRandom.nextDouble() * 2 - 1 ), PARTICLE_RAY_WIDTH * ( dotRandom.nextDouble() * 2 - 1 ) ) );
    } );

    // Find the first inactive single particle and activate it
    this.particleSourceModel.currentlyShootingParticlesProperty.link( shooting => {
      if ( shooting ) {
        const particleToActivate = this.singleParticles.find( particle => !particle.activeProperty.value );

        if ( particleToActivate ) {
          this.activateParticle( particleToActivate );
        }
      }
    } );

    this.expectedPercentageVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'expectedPercentageVisibleProperty' )
    } );

    this.isBlockingProperty = new DerivedProperty(
      [
        this.particleSourceModel.sourceModeProperty,
        this.currentExperimentProperty
      ],
      ( sourceMode, currentExperiment ) => {
        return sourceMode === SourceMode.CONTINUOUS && !currentExperiment.isShortExperiment;
      }
    );

    this.blockUpperExitProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'blockUpperExitProperty' )
    } );

    this.exitBlockerPositionProperty = new DerivedProperty(
      [
        this.blockUpperExitProperty,
        this.sternGerlachs[ 0 ].topExitPositionProperty,
        this.sternGerlachs[ 0 ].bottomExitPositionProperty
      ],
      ( blockUpperExit, topExit, bottomExit ) => {
        const offset = BLOCKER_OFFSET;
        const position = blockUpperExit ? topExit : bottomExit;
        return position.plus( offset );
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

    // Multilink for changes in the experiment either via source mode or experiment selection
    Multilink.multilink(
      [
        this.currentExperimentProperty,
        this.particleSourceModel.sourceModeProperty,
        this.particleSourceModel.spinStateProperty,
        this.blockUpperExitProperty
      ],
      ( experiment, sourceMode, spinState, blockUpperExit ) => {
        this.particleRays.reset();
        this.particleRays.isShortExperiment = experiment.isShortExperiment;
        this.particleRays.updateExperiment();
        this.sternGerlachs.forEach( sternGerlach => sternGerlach.reset() );

        if ( experiment !== SpinExperiment.CUSTOM ) {
          this.particleSourceModel.customSpinStateProperty.value = SpinDirection.spinToVector( spinState );
          this.upProbabilityProperty.value = ( spinState === SpinDirection.Z_PLUS || spinState === SpinDirection.X_PLUS ) ? 1 : 0;
        }

        const isSingle = sourceMode === SourceMode.SINGLE;
        this.measurementLines[ 0 ].isActiveProperty.value = isSingle;
        this.measurementLines[ 1 ].isActiveProperty.value = isSingle;
        this.measurementLines[ 2 ].isActiveProperty.value = isSingle && !experiment.isShortExperiment;

        this.measurementLines.forEach( line => line.measurementStateProperty.reset() );

        this.singleParticles.forEach( particle => particle.reset() );
        this.multipleParticles.forEach( particle => particle.reset() );

        this.sternGerlachs.forEach( ( SternGerlach, index ) => {
          if ( experiment.experimentSetting.length > index ) {
            // If isBlocking, check which entrance is blocked and set the visibility of the SternGerlach accordingly
            const isBlocked = this.isBlockingProperty.value ?
                              index === 1 ? blockUpperExit :
                              index === 2 ? !blockUpperExit : false : false;
            SternGerlach.isVisibleProperty.value = experiment.experimentSetting[ index ].active && !isBlocked;
            if ( experiment !== SpinExperiment.CUSTOM ) {
              SternGerlach.isZOrientedProperty.value = experiment.experimentSetting[ index ].isZOriented;
            }
          }
          else {
            SternGerlach.isVisibleProperty.value = false;
          }
        } );

        // Set the probabilities of the experiment. In the continuous case, this immediately alters the shown rays
        // In the single case, this prepares the probabilities for the particle that will be shot
        this.prepare();

      }
    );
  }

  /**
   * Given the incoming state of a particle, calculate the result of a SG measurement on a particle and set its spin
   */
  private measureParticle(
    particle: ParticleWithSpin,
    sternGerlach: SternGerlach,
    experimentStageIndex: number,
    incomingState: Vector2 ): boolean {

    const upProbability = sternGerlach.prepare( incomingState );
    const isResultUp = dotRandom.nextDouble() < upProbability;
    particle.isSpinUp[ experimentStageIndex ] = isResultUp;
    particle.spinVectors[ experimentStageIndex ] = SpinDirection.spinToVector(
      isResultUp ?
      sternGerlach.isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS :
      sternGerlach.isZOrientedProperty.value ? SpinDirection.Z_MINUS : null
    );
    return isResultUp;
  }

  private activateParticle( particle: ParticleWithSpin ): void {
    particle.reset();
    particle.activeProperty.value = true;

    // Set the first spin vector to the state of the generated particles
    particle.spinVectors[ 0 ] = SpinDirection.spinToVector( this.particleSourceModel.spinStateProperty.value );

    particle.startPositionProperty.value = this.particleSourceModel.exitPositionProperty.value;

    // Put the end position at the back wall of the first SG
    particle.endPositionProperty.value = this.sternGerlachs[ 0 ].entrancePositionProperty.value.plusXY(
      SternGerlach.STERN_GERLACH_WIDTH, 0
    );

    // // First measurement: SG0 where the particle decides to go up or down
    // const isResultUp = this.measureParticle( particle, this.sternGerlachs[ 0 ], 1, this.particleSourceModel.customSpinStateProperty.value );
    //
    // // If current experiment is short, the particle only goes through SG0
    // if ( !this.currentExperimentProperty.value.isShortExperiment ) {
    //   if ( isResultUp ) {
    //     // If it went up, go through SG1
    //     this.measureParticle( particle, this.sternGerlachs[ 1 ], 2, SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS ) );
    //   }
    //   else {
    //     // If it went down, go through SG2
    //     this.measureParticle( particle, this.sternGerlachs[ 2 ], 2, SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null ) );
    //   }
    // }
    //
    // // Once the particle knows the directions it took, we assign the path to it
    // this.particleRays.assignRayToParticle( particle );
  }

  public prepare(): void {
    const experimentSetting = this.currentExperimentProperty.value.experimentSetting;

    // Measure on the first SG, this will change its upProbabilityProperty
    this.sternGerlachs[ 0 ].prepare( this.particleSourceModel.customSpinStateProperty.value );

    if ( experimentSetting.length > 1 ) {
      // Measure on the second SG according to the orientation of the first one
      this.sternGerlachs[ 1 ].prepare(
        // SG0 passes the up-spin particles to SG1
        SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_PLUS : SpinDirection.X_PLUS )
      );

      this.sternGerlachs[ 2 ].prepare(
        // SG0 passes the down-spin particles to SG2, and because X- is not in the initial spin values, we pass null
        SpinDirection.spinToVector( this.sternGerlachs[ 0 ].isZOrientedProperty.value ? SpinDirection.Z_MINUS : null )
      );

    }
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {

    // Stepping the Stern Gerlachs so their counters average over time
    this.sternGerlachs.forEach( sternGerlach => sternGerlach.step( dt ) );

    if ( !this.particleSourceModel.isContinuousModeProperty.value ) {
      // Filter out the active single particles
      const activeSingleParticles = this.singleParticles.filter( particle => particle.activeProperty.value );

      // Moves single particles and triggers measurements when they pass through Measuring Lines
      activeSingleParticles.forEach( particle => {
        particle.step( dt );

        // If the particle crosses a measurement line, we update the line
        this.measurementLines.forEach( ( line, index ) => {
          if ( !particle.wasCounted[ index ] && !line.isParticleBehind( particle.positionProperty.value ) ) {
            line.measurementStateProperty.value = MeasurementState.MEASURING;
            line.spinStateProperty.value = particle.spinVectors[ index ];
            particle.wasCounted[ index ] = true;
          }
        } );
      } );
    }
    else {
      // Generates the stream of particles. They are activated, not created, as they are already created at construction.
      this.activateMultipleParticles();

      // Make a list of all particles that are on a path that could potentially be blocked by the exit blocker.
      const activeMultipleParticles = this.multipleParticles.filter( particle => particle.activeProperty.value );

      // Step all active particles, and deactivate them if they cross the exit blocker position, and step them
      // normally if not.
      activeMultipleParticles.forEach( particle => {
        particle.step( dt );
        this.decideParticleDestiny( particle );
      } );
    }
  }

  private activateMultipleParticles(): void {
    // Calculate the number of particles to produce in this time step based on the particle amount property, the max
    // creation rate, and the time step.  This could include a fractional amount.
    const particlesToActivate = this.particleSourceModel.particleAmountProperty.value * MAX_PARTICLE_CREATION_RATE;

    // Calculate the whole number to actually activate, and use the fractional accumlator in the process.
    let wholeParticlesToActivate = Math.floor( particlesToActivate );

    this.fractionalEmissionAccumulator += particlesToActivate - wholeParticlesToActivate;

    if ( this.fractionalEmissionAccumulator >= 1 ) {
      wholeParticlesToActivate++;
      this.fractionalEmissionAccumulator -= 1;
    }

    // Activate the particles.
    for ( let i = 0; i < wholeParticlesToActivate; i++ ) {
      const particleToActivate = this.multipleParticles.find( particle => !particle.activeProperty.value );
      assert && assert( particleToActivate, 'no inactive particles available, increase the initial creation amount' );
      if ( particleToActivate ) {
        this.activateParticle( particleToActivate );
      }
    }
  }

  /**
   * Check if the particle would be blocked by the exit blocker, and if so, reset it and return true.
   */
  private checkParticleBlocking( particle: ParticleWithSpin ): boolean {
    if ( this.isBlockingProperty.value ) {
      if (
        this.blockUpperExitProperty.value &&
        particle.isSpinUp[ 1 ] &&
        ( particle.positionProperty.value.x > this.exitBlockerPositionProperty.value.x ) ) {
        particle.reset();
        return true;
      }
      else if (
        !this.blockUpperExitProperty.value &&
        !particle.isSpinUp[ 1 ] &&
        ( particle.positionProperty.value.x > this.exitBlockerPositionProperty.value.x ) ) {
        particle.reset();
        return true;
      }
    }
    return false;
  }

  private decideParticleDestiny( particle: ParticleWithSpin ): void {
    const dx = 0.03; // Threshold to trigger a change in the particle's path

    const wasParticleBlocked = this.checkParticleBlocking( particle );
    if ( wasParticleBlocked ) {
      return;
    }

    // If the particle were to reach its end position, measure it and decide on a new path
    if ( particle.positionProperty.value.x > particle.endPositionProperty.value.x - dx ) {
      if ( !particle.wasCounted[ 0 ] ) {
        const isResultUp = this.measureParticle( particle, this.sternGerlachs[ 0 ], 1, this.particleSourceModel.customSpinStateProperty.value );
        this.sternGerlachs[ 0 ].count( isResultUp );
        particle.wasCounted[ 0 ] = true;

        particle.startPositionProperty.value = isResultUp ?
                                               this.sternGerlachs[ 0 ].topExitPositionProperty.value :
                                               this.sternGerlachs[ 0 ].bottomExitPositionProperty.value;
        if ( this.currentExperimentProperty.value.isShortExperiment ) {
          particle.endPositionProperty.value = isResultUp ?
                                               this.sternGerlachs[ 0 ].topExitPositionProperty.value.plusXY( 10, 0 ) : // To infinity
                                               this.sternGerlachs[ 0 ].bottomExitPositionProperty.value.plusXY( 10, 0 ); // To infinity
        }
        else {
          particle.endPositionProperty.value = isResultUp ?
                                                this.sternGerlachs[ 1 ].entrancePositionProperty.value :
                                                this.sternGerlachs[ 2 ].entrancePositionProperty.value;
        }
      }
      else if ( !particle.wasCounted[ 1 ] && !this.currentExperimentProperty.value.isShortExperiment ) {
        particle.wasCounted[ 1 ] = true;
        particle.startPositionProperty.value = particle.endPositionProperty.value;
        particle.endPositionProperty.value = particle.endPositionProperty.value.plusXY(
          SternGerlach.STERN_GERLACH_WIDTH, 0
        );
      }
      else if ( !particle.wasCounted[ 2 ] && !this.currentExperimentProperty.value.isShortExperiment ) {
        const sternGerlach = particle.isSpinUp[ 1 ] ? this.sternGerlachs[ 1 ] : this.sternGerlachs[ 2 ];
        const isResultUp = this.measureParticle(
          particle, sternGerlach, 2, particle.spinVectors[ 1 ] );
        sternGerlach.count( isResultUp );
        particle.wasCounted[ 2 ] = true;

        particle.startPositionProperty.value = isResultUp ?
                                               sternGerlach.topExitPositionProperty.value :
                                                sternGerlach.bottomExitPositionProperty.value;
        particle.endPositionProperty.value = particle.startPositionProperty.value.plusXY( 10, 0 );
      }
    }
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.sternGerlachs.forEach( sternGerlach => sternGerlach.reset() );
    this.singleParticles.forEach( particle => particle.reset() );
    this.multipleParticles.forEach( particle => particle.reset() );
    this.measurementLines.forEach( line => line.reset() );
    this.currentExperimentProperty.reset();
    this.particleSourceModel.spinStateProperty.reset();
    this.particleSourceModel.reset();
    this.fractionalEmissionAccumulator = 0;
  }

}

quantumMeasurement.register( 'SpinModel', SpinModel );