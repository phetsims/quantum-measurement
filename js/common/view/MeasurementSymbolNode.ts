// Copyright 2024, University of Colorado Boulder

/**
 * Path for the quantum measurement symbol: a curved arc and an arrow going across it
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class MeasurementSymbolNode extends Node {
  public constructor( providedOptions?: NodeOptions ) {
    const measurementArcPath = new Path( Shape.arc( 0, 0, 20, 0, Math.PI, true ), {
      stroke: 'white',
      lineWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
      center: new Vector2( 0, 5 ),
      scale: 0.6
    } );
    const measurementArrowPath = new ArrowNode( 0, 0, 30, -35, {
      fill: 'white',
      stroke: 'white',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      center: new Vector2( 5, 4 ),
      scale: 0.6
    } );

    super( combineOptions<NodeOptions>( {
      children: [ measurementArcPath, measurementArrowPath ]
    }, providedOptions ) );
  }
}

quantumMeasurement.register( 'MeasurementSymbolNode', MeasurementSymbolNode );