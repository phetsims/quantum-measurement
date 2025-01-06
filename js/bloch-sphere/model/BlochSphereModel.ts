// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main model for the Bloch Sphere screen that contains the Bloch Sphere representation and the logic for
 * measurements, equations and rotation under magnetic field.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlochSphereScene } from './BlochSphereScene.js';
import ComplexBlochSphere from './ComplexBlochSphere.js';
import { MeasurementBasis } from './MeasurementBasis.js';
import { StateDirection } from './StateDirection.js';

type SelfOptions = EmptySelfOptions;

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BlochSphereModel implements TModel {

  public readonly selectedSceneProperty: Property<BlochSphereScene>;

  public readonly preparationBlochSphere: ComplexBlochSphere;
  public readonly singleMeasurementBlochSphere: ComplexBlochSphere;
  public readonly multiMeasurementBlochSpheres: ComplexBlochSphere[] = [];

  // Coefficients of the state equation. They are derived from the Bloch Sphere representation on the multilink below.
  // |psi> = upCoefficient |up> + downCoefficient * exp( i * phase * PI ) |down>
  public readonly upCoefficientProperty: NumberProperty;
  public readonly downCoefficientProperty: NumberProperty;
  public readonly phaseFactorProperty: NumberProperty;

  // Selected State Direction
  public selectedStateDirectionProperty: Property<StateDirection>;

  // Strength of the magnetic field
  public magneticFieldStrengthProperty: NumberProperty;

  // Time to measurement
  public timeToMeasurementProperty: NumberProperty;

  // Measurement basis
  public measurementBasisProperty: Property<MeasurementBasis>;

  // If is single or multiple measurement mode
  public isSingleMeasurementModeProperty: BooleanProperty;

  // A flag that indicates whether the model is ready to observe or needs the state to be prepared.  This should not be
  // modified directly by client code, but rather by the model's observe() and reprepare() methods.
  public readonly readyToObserveProperty: BooleanProperty;

  // Properties for the spin measurements made.
  public readonly upMeasurementCountProperty: NumberProperty;
  public readonly downMeasurementCountProperty: NumberProperty;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.selectedSceneProperty = new Property( BlochSphereScene.MEASUREMENT, {
      tandem: providedOptions.tandem.createTandem( 'selectedSceneProperty' ),
      phetioReadOnly: true,
      phetioValueType: EnumerationIO( BlochSphereScene )
    } );

    this.preparationBlochSphere = new ComplexBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'preparationBlochSphere' )
    } );

    this.singleMeasurementBlochSphere = new ComplexBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'singleMeasurementBlochSphere' )
    } );

    const multiMeasurementTandem = providedOptions.tandem.createTandem( 'multiMeasurementBlochSpheres' );
    _.times( 10, index => {
      this.multiMeasurementBlochSpheres.push( new ComplexBlochSphere( {
        tandem: multiMeasurementTandem.createTandem( `blochSphere${index}` )
      } ) );
    } );

    this.upCoefficientProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'upCoefficientProperty' ),
      phetioReadOnly: true
    } );

    this.downCoefficientProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'downCoefficientProperty' ),
      phetioReadOnly: true
    } );

    this.phaseFactorProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'phaseFactorProperty' ),
      phetioReadOnly: true
    } );

    this.selectedStateDirectionProperty = new Property( StateDirection.Z_PLUS, {
      tandem: providedOptions.tandem.createTandem( 'selectedStateDirectionProperty' ),
      phetioValueType: EnumerationIO( StateDirection ),
      phetioFeatured: true
    } );

    this.magneticFieldStrengthProperty = new NumberProperty( 1, {
      tandem: providedOptions.tandem.createTandem( 'magneticFieldStrengthProperty' ),
      range: new Range( -1, 1 )
    } );

    this.timeToMeasurementProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'timeToMeasurementProperty' ),
      range: new Range( 0, 1 )
    } );

    this.measurementBasisProperty = new Property( MeasurementBasis.S_SUB_Z, {
      tandem: providedOptions.tandem.createTandem( 'measurementBasisProperty' ),
      phetioValueType: EnumerationIO( MeasurementBasis )
    } );

    this.isSingleMeasurementModeProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'isSingleMeasurementModeProperty' ),
      phetioReadOnly: true
    } );

    this.upMeasurementCountProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'upMeasurementCountProperty' ),
      phetioReadOnly: true
    } );

    this.downMeasurementCountProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'downMeasurementCountProperty' ),
      phetioReadOnly: true
    } );

    let selectingStateDirection = false;
    this.selectedStateDirectionProperty.link( stateDirection => {
      if ( stateDirection !== StateDirection.CUSTOM ) {
        selectingStateDirection = true;
        this.preparationBlochSphere.polarAngleProperty.value = stateDirection.polarAngle;
        this.preparationBlochSphere.azimuthalAngleProperty.value = stateDirection.azimuthalAngle;
        selectingStateDirection = false;
      }
    } );

    this.readyToObserveProperty = new BooleanProperty( true, {
      phetioReadOnly: true,
      tandem: providedOptions.tandem.createTandem( 'readyToObserveProperty' )
    } );

    Multilink.multilink(
      [
        this.preparationBlochSphere.polarAngleProperty,
        this.preparationBlochSphere.azimuthalAngleProperty
      ],
      ( polarAngle, azimuthalAngle ) => {
        this.upCoefficientProperty.value = Math.cos( polarAngle / 2 );
        this.downCoefficientProperty.value = Math.sin( polarAngle / 2 );
        this.phaseFactorProperty.value = azimuthalAngle / Math.PI;

        if ( !selectingStateDirection ) {
          this.selectedStateDirectionProperty.value = StateDirection.CUSTOM;
        }
      }
    );

    // Set the precession rate of the Bloch sphere based on the magnetic field strength and the selected scene.
    Multilink.multilink(
      [ this.magneticFieldStrengthProperty, this.selectedSceneProperty ],
      ( magneticFieldStrength, selectedScene ) => {
        this.singleMeasurementBlochSphere.rotatingSpeedProperty.value = selectedScene === BlochSphereScene.PRECESSION ?
                                                                        magneticFieldStrength :
                                                                        0;
        this.multiMeasurementBlochSpheres.forEach( blochSphere => {
          blochSphere.rotatingSpeedProperty.value = selectedScene === BlochSphereScene.PRECESSION ?
                                                     magneticFieldStrength :
                                                     0;
        } );
      }
    );

    this.preparationBlochSphere.polarAngleProperty.link( polarAngle => {
      this.singleMeasurementBlochSphere.polarAngleProperty.value = polarAngle;
      this.multiMeasurementBlochSpheres.forEach( blochSphere => {
        blochSphere.polarAngleProperty.value = polarAngle;
      } );
    } );

    this.preparationBlochSphere.azimuthalAngleProperty.link( azimuthalAngle => {
      this.singleMeasurementBlochSphere.azimuthalAngleProperty.value = azimuthalAngle;
      this.multiMeasurementBlochSpheres.forEach( blochSphere => {
        blochSphere.azimuthalAngleProperty.value = azimuthalAngle;
      } );
    } );

    this.measurementBasisProperty.link( () => {
      this.resetCounts();
    } );
  }

  /**
   * Make whatever observation ths mode is currently set up to make.
   */
  public observe(): void {
    if ( this.readyToObserveProperty.value ) {

      if ( this.isSingleMeasurementModeProperty.value ) {
        this.singleMeasurementBlochSphere.measure( this.measurementBasisProperty.value, this.upMeasurementCountProperty, this.downMeasurementCountProperty );
      }
      else {
        this.multiMeasurementBlochSpheres.forEach( blochSphere => {
          blochSphere.measure( this.measurementBasisProperty.value, this.upMeasurementCountProperty, this.downMeasurementCountProperty );
        } );
      }

      // Update the measurement state.
      this.readyToObserveProperty.value = false;
    }
  }

  /**
   * Reprepare the model for a new observation.
   */
  public reprepare(): void {
    this.readyToObserveProperty.value = true;

    // Copy the settings from the preparation bloch sphere
    this.singleMeasurementBlochSphere.setDirection(
      this.preparationBlochSphere.polarAngleProperty.value,
      this.preparationBlochSphere.azimuthalAngleProperty.value
    );

    this.multiMeasurementBlochSpheres.forEach( blochSphere => {
      blochSphere.setDirection(
        this.preparationBlochSphere.polarAngleProperty.value,
        this.preparationBlochSphere.azimuthalAngleProperty.value
      );
    } );
  }

  /**
   * Resets the measurement counts.
   */
  private resetCounts(): void {
    this.upMeasurementCountProperty.reset();
    this.downMeasurementCountProperty.reset();
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.resetCounts();
    this.preparationBlochSphere.reset();
    this.selectedSceneProperty.reset();
    this.readyToObserveProperty.reset();
    this.magneticFieldStrengthProperty.reset();
    this.measurementBasisProperty.reset();
    this.isSingleMeasurementModeProperty.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.singleMeasurementBlochSphere.step( dt );
    this.multiMeasurementBlochSpheres.forEach( blochSphere => {
      blochSphere.step( dt );
    } );
  }
}

quantumMeasurement.register( 'BlochSphereModel', BlochSphereModel );