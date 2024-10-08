// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsModel is the primary model class for the Photons screen.  It manages the general model state and behavior for
 * the photons that travel from the source to the detectors.
 *
 * Part of what this model does is move photons in two-dimensional space.  This space is set up to center on the
 * polarizing beam splitter, which is at the center of the screen.  The x-axis is horizontal and the y-axis is vertical.
 * Units are in meters.  The photons are emitted from a source, travel to the polarizing beam splitter, and then are
 * either reflected or transmitted.  The photons are then detected by two photon detectors.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonDetector from './PhotonDetector.js';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export const ExperimentModeTypeValues = [ 'singlePhoton', 'multiplePhotons' ] as const;
export type ExperimentModeType = ( typeof ExperimentModeTypeValues )[number];

export default class PhotonsModel implements TModel {

  // The experiment mode, either single-photon or multiple-photon.
  public readonly experimentModeProperty: Property<ExperimentModeType>;

  // The polarizing beam splitter that the photons will encounter.
  public readonly polarizingBeamSplitter: PolarizingBeamSplitter;

  // The angle of polarization for the polarizing beam splitter, in degrees.  Zero is horizontal and 90 is vertical.
  public readonly photonPolarizationAngleProperty: NumberProperty;

  // photon detectors
  public readonly verticalPolarizationDetector: PhotonDetector;
  public readonly horizontalPolarizationDetector: PhotonDetector;

  public constructor( providedOptions: QuantumMeasurementModelOptions ) {

    this.experimentModeProperty = new Property<ExperimentModeType>( 'singlePhoton', {
      tandem: providedOptions.tandem.createTandem( 'experimentModeProperty' ),
      phetioValueType: StringUnionIO( ExperimentModeTypeValues )
    } );

    this.polarizingBeamSplitter = new PolarizingBeamSplitter( new Vector2( 0, 0 ), {
      tandem: providedOptions.tandem.createTandem( 'polarizingBeamSplitter' )
    } );

    this.photonPolarizationAngleProperty = new NumberProperty( 45, {
      range: new Range( 0, 90 ),
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
    this.experimentModeProperty.reset();
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