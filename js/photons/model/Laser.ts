// Copyright 2024-2025, University of Colorado Boulder

/**
 * Laser is the model element that produces photons and sends them toward the polarizing beam splitter.  It can
 * produce photons one at a time or at a continuous, controllable rate.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ExperimentModeValues from './ExperimentModeValues.js';
import Photon from './Photon.js';
import { PhotonCollection } from './PhotonCollection.js';

type SelfOptions = {
  emissionMode: ExperimentModeValues;
};
type LaserOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

const PolarizationPresetValues = [ 'vertical', 'horizontal', 'fortyFiveDegrees', 'unpolarized', 'custom' ] as const;
export type PolarizationPresets = ( typeof PolarizationPresetValues )[number];

// constants

const MAX_PHOTON_EMISSION_RATE = 200; // photons per second
const MAP_OF_PRESET_POLARIZATION_ANGLES = new Map<PolarizationPresets, number>(
  [
    [ 'horizontal', 0 ],
    [ 'vertical', 90 ],
    [ 'fortyFiveDegrees', 45 ]
  ]
);

class Laser extends PhetioObject {

  // The position of the detector in two-dimensional space.  Units are in meters.
  public readonly position: Vector2;

  // The direction in which the photons should be emitted, as a unit vector.
  private readonly emissionDirection = Photon.RIGHT;

  // A flag that indicates whether photons should be emitted one at a time or in a continuous stream.
  public readonly emissionMode: ExperimentModeValues;

  // The width of the emitted photon beam, in meters, empirically determined.
  public static readonly PHOTON_BEAM_WIDTH = 0.04;

  // The width of the emitted photon beam, in meters.
  private readonly emittedBeamWidth = Laser.PHOTON_BEAM_WIDTH;

  // The rate at which photons are emitted, in photons per second.
  public readonly emissionRateProperty: NumberProperty;

  // The preset values of polarization direction that are available for the photons that are emitted.
  public readonly presetPolarizationDirectionProperty: Property<PolarizationPresets>;

  // The custom polarization angle for the emitted photons. This is only used when the preset direction is "custom".
  public readonly customPolarizationAngleProperty: NumberProperty;

  // The polarization angle of the emitted photons. This is a derived - and thus read-only - Property that is
  // derived from the preset polarization direction and the custom polarization angle. A value of null indicates that
  // the emitted photons are unpolarized, meaning that their individual polarization angles are random.
  public readonly polarizationAngleProperty: TReadOnlyProperty<number | null>;

  // The collection of photons that are used for emission.
  // This is a reference to the same collection that is used in the scene model.
  private readonly photonCollection: PhotonCollection;

  // The fractional emission backlog is used to track fractional amounts of photons that build up due to a mismatch
  // between the stepping rate frequency and the emission rate.
  private fractionalEmissionAccumulator = 0;

  public constructor( position: Vector2, photonCollection: PhotonCollection, providedOptions: LaserOptions ) {

    const options = optionize<LaserOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.position = position;
    this.photonCollection = photonCollection;
    this.emissionMode = providedOptions.emissionMode;

    this.emissionRateProperty = new NumberProperty( 0, {
      range: new Range( 0, MAX_PHOTON_EMISSION_RATE ),

      // Only instrument this in the manyPhotons mode, since it's not relevant in the singlePhoton mode.
      tandem: providedOptions.emissionMode === ExperimentModeValues.MANY_PHOTONS ?
              providedOptions.tandem.createTandem( 'emissionRateProperty' ) :
              Tandem.OPT_OUT,
      phetioFeatured: providedOptions.emissionMode === ExperimentModeValues.MANY_PHOTONS
    } );

    this.presetPolarizationDirectionProperty = new Property<PolarizationPresets>( 'fortyFiveDegrees', {
      tandem: providedOptions.tandem.createTandem( 'presetPolarizationDirectionProperty' ),
      phetioValueType: StringUnionIO( PolarizationPresetValues ),
      validValues: PolarizationPresetValues,
      phetioFeatured: true
    } );
    this.customPolarizationAngleProperty = new NumberProperty( 45, {
      range: new Range( 0, 90 ),
      tandem: providedOptions.tandem.createTandem( 'customPolarizationAngleProperty' ),
      units: MathSymbols.DEGREES,
      phetioFeatured: true
    } );

    // Derive the polarization angle from the model Properties.
    this.polarizationAngleProperty = new DerivedProperty(
      [
        this.customPolarizationAngleProperty,
        this.presetPolarizationDirectionProperty
      ],
      ( customPolarizationAngle, presetPolarizationDirection ) => {
        return presetPolarizationDirection === 'vertical' ? 90 :
               presetPolarizationDirection === 'horizontal' ? 0 :
               presetPolarizationDirection === 'fortyFiveDegrees' ? 45 :
               presetPolarizationDirection === 'unpolarized' ? null :
               customPolarizationAngle;
      }
    );
  }

  /**
   * Emits a photon from the laser.
   * @param dt - Time step, in seconds.  This is used to set the x offset from the emission point.  If not provided, the
   *             photon will be emitted at the exact X position of the laser.
   */
  public emitAPhoton( dt = 0 ): void {

    // Randomize the y position of the emitted photon so that the beam has some thickness.
    const yOffset = this.emittedBeamWidth / 2 * ( 1 - dotRandom.nextDouble() * 2 );

    // Randomize the x position of the emitted photon so that we don't have big clumps of photons when large dt values
    // occur.
    const xOffset = dt * dotRandom.nextDouble() * Photon.PHOTON_SPEED;

    // Determine the polarization angle for the emitted photon.
    let polarizationAngle;
    if ( this.presetPolarizationDirectionProperty.value === 'custom' ) {
      polarizationAngle = this.customPolarizationAngleProperty.value;
    }
    else if ( this.presetPolarizationDirectionProperty.value === 'unpolarized' ) {
      polarizationAngle = dotRandom.nextDouble() * 360;
    }
    else {
      assert && assert( MAP_OF_PRESET_POLARIZATION_ANGLES.has( this.presetPolarizationDirectionProperty.value ) );
      polarizationAngle = MAP_OF_PRESET_POLARIZATION_ANGLES.get( this.presetPolarizationDirectionProperty.value )!;
    }

    const photon = new Photon(
      polarizationAngle,
      this.position.plusXY( xOffset, yOffset ),
      this.emissionDirection
    );

    this.photonCollection.addPhoton( photon );
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
    this.customPolarizationAngleProperty.reset();
    this.presetPolarizationDirectionProperty.reset();
  }
}

quantumMeasurement.register( 'Laser', Laser );
export default Laser;