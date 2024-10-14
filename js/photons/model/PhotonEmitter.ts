// Copyright 2024, University of Colorado Boulder

/**
 * PhotonEmitter is the model element that produces photons and sends them toward the polarizing beam splitter.  It can
 * produce photons one at a time or at a continuous, controllable rate.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { PHOTON_BEAM_WIDTH } from './PhotonsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type PhotonEmitterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;
export type DetectionDirection = ( [ 'up', 'down' ] )[number];

export default class PhotonEmitter {

  // The position of the detector in two-dimensional space.  Units are in meters.
  public readonly position: Vector2;

  // The direction in which the photons should be emitted, as a unit vector.
  public readonly emissionDirection = new Vector2( 1, 0 );

  public readonly emittedBeamWidth = PHOTON_BEAM_WIDTH;

  // The rate at which photons are detected, in arrival events per second.
  public readonly emissionRateProperty: NumberProperty;

  public constructor( position: Vector2, providedOptions: PhotonEmitterOptions ) {

    this.position = position;

    this.emissionRateProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'emissionRateProperty' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.emissionRateProperty.reset();
  }

  /**
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // TBD - fill this in.
  }
}

quantumMeasurement.register( 'PhotonEmitter', PhotonEmitter );