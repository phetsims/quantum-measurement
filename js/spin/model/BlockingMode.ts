// Copyright 2024-2025, University of Colorado Boulder

/**
 * Controls whether Stern Gerlach apparatus is blocked and which exit would be blocked
 *
 * @author Agustín Vallejo
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export class BlockingMode extends EnumerationValue {

  public static readonly NO_BLOCKER = new BlockingMode( 'noBlocker' );
  public static readonly BLOCK_UP = new BlockingMode( 'blockingUp' );
  public static readonly BLOCK_DOWN = new BlockingMode( 'blockingDown' );

  public static readonly enumeration = new Enumeration( BlockingMode );

  public constructor( public readonly tandemName: string ) {
    super();
  }
}
quantumMeasurement.register( 'BlockingMode', BlockingMode );