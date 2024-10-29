// Copyright 2024, University of Colorado Boulder

/**
 * SimpleBlochSphere is a Quantum State representation that supports three states: +Z, -Z and +X
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;

export type SimpleBlochSphereOptions = SelfOptions & AbstractBlochSphereOptions;


export default class SimpleBlochSphere extends AbstractBlochSphere {

  // Spin state property is in XZ coordinates
  public constructor( spinStateProperty: TReadOnlyProperty<Vector2>, providedOptions?: SimpleBlochSphereOptions ) {

    const options = optionize<SimpleBlochSphereOptions, SelfOptions, PhetioObjectOptions>()( {

    }, providedOptions );

    super( options );

    spinStateProperty.link( spinState => {
      this.azimutalAngleProperty.value = Math.atan2( spinState.y, -spinState.x ) + Math.PI;
      this.polarAngleProperty.value = Math.asin( spinState.y );
    } );

  }


  /**
   * Abstract method that should run calculations to update the Bloch Sphere representation.
   */
  protected override updateBlochSphere(): void {
    // no-op
  }

  public override reset(): void {
    super.reset();
  }

}

quantumMeasurement.register( 'SimpleBlochSphere', SimpleBlochSphere );