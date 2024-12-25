// Copyright 2024, University of Colorado Boulder

/**
 * ComplexBlochSphere is a Quantum State representation that supports more sophisticated angles and equation coefficients,
 * such as complex numbers and euler representations.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;

export type ComplexBlochSphereOptions = SelfOptions & AbstractBlochSphereOptions;

export default class ComplexBlochSphere extends AbstractBlochSphere {

  public readonly rotatingSpeedProperty: NumberProperty;

  public constructor( providedOptions?: ComplexBlochSphereOptions ) {

    const options = optionize<ComplexBlochSphereOptions, SelfOptions, PhetioObjectOptions>()( {

    }, providedOptions );

    super( options );

    this.rotatingSpeedProperty = new NumberProperty( 0, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'rotatingSpeedProperty' ),
      phetioReadOnly: true
    } );

  }


  /**
   * Abstract method that should run calculations to update the Bloch Sphere representation.
   */
  public override step( dt: number ): void {
    this.azimuthalAngleProperty.value = ( this.azimuthalAngleProperty.value + this.rotatingSpeedProperty.value * dt ) % ( 2 * Math.PI );
  }

  public override reset(): void {
    super.reset();
  }

}

quantumMeasurement.register( 'ComplexBlochSphere', ComplexBlochSphere );