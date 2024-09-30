// Copyright 2024, University of Colorado Boulder

/**
 * SingleCoinTestBox is a Scenery Node that represents a box (i.e. a rectangle) where a coin is placed for tests where
 * the coin is prepared for measurement and then measured.  This provides a child with a clip area that can be used for
 * animations where a coin slides in and becomes masked as it does.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color, LinearGradient, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Property from '../../../../axon/js/Property.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';

type SelfOptions = EmptySelfOptions;
export type SingleCoinTestBoxOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// constants
const SINGLE_COIN_AREA_RECT_LINE_WIDTH = 36;
const SINGLE_COIN_TEST_BOX_SIZE = new Dimension2( 165, 145 );
const SINGLE_COIN_TEST_BOX_UNREVEALED_FILL = new LinearGradient( 0, 0, SINGLE_COIN_TEST_BOX_SIZE.width, 0 )
  .addColorStop( 0, new Color( '#eeeeee' ) )
  .addColorStop( 0.9, new Color( '#bae3e0' ) );

export default class SingleCoinTestBox extends Node {

  // Make the clipped child accessible externally since this is where children should be added if clients want to take
  // advantage of the clip area.
  public readonly clippedTestBox: Node;

  public constructor( measurementStateProperty: Property<ExperimentMeasurementState>,
                      providedOptions: SingleCoinTestBoxOptions ) {

    // Add the main rectangular area.
    const testBoxRectangle = new Rectangle(
      0,
      0,
      SINGLE_COIN_TEST_BOX_SIZE.width,
      SINGLE_COIN_TEST_BOX_SIZE.height,
      {
        lineWidth: SINGLE_COIN_AREA_RECT_LINE_WIDTH,
        stroke: new Color( '#555555' ),
        opacity: 0.8
      }
    );

    // Make the test box transparent when the state of the measurement indicates that the coin is revealed to the user.
    measurementStateProperty.link( singleCoinMeasurementState => {
      testBoxRectangle.fill = singleCoinMeasurementState === 'measuredAndRevealed' ?
                                        Color.TRANSPARENT :
                                        SINGLE_COIN_TEST_BOX_UNREVEALED_FILL;
    } );

    // Put the test box into another parent node so that a clip area can be included.  The clip area will be used to
    // clip the mask that is used to hide the value of the coin.
    const testBoxRectangleClipped = new Node( {
      children: [ testBoxRectangle ],
      clipArea: Shape.bounds( testBoxRectangle.getRectBounds() )
    } );

    const options = optionize<SingleCoinTestBoxOptions, SelfOptions, NodeOptions>()( {
      children: [ testBoxRectangleClipped ]
    }, providedOptions );

    super( options );

    this.clippedTestBox = testBoxRectangle;
  }
}

quantumMeasurement.register( 'SingleCoinTestBox', SingleCoinTestBox );