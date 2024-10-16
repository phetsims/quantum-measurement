// Copyright 2024, University of Colorado Boulder

/**
 * SimpleBlochSphere is a Quantum State representation that supports three states: +Z, -Z and +X
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import AbstractBlochSphere, { AbstractBlochSphereOptions } from '../../common/model/AbstractBlochSphere.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SpinDirection } from './SpinDirection.js';

type SelfOptions = EmptySelfOptions;

export type SimpleBlochSphereOptions = SelfOptions & AbstractBlochSphereOptions;


export default class SimpleBlochSphere extends AbstractBlochSphere {

  public constructor( spinStateProperty: TReadOnlyProperty<SpinDirection>, providedOptions?: SimpleBlochSphereOptions ) {

    const options = optionize<SimpleBlochSphereOptions, SelfOptions, PhetioObjectOptions>()( {

    }, providedOptions );

    super( options );

    spinStateProperty.link( spinState => {
      this.azimutalAngleProperty.value = 0;
      if ( spinState === SpinDirection.Z_PLUS ) {
        this.polarAngleProperty.value = Math.PI / 2;
      }
      else if ( spinState === SpinDirection.Z_MINUS ) {
        this.polarAngleProperty.value = -Math.PI / 2;
      }
      else if ( spinState === SpinDirection.X_PLUS ) {
        this.polarAngleProperty.value = 0;
      }
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