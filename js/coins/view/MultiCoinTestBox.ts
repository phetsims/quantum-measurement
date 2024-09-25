// Copyright 2024, University of Colorado Boulder

/**
 * MultiCoinTestBox is a Scenery Node that represents a box (i.e. a rectangle) where coins are placed for tests where
 * they are prepared for measurement and then measured. It is responsible for creating the coins that will be shown
 * within it.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Color, HBox, HBoxOptions, LinearGradient, Node, Rectangle } from '../../../../scenery/js/imports.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';
import SmallCoinNode from './SmallCoinNode.js';
import { MAX_COINS, MULTI_COIN_EXPERIMENT_QUANTITIES } from '../model/CoinsExperimentSceneModel.js';

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

export default class MultiCoinTestBox extends HBox {

  private readonly testBoxWithClipArea: Node;
  private readonly numberOfActiveSystemsProperty: TReadOnlyProperty<number>;
  private readonly residentCoinNodes: SmallCoinNode[] = [];

  public constructor( coinSet: TwoStateSystemSet<string>,
                      measurementStateProperty: Property<ExperimentMeasurementState>,
                      numberOfActiveSystemsProperty: TReadOnlyProperty<number>,
                      providedOptions?: MultiCoinTestBoxOptions ) {

    // Create the main rectangle that will represent the area where the coins will be hidden and shown.
    const multipleCoinTestBoxRectangle = new Rectangle(
      0,
      0,
      BOX_SIZE.width,
      BOX_SIZE.height,
      {
        fill: TEST_BOX_CONTENTS_HIDDEN_FILL,
        opacity: 0.5,
        lineWidth: 2,
        stroke: new Color( '#666666' )
      }
    );

    // Create a node that includes the test box and a clip area. This is used to put masks over the tops of the coins
    // that appear as the coins slide into the box.
    const testBoxWithClipArea = new Node( {
      children: [ multipleCoinTestBoxRectangle ],
      clipArea: Shape.bounds( multipleCoinTestBoxRectangle.getRectBounds() )
    } );

    // Create an area that will set to the left of the test box where coins that are animating into the box can be
    // placed before moving into it. This is done so that the bounds of this node don't change when the coins and the
    // masks for those coins are added as children.
    const coinLandingZone = new Rectangle( 0, 0, LANDING_ZONE_WIDTH, BOX_SIZE.height, {
      fill: LANDING_ZONE_FILL
    } );

    const options = optionize<MultiCoinTestBoxOptions, SelfOptions, HBoxOptions>()( {
      children: [ coinLandingZone, testBoxWithClipArea ]
    }, providedOptions );

    super( options );

    this.testBoxWithClipArea = testBoxWithClipArea;
    this.numberOfActiveSystemsProperty = numberOfActiveSystemsProperty;

    // Update the fill for the rectangle based on the measurement state.
    measurementStateProperty.link( measurementState => {

      // Make the box look hazy when the measurement is not revealed.
      multipleCoinTestBoxRectangle.fill = measurementState === 'measuredAndRevealed' ?
                                          TEST_BOX_CONTENTS_REVEALED_FILL :
                                          TEST_BOX_CONTENTS_HIDDEN_FILL;

      // Update the appearance of the coin nodes.
      this.residentCoinNodes.forEach( ( coinNode, index ) => {

        if ( measurementState === 'measuredAndRevealed' ) {

          if ( coinNode.isFlipping ) {
            coinNode.stopFlipping();
          }

          // Reveal the coin's state.
          const state = coinSet.measuredValues[ index ];
          if ( state === null ) {
            coinNode.displayModeProperty.value = 'masked';
          }
          else if ( state === 'up' ) {
            coinNode.displayModeProperty.value = 'up';
          }
          else if ( state === 'down' ) {
            coinNode.displayModeProperty.value = 'down';
          }
          else if ( state === 'heads' ) {
            coinNode.displayModeProperty.value = 'heads';
          }
          else if ( state === 'tails' ) {
            coinNode.displayModeProperty.value = 'tails';
          }
        }
        else if ( measurementState === 'preparingToBeMeasured' ) {

          assert && assert( !coinNode.isFlipping, 'coin node should not already be flipping' );

          coinNode.displayModeProperty.value = 'masked';
          coinNode.startFlipping();
        }
        else if ( measurementState === 'readyToBeMeasured' ) {
          if ( coinNode.isFlipping ) {
            coinNode.stopFlipping();
          }
          coinNode.displayModeProperty.value = 'masked';
        }
      } );
    } );
  }

  // Clear out the contents of this test box.
  public clearContents(): void {
    this.residentCoinNodes.forEach( coinNode => this.testBoxWithClipArea.removeChild( coinNode ) );
    this.residentCoinNodes.length = 0;
  }

  public addCoinNodeToBox( coinNode: SmallCoinNode ): void {
    this.testBoxWithClipArea.addChild( coinNode );
    coinNode.moveToBack();
    this.residentCoinNodes.push( coinNode );
  }

  /**
   * Get an offset value from the center of the test box rectangle where a coin at the given index should go.
   */
  public getOffsetFromCenter( index: number ): Vector2 {
    assert && assert( index < this.numberOfActiveSystemsProperty.value, 'index is out of range for current capacity' );
    const offset = new Vector2( 0, 0 );

    const setOffsets = ( box: Dimension2, columns: number, rows: number ) => {
      const xOffset = box.width / ( columns + 1 ) * ( ( index % columns ) + 1 ) - box.width / 2;
      const yOffset = box.height / ( rows + 1 ) * ( Math.floor( index / columns ) + 1 ) - box.height / 2;
      offset.setXY( xOffset, yOffset );
    };

    if ( this.numberOfActiveSystemsProperty.value === 10 ) {
      setOffsets( BOX_SIZE, 5, 2 );
    }
    else if ( this.numberOfActiveSystemsProperty.value === 100 ) {
      setOffsets( BOX_SIZE, 10, 10 );
    }
    else if ( this.numberOfActiveSystemsProperty.value === MAX_COINS ) {
      // N rows of N = sqrt( Hollywooded number of coins )
      const sideLength = Math.sqrt( QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS );
      const BoxDimension = new Dimension2(
        BOX_SIZE.width * QuantumMeasurementConstants.COIN_SET_AREA_PROPORTION + 3 * QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS_RADII,
        BOX_SIZE.height * QuantumMeasurementConstants.COIN_SET_AREA_PROPORTION + 3 * QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS_RADII
      );
      setOffsets( BoxDimension, sideLength, sideLength );
    }
    return offset;
  }

  /**
   * Get the radius that should be used for coin nodes in this test box based on the number of them that will be shown.
   */
  public static getRadiusFromCoinQuantity( coinQuantity: number ): number {
    assert && assert(
      MULTI_COIN_EXPERIMENT_QUANTITIES.includes( coinQuantity ),
      'unsupported number of coins for test box'
    );
    let radius;
    if ( coinQuantity === 10 ) {
      radius = 12;
    }
    else if ( coinQuantity === 100 ) {
      radius = 6;
    }
    else {
      radius = QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS_RADII;
    }
    return radius;
  }
}

quantumMeasurement.register( 'MultiCoinTestBox', MultiCoinTestBox );