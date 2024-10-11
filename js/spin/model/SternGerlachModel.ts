// Copyright 2024, University of Colorado Boulder

/**
 * SternGerlachModel handles the internal states of the Stern Gerlach experiment. This includes:
 * - The direction of the experiment (currently constrained to X and +-Z)
 * - The state of the incoming particles
 * - The state of the particles after the experiment
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class SternGerlachModel {

  public readonly isZOrientedProperty: BooleanProperty;

  public readonly isVisibleProperty: BooleanProperty;

  public constructor( isZOriented: boolean, tandem: Tandem ) {

    this.isZOrientedProperty = new BooleanProperty( isZOriented, {
      tandem: tandem.createTandem( 'isZOrientedProperty' )
    } );

    this.isVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isVisibleProperty' )
    } );

  }

  public reset(): void {
    // no-op TODO https://github.com/phetsims/quantum-measurement/issues/53
  }

}

quantumMeasurement.register( 'SternGerlachModel', SternGerlachModel );