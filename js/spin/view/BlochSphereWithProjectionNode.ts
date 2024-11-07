// Copyright 2024, University of Colorado Boulder

/**
 * BlochSphereWithProjectionNode is an extension of BlochSphereNode with vector projections on X and Z.
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { Line, LineOptions } from '../../../../scenery/js/imports.js';
import AbstractBlochSphere from '../../common/model/AbstractBlochSphere.js';
import BlochSphereNode, { BlochSphereNodeOptions } from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class BlochSphereWithProjectionNode extends BlochSphereNode {

  public constructor(
    blochSphere: AbstractBlochSphere,
    customSpinVectorProperty: Vector2Property,
    providedOptions: BlochSphereNodeOptions
  ) {
    super( blochSphere, providedOptions );

    // Create the Y axis line with an arrow head.  This is pointing directly to the right.  We have to do this as a
    // separate arrow head and line because the line has a dashed pattern, which doesn't work with ArrowNode.
    const axisLength = customSpinVectorProperty.value.magnitude;

    const lineWidth = 2;
    const arrowHeadOptions = {
      tailWidth: lineWidth,
      headWidth: 2 * lineWidth,
      headHeight: 2 * lineWidth
    };

    const arrowLineOptions = {
      lineWidth: lineWidth,
      lineDash: [ 2, 2 ]
    };

    const xProjectionColor = 'red';
    const xProjectionArrowHead = new ArrowNode( 0.9 * axisLength, 0, axisLength, 0, combineOptions<ArrowNodeOptions>(
      arrowHeadOptions, { stroke: xProjectionColor, fill: xProjectionColor }
    ) );
    const xProjectionLine = new Line( 0, 0, axisLength, 0, combineOptions<LineOptions>(
      arrowLineOptions, { stroke: xProjectionColor, fill: xProjectionColor }
    ) );

    const zProjectionColor = 'blue';
    const zProjectionArrowHead = new ArrowNode( 0, 0, 0, -0.9 * axisLength, combineOptions<ArrowNodeOptions>(
      arrowHeadOptions, { stroke: zProjectionColor, fill: zProjectionColor }
    ) );
    const zProjectionLine = new Line( 0, 0, 0, -axisLength, combineOptions<LineOptions>(
      arrowLineOptions, { stroke: zProjectionColor, fill: zProjectionColor }
    ) );

    this.addChild( xProjectionArrowHead );
    this.addChild( xProjectionLine );

    this.addChild( zProjectionArrowHead );
    this.addChild( zProjectionLine );

    customSpinVectorProperty.link( spinVector => {
      const xProjectionLength = spinVector.dot( new Vector2( 1, 0 ) );
      if ( Math.abs( xProjectionLength ) > 1e-5 ) {
        xProjectionArrowHead.visible = true;
        xProjectionLine.visible = true;
        const xProjectionPosition = this.pointOnTheEquator( 0 ).times( xProjectionLength );
        xProjectionArrowHead.setTail( xProjectionPosition.times( 0.9 ).x, xProjectionPosition.times( 0.9 ).y );
        xProjectionArrowHead.setTip( xProjectionPosition.x, xProjectionPosition.y );
        xProjectionLine.setLine( 0, 0, xProjectionPosition.x, xProjectionPosition.y );
      }
      else {
        xProjectionArrowHead.visible = false;
        xProjectionLine.visible = false;
      }

      const zProjectionLength = -spinVector.dot( new Vector2( 0, 1 ) ) * this.sphereRadius;
      if ( Math.abs( zProjectionLength ) > 1e-5 ) {
        zProjectionArrowHead.visible = true;
        zProjectionLine.visible = true;
        zProjectionArrowHead.setTail( 0, 0.9 * zProjectionLength );
        zProjectionArrowHead.setTip( 0, zProjectionLength );
        zProjectionLine.setLine( 0, 0, 0, zProjectionLength );
      }
      else {
        zProjectionArrowHead.visible = false;
        zProjectionLine.visible = false;
      }
    } );
  }
}

quantumMeasurement.register( 'BlochSphereWithProjectionNode', BlochSphereWithProjectionNode );