// Copyright 2024, University of Colorado Boulder

/**
 * MeasurementLine is a component that will hold the spin state of particles that cross along its position.
 *
 * @author Agustín Vallejo
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';

type SelfOptions = EmptySelfOptions;

export type MeasurementLineOptions = SelfOptions & AbstractBlochSphereOptions;

export default class MeasurementLine {

  // The bloch sphere representation of the spin state
  public readonly simpleBlochSphere: AbstractBlochSphere;

  // The spin state of the particle that last crossed the line
  public readonly spinStateProperty: Vector2Property;

  // The position of the line in the model
  public readonly positionProperty: Vector2Property;

  // Emitter that informs that there has been a measurement
  public readonly measurementEmitter: Emitter;

  // Flag to indicate if the line is active
  public readonly isActiveProperty: Property<boolean>;

  public constructor( position: Vector2, originallyActive: boolean, providedOptions: MeasurementLineOptions ) {

    this.spinStateProperty = new Vector2Property( new Vector2( 0, 1 ), {
      tandem: providedOptions.tandem.createTandem( 'spinStateProperty' ),
      phetioReadOnly: true
    } );

    this.measurementEmitter = new Emitter();

    this.isActiveProperty = new Property<boolean>( originallyActive, {
      tandem: providedOptions.tandem.createTandem( 'isActiveProperty' ),
      phetioValueType: BooleanIO
    } );

    this.simpleBlochSphere = new SimpleBlochSphere( this.spinStateProperty, providedOptions );

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

quantumMeasurement.register( 'MeasurementLine', MeasurementLine );