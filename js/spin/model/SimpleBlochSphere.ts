// Copyright 2024-2025, University of Colorado Boulder

/**
 * SimpleBlochSphere is a Quantum State representation that supports three states: +Z, -Z and +X
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
export type SimpleBlochSphereOptions = SelfOptions & AbstractBlochSphereOptions;

export default class SimpleBlochSphere extends AbstractBlochSphere {

  public readonly zProjectionVisibleProperty: BooleanProperty;
  public readonly xProjectionVisibleProperty: BooleanProperty;

  public constructor( spinStateProperty: TReadOnlyProperty<Vector2>, providedOptions?: SimpleBlochSphereOptions ) {

    const options = optionize<SimpleBlochSphereOptions, SelfOptions, AbstractBlochSphereOptions>()( {
      azimuthalRange: new Range( 0, 0 ),
      initialAzimuthalAngle: 0
    }, providedOptions );

    super( options );

    this.zProjectionVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'zProjectionVisibleProperty' ),
      phetioDocumentation: 'Projections only visible in Custom experiment mode',
      phetioFeatured: true
    } );

    this.xProjectionVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'xProjectionVisibleProperty' ),
      phetioDocumentation: 'Projections only visible in Custom experiment mode',
      phetioFeatured: true
    } );

    spinStateProperty.link( spinState => {
      this.azimuthalAngleProperty.value = spinState.x >= 0 ? 0 : Math.PI;
      this.polarAngleProperty.value = Math.acos( spinState.y );
    } );

  }

  /**
   * Abstract method that should run calculations to update the Bloch Sphere representation.
   */
  public override step( dt: number ): void {
    // no-op
  }

  public override reset(): void {
    super.reset();
    this.zProjectionVisibleProperty.reset();
    this.xProjectionVisibleProperty.reset();
  }

}

quantumMeasurement.register( 'SimpleBlochSphere', SimpleBlochSphere );