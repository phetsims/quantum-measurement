// Copyright 2024-2025, University of Colorado Boulder

/**
 * SingleCoinTestBox is a Scenery Node that represents a box (i.e. a rectangle) where a coin is placed for tests where
 * the coin is prepared for measurement and then measured.  This provides a child with a clip area that can be used for
 * animations where a coin slides in and becomes masked (i.e. its value is hidden from the user) as it does.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';

// constants
const SINGLE_COIN_AREA_RECT_LINE_WIDTH = 18;
const SINGLE_COIN_TEST_BOX_SIZE = new Dimension2( 165, 145 );
const SINGLE_COIN_TEST_BOX_UNREVEALED_FILL = new LinearGradient( 0, 0, SINGLE_COIN_TEST_BOX_SIZE.width, 0 )
  .addColorStop( 0, QuantumMeasurementColors.testBoxLinearGradient1ColorProperty.value.withAlpha( 0.8 ) )
  .addColorStop( 0.9, QuantumMeasurementColors.testBoxLinearGradient2ColorProperty.value.withAlpha( 0.8 ) );

export default class SingleCoinTestBox extends Node {

  // Make the clipped child accessible externally since this is where children should be added if clients want to take
  // advantage of the clip area.
  public readonly clippedTestBox: Node;

  public constructor( measurementStateProperty: Property<ExperimentMeasurementState> ) {

    const testBoxBounds = new Bounds2(
      0,
      0,
      SINGLE_COIN_TEST_BOX_SIZE.width,
      SINGLE_COIN_TEST_BOX_SIZE.height
    );

    // Add the main rectangular area that will define the test box.
    const testBoxRectangle = new Rectangle( testBoxBounds, {
        lineWidth: SINGLE_COIN_AREA_RECT_LINE_WIDTH,
        stroke: QuantumMeasurementColors.testBoxRectangleStrokeColorProperty
      }
    );

    // Make the box transparent when the state of the measurement indicates that the coin is revealed to the user.
    measurementStateProperty.link( singleCoinMeasurementState => {
      testBoxRectangle.fill = singleCoinMeasurementState === 'revealed' ?
                              Color.TRANSPARENT :
                              SINGLE_COIN_TEST_BOX_UNREVEALED_FILL;
    } );

    // Add a second rectangle that is clipped.  This is where the children should go if they need to only appear when
    // inside the box.
    const testBoxRectangleClipped = new Rectangle( testBoxBounds, {
      clipArea: Shape.bounds( testBoxBounds )
    } );

    super( { children: [ testBoxRectangleClipped, testBoxRectangle ] } );

    this.clippedTestBox = testBoxRectangleClipped;
  }
}

quantumMeasurement.register( 'SingleCoinTestBox', SingleCoinTestBox );