// Copyright 2024-2025, University of Colorado Boulder

/**
 * HistogramWithExpectedValue is an extension of QuantumMeasurementHistogram but this time including the expected
 * statistical outcome (probability), as well as the real number counts.
 *
 * @author Agustín Vallejo
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram, { DEFAULT_HISTOGRAM_SIZE, QuantumMeasurementHistogramOptions } from '../../common/view/QuantumMeasurementHistogram.js';
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
    }, QuantumMeasurementConstants.EXPECTED_PERCENTAGE_PATH_OPTIONS );

    const expectedValueShape = new Shape().moveTo( 0, 0 ).lineTo( DEFAULT_HISTOGRAM_SIZE.width / 3, 0 );
    const leftExpectedValueLine = new Path( expectedValueShape, expectedValueOptions );
    const rightExpectedValueLine = new Path( expectedValueShape, expectedValueOptions );

    this.addChild( leftExpectedValueLine );
    this.addChild( rightExpectedValueLine );

    leftProbabilityProperty.link( probability => {
      const xPosition = DEFAULT_HISTOGRAM_SIZE.width / 4;
      leftExpectedValueLine.center = new Vector2( -xPosition, -this.maxBarHeight * probability );
      rightExpectedValueLine.center = new Vector2( xPosition, -this.maxBarHeight * ( 1 - probability ) );
    } );
  }
}

quantumMeasurement.register( 'HistogramWithExpectedValue', HistogramWithExpectedValue );