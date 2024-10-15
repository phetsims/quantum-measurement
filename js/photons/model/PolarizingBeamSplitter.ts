// Copyright 2024, University of Colorado Boulder

/**
 * PolarizingBeamSplitter is a model element that represents a device that splits a beam of photons into two beams based
 * on the polarization of the photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon from './Photon.js';
import { PhotonInteraction } from './PhotonsModel.js';

type SelfOptions = EmptySelfOptions;
type PolarizingBeamSplitterOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

const PresetPolarizationValues = [ 'vertical', 'horizontal', 'fortyFiveDegrees', 'custom' ] as const;
export type PresetPolarizationDirections = ( typeof PresetPolarizationValues )[number];

export default class PolarizingBeamSplitter {

  // The position of the center of the beam splitter in two-dimensional space.  Units are in meters.
  public readonly centerPosition: Vector2;

  // the size of the beam splitter, in meters
  public readonly size = new Dimension2( 0.1, 0.1 );

  // A line in model space that represents the position of the polarizing beam splitter.
  public readonly polarizingSurfaceLine: Line;

  // The direction of polarization that the beam splitter is set to.  This can be one of the preset directions or a
  // custom angle.
  public readonly presetPolarizationDirectionProperty: Property<PresetPolarizationDirections>;

  // The custom angle at which the beam splitter is set, in degrees.  This is only used when the preset direction is
  // "custom".
  public readonly customPolarizationAngleProperty: NumberProperty;

  public constructor( centerPosition: Vector2, providedOptions: PolarizingBeamSplitterOptions ) {
    this.centerPosition = centerPosition;

    // Initialize the line that represents the position of the beam splitter in the model.
    const endpoint1 = new Vector2( centerPosition.x - this.size.width / 2, centerPosition.y - this.size.height / 2 );
    const endpoint2 = new Vector2( centerPosition.x + this.size.width / 2, centerPosition.y + this.size.height / 2 );
    this.polarizingSurfaceLine = new Line( endpoint1, endpoint2 );

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

  public testForPhotonInteraction( photon: Photon, dt: number ): PhotonInteraction {

    assert && assert( photon.activeProperty.value, 'save CPU cycles - don\'t use this method with inactive photons' );

    // Test for whether this photon crosses the surface of the beam splitter.
    const photonIntersectionPoint = photon.getTravelPathIntersectionPoint(
      this.polarizingSurfaceLine.start,
      this.polarizingSurfaceLine.end,
      dt
    );

    if ( photonIntersectionPoint !== null ) {

      // Calculate the probability of reflection.
      let probabilityOfReflection;
      if ( this.presetPolarizationDirectionProperty.value === 'horizontal' ) {
        probabilityOfReflection = 0;
      }
      else if ( this.presetPolarizationDirectionProperty.value === 'vertical' ) {
        probabilityOfReflection = 1;
      }
      else if ( this.presetPolarizationDirectionProperty.value === 'fortyFiveDegrees' ) {
        probabilityOfReflection = 0.5;
      }
      else {

        // TODO: How is this supposed to be calculated? See https://github.com/phetsims/quantum-measurement/issues/52.
        probabilityOfReflection = this.customPolarizationAngleProperty.value / 90;
      }

      if ( dotRandom.nextDouble() >= probabilityOfReflection ) {

        // The photon is being reflected by the beam splitter.  The only direction supported currently is up.
        return {
          interactionType: 'reflected',
          reflectionPoint: photonIntersectionPoint,
          reflectionDirection: new Vector2( 0, 1 )
        };
      }
      else {

        // No reflection.  The photon is passing through the beam splitter.
        return { interactionType: 'none' };
      }

    }
    else {
      return { interactionType: 'none' };
    }
  }
}

quantumMeasurement.register( 'PolarizingBeamSplitter', PolarizingBeamSplitter );