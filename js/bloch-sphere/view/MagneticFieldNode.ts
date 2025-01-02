// Copyright 2024, University of Colorado Boulder
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

    const columns = 5;
    const rows = 5;
    const separation = 60;

    for ( let i = 0; i < columns; i++ ) {
      for ( let j = 0; j < rows; j++ ) {
        const magneticFieldArrowNode = new MagneticFieldArrowNode( magneticFieldStrength );
        magneticFieldArrowNode.centerX = i * separation;
        magneticFieldArrowNode.centerY = j * separation;
        this.addChild( magneticFieldArrowNode );
      }
    }

  }
}

quantumMeasurement.register( 'MagneticFieldNode', MagneticFieldNode );