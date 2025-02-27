// Copyright 2024-2025, University of Colorado Boulder

/**
 * HistogramWithExpectedValue is an extension of QuantumMeasurementHistogram but this time including the expected
 * statistical outcome (probability), as well as the real number counts.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram, { HISTOGRAM_SIZE, QuantumMeasurementHistogramOptions } from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class HistogramWithExpectedValue extends QuantumMeasurementHistogram {

  public constructor( leftNumberProperty: TReadOnlyProperty<number>,
                      rightNumberProperty: TReadOnlyProperty<number>,
                      leftProbabilityProperty: TReadOnlyProperty<number>,
                      expectedValueVisibleProperty: TReadOnlyProperty<boolean>,
                      providedXAxisLabels: [ RichText, RichText ],
                      providedOptions: QuantumMeasurementHistogramOptions ) {

    super( leftNumberProperty, rightNumberProperty, providedXAxisLabels, providedOptions );

    const expectedValueOptions = combineOptions<PathOptions>( {
      visibleProperty: expectedValueVisibleProperty
    }, QuantumMeasurementConstants.expectedPercentagePathOptions );

    // REVIEW: do you  need to create the same shape twice or can you create it once and pass to a new Path?
    const leftExpectedValueLine = new Path( new Shape().moveTo( 0, 0 ).lineTo( HISTOGRAM_SIZE.width / 3, 0 ), expectedValueOptions );
    const rightExpectedValueLine = new Path( new Shape().moveTo( 0, 0 ).lineTo( HISTOGRAM_SIZE.width / 3, 0 ), expectedValueOptions );

    this.addChild( leftExpectedValueLine );
    this.addChild( rightExpectedValueLine );

    leftProbabilityProperty.link( probability => {
      const xPosition = HISTOGRAM_SIZE.width / 4;
      leftExpectedValueLine.center = new Vector2( -xPosition, -this.maxBarHeight * probability );
      rightExpectedValueLine.center = new Vector2( xPosition, -this.maxBarHeight * ( 1 - probability ) );
    } );
  }
}

quantumMeasurement.register( 'HistogramWithExpectedValue', HistogramWithExpectedValue );