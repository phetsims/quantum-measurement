// Copyright 2024-2025, University of Colorado Boulder

/**
 * ComplexBlochSphere is a Quantum State representation that supports more sophisticated angles and equation
 * coefficients, such as complex numbers and euler representations.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { MeasurementAxis } from './MeasurementAxis.js';
import { StateDirection } from './StateDirection.js';

type SelfOptions = {
  initialRotationSpeed?: number;
};

export type ComplexBlochSphereOptions = SelfOptions & AbstractBlochSphereOptions;

export default class ComplexBlochSphere extends AbstractBlochSphere {

  // The rate, in radians per second, at which the unit vector representing the state will rotate, or "precess", around
  // the Z axis.
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
   * Calculate precession and add it to azimuthal angle, constrained from 0 to 2 PI.
   */
  public override step( dt: number ): void {
    const precession = this.rotatingSpeedProperty.value * QuantumMeasurementConstants.MAX_PRECESSION_RATE * dt;
    this.azimuthalAngleProperty.value = Utils.moduloBetweenDown(
      this.azimuthalAngleProperty.value + precession, 0, 2 * Math.PI
    );
  }

  /**
   * Set the direction of the unit vector representing the state using a polar and an azimuthal angle.
   */
  public setDirection( polarAngle: number, azimuthalAngle: number ): void {
    this.polarAngleProperty.value = polarAngle;
    this.azimuthalAngleProperty.value = azimuthalAngle;
  }

  /**
   * Given a measurement basis, measure along that axis and update the counters accordingly.
   */
  public measure( measurementAxis: MeasurementAxis, upCounterProperty: NumberProperty, downCounterProperty: NumberProperty ): void {
    const measurementVector = StateDirection.directionToVector( measurementAxis );
    const stateVector = StateDirection.anglesToVector(
      this.polarAngleProperty.value,
      this.azimuthalAngleProperty.value
    );

    const dotProduct = measurementVector.dot( stateVector );

    const isUp = ( dotRandom.nextDouble() * 2 - 1 ) < dotProduct;
    if ( isUp ) {
      upCounterProperty.value++;
      this.setDirection(
        measurementAxis.polarAngle,
        measurementAxis.azimuthalAngle
      );
    }
    else {
      downCounterProperty.value++;
      const oppositeDirection = measurementAxis.oppositeDirection;
      this.setDirection(
        oppositeDirection.polarAngle,
        oppositeDirection.azimuthalAngle
      );
    }
  }

  public override reset(): void {
    this.rotatingSpeedProperty.reset();
    super.reset();
  }
}

quantumMeasurement.register( 'ComplexBlochSphere', ComplexBlochSphere );