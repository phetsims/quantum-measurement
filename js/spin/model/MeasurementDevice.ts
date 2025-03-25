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
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AbstractBlochSphere from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';

type SelfOptions = EmptySelfOptions;
export type MeasurementDeviceOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class MeasurementDevice extends PhetioObject {

  // Bloch sphere representation of the spin state
  public readonly simpleBlochSphere: AbstractBlochSphere;

  // spin state of the particle that last crossed the measurement line
  public readonly spinStateProperty: Vector2Property;

  // position of the device in the model
  public readonly positionProperty: Vector2Property;

  // emitter that fires when a measurement is made
  public readonly measurementEmitter: Emitter;

  // If this is reset via the model, alert the view
  public readonly resetEmitter: Emitter;

  // flag to indicate if the line is active
  public readonly isActiveProperty: BooleanProperty;

  public constructor( position: Vector2,
                      originallyActive: boolean,
                      providedOptions: MeasurementDeviceOptions ) {

    const options = optionize<MeasurementDeviceOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false,
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.spinStateProperty = new Vector2Property( new Vector2( 0, 1 ), {
      tandem: options.tandem.createTandem( 'spinStateProperty' ),
      phetioDocumentation: 'Indicates the axis and orientation of the spin state for the particle that last crossed' +
                           'the measurement line.  The y-coordinate corresponds to the z-axis',
      phetioReadOnly: true
    } );

    this.measurementEmitter = new Emitter();

    this.resetEmitter = new Emitter();

    this.isActiveProperty = new BooleanProperty( originallyActive, {
      tandem: options.tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true
    } );

    this.simpleBlochSphere = new SimpleBlochSphere( this.spinStateProperty, {
      tandem: Tandem.OPT_OUT
    } );

    this.positionProperty = new Vector2Property( position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioReadOnly: true
    } );
  }

  public isParticleBehind( position: Vector2 ): boolean {
    return position.x < this.positionProperty.value.x;
  }

  public reset(): void {
    this.spinStateProperty.reset();
    this.isActiveProperty.reset();
    this.resetEmitter.emit();
  }

  // Only clear the data, not the position or active state
  public clearData(): void {
    this.resetEmitter.emit();
  }
}

quantumMeasurement.register( 'MeasurementDevice', MeasurementDevice );