// Copyright 2024-2025, University of Colorado Boulder

/**
 * AbstractBlochSphere is a simple model for a sphere representation of a Quantum system.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = {
  initialPolarAngle?: number;
  initialAzimuthalAngle?: number;
};

export type AbstractBlochSphereOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class AbstractBlochSphere extends PhetioObject {

  // Angles that determine the direction the vector representation is pointing at
  // azimuthal angle, measured along the XY plane from the +X axis, goes from 0 to 2*PI in radians
  public readonly azimuthalAngleProperty: NumberProperty;
  // Polar angle, measured from the +Z axis, goes from 0 to PI in radians
  public readonly polarAngleProperty: NumberProperty;

  // Coefficients of the vector representation
  public readonly alphaProperty: NumberProperty;
  public readonly betaProperty: NumberProperty;

  protected constructor( providedOptions: AbstractBlochSphereOptions ) {

    const options = optionize<AbstractBlochSphereOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false,
      initialPolarAngle: 0,
      initialAzimuthalAngle: Math.PI / 2
    }, providedOptions );

    super( options );

    this.azimuthalAngleProperty = new NumberProperty( options.initialAzimuthalAngle, {
      range: new Range( 0, 2 * Math.PI ),
      tandem: options.tandem.createTandem( 'azimuthalAngleProperty' ),
      phetioReadOnly: true,
      reentrant: true
    } );

    this.polarAngleProperty = new NumberProperty( options.initialPolarAngle, {
      range: new Range( 0, Math.PI ),
      tandem: options.tandem.createTandem( 'polarAngleProperty' ),
      phetioReadOnly: true,
      reentrant: true
    } );

    this.alphaProperty = new NumberProperty( 1, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'alphaProperty' ),
      phetioReadOnly: true
    } );

    this.betaProperty = new NumberProperty( 0, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'betaProperty' ),
      phetioReadOnly: true
    } );
  }


  /**
   * Abstract method that should run calculations to update the Bloch Sphere representation.
   */
  public abstract step( dt: number ): void;

  protected reset(): void {
    this.azimuthalAngleProperty.reset();
    this.polarAngleProperty.reset();
    this.alphaProperty.reset();
    this.betaProperty.reset();
  }
}

quantumMeasurement.register( 'AbstractBlochSphere', AbstractBlochSphere );