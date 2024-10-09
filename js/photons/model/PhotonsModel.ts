// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsModel is the primary model class for the Photons screen.  It manages the general model state and behavior for
 * the photons that travel from the source to the detectors.
 *
 * Part of what this model does is position photons in two-dimensional space.  This space is set up to center on the
 * polarizing beam splitter, which is at the center of the screen.  The x-axis is horizontal and the y-axis is vertical.
 * Units are in meters.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonDetector from './PhotonDetector.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotonsModel implements TModel {

  // The angle of polarization for the polarizing beam splitter.
  public readonly photonPolarizationAngleProperty: NumberProperty;

  // photon detectors
  public readonly verticalPolarizationDetector: PhotonDetector;
  public readonly horizontalPolarizationDetector: PhotonDetector;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.photonPolarizationAngleProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleProperty' )
    } );

    // Create the photon detectors that will measure the rate at which photons are arriving after being either reflected
    // or transmitted by the polarizing beam splitter.
    this.verticalPolarizationDetector = new PhotonDetector( new Vector2( 0, 0.5 ), 'up', {
      tandem: providedOptions.tandem.createTandem( 'verticalPolarizationDetector' )
    } );
    this.horizontalPolarizationDetector = new PhotonDetector( new Vector2( 0.25, -0.5 ), 'down', {
      tandem: providedOptions.tandem.createTandem( 'horizontalPolarizationDetector' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.photonPolarizationAngleProperty.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }
}

quantumMeasurement.register( 'PhotonsModel', PhotonsModel );