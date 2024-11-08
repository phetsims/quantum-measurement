// Copyright 2024, University of Colorado Boulder

/**
 * HistogramWithExpectedValue is an extension of QuantumMeasurementHistogram but this time including the expected
 * statistical outcome (probability), as well as the real number counts.
 *
 * @author Agustín Vallejo
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Path, PathOptions, RichText } from '../../../../scenery/js/imports.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram, { HISTOGRAM_BAR_WIDTH, QuantumMeasurementHistogramOptions } from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class HistogramWithExpectedValue extends QuantumMeasurementHistogram {

  public constructor( leftNumberProperty: TReadOnlyProperty<number>,
                      rightNumberProperty: TReadOnlyProperty<number>,
                      leftProbabilityProperty: TReadOnlyProperty<number>,
                      expectedValueVisibleProperty: TReadOnlyProperty<boolean>,
                      displayValuesProperty: TReadOnlyProperty<boolean>,
                      providedXAxisLabels: [ RichText, RichText ],
                      providedOptions: QuantumMeasurementHistogramOptions ) {

    super( leftNumberProperty, rightNumberProperty, displayValuesProperty, providedXAxisLabels, providedOptions );

    const expectedValueOptions = combineOptions<PathOptions>( {
      visibleProperty: expectedValueVisibleProperty
    }, QuantumMeasurementConstants.expectedPercentagePathOptions );
    const leftExpectedValueLine = new Path( new Shape().moveTo( 0, 0 ).lineTo( HISTOGRAM_BAR_WIDTH * 2, 0 ), expectedValueOptions );
    const rightExpectedValueLine = new Path( new Shape().moveTo( 0, 0 ).lineTo( HISTOGRAM_BAR_WIDTH * 2, 0 ), expectedValueOptions );

    this.addChild( leftExpectedValueLine );
    this.addChild( rightExpectedValueLine );

    leftProbabilityProperty.link( probability => {
      // TODO: Check this, https://github.com/phetsims/quantum-measurement/issues/53
      // Position the expected value lines, empirically determined since the AlignGroups mess everything up
      const xPosition = 1.65 * HISTOGRAM_BAR_WIDTH;
      leftExpectedValueLine.center = new Vector2( -xPosition, -this.maxBarHeight * probability );
      rightExpectedValueLine.center = new Vector2( xPosition, -this.maxBarHeight * ( 1 - probability ) );
    } );
  }
}

quantumMeasurement.register( 'HistogramWithExpectedValue', HistogramWithExpectedValue );