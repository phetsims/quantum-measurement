// Copyright 2024-2025, University of Colorado Boulder

/**
 * ComplexBlochSphere is a Quantum State representation that supports more sophisticated angles and equation coefficients,
 * such as complex numbers and euler representations.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { MeasurementBasis } from './MeasurementBasis.js';
import { StateDirection } from './StateDirection.js';

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
    this.azimuthalAngleProperty.value = Utils.moduloBetweenDown(
      this.azimuthalAngleProperty.value + this.rotatingSpeedProperty.value * dt, 0, 2 * Math.PI
    );
  }

  public setDirection( polarAngle: number, azimuthalAngle: number ): void {
    this.polarAngleProperty.value = polarAngle;
    this.azimuthalAngleProperty.value = azimuthalAngle;
  }

  /**
   * Given a measurement basis, measures along that axis and updates the counters accordingly.
   * @param measurementBasis
   * @param upCounterProperty
   * @param downCounterProperty
   */
  public measure( measurementBasis: MeasurementBasis, upCounterProperty: NumberProperty, downCounterProperty: NumberProperty ): void {
    const measurementVector = StateDirection.directionToVector( measurementBasis );
    const stateVector = StateDirection.anglesToVector(
      this.polarAngleProperty.value,
      this.azimuthalAngleProperty.value
    );

    const dotProduct = measurementVector.dot( stateVector );

    const isUp = ( dotRandom.nextDouble() * 2 - 1 ) < dotProduct;
    if ( isUp ) {
      upCounterProperty.value++;
      this.setDirection(
        measurementBasis.polarAngle,
        measurementBasis.azimuthalAngle
      );
    }
    else {
      downCounterProperty.value++;
      const oppositeDirection = measurementBasis.oppositeDirection;
      this.setDirection(
        oppositeDirection.polarAngle,
        oppositeDirection.azimuthalAngle
      );
    }
  }

  public override reset(): void {
    super.reset();
  }

}

quantumMeasurement.register( 'ComplexBlochSphere', ComplexBlochSphere );