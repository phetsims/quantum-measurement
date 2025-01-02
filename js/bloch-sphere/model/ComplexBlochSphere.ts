// Copyright 2024, University of Colorado Boulder

/**
 * ComplexBlochSphere is a Quantum State representation that supports more sophisticated angles and equation coefficients,
 * such as complex numbers and euler representations.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = {
  initialRotationSpeed?: number;
};

export type ComplexBlochSphereOptions = SelfOptions & AbstractBlochSphereOptions;

export default class ComplexBlochSphere extends AbstractBlochSphere {

  public readonly rotatingSpeedProperty: NumberProperty;

  public constructor( providedOptions?: ComplexBlochSphereOptions ) {

    const options = optionize<ComplexBlochSphereOptions, SelfOptions, PhetioObjectOptions>()( {
      initialRotationSpeed: 0
    }, providedOptions );

    super( options );

    this.rotatingSpeedProperty = new NumberProperty( options.initialRotationSpeed, {
      range: new Range( -1, 1 ),
      tandem: options.tandem.createTandem( 'rotatingSpeedProperty' ),
      phetioReadOnly: true
    } );

  }


  /**
   * Abstract method that should run calculations to update the Bloch Sphere representation.
   */
  public override step( dt: number ): void {
    this.azimuthalAngleProperty.value = Utils.moduloBetweenDown( this.azimuthalAngleProperty.value + this.rotatingSpeedProperty.value * dt, 0, 2 * Math.PI );
  }

  public override reset(): void {
    super.reset();
  }

}

quantumMeasurement.register( 'ComplexBlochSphere', ComplexBlochSphere );