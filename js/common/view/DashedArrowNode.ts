// Copyright 2024, University of Colorado Boulder
/**
 * Node that displays a fraction that grows dynamically based on the contents.
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;

export type DashedArrowNodeOptions = SelfOptions & ArrowNodeOptions;

export default class DashedArrowNode extends Node {

  private arrowHead: ArrowNode;
  private arrowHeadHeight: number;
  private arrowLine: Line;

  public constructor( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: ArrowNodeOptions ) {

    const lineWidth = providedOptions && providedOptions.lineWidth ? providedOptions.lineWidth : 2;

    const options = optionize<DashedArrowNodeOptions, SelfOptions>()( {
      tailWidth: lineWidth,
      headWidth: 4 * lineWidth,
      headHeight: 4 * lineWidth,
      lineDash: [ 2, 2 ],
      lineWidth: lineWidth
    }, providedOptions );

    const arrowHead = new ArrowNode( 0, 0, 0, 0, combineOptions<ArrowNodeOptions>( {}, options, { lineDash: [] } ) );
    const arrowLine = new Line( 0, 0, 0, 0, options );

    super( {
      children: [ arrowHead, arrowLine ]
    } );

    this.arrowHead = arrowHead;
    this.arrowLine = arrowLine;
    this.arrowHeadHeight = options.headHeight ? options.headHeight : 10;

    this.setTailAndTip( tailX, tailY, tipX, tipY );
  }

  public setTailAndTip( tailX: number, tailY: number, tipX: number, tipY: number ): void {
    const tip = new Vector2( tipX, tipY );

    // Substract the arrow head height to the tip for the tail position
    const tail = tip.minus( tip.normalized().times( this.arrowHeadHeight ) );

    this.arrowHead.setTailAndTip( tail.x, tail.y, tipX, tipY );
    this.arrowLine.setLine( tailX, tailY, tipX, tipY );
  }

  public setTip( tipX: number, tipY: number ): void {
    this.setTailAndTip( this.arrowLine.x1, this.arrowLine.y1, tipX, tipY );
  }
}

quantumMeasurement.register( 'DashedArrowNode', DashedArrowNode );