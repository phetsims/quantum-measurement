// Copyright 2024-2025, University of Colorado Boulder

/**
 * AbstractBlochSphere is a base class that represents in geometrical terms the pure state space of a two-level quantum
 * mechanical system.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = {
  initialPolarAngle?: number;
  polarAnglePhetioReadOnly?: boolean;
  initialAzimuthalAngle?: number;
  azimuthalAnglePhetioReadOnly?: boolean;
  azimuthalRange?: Range; // Range for azimuthal angle, in Spin Screen should be [0,0]
};

export type AbstractBlochSphereOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class AbstractBlochSphere extends PhetioObject {

  // Azimuthal angle, measured along the XY plane from the +X axis, goes from 0 to 2*PI in radians.
  public readonly azimuthalAngleProperty: NumberProperty;

  // Polar angle, measured from the +Z axis, goes from 0 to PI in radians.
  public readonly polarAngleProperty: NumberProperty;

  protected constructor( providedOptions: AbstractBlochSphereOptions ) {

    const options = optionize<AbstractBlochSphereOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false,
      initialPolarAngle: 0,
      polarAnglePhetioReadOnly: true,
      initialAzimuthalAngle: Math.PI / 2,
      azimuthalAnglePhetioReadOnly: true,
      azimuthalRange: new Range( 0, 2 * Math.PI )
    }, providedOptions );

    super( options );

    this.azimuthalAngleProperty = new NumberProperty( options.initialAzimuthalAngle, {
      range: options.azimuthalRange,
      tandem: options.tandem.createTandem( 'azimuthalAngleProperty' ),
      units: 'radians',
      phetioReadOnly: options.azimuthalAnglePhetioReadOnly,
      phetioFeatured: true
    } );

    this.polarAngleProperty = new NumberProperty( options.initialPolarAngle, {
      range: new Range( 0, Math.PI ),
      tandem: options.tandem.createTandem( 'polarAngleProperty' ),
      units: 'radians',
      phetioReadOnly: options.polarAnglePhetioReadOnly,
      phetioFeatured: true
    } );
  }

  /**
   * Abstract method that should run calculations to update the Bloch Sphere representation.
   */
  public abstract step( dt: number ): void;

  protected reset(): void {
    this.azimuthalAngleProperty.reset();
    this.polarAngleProperty.reset();
  }
}

quantumMeasurement.register( 'AbstractBlochSphere', AbstractBlochSphere );