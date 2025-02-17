// Copyright 2025, University of Colorado Boulder

/**
 * Arrow node that listens to the magnetic field strength.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class MagneticFieldArrowNode extends ArrowNode {

  public constructor( magneticFieldStrength: NumberProperty, maximumLength: number, providedOptions?: ArrowNodeOptions ) {
    super( 0, 0, 0, 0, combineOptions<ArrowNodeOptions>( {
      stroke: 'black',
      fill: QuantumMeasurementColors.magneticFieldColorProperty,

      // empirically determined values that define the shape of the arrow
      headHeight: 0.3 * maximumLength,
      headWidth: 0.4 * maximumLength,
      tailWidth: 0.15 * maximumLength
    }, providedOptions ) );

    magneticFieldStrength.link( strength => {
      this.setTip( 0, -strength * maximumLength );
    } );
  }
}

quantumMeasurement.register( 'MagneticFieldArrowNode', MagneticFieldArrowNode );