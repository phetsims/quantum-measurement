// Copyright 2024, University of Colorado Boulder

/**
 * The ParticleSourceModel contains the primary properties of the particle source,
 * such as the position, source mode (single vs continuous), and the amount of particles it's going to be shooting.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SourceMode } from './SourceMode.js';

export default class ParticleSourceModel {

  public readonly sourceModeProperty: Property<SourceMode>;

  // Position of the particle source
  public readonly positionProperty: Vector2Property;

  public readonly currentlyShootingParticlesProperty: Property<boolean>;

  // Mapped from [0, 1] to control the Continuous mode, 0 is 'None' and 1 is 'Lots'
  public readonly particleAmmountProperty: NumberProperty;

  public constructor( position: Vector2, tandem: Tandem ) {

    this.sourceModeProperty = new Property<SourceMode>( SourceMode.SINGLE );

    this.positionProperty = new Vector2Property( position, {
      tandem: tandem.createTandem( 'positionProperty' )
    } );

    this.currentlyShootingParticlesProperty = new Property<boolean>( false, {
      tandem: tandem.createTandem( 'currentlyShootingParticlesProperty' ),
      phetioValueType: BooleanIO
    } );

    this.particleAmmountProperty = new NumberProperty( 1, {
      tandem: tandem.createTandem( 'particleAmmountProperty' ),
      range: new Range( 0, 1 )
    } );

  }
}

quantumMeasurement.register( 'ParticleSourceModel', ParticleSourceModel );