// Copyright 2024, University of Colorado Boulder

/**
 * Laser is the model element that produces photons and sends them toward the polarizing beam splitter.  It can
 * produce photons one at a time or at a continuous, controllable rate.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon, { RIGHT } from './Photon.js';
import { PHOTON_BEAM_WIDTH } from './PhotonsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type LaserOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Laser {

  // The position of the detector in two-dimensional space.  Units are in meters.
  public readonly position: Vector2;

  // The direction in which the photons should be emitted, as a unit vector.
  public readonly emissionDirection = RIGHT;

  public readonly emittedBeamWidth = PHOTON_BEAM_WIDTH;

  // The rate at which photons are detected, in arrival events per second.
  public readonly emissionRateProperty: NumberProperty;

  // TODO: Temporary, to be removed.  For testing and prototyping.  See https://github.com/phetsims/quantum-measurement/issues/52.
  public readonly photonProductionEnabledProperty = new BooleanProperty( false );

  // The set of photons that are used for emission.  This is a reference to the same array that is used in the scene model.
  private readonly photons: Photon[];

  private timeSinceLastPhoton = 0; // seconds

  public constructor( position: Vector2, photons: Photon[], providedOptions: LaserOptions ) {

    this.position = position;
    this.photons = photons;

    this.emissionRateProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'emissionRateProperty' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.emissionRateProperty.reset();
    this.photonProductionEnabledProperty.reset();
  }

  /**
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.timeSinceLastPhoton += dt;
    if ( this.photonProductionEnabledProperty.value && this.timeSinceLastPhoton >= 0.05 ) {
      this.timeSinceLastPhoton = 0;
      const photonToActivate = this.photons.find( photon => !photon.activeProperty.value );
      if ( photonToActivate ) {

        const yOffset = this.emittedBeamWidth / 2 * ( dotRandom.nextDouble() - 0.5 );
        photonToActivate.positionProperty.set( this.position.plusXY( 0, yOffset ) );
        photonToActivate.activeProperty.set( true );
        photonToActivate.directionProperty.set( this.emissionDirection );
      }
    }
  }
}

quantumMeasurement.register( 'Laser', Laser );