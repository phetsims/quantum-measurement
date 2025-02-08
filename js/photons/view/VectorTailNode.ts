// Copyright 2024-2025, University of Colorado Boulder

/**
 * VectorTailNode provides a visual representation of the tail of a vector.  It is used to indicate the direction of
 * going into the plan.  It is a circle with two lines that cross in an X pattern.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Circle, { CircleOptions } from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class VectorTailNode extends Circle {
  public constructor( radius: number, providedOptions?: CircleOptions ) {

    const options = combineOptions<CircleOptions>( {
      fill: null,
      stroke: 'black',
      lineWidth: 1
    }, providedOptions );
    const multiplier = Math.sqrt( 2 ) / 2;

    super( radius, options );

    const line1 = new Line( -multiplier * radius, -multiplier * radius, multiplier * radius, multiplier * radius, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );
    const line2 = new Line( -multiplier * radius, multiplier * radius, multiplier * radius, -multiplier * radius, {
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );
    this.addChild( line1 );
    this.addChild( line2 );
  }
}

quantumMeasurement.register( 'VectorTailNode', VectorTailNode );