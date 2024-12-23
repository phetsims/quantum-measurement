// Copyright 2024, University of Colorado Boulder

/**
 * AbstractBlochSphere is a simple model for a sphere representation of a Quantum system.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;

export type AbstractBlochSphereOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class AbstractBlochSphere extends PhetioObject {

  // Angles that determine the direction the vector representation is pointing at
  // azimutal angle, measured along the XY plane from the +X axis, goes from 0 to 2*PI
  public readonly azimutalAngleProperty: NumberProperty;
  // Polar angle, measured from the +Z axis, goes from 0 to PI
  public readonly polarAngleProperty: NumberProperty;

  // Coefficients of the vector representation
  public readonly alphaProperty: NumberProperty;
  public readonly betaProperty: NumberProperty;

  protected constructor( providedOptions: AbstractBlochSphereOptions ) {

    const options = optionize<AbstractBlochSphereOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.azimutalAngleProperty = new NumberProperty( 0, {
      range: new Range( 0, 2 * Math.PI ),
      tandem: options.tandem.createTandem( 'azimutalAngleProperty' ),
      phetioReadOnly: true
    } );

    this.polarAngleProperty = new NumberProperty( 0, {
      range: new Range( -Math.PI / 2, Math.PI / 2 ),
      tandem: options.tandem.createTandem( 'polarAngleProperty' ),
      phetioReadOnly: true
    } );

    this.alphaProperty = new NumberProperty( 1, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'alphaProperty' ),
      phetioReadOnly: true
    } );

    this.betaProperty = new NumberProperty( 0, {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'betaProperty' ),
      phetioReadOnly: true
    } );
  }


  /**
   * Abstract method that should run calculations to update the Bloch Sphere representation.
   */
  public abstract step( dt: number ): void;

  protected reset(): void {
    this.azimutalAngleProperty.reset();
    this.polarAngleProperty.reset();
    this.alphaProperty.reset();
    this.betaProperty.reset();
  }
}

quantumMeasurement.register( 'AbstractBlochSphere', AbstractBlochSphere );