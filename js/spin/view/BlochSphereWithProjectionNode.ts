// Copyright 2024-2025, University of Colorado Boulder

/**
 * BlochSphereWithProjectionNode is an extension of BlochSphereNode with vector projections on X and Z.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BlochSphereNode, { BlochSphereNodeOptions } from '../../common/view/BlochSphereNode.js';
import DashedArrowNode from '../../common/view/DashedArrowNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from '../model/SimpleBlochSphere.js';

export default class BlochSphereWithProjectionNode extends BlochSphereNode {

  public constructor(
    blochSphere: SimpleBlochSphere,
    customSpinVectorProperty: TReadOnlyProperty<Vector2>,
    isCustomExperiment: TReadOnlyProperty<boolean>,
    providedOptions: BlochSphereNodeOptions
  ) {
    super( blochSphere, providedOptions );

    // Create the Y axis line with an arrow head.  This is pointing directly to the right.  We have to do this as a
    // separate arrow head and line because the line has a dashed pattern, which doesn't work with ArrowNode.
    const axisLength = customSpinVectorProperty.value.magnitude;

    const xProjectionColor = 'red';
    const xProjectionArrowNode = new DashedArrowNode( 0.9 * axisLength, 0, axisLength, 0,
      { stroke: xProjectionColor, fill: xProjectionColor, visibleProperty: DerivedProperty.and( [ blochSphere.showXProjectionProperty, isCustomExperiment ] ) }
    );

    const zProjectionColor = 'blue';
    const zProjectionArrowNode = new DashedArrowNode( 0, 0, 0, -0.9 * axisLength,
      { stroke: zProjectionColor, fill: zProjectionColor, visibleProperty: DerivedProperty.and( [ blochSphere.showZProjectionProperty, isCustomExperiment ] ) }
    );

    this.addChild( xProjectionArrowNode );
    this.addChild( zProjectionArrowNode );

    customSpinVectorProperty.link( spinVector => {
      const xProjectionLength = spinVector.dot( new Vector2( 1, 0 ) );
      if ( Math.abs( xProjectionLength ) > 1e-5 ) {
        xProjectionArrowNode.visible = true;
        const xProjectionPosition = this.pointOnTheEquator( 0, this.xAxisOffsetAngleProperty.value ).times( xProjectionLength );
        xProjectionArrowNode.setTailAndTip( 0, 0, xProjectionPosition.x, xProjectionPosition.y );
      }
      else {
        xProjectionArrowNode.visible = false;
      }

      const zProjectionLength = -spinVector.dot( new Vector2( 0, 1 ) ) * this.sphereRadius;
      if ( Math.abs( zProjectionLength ) > 1e-5 ) {
        zProjectionArrowNode.visible = true;
        zProjectionArrowNode.setTailAndTip( 0, 0, 0, zProjectionLength );
      }
      else {
        zProjectionArrowNode.visible = false;
      }
    } );
  }
}

quantumMeasurement.register( 'BlochSphereWithProjectionNode', BlochSphereWithProjectionNode );