// Copyright 2024, University of Colorado Boulder

/**
 * SpinDirection contains information of the three supported spin states in the preparation area.
 * On top of that, it contains the description associated to each spin button, as well as the tandem name.
 *
 * The function spinToVector is used to convert a SpinDirection to a Vector2, which is used in some
 * cases to represent a spin state in the XZ plane for easier dot product calculations. *
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export class SpinDirection extends EnumerationValue {


  // TODO: This should go in the strings file https://github.com/phetsims/quantum-measurement/issues/53
  public static readonly Z_PLUS = new SpinDirection( 'Z_PLUS', '"+Z"    ⟨Sz⟩ = +ħ/2', 'ZPlus' );
  public static readonly X_PLUS = new SpinDirection( 'X_PLUS', '"+X"    ⟨Sz⟩ = 0', 'XPlus' );
  public static readonly Z_MINUS = new SpinDirection( 'Z_MINUS', '"-Z"    ⟨Sz⟩ = -ħ/2', 'ZMinus' );

  public static readonly enumeration = new Enumeration( SpinDirection );

  public constructor( public readonly value: string,
                      public readonly description: string | TReadOnlyProperty<string>,
                      public readonly tandemName: string ) {
    super();
  }

  public static spinToVector( spin: SpinDirection | null ): Vector2 {
    // Since X_MINUS is not a valid initial state, we support null here to represent that case as a vector
    return spin === SpinDirection.Z_PLUS ? new Vector2( 0, 1 ) :
           spin === SpinDirection.Z_MINUS ? new Vector2( 0, -1 ) :
           spin === SpinDirection.X_PLUS ? new Vector2( 1, 0 ) : new Vector2( -1, 0 );

  }
}

quantumMeasurement.register( 'SpinDirection', SpinDirection );