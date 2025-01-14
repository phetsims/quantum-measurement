// Copyright 2024, University of Colorado Boulder

/**
 * MultiCoinTestBox is a Scenery Node that represents a box (i.e. a rectangle) where coins are placed for tests where
 * they are prepared for measurement and then measured. It is responsible for creating the coins that will be shown
 * within it.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Property from '../../../../axon/js/Property.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color, HBox, LinearGradient, Node, Rectangle } from '../../../../scenery/js/imports.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import TwoStateSystemSet from '../../common/model/TwoStateSystemSet.js';
import quantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { MULTI_COIN_ANIMATION_QUANTITIES } from '../model/CoinsExperimentSceneModel.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';
import SmallCoinNode, { SmallCoinDisplayMode } from './SmallCoinNode.js';

// constants
const BOX_SIZE = new Dimension2( 200, 200 );
const TEST_BOX_CONTENTS_HIDDEN_FILL = new LinearGradient( 0, 0, BOX_SIZE.width, 0 )
  .addColorStop( 0, quantumMeasurementColors.multiCoinFirstGradientColorProperty )
  .addColorStop( 1, quantumMeasurementColors.multiCoinSecondGradientColorProperty );
const TEST_BOX_CONTENTS_REVEALED_FILL_COLOR_PROPERTY = quantumMeasurementColors.testBoxContentsRevealedFillColorProperty;
const LANDING_ZONE_WIDTH = 1;
const LANDING_ZONE_FILL_COLOR_PROPERTY = quantumMeasurementColors.landingZoneFillColorProperty; // useful for debug, opacity should be 0 in production version

class MultiCoinTestBox extends HBox {

  private readonly testBoxWithClipArea: Node;
  private readonly numberOfActiveSystemsProperty: TReadOnlyProperty<number>;
  private readonly residentCoinNodes: SmallCoinNode[] = [];

  public constructor( coinSet: TwoStateSystemSet<string>,
                      measurementStateProperty: Property<ExperimentMeasurementState>,
                      numberOfActiveSystemsProperty: TReadOnlyProperty<number>,
                      measuredDataChangedEmitter: TEmitter ) {

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
      fill: LANDING_ZONE_FILL_COLOR_PROPERTY
    } );

    super( { children: [ coinLandingZone, testBoxWithClipArea ] } );

    this.testBoxWithClipArea = testBoxWithClipArea;
    this.numberOfActiveSystemsProperty = numberOfActiveSystemsProperty;

    // Update the fill for the rectangle based on the measurement state.
    measurementStateProperty.link( measurementState => {

      // Make the box look hazy when the measurement is not revealed.
      multipleCoinTestBoxRectangle.fill = measurementState === 'revealed' ?
                                          TEST_BOX_CONTENTS_REVEALED_FILL_COLOR_PROPERTY :
                                          TEST_BOX_CONTENTS_HIDDEN_FILL;

      // Update the appearance of the coin nodes.
      this.updateCoinNodes( coinSet, measurementState );
    } );

    // Update the appearance of the coin nodes when the data changes.
    measuredDataChangedEmitter.addListener( () => {

      // When phet-io state is being set, the measured data can change without any change to the measurement state of
      // the coin set.  This makes sure that the coin nodes are updated in that situation.
      if ( isSettingPhetioStateProperty.value ) {
        this.updateCoinNodes( coinSet, measurementStateProperty.value );
      }
    } );
  }

  /**
   * Update the appearance of the coin nodes.  This is done in a batch rather than having separate model elements and
   * nodes that automatically update because there can be many thousands of coins, so this approach is needed to get
   * reasonable performance.
   */
  private updateCoinNodes( coinSet: TwoStateSystemSet<string>, measurementState: ExperimentMeasurementState ): void {
    this.residentCoinNodes.forEach( ( coinNode, index ) => {

      if ( measurementState === 'revealed' ) {

        // Stop any in-progress animation.
        if ( coinNode.isFlipping ) {
          coinNode.stopFlipping();
        }

        // Set the coin node to display the revealed face of the coin.
        coinNode.displayModeProperty.value = coinSet.measuredValues[ index ] as SmallCoinDisplayMode;
      }
      else if ( measurementState === 'preparingToBeMeasured' ) {

        assert && assert( !coinNode.isFlipping, 'coin node should not already be flipping' );

        // Hide the faces of the coin.
        coinNode.displayModeProperty.value = 'masked';

        if ( coinSet.systemType === 'classical' ) {
          coinNode.startFlipping();
        }
      }
      else if ( measurementState === 'readyToBeMeasured' || measurementState === 'measuredAndHidden' ) {
        if ( coinNode.isFlipping ) {
          coinNode.stopFlipping();
        }
        coinNode.displayModeProperty.value = 'masked';
      }
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
    return offset;
  }

  /**
   * Get the radius that should be used for coin nodes in this test box based on the number of them that will be shown.
   */
  public static getRadiusFromCoinQuantity( coinQuantity: number ): number {
    assert && assert(
      MULTI_COIN_ANIMATION_QUANTITIES.includes( coinQuantity ), 'unsupported number of coins' );
    let radius;
    if ( coinQuantity === 10 ) {
      radius = 12;
    }
    else {
      radius = 6;
    }

    return radius;
  }
}

quantumMeasurement.register( 'MultiCoinTestBox', MultiCoinTestBox );

export default MultiCoinTestBox;