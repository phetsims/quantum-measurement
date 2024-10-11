// Copyright 2024, University of Colorado Boulder

/**
 * PolarizingBeamSplitter is a model element that represents a device that splits a beam of photons into two beams based
 * on the polarization of the photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
type PolarizingBeamSplitterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

const PresetPolarizationValues = [ 'vertical', 'horizontal', 'fortyFiveDegrees', 'custom' ] as const;
export type PresetPolarizationDirections = ( typeof PresetPolarizationValues )[number];

// constants
const WIDTH = 0.1; // the width, in meters, of the beam splitter
const ROTATIONAL_ANGLE = Math.PI / 4; // the angle at which the beam splitter is rotated, in radians, zero is horizontal

export default class PolarizingBeamSplitter {

  // The position of the center of the beam splitter in two-dimensional space.  Units are in meters.
  public readonly centerPosition: Vector2;

  // A line in model space that represents the position of the beam splitter.
  public readonly positionalLine: Line;

  // The direction of polarization that the beam splitter is set to.  This can be one of the preset directions or a
  // custom angle.
  public readonly presetPolarizationDirectionProperty: Property<PresetPolarizationDirections>;

  // The custom angle at which the beam splitter is set, in degrees.  This is only used when the preset direction is
  // "custom".
  public readonly customPolarizationAngleProperty: NumberProperty;

  public constructor( centerPosition: Vector2, providedOptions: PolarizingBeamSplitterOptions ) {
    this.centerPosition = centerPosition;

    // Initialize the line that represents the position of the beam splitter in the model.
    const endpoint1 = centerPosition.plusXY( WIDTH / 2, 0 ).rotated( ROTATIONAL_ANGLE );
    const endpoint2 = centerPosition.plusXY( -WIDTH / 2, 0 ).rotated( ROTATIONAL_ANGLE );
    this.positionalLine = new Line( endpoint1, endpoint2 );

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
}

quantumMeasurement.register( 'PolarizingBeamSplitter', PolarizingBeamSplitter );