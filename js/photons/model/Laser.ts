// Copyright 2024, University of Colorado Boulder

/**
 * Laser is the model element that produces photons and sends them toward the polarizing beam splitter.  It can
 * produce photons one at a time or at a continuous, controllable rate.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon, { RIGHT } from './Photon.js';

export type PhotonEmissionMode = 'singlePhoton' | 'manyPhotons';

type SelfOptions = {
  emissionMode: PhotonEmissionMode;
};
type LaserOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

const PresetPolarizationValues = [ 'vertical', 'horizontal', 'fortyFiveDegrees', 'custom' ] as const;
export type PresetPolarizationDirections = ( typeof PresetPolarizationValues )[number];

// constants

// The width of the emitted photon beam, in meters, empirically determined.
export const PHOTON_BEAM_WIDTH = 0.04;

const MAX_PHOTON_EMISSION_RATE = 200; // photons per second
const MAP_OF_PRESET_POLARIZATION_ANGLES = new Map(
  [
    [ 'horizontal', 0 ],
    [ 'vertical', 90 ],
    [ 'fortyFiveDegrees', 45 ]
  ]
);

export default class Laser {

  // The position of the detector in two-dimensional space.  Units are in meters.
  public readonly position: Vector2;

  // The direction in which the photons should be emitted, as a unit vector.
  public readonly emissionDirection = RIGHT;

  // A flag that indicates whether photons should be emitted one at a time or in a continuous stream.
  public readonly emissionMode: PhotonEmissionMode;

  public readonly emittedBeamWidth = PHOTON_BEAM_WIDTH;

  // The rate at which photons are created, in photons per second.
  public readonly emissionRateProperty: NumberProperty;

  // The preset values of polarization direction that are available for the photons that are emitted.
  public readonly presetPolarizationDirectionProperty: Property<PresetPolarizationDirections>;

  // The custom polarization angle for the emitted photons.  This is only used when the preset direction is "custom".
  public readonly customPolarizationAngleProperty: NumberProperty;

  // The set of photons that are used for emission.  This is a reference to the same array that is used in the scene model.
  private readonly photons: Photon[];

  // Values used in calculating the emission rate.
  private timeSinceLastPhoton = Number.POSITIVE_INFINITY; // seconds
  private timeBetweenPhotons = Number.POSITIVE_INFINITY; // seconds

  public constructor( position: Vector2, photons: Photon[], providedOptions: LaserOptions ) {

    this.position = position;
    this.photons = photons;
    this.emissionMode = providedOptions.emissionMode;

    this.emissionRateProperty = new NumberProperty( 0, {
      range: new Range( 0, MAX_PHOTON_EMISSION_RATE ),
      tandem: providedOptions.tandem.createTandem( 'emissionRateProperty' )
    } );

    // Adjust the time between photons as the emission rate changes.
    this.emissionRateProperty.link( emissionRate => {
      this.timeBetweenPhotons = emissionRate > 0 ? 1 / emissionRate : Number.POSITIVE_INFINITY;
    } );

    this.presetPolarizationDirectionProperty = new Property<PresetPolarizationDirections>( 'fortyFiveDegrees', {
      tandem: providedOptions.tandem.createTandem( 'presetPolarizationDirectionProperty' ),
      phetioValueType: StringUnionIO( PresetPolarizationValues ),
      validValues: PresetPolarizationValues
    } );
    this.customPolarizationAngleProperty = new NumberProperty( 45, {
      tandem: providedOptions.tandem.createTandem( 'customPolarizationAngleProperty' )
    } );

    // TODO: This is temporary code to log changes to the properties.  It will be removed later.  See https://github.com/phetsims/quantum-measurement/issues/52.
    this.presetPolarizationDirectionProperty.lazyLink( presetPolarizationDirection => {
      console.log( `presetPolarizationDirection = ${presetPolarizationDirection}` );
    } );
    this.customPolarizationAngleProperty.lazyLink( customPolarizationAngleProperty => {
      console.log( `customPolarizationAngleProperty = ${customPolarizationAngleProperty}` );
    } );
  }

  /**
   * Emits a photon from the laser.
   */
  public emitAPhoton(): void {
    const photonToActivate = this.photons.find( photon => !photon.activeProperty.value );
    assert && assert( photonToActivate, 'no inactive photons available, increase the initial creation amount' );
    if ( photonToActivate ) {

      // Randomize the y position of the emitted photon so that the beam has some thickness.
      const yOffset = this.emittedBeamWidth / 2 * ( 1 - dotRandom.nextDouble() * 2 );

      // Determine the polarization angle for the emitted photon.
      const polarizationAngle = this.presetPolarizationDirectionProperty.value === 'custom' ?
                                this.customPolarizationAngleProperty.value :
                                MAP_OF_PRESET_POLARIZATION_ANGLES.get( this.presetPolarizationDirectionProperty.value )!;

      // Activate the photon and set its position, direction, and polarization angle.
      photonToActivate.activeProperty.set( true );
      photonToActivate.positionProperty.set( this.position.plusXY( 0, yOffset ) );
      photonToActivate.directionProperty.set( this.emissionDirection );
      photonToActivate.polarizationAngleProperty.set( polarizationAngle );
    }
  }

  /**
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.timeSinceLastPhoton += dt;
    if ( this.timeSinceLastPhoton > this.timeBetweenPhotons ) {
      this.timeSinceLastPhoton = 0;
      this.emitAPhoton();
    }
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.emissionRateProperty.reset();
  }
}

quantumMeasurement.register( 'Laser', Laser );