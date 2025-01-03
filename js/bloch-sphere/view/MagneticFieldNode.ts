// Copyright 2025, University of Colorado Boulder
/**
 * Array of Magnetic Field Arrow Nodes that represent the bulk of the magnetic field.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import MagneticFieldArrowNode from './MagneticFieldArrowNode.js';

export default class MagneticFieldNode extends Node {

  public constructor( magneticFieldStrength: NumberProperty, providedOptions: NodeOptions ) {

    super( providedOptions );

    const columns = 8;
    const rows = 7;
    const separationX = 300 / columns;
    const separationY = 300 / rows;

    for ( let i = 0; i < columns; i++ ) {
      for ( let j = 0; j < rows; j++ ) {
        const magneticFieldArrowNode = new MagneticFieldArrowNode( magneticFieldStrength, 30 );
        magneticFieldStrength.link( strength => {
          magneticFieldArrowNode.centerX = i * separationX;
          magneticFieldArrowNode.centerY = j * separationY;
        } );

        this.addChild( magneticFieldArrowNode );
      }
    }
  }
}

quantumMeasurement.register( 'MagneticFieldNode', MagneticFieldNode );