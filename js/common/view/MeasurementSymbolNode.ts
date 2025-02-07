// Copyright 2025, University of Colorado Boulder

/**
 * Path for the quantum measurement symbol: a curved arc and an arrow going across it
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import TPaint from '../../../../scenery/js/util/TPaint.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = {
  stroke?: TPaint;
};

type MeasurementSymbolNodeOptions = SelfOptions & NodeOptions;

export default class MeasurementSymbolNode extends Node {
  public constructor( providedOptions?: MeasurementSymbolNodeOptions ) {
    const options = optionize<MeasurementSymbolNodeOptions, SelfOptions, NodeOptions>()( {
      stroke: 'white'
    }, providedOptions );

    const measurementArcPath = new Path( Shape.arc( 0, 0, 20, 0, Math.PI, true ), {
      stroke: options.stroke,
      lineWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
      center: new Vector2( 0, 5 ),
      scale: 0.6
    } );
    const measurementArrowPath = new ArrowNode( 0, 0, 30, -35, {
      fill: options.stroke,
      stroke: options.stroke,
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      center: new Vector2( 5, 4 ),
      scale: 0.6
    } );

    options.children = [ measurementArcPath, measurementArrowPath ];

    super( options );
  }
}

quantumMeasurement.register( 'MeasurementSymbolNode', MeasurementSymbolNode );