// Copyright 2025, University of Colorado Boulder

/**
 * ExpectationValueCheckboxDecorationNode is the node that is used to display the expectation value icon (basically a
 * little green line) and a display value that is sometimes visible.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class ExpectationValueCheckboxDecorationNode extends HBox {

  public constructor( normalizedExpectationValueProperty: TReadOnlyProperty<number | null>,
                      expectationValueLineVisibleProperty: TReadOnlyProperty<boolean>,
                      showReadoutProperty: TReadOnlyProperty<boolean> ) {

    const lineIcon = new Line( 0, 0, 30, 0, {
      stroke: QuantumMeasurementColors.expectedPercentageFillProperty,
      lineWidth: 3
    } );

    const expectationValueDisplay = new NumberDisplay(
      normalizedExpectationValueProperty,
      new Range( -1, 1 ),
      {
        yMargin: 0,
        decimalPlaces: 2,
        backgroundStroke: null,
        visibleProperty: DerivedProperty.and( [ expectationValueLineVisibleProperty, showReadoutProperty ] ),
        textOptions: {
          font: QuantumMeasurementConstants.CONTROL_FONT
        }
      }
    );

    super( {
      children: [ lineIcon, expectationValueDisplay ],
      spacing: 3
    } );
  }
}

quantumMeasurement.register( 'ExpectationValueCheckboxDecorationNode', ExpectationValueCheckboxDecorationNode );