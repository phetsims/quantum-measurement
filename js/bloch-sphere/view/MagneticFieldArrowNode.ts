// Copyright 2024, University of Colorado Boulder
/**
 * Arrow node that listens to the magnetic field strength.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const MAXIMUM_LENGTH = 50;

export default class MagneticFieldArrowNode extends ArrowNode {

  public constructor( magneticFieldStrength: NumberProperty, providedOptions?: ArrowNodeOptions ) {
    super( 0, 0, 0, 0, combineOptions<ArrowNodeOptions>( {
      stroke: 'black',
      fill: '#ff0',
      headHeight: 15,
      headWidth: 15,
      tailWidth: 5
    }, providedOptions ) );

    magneticFieldStrength.link( strength => {
      this.setTip( 0, -strength * MAXIMUM_LENGTH );
    } );
  }
}

quantumMeasurement.register( 'MagneticFieldArrowNode', MagneticFieldArrowNode );