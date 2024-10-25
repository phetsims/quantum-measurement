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
import Photon, { PHOTON_SPEED, RIGHT } from './Photon.js';

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

  // The rate at which photons are emitted, in photons per second.
  public readonly emissionRateProperty: NumberProperty;

  // The preset values of polarization direction that are available for the photons that are emitted.
  public readonly presetPolarizationDirectionProperty: Property<PresetPolarizationDirections>;

  // The custom polarization angle for the emitted photons.  This is only used when the preset direction is "custom".
  public readonly customPolarizationAngleProperty: NumberProperty;

  // The set of photons that are used for emission.  This is a reference to the same array that is used in the scene model.
  private readonly photons: Photon[];

  // The fractional emission backlog is used to track fractional amounts of photons that build up due to a mismatch
  // between the stepping rate frequency and the emission rate.
  private fractionalEmissionAccumulator = 0;

  public constructor( position: Vector2, photons: Photon[], providedOptions: LaserOptions ) {

    this.position = position;
    this.photons = photons;
    this.emissionMode = providedOptions.emissionMode;

    this.emissionRateProperty = new NumberProperty( 0, {
      range: new Range( 0, MAX_PHOTON_EMISSION_RATE ),
      tandem: providedOptions.tandem.createTandem( 'emissionRateProperty' )
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
   * @param dt - Time step, in seconds.  This is used to set the x offset from the emission point.  If not provided, the
   *             photon will be emitted at the exact X position of the laser.
   */
  public emitAPhoton( dt = 0 ): void {
    const photonToActivate = this.photons.find( photon => !photon.activeProperty.value );
    assert && assert( photonToActivate, 'no inactive photons available, increase the initial creation amount' );
    if ( photonToActivate ) {

      // Randomize the y position of the emitted photon so that the beam has some thickness.
      const yOffset = this.emittedBeamWidth / 2 * ( 1 - dotRandom.nextDouble() * 2 );

      // Randomize the x position of the emitted photon so that we don't have big clumps of photons when large dt values
      // occur.
      const xOffset = dt * dotRandom.nextDouble() * PHOTON_SPEED;

      // Determine the polarization angle for the emitted photon.
      const polarizationAngle = this.presetPolarizationDirectionProperty.value === 'custom' ?
                                this.customPolarizationAngleProperty.value :
                                MAP_OF_PRESET_POLARIZATION_ANGLES.get( this.presetPolarizationDirectionProperty.value )!;

      // Activate the photon and set its position, direction, and polarization angle.
      photonToActivate.activeProperty.set( true );
      photonToActivate.positionProperty.set( this.position.plusXY( xOffset, yOffset ) );
      photonToActivate.directionProperty.set( this.emissionDirection );
      photonToActivate.polarizationAngleProperty.set( polarizationAngle );
    }
  }

  /**
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    const photonsToEmit = this.emissionRateProperty.value * dt;

    // Emit the whole number of photons.
    const wholeNumberPhotonsToEmit = Math.floor( photonsToEmit );
    _.times( wholeNumberPhotonsToEmit, () => this.emitAPhoton( dt ) );

    // Update the fractional emission accumulator and emit any additional photons that are due to the fractional amount.
    this.fractionalEmissionAccumulator += photonsToEmit - wholeNumberPhotonsToEmit;
    const additionalPhotonsToEmit = Math.floor( this.fractionalEmissionAccumulator );
    _.times( additionalPhotonsToEmit, () => {
      this.emitAPhoton( dt );
      this.fractionalEmissionAccumulator -= 1;
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.emissionRateProperty.reset();
  }
}

quantumMeasurement.register( 'Laser', Laser );