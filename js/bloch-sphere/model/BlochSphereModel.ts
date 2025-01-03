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

  // If the model is ready to observe or needs the state to be prepared.
  public readonly readyToObserveProperty: BooleanProperty;

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
      initialRotationSpeed: 0.5,
      tandem: providedOptions.tandem.createTandem( 'singleMeasurementBlochSphere' )
    } );
    this.singleMeasurementBlochSphere.polarAngleProperty.value = Math.PI / 2;

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

    this.magneticFieldStrengthProperty.link( magneticFieldStrength => {
      this.singleMeasurementBlochSphere.rotatingSpeedProperty.value = magneticFieldStrength;
    } );

    this.preparationBlochSphere.polarAngleProperty.link( polarAngle => {
      this.singleMeasurementBlochSphere.polarAngleProperty.value = polarAngle;
    } );

    this.preparationBlochSphere.azimuthalAngleProperty.link( azimuthalAngle => {
      this.singleMeasurementBlochSphere.azimuthalAngleProperty.value = azimuthalAngle;
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
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
    this.preparationBlochSphere.step( dt );
    this.singleMeasurementBlochSphere.step( dt );
  }
}

quantumMeasurement.register( 'BlochSphereModel', BlochSphereModel );