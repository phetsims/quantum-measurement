// Copyright 2024, University of Colorado Boulder

/**
 * Main model for the Bloch Sphere screen that contains the Bloch Sphere representation and the logic for
 * measurements, equations and rotation under magnetic field.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { BlochSphereScene } from './BlochSphereScene.js';
import ComplexBlochSphere from './ComplexBlochSphere.js';
import { StateDirection } from './StateDirection.js';

type SelfOptions = EmptySelfOptions;

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BlochSphereModel implements TModel {

  public readonly selectedSceneProperty: Property<BlochSphereScene>;

  public readonly preparationBlochSphere: ComplexBlochSphere;

  // Coefficients of the state equation. They are derived from the Bloch Sphere representation on the multilink below.
  // |psi> = upCoefficient |up> + downCoefficient * exp( i * phase * PI ) |down>
  public readonly upCoefficientProperty: NumberProperty;
  public readonly downCoefficientProperty: NumberProperty;
  public readonly phaseFactorProperty: NumberProperty;

  // Selected State Direction
  public selectedStateDirectionProperty: Property<StateDirection>;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.selectedSceneProperty = new Property( BlochSphereScene.MEASUREMENT, {
      tandem: providedOptions.tandem.createTandem( 'selectedSceneProperty' ),
      phetioReadOnly: true,
      phetioValueType: EnumerationIO( BlochSphereScene )
    } );

    this.preparationBlochSphere = new ComplexBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'preparationBlochSphere' )
    } );

    this.upCoefficientProperty = new NumberProperty( 1, {
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

    let selectingStateDirection = false;
    this.selectedStateDirectionProperty.link( stateDirection => {
      if ( stateDirection !== StateDirection.CUSTOM ) {
        selectingStateDirection = true;
        this.preparationBlochSphere.polarAngleProperty.value = stateDirection.polarAngle;
        this.preparationBlochSphere.azimuthalAngleProperty.value = stateDirection.azimuthalAngle;
        selectingStateDirection = false;
      }
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
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    // no-op
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.preparationBlochSphere.step( dt );
  }
}

quantumMeasurement.register( 'BlochSphereModel', BlochSphereModel );