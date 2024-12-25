// Copyright 2024, University of Colorado Boulder

/**
 * Main model for the Bloch Sphere screen that contains the Bloch Sphere representation and the logic for
 * measurements, equations and rotation under magnetic field.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ComplexBlochSphere from './ComplexBlochSphere.js';

type SelfOptions = EmptySelfOptions;

type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class BlochSphereModel implements TModel {

  public readonly blochSphere: ComplexBlochSphere;

  // Coefficients of the state equation
  // |psi> = upCoefficient |up> + downCoefficient * exp( i * phase * PI ) |down>
  public readonly upCoefficientProperty: NumberProperty;
  public readonly downCoefficientProperty: NumberProperty;
  public readonly phaseFactorProperty: NumberProperty;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.blochSphere = new ComplexBlochSphere( {
      tandem: providedOptions.tandem.createTandem( 'blochSphere' )
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

    this.blochSphere.polarAngleProperty.link( theta => {
      this.upCoefficientProperty.value = Math.cos( theta / 2 );
      this.downCoefficientProperty.value = Math.sin( theta / 2 );
    } );

    this.blochSphere.azimutalAngleProperty.link( phi => {
      this.phaseFactorProperty.value = phi / Math.PI;
    } );
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
    this.blochSphere.step( dt );
  }
}

quantumMeasurement.register( 'BlochSphereModel', BlochSphereModel );