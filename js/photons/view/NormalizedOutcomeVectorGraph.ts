// Copyright 2024, University of Colorado Boulder

/**
 *
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, Node, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const HEIGHT = 200;
const TICK_MARK_LENGTH = 20;
const TICK_MARK_LINE_WIDTH = 1.5;
const LABEL_FONT = new PhetFont( { size: 14, weight: 'bold' } );
const LABEL_SPACING = 5;

export default class NormalizedOutcomeVectorGraph extends Node {

  public constructor() {

    const verticalAxis = new Line( 0, -HEIGHT / 2, 0, HEIGHT / 2, {
      stroke: Color.BLACK,
      lineDash: [ 7, 4 ]
    } );

    const topTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.top,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const topTickMarkLabel = new Text( '+1', {
      font: LABEL_FONT,
      left: topTickMark.right + LABEL_SPACING,
      centerY: topTickMark.centerY
    } );

    const middleTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.centerY,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const middleTickMarkLabel = new Text( '0', {
      font: LABEL_FONT,
      left: middleTickMark.right + LABEL_SPACING,
      centerY: middleTickMark.centerY
    } );

    const bottomTickMark = new Line( -TICK_MARK_LENGTH / 2, 0, TICK_MARK_LENGTH / 2, 0, {
      centerY: verticalAxis.bottom,
      stroke: Color.BLACK,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );
    const bottomTickMarkLabel = new Text( '-1', {
      font: LABEL_FONT,
      left: bottomTickMark.right + LABEL_SPACING,
      centerY: bottomTickMark.centerY
    } );

    super( {
      children: [
        topTickMark,
        topTickMarkLabel,
        middleTickMark,
        middleTickMarkLabel,
        bottomTickMark,
        bottomTickMarkLabel,
        verticalAxis
      ]
    } );

  }
}

quantumMeasurement.register( 'NormalizedOutcomeVectorGraph', NormalizedOutcomeVectorGraph );