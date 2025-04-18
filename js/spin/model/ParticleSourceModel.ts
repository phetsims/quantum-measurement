// Copyright 2024-2025, University of Colorado Boulder

/**
 * The ParticleSourceModel contains the primary properties of the particle source,
 * such as the position, source mode (single vs continuous), and the amount of particles it's going to be shooting.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SourceMode } from './SourceMode.js';
import { SpinDirection } from './SpinDirection.js';

export default class ParticleSourceModel {

  public readonly spinStateProperty: Property<SpinDirection>;
  public readonly customSpinStateProperty: Vector2Property;

  public readonly sourceModeProperty: Property<SourceMode>;
  public readonly isContinuousModeProperty: TReadOnlyProperty<boolean>;

  // Position of the particle source, the tip will be at (0,0)
  public readonly positionProperty: Vector2Property;
  public readonly exitLocalPosition: Vector2;
  public readonly exitPositionProperty: TReadOnlyProperty<Vector2>;

  // Mapped from [0, 1] to control the Continuous mode, 0 is 'None' and 1 is 'Lots'
  public readonly particleAmountProperty: NumberProperty;

  // Constants
  public static readonly PARTICLE_SOURCE_WIDTH = 120 / 200;
  public static readonly PARTICLE_SOURCE_HEIGHT = 120 / 200;
  public static readonly PARTICLE_SOURCE_CORNER_RADIUS = 10 / 200;

  public constructor( position: Vector2, tandem: Tandem ) {

    this.sourceModeProperty = new EnumerationProperty( SourceMode.SINGLE, {
      tandem: tandem.createTandem( 'sourceModeProperty' ),
      validValues: SourceMode.enumeration.values,
      phetioFeatured: true
    } );

    this.isContinuousModeProperty = DerivedProperty.valueEqualsConstant( this.sourceModeProperty, SourceMode.CONTINUOUS );

    this.particleAmountProperty = new NumberProperty( 0.1, {
      tandem: tandem.createTandem( 'particleAmountProperty' ),
      range: new Range( 0, 1 ),
      phetioFeatured: true
    } );

    this.positionProperty = new Vector2Property( position );

    this.exitLocalPosition = new Vector2( 0, 0 );

    this.exitPositionProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) => {
      return position.plus( this.exitLocalPosition ).plusXY( ParticleSourceModel.PARTICLE_SOURCE_WIDTH / 2, 0 );
    } );

    const initialSpinState = SpinDirection.Z_PLUS;

    this.spinStateProperty = new EnumerationProperty( initialSpinState, {
      tandem: tandem.createTandem( 'spinStateProperty' ),
      validValues: SpinDirection.enumeration.values,
      phetioFeatured: true
    } );

    this.customSpinStateProperty = new Vector2Property( SpinDirection.spinToVector( initialSpinState ), {
      tandem: tandem.createTandem( 'customSpinStateProperty' )
    } );
  }

  public reset(): void {
    this.sourceModeProperty.reset();
    this.positionProperty.reset();
    this.particleAmountProperty.reset();
    this.spinStateProperty.reset();
    this.customSpinStateProperty.reset();
  }
}

quantumMeasurement.register( 'ParticleSourceModel', ParticleSourceModel );