// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main model for the Bloch Sphere screen. This contains the Bloch Sphere representation and the logic for
 * measurements, equations and rotation under magnetic field.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ComplexBlochSphere from './ComplexBlochSphere.js';
import { MeasurementAxis } from './MeasurementAxis.js';
import { SpinMeasurementState } from './SpinMeasurementState.js';
import { StateDirection } from './StateDirection.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const MAX_OBSERVATION_TIME = 2 * Math.PI / QuantumMeasurementConstants.MAX_PRECESSION_RATE;
const MODEL_TO_VIEW_TIME = 1 / MAX_OBSERVATION_TIME;

class BlochSphereModel implements TModel {

  // Bloch spheres for preparing the spin state and displaying the results of measurements.
  public readonly preparationBlochSphere: ComplexBlochSphere;
  public readonly singleMeasurementBlochSphere: ComplexBlochSphere;
  public readonly multipleMeasurementBlochSpheres: ComplexBlochSphere[] = [];

  // Preparation-area-related properties

  // Selected spin state to prepare
  public spinStateProperty: Property<StateDirection>;

  // Measurement area related properties

  // A state variable that indicates whether the model is ready to observe, needs the state to be prepared, or is
  // timing the next measurement. This should not be modified directly by client code, but rather by the model's
  // observe() and reprepare() methods.
  public readonly measurementStateProperty: Property<SpinMeasurementState>;

  // Selected equation basis
  public equationBasisProperty: Property<StateDirection>;

  // Measurement axis, whether to measure spin in X,Y, or Z axis
  public measurementAxisProperty: Property<MeasurementAxis>;

  // If is single or multiple measurement mode
  public isSingleMeasurementModeProperty: BooleanProperty;

  // The amount of time to wait before making a measurement when the magnetic field is present.
  public measurementDelayProperty: NumberProperty;

  // Current measurement time.
  public timeElapsedProperty: NumberProperty;

  // Counts for the number of times the spin has been measured in the up and down states. Shown in the histograms.
  public readonly upMeasurementCountProperty: NumberProperty;
  public readonly downMeasurementCountProperty: NumberProperty;

  // Magnetic Field Controls
  public readonly magneticFieldEnabledProperty: BooleanProperty;

  // Strength of the magnetic field
  public magneticFieldStrengthProperty: NumberProperty;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    // nesting tandems
    const preparationAreaTandem = providedOptions.tandem.createTandem( 'preparationAreaModel' );
    const measurementAreaTandem = providedOptions.tandem.createTandem( 'measurementAreaModel' );
    const measurementControlsTandem = measurementAreaTandem.createTandem( 'measurementControls' );
    const magneticFieldControlsTandem = measurementAreaTandem.createTandem( 'magneticFieldControls' );

    // preparation-area-related properties
    this.preparationBlochSphere = new ComplexBlochSphere( {
      tandem: preparationAreaTandem.createTandem( 'preparationBlochSphere' ),
      phetioFeatured: true,
      azimuthalAnglePhetioReadOnly: false,
      polarAnglePhetioReadOnly: false
    } );

    this.spinStateProperty = new EnumerationProperty( StateDirection.X_PLUS, {
      tandem: preparationAreaTandem.createTandem( 'spinStateProperty' ),
      phetioFeatured: true
    } );

    // measurement-area-related properties
    this.singleMeasurementBlochSphere = new ComplexBlochSphere( {
      tandem: measurementAreaTandem.createTandem( 'singleMeasurementBlochSphere' ),
      phetioFeatured: true
    } );

    const multiMeasurementTandem = measurementAreaTandem.createTandem( 'multipleMeasurementBlochSpheres' );
    _.times( 10, index => {
      this.multipleMeasurementBlochSpheres.push( new ComplexBlochSphere( {
        tandem: multiMeasurementTandem.createTandem( `blochSphere${index}` ),
        phetioFeatured: true
      } ) );
    } );

    this.measurementStateProperty = new EnumerationProperty( SpinMeasurementState.PREPARED, {
      phetioReadOnly: true,
      phetioDocumentation: 'For internal use only.',
      tandem: measurementAreaTandem.createTandem( 'measurementStateProperty' ),
      phetioFeatured: true
    } );

    // Selected Equation Basis
    this.equationBasisProperty = new EnumerationProperty( StateDirection.Z_PLUS, {
      tandem: measurementAreaTandem.createTandem( 'equationBasisProperty' ),
      phetioFeatured: true,
      validValues: QuantumMeasurementConstants.PLUS_DIRECTIONS
    } );

    // Measurement controls. Starting time to measurement at 75% so there's more subliminal reason to move it
    this.measurementDelayProperty = new NumberProperty( MODEL_TO_VIEW_TIME * 0.75 * MAX_OBSERVATION_TIME, {
      tandem: measurementControlsTandem.createTandem( 'measurementDelayProperty' ),
      range: new Range( 0, MODEL_TO_VIEW_TIME * MAX_OBSERVATION_TIME ),
      phetioDocumentation: 'Time at which the measurement will be made after the start of the experiment.',
      phetioFeatured: true,
      units: 'ns'
    } );

    this.timeElapsedProperty = new NumberProperty( 0, {
      tandem: measurementControlsTandem.createTandem( 'timeElapsedProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Current time of the experiment. For internal use only.',
      units: 'ns'
    } );

    this.measurementAxisProperty = new EnumerationProperty( MeasurementAxis.Z_PLUS, {
      tandem: measurementControlsTandem.createTandem( 'measurementAxisProperty' ),
      phetioFeatured: true
    } );

    this.isSingleMeasurementModeProperty = new BooleanProperty( true, {
      tandem: measurementControlsTandem.createTandem( 'isSingleMeasurementModeProperty' ),
      phetioFeatured: true
    } );

    this.upMeasurementCountProperty = new NumberProperty( 0, {
      tandem: measurementAreaTandem.createTandem( 'upMeasurementCountProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.downMeasurementCountProperty = new NumberProperty( 0, {
      tandem: measurementAreaTandem.createTandem( 'downMeasurementCountProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    // Magnetic Field Controls
    this.magneticFieldEnabledProperty = new BooleanProperty( false, {
      tandem: magneticFieldControlsTandem.createTandem( 'magneticFieldEnabledProperty' ),
      phetioFeatured: true
    } );

    this.magneticFieldStrengthProperty = new NumberProperty( 1, {
      tandem: magneticFieldControlsTandem.createTandem( 'magneticFieldStrengthProperty' ),
      range: new Range( -1, 1 ),
      phetioFeatured: true
    } );

    let selectingStateDirection = false;
    this.spinStateProperty.link( stateDirection => {
      if ( stateDirection !== StateDirection.CUSTOM ) {
        selectingStateDirection = true;
        this.preparationBlochSphere.polarAngleProperty.value = stateDirection.polarAngle;
        this.preparationBlochSphere.azimuthalAngleProperty.value = stateDirection.azimuthalAngle;
        selectingStateDirection = false;
      }
    } );

    // Clear the measurement counts when the time to measurement changes, since this changes the nature of the
    // measurement that is being made.
    this.measurementDelayProperty.link( () => this.resetCounts() );

    // Clear accumulated counts and potentially change the selected preset state direction to CUSTOM when the user
    // changes the angles of the Bloch Sphere. Lazy to not change the selected state direction on build up.
    selectingStateDirection = true;
    Multilink.multilink(
      [ this.preparationBlochSphere.polarAngleProperty, this.preparationBlochSphere.azimuthalAngleProperty ],
      () => {
        // Clear the accumulated counts.
        this.resetCounts();

        if ( !selectingStateDirection ) {
          // Change the selected state to indicate that the user has moved away from the preset states.
          this.spinStateProperty.value = StateDirection.CUSTOM;
        }

        this.reprepare();
      }
    );
    selectingStateDirection = false;

    // Reset the counts when the user changes the magnetic field attributes.
    Multilink.lazyMultilink(
      [ this.magneticFieldStrengthProperty, this.magneticFieldEnabledProperty ],
      () => this.resetCounts()
    );

    // Set the precession rate of the Bloch sphere based on the state of the magnetic field, the selected scene, and the
    // measurement state.
    Multilink.lazyMultilink(
      [ this.magneticFieldStrengthProperty, this.magneticFieldEnabledProperty, this.measurementStateProperty ],
      ( magneticFieldStrength, showMagneticField, measurementState ) => {

        // Set the precession rate of the Bloch sphere based on the measurement state and the state of the magnetic
        // field.
        const rotationRate = measurementState === SpinMeasurementState.TIMING_OBSERVATION && showMagneticField ? magneticFieldStrength : 0;
        this.singleMeasurementBlochSphere.rotatingSpeedProperty.value = rotationRate;
        this.multipleMeasurementBlochSpheres.forEach( blochSphere => {
          blochSphere.rotatingSpeedProperty.value = rotationRate;
        } );
      }
    );

    // Reset accumulated data when the user changes the measurement axis.
    this.measurementAxisProperty.link( () => {
      this.resetCounts();
    } );
  }

  /**
   * Make whatever observation ths mode is currently set up to make.
   */
  private observe(): void {

    assert && assert(
      this.measurementStateProperty.value === SpinMeasurementState.PREPARED || this.measurementStateProperty.value === SpinMeasurementState.TIMING_OBSERVATION,
      'The model is not in state where a new observation can be made.'
    );

    if ( this.isSingleMeasurementModeProperty.value ) {
      this.singleMeasurementBlochSphere.measure(
        this.measurementAxisProperty.value,
        this.upMeasurementCountProperty,
        this.downMeasurementCountProperty
      );
    }
    else {
      this.multipleMeasurementBlochSpheres.forEach( blochSphere => {
        blochSphere.measure(
          this.measurementAxisProperty.value,
          this.upMeasurementCountProperty,
          this.downMeasurementCountProperty
        );
      } );
    }

    // Update the measurement state.
    this.measurementStateProperty.value = SpinMeasurementState.OBSERVED;
  }

  /**
   * Initiates an observation, aka a measurement, of the spin value or values. If the model is in the state where
   * precession is occurring, this starts a timer that will trigger the measurement when it expires. If precession is
   * not occurring, the measurement is made immediately.
   */
  public initiateObservation(): void {

    assert && assert(
      this.measurementStateProperty.value === SpinMeasurementState.PREPARED,
      'The model should be prepared for measurement prior to calling this method.'
    );

    if ( this.magneticFieldEnabledProperty.value ) {

      // Transition to the state where the model is waiting to take a measurement.
      this.measurementStateProperty.value = SpinMeasurementState.TIMING_OBSERVATION;
      this.timeElapsedProperty.value = 0;
    }
    else {

      // Make the measurement immediately.
      this.observe();
    }
  }

  /**
   * Reprepare the model for a new observation.
   */
  public reprepare(): void {

    // Copy the settings from the preparation bloch sphere
    this.singleMeasurementBlochSphere.setDirection(
      this.preparationBlochSphere.polarAngleProperty.value,
      this.preparationBlochSphere.azimuthalAngleProperty.value
    );

    this.multipleMeasurementBlochSpheres.forEach( blochSphere => {
      blochSphere.setDirection(
        this.preparationBlochSphere.polarAngleProperty.value,
        this.preparationBlochSphere.azimuthalAngleProperty.value
      );
    } );

    this.timeElapsedProperty.value = 0;
    this.measurementStateProperty.value = SpinMeasurementState.PREPARED;
  }

  /**
   * Resets the measurement counts.
   */
  public resetCounts(): void {
    this.upMeasurementCountProperty.reset();
    this.downMeasurementCountProperty.reset();
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.resetCounts();
    this.preparationBlochSphere.reset();
    this.magneticFieldEnabledProperty.reset();
    this.measurementStateProperty.reset();
    this.magneticFieldStrengthProperty.reset();
    this.measurementAxisProperty.reset();
    this.isSingleMeasurementModeProperty.reset();
    this.measurementDelayProperty.reset();
    this.timeElapsedProperty.reset();
    this.spinStateProperty.reset();
    this.equationBasisProperty.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.singleMeasurementBlochSphere.step( dt );
    this.multipleMeasurementBlochSpheres.forEach( blochSphere => {
      blochSphere.step( dt );
    } );

    if ( this.measurementStateProperty.value === SpinMeasurementState.TIMING_OBSERVATION ) {
      this.timeElapsedProperty.value = Math.min(
        this.timeElapsedProperty.value + dt * MODEL_TO_VIEW_TIME,
        this.measurementDelayProperty.value
      );
      if ( this.timeElapsedProperty.value >= this.measurementDelayProperty.value ) {

        // The time when the observation should be made has been reached.  Make the observation.
        this.observe();
      }
    }
  }
}

quantumMeasurement.register( 'BlochSphereModel', BlochSphereModel );

export default BlochSphereModel;