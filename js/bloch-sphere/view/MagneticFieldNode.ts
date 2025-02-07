// Copyright 2025, University of Colorado Boulder
/**
 * Array of Magnetic Field Arrow Nodes that represent the bulk of the magnetic field.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SpinMeasurementState } from '../model/SpinMeasurementState.js';
import MagneticFieldArrowNode from './MagneticFieldArrowNode.js';

const SIZE = new Dimension2( 150, 170 );
const DASH_PATTERN_FOR_GHOST_FIELD = [ 1, 2 ];

export default class MagneticFieldNode extends Node {

  public constructor( magneticFieldStrength: NumberProperty,
                      measurementStateProperty: Property<SpinMeasurementState>,
                      providedOptions?: NodeOptions ) {

    const columns = 4;
    const rows = 4;
    const separationX = SIZE.width / columns;
    const separationY = SIZE.height / rows;
    const arrowNodes: MagneticFieldArrowNode[] = [];

    for ( let i = 0; i < columns; i++ ) {
      for ( let j = 0; j < rows; j++ ) {
        const magneticFieldArrowNode = new MagneticFieldArrowNode( magneticFieldStrength, 25, { lineWidth: 0.5 } );
        magneticFieldStrength.link( () => {
          magneticFieldArrowNode.centerX = i * separationX;
          magneticFieldArrowNode.centerY = j * separationY;
        } );

        arrowNodes.push( magneticFieldArrowNode );
      }
    }

    const options = combineOptions<NodeOptions>( { children: arrowNodes }, providedOptions );

    super( options );

    // Make the field look somewhat ghostly when it is not actually being applied.
    measurementStateProperty.link( ( measurementState: SpinMeasurementState ) => {
      const lineDash = measurementState === 'timingObservation' ? [ 1, 0 ] : DASH_PATTERN_FOR_GHOST_FIELD;
      const opacity = measurementState === 'timingObservation' ? 1 : 0.75;
      arrowNodes.forEach( arrowNode => {
        arrowNode.lineDash = lineDash;
        arrowNode.opacity = opacity;
      } );
    } );
  }
}

quantumMeasurement.register( 'MagneticFieldNode', MagneticFieldNode );