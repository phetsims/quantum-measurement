// Copyright 2024, University of Colorado Boulder

/**
 * MultiCoinTestBox is a Scenery Node that represents a box (i.e. a rectangle) where coins are placed for tests where
 * they are prepared for measurement and then measured.  It is responsible for creating the coins that will be shown
 * within it.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Color, HBox, HBoxOptions, LinearGradient, Node, Rectangle } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Shape } from '../../../../kite/js/imports.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Property from '../../../../axon/js/Property.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';
import SmallCoinNode from './SmallCoinNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = EmptySelfOptions;
export type MultiCoinTestBoxOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

// constants
const BOX_SIZE = new Dimension2( 200, 200 );
const TEST_BOX_CONTENTS_HIDDEN_FILL = new LinearGradient( 0, 0, BOX_SIZE.width, 0 )
  .addColorStop( 0, new Color( '#eeeeee' ) )
  .addColorStop( 1, new Color( '#cceae8' ) );
const TEST_BOX_CONTENTS_REVEALED_FILL = Color.WHITE.withAlpha( 0 );
const LANDING_ZONE_WIDTH = 1;
const LANDING_ZONE_FILL = 'rgba( 255, 192, 203, 0.5 )'; // useful for debug, opacity should be 0 in production version

// map of the radii to be used based on the quantity of coins that will appear in this test box
const MAP_OF_COIN_QUANTITY_TO_RADIUS = new Map( [
  [ 10, 12 ],
  [ 100, 6 ],

  // TODO: See https://github.com/phetsims/quantum-measurement/issues/15.  This will need to be modded when real suppor
  //       for 10000 coins is added.
  [ 144, 4 ]
  // [ 10000, 0.5 ]
] );

export default class MultiCoinTestBox extends HBox {

  private readonly testBoxWithClipArea: Node;
  private readonly coinCapacityProperty: TReadOnlyProperty<number>;

  public constructor( measurementStateProperty: Property<ExperimentMeasurementState>,
                      coinCapacityProperty: TReadOnlyProperty<number>,
                      providedOptions?: MultiCoinTestBoxOptions ) {

    // Create the main rectangle that will represent the area where the coins will be hidden and shown.
    const multipleCoinTestBoxRectangle = new Rectangle(
      0,
      0,
      BOX_SIZE.width,
      BOX_SIZE.height,
      {
        fill: new LinearGradient( 0, 0, BOX_SIZE.width, 0 )
          .addColorStop( 0, new Color( '#eeeeee' ) )
          .addColorStop( 1, new Color( '#cceae8' ) ),
        lineWidth: 2,
        stroke: new Color( '#666666' )
      }
    );

    // Update the fill for the rectangle based on the measurement state.
    measurementStateProperty.link( measurementState => {
      multipleCoinTestBoxRectangle.fill = measurementState === 'measuredAndRevealed' ?
                                          TEST_BOX_CONTENTS_REVEALED_FILL :
                                          TEST_BOX_CONTENTS_HIDDEN_FILL;
    } );

    // Create a node that includes the test box and a clip area.  This is used to put masks over the tops of the coins
    // that appear as the coins slide into the box.
    const testBoxWithClipArea = new Node( {
      children: [ multipleCoinTestBoxRectangle ],
      clipArea: Shape.bounds( multipleCoinTestBoxRectangle.getRectBounds() )
    } );

    // Create an area that will set to the left of the test box where coins that are animating into the box can be
    // placed before moving into it.  This is done so that the bounds of this node don't change when the coins and the
    // masks for those coins are added as children.
    const coinLandingZone = new Rectangle( 0, 0, LANDING_ZONE_WIDTH, BOX_SIZE.height, {
      fill: LANDING_ZONE_FILL
    } );

    const options = optionize<MultiCoinTestBoxOptions, SelfOptions, HBoxOptions>()( {
      children: [ coinLandingZone, testBoxWithClipArea ]
    }, providedOptions );

    super( options );

    this.testBoxWithClipArea = testBoxWithClipArea;
    this.coinCapacityProperty = coinCapacityProperty;
  }

  // Clear out the contents of this test box.
  public clearContents(): void {
    const coinNodeChildren = this.testBoxWithClipArea.children.filter( node => node instanceof SmallCoinNode );
    coinNodeChildren.forEach( coinNodeChild => this.testBoxWithClipArea.removeChild( coinNodeChild ) );
  }

  public addCoinNodeToBox( coinNode: SmallCoinNode ): void {
    this.testBoxWithClipArea.addChild( coinNode );
  }

  /**
   * Get an offset value from the center of the test box rectangle where a coin at the given index should go.
   */
  public getOffsetFromCenter( index: number ): Vector2 {
    assert && assert( index < this.coinCapacityProperty.value, 'index is out of range for current capacity' );
    const offset = new Vector2( 0, 0 );
    if ( this.coinCapacityProperty.value === 10 ) {

      // Two rows of five.
      const xOffset = BOX_SIZE.width / 6 * ( index % 5 + 1 ) - BOX_SIZE.width / 2;
      const yOffset = BOX_SIZE.height / 3 * ( Math.floor( index / 5 ) + 1 ) - BOX_SIZE.height / 2;
      offset.setXY( xOffset, yOffset );
    }
    else if ( this.coinCapacityProperty.value === 100 ) {

      // 10 rows of 10
      const xOffset = BOX_SIZE.width / 11 * ( Math.floor( index / 10 ) + 1 ) - BOX_SIZE.width / 2;
      const yOffset = BOX_SIZE.height / 11 * ( index % 10 + 1 ) - BOX_SIZE.height / 2;
      offset.setXY( xOffset, yOffset );
    }

    // TODO: See https://github.com/phetsims/quantum-measurement/issues/15.  This is a temporary workaround where we are
    //       handling the 10000 setting as though it's 144, and will need to be replaced.
    else if ( this.coinCapacityProperty.value === 144 ) {

      // 12 rows of 12
      const xOffset = BOX_SIZE.width / 13 * ( Math.floor( index / 12 ) + 1 ) - BOX_SIZE.width / 2;
      const yOffset = BOX_SIZE.height / 13 * ( index % 12 + 1 ) - BOX_SIZE.height / 2;
      offset.setXY( xOffset, yOffset );
    }
    return offset;
  }

  /**
   * Get the radius that should be used for coin nodes in this test box based on the number of them that will be shown.
   */
  public static getRadiusFromCoinQuantity( coinQuantity: number ): number {
    assert && assert( MAP_OF_COIN_QUANTITY_TO_RADIUS.has( coinQuantity ), 'unsupported number of coins for test box' );
    return MAP_OF_COIN_QUANTITY_TO_RADIUS.get( coinQuantity ) || 1000;
  }
}

quantumMeasurement.register( 'MultiCoinTestBox', MultiCoinTestBox );