// Copyright 2024-2025, University of Colorado Boulder

/**
 * A common diving line that is used to separate the preparation and measurement areas.
 *
 * @author Agustín Vallejo
 */

import Line from '../../../../scenery/js/nodes/Line.js';
import Color from '../../../../scenery/js/util/Color.js';
import quantumMeasurement from '../../quantumMeasurement.js';

const DIVIDER_HEIGHT = 500; // empirically determined

export default class ExperimentDividingLine extends Line {
  public constructor( x: number ) {
    super( 0, 0, 0, DIVIDER_HEIGHT, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineDash: [ 6, 5 ]
    } );

    this.centerX = x;
  }
}

quantumMeasurement.register( 'ExperimentDividingLine', ExperimentDividingLine );