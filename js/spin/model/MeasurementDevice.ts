// Copyright 2024-2025, University of Colorado Boulder

/**
 * MeasurementDevice is a component that will hold the spin state of particles that cross along its position.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';

type SelfOptions = EmptySelfOptions;

export type MeasurementDeviceOptions = SelfOptions & AbstractBlochSphereOptions;

export default class MeasurementDevice {

  // The bloch sphere representation of the spin state
  public readonly simpleBlochSphere: AbstractBlochSphere;

  // The spin state of the particle that last crossed the measurement line
  public readonly spinStateProperty: Vector2Property;

  // The position of the device in the model
  public readonly positionProperty: Vector2Property;

  // Emitter that informs that there has been a measurement
  public readonly measurementEmitter: Emitter;

  // Flag to indicate if the line is active
  public readonly isActiveProperty: BooleanProperty;

  public constructor( position: Vector2, originallyActive: boolean, providedOptions: MeasurementDeviceOptions ) {

    this.spinStateProperty = new Vector2Property( new Vector2( 0, 1 ), {
      tandem: providedOptions.tandem.createTandem( 'spinStateProperty' ),
      phetioReadOnly: true
    } );

    this.measurementEmitter = new Emitter();

    this.isActiveProperty = new BooleanProperty( originallyActive, {
      tandem: providedOptions.tandem.createTandem( 'isActiveProperty' )
    } );

    this.simpleBlochSphere = new SimpleBlochSphere( this.spinStateProperty, {
      tandem: Tandem.OPT_OUT
    } );

    this.positionProperty = new Vector2Property( position, {
      tandem: providedOptions.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true
    } );
  }

  public isParticleBehind( position: Vector2 ): boolean {
    return position.x < this.positionProperty.value.x;
  }

  public reset(): void {
    this.spinStateProperty.reset();
    this.isActiveProperty.reset();
  }
}

quantumMeasurement.register( 'MeasurementDevice', MeasurementDevice );