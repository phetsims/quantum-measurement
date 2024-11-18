// Copyright 2024, University of Colorado Boulder

/**
 * MeasurementLine is a component that will hold the spin state of particles that cross along its position.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from './SimpleBlochSphere.js';

type SelfOptions = EmptySelfOptions;

export type MeasurementLineOptions = SelfOptions & AbstractBlochSphereOptions;

export class MeasurementState extends EnumerationValue {
  public static readonly NOT_MEASURED = new MeasurementState();
  public static readonly MEASURING = new MeasurementState();
  public static readonly MEASURED = new MeasurementState();

  public static readonly MEASURING_TIMEOUT_DURATION = 1000;

  public static readonly enumeration = new Enumeration( MeasurementState );

  public constructor() {
    super();
  }
}

export default class MeasurementLine {

  // The bloch sphere representation of the spin state
  public readonly simpleBlochSphere: AbstractBlochSphere;

  // The spin state of the particle that last crossed the line
  public readonly spinStateProperty: Vector2Property;

  // The position of the line in the model
  public readonly positionProperty: Vector2Property;

  // Flag that indicates if a particle has been measured
  public readonly measurementStateProperty: Property<MeasurementState>;

  // Flag to indicate if the line is active
  public readonly isActiveProperty: Property<boolean>;

  public constructor( position: Vector2, originallyActive: boolean, providedOptions: MeasurementLineOptions ) {

    this.spinStateProperty = new Vector2Property( new Vector2( 0, 1 ), {
      tandem: providedOptions.tandem.createTandem( 'spinStateProperty' )
    } );

    this.measurementStateProperty = new Property<MeasurementState>( MeasurementState.NOT_MEASURED );

    this.measurementStateProperty.link( measurementState => {
      if ( measurementState === MeasurementState.MEASURING ) {
        // TODO: How to interrupt this after a restart? https://github.com/phetsims/quantum-measurement/issues/53
        const measurementStateListener = () => {
          this.measurementStateProperty.value = MeasurementState.MEASURED;
        };

        // Count some time and reset the hasMeasured flag
        stepTimer.setTimeout( measurementStateListener, MeasurementState.MEASURING_TIMEOUT_DURATION );
      }
    } );

    this.isActiveProperty = new Property<boolean>( originallyActive, {
      tandem: providedOptions.tandem.createTandem( 'isActiveProperty' ),
      phetioValueType: BooleanIO
    } );

    this.isActiveProperty.link( () => {
      this.measurementStateProperty.reset();
    } );

    this.simpleBlochSphere = new SimpleBlochSphere( this.spinStateProperty, providedOptions );

    this.positionProperty = new Vector2Property( position, {
      tandem: providedOptions.tandem.createTandem( 'positionProperty' )
    } );
  }

  public isParticleBehind( position: Vector2 ): boolean {
    return position.x < this.positionProperty.value.x;
  }

  public reset(): void {
    this.spinStateProperty.reset();
    this.measurementStateProperty.reset();
    this.isActiveProperty.reset();
  }
}

quantumMeasurement.register( 'MeasurementLine', MeasurementLine );