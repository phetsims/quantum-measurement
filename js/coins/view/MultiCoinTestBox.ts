// Copyright 2024-2025, University of Colorado Boulder

/**
 * MultiCoinTestBox is a Scenery Node that represents a box (i.e. a rectangle) where coins are placed for tests where
 * they are prepared for measurement and then measured. It is responsible for creating the coins that will be shown
 * within it.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinSet from '../model/CoinSet.js';
import { MULTI_COIN_ANIMATION_QUANTITIES } from '../model/CoinsExperimentSceneModel.js';
import { ExperimentMeasurementState } from '../model/ExperimentMeasurementState.js';
import CoinSetPixelRepresentation from './CoinSetPixelRepresentation.js';
import SmallCoinNode, { SmallCoinDisplayMode } from './SmallCoinNode.js';

// constants
const BOX_SIZE = new Dimension2( 200, 200 );
const CONTENTS_HIDDEN_FILL = new LinearGradient( 0, 0, BOX_SIZE.width, 0 )
  .addColorStop( 0, QuantumMeasurementColors.multiCoinFirstGradientColorProperty )
  .addColorStop( 1, QuantumMeasurementColors.multiCoinSecondGradientColorProperty );
const INTERIOR_COLOR_PROPERTY = QuantumMeasurementColors.testBoxBackgroundFillProperty;

class MultiCoinTestBox extends Node {

  private readonly testBoxWithClipArea: Node;
  private readonly numberOfActiveCoinsProperty: TReadOnlyProperty<number>;

  // The coin nodes that are currently in the test box.  These are the represented as one node per coin.
  private readonly residentCoinNodes: SmallCoinNode[] = [];

  // The pixel representation of the coin set, which is used for the many coin case.
  private pixelRepresentation: CoinSetPixelRepresentation | null = null;

  public constructor( coinSet: CoinSet ) {

    // Create the main rectangle that will represent the area where the coins will be hidden and shown.
    const multipleCoinTestBoxRectangle = new Rectangle(
      0,
      0,
      BOX_SIZE.width,
      BOX_SIZE.height,
      {
        fill: CONTENTS_HIDDEN_FILL,
        opacity: 0.5,
        lineWidth: 2,
        stroke: QuantumMeasurementColors.testBoxRectangleStrokeColorProperty
      }
    );

    // Create the node that will be the interior of the test box.
    const testBoxInterior = new Rectangle( 0, 0, BOX_SIZE.width, BOX_SIZE.height, {
      fill: INTERIOR_COLOR_PROPERTY
    } );

    // Create a node that includes the test box and a clip area. This is used to put masks over the tops of the coins
    // that appear as the coins slide into the box.
    const testBoxWithClipArea = new Node( {
      children: [ multipleCoinTestBoxRectangle ],
      clipArea: Shape.bounds( multipleCoinTestBoxRectangle.getRectBounds() )
    } );

    super( { children: [ testBoxInterior, testBoxWithClipArea ] } );

    this.testBoxWithClipArea = testBoxWithClipArea;
    this.numberOfActiveCoinsProperty = coinSet.numberOfCoinsProperty;

    // Update the fill for the rectangle based on the measurement state.
    coinSet.measurementStateProperty.link( measurementState => {

      // Make the box look hazy when the measurement is not revealed.
      multipleCoinTestBoxRectangle.fill = measurementState === 'revealed' ?
                                          Color.TRANSPARENT :
                                          CONTENTS_HIDDEN_FILL;

      // Update the appearance of the coin nodes.
      this.updateCoinNodes( coinSet, measurementState );
    } );

    // Update the appearance of the coin nodes when the data changes.
    coinSet.measuredDataChangedEmitter.addListener( () => {

      // When phet-io state is being set, the measured data can change without any change to the measurement state of
      // the coin set. This makes sure that the coin nodes are updated in that situation.
      if ( isSettingPhetioStateProperty.value ) {
        this.updateCoinNodes( coinSet, coinSet.measurementStateProperty.value );
      }
    } );
  }

  /**
   * Update the appearance of the coin nodes.  This is done in a batch rather than having separate model elements and
   * nodes that automatically update because there can be many thousands of coins, so an approach like this is needed to
   * get reasonable performance.
   */
  private updateCoinNodes( coinSet: CoinSet, measurementState: ExperimentMeasurementState ): void {
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
        coinNode.displayModeProperty.value = 'hidden';

        if ( coinSet.coinType === SystemType.CLASSICAL ) {
          coinNode.startFlipping();
        }
      }
      else if ( measurementState === 'readyToBeMeasured' || measurementState === 'measuredAndHidden' ) {
        if ( coinNode.isFlipping ) {
          coinNode.stopFlipping();
        }
        coinNode.displayModeProperty.value = 'hidden';
      }
    } );

    // Handle the pixel-based representation of the coin set if present.
    if ( this.pixelRepresentation && measurementState === 'preparingToBeMeasured' ) {
      this.pixelRepresentation.startFlippingAnimation();
    }
  }

  // Clear out the contents of this test box.
  public clearContents(): void {
    this.residentCoinNodes.forEach( coinNode => this.testBoxWithClipArea.removeChild( coinNode ) );
    this.residentCoinNodes.length = 0;
    if ( this.pixelRepresentation ) {
      this.testBoxWithClipArea.removeChild( this.pixelRepresentation );
      this.pixelRepresentation = null;
    }
  }

  public addCoinNodeToBox( coinNode: SmallCoinNode ): void {
    this.testBoxWithClipArea.addChild( coinNode );
    coinNode.moveToBack();
    this.residentCoinNodes.push( coinNode );
  }

  // Add the pixel-based representation of the coin set to the test box.
  public addPixelRepresentationToBox( pixelRepresentation: CoinSetPixelRepresentation ): void {

    // Center it, add it, and keep a record of it.
    pixelRepresentation.center = this.testBoxWithClipArea.center;
    this.testBoxWithClipArea.addChild( pixelRepresentation );
    this.pixelRepresentation = pixelRepresentation;
  }

  /**
   * Get an offset value from the center of the test box rectangle where a coin at the given index should go.
   */
  public getOffsetFromCenter( index: number ): Vector2 {
    assert && assert( index < this.numberOfActiveCoinsProperty.value, 'index is out of range for current capacity' );
    const offset = new Vector2( 0, 0 );

    const setOffsets = ( box: Dimension2, columns: number, rows: number ) => {
      const xOffset = box.width / ( columns + 1 ) * ( ( index % columns ) + 1 ) - box.width / 2;
      const yOffset = box.height / ( rows + 1 ) * ( Math.floor( index / columns ) + 1 ) - box.height / 2;
      offset.setXY( xOffset, yOffset );
    };

    if ( this.numberOfActiveCoinsProperty.value === 10 ) {
      setOffsets( BOX_SIZE, 5, 2 );
    }
    else if ( this.numberOfActiveCoinsProperty.value === 100 ) {
      setOffsets( BOX_SIZE, 10, 10 );
    }
    return offset;
  }

  /**
   * Get the radius that should be used for coin nodes in this test box based on the number of them that will be shown.
   */
  public static getRadiusFromCoinQuantity( coinQuantity: number ): number {
    assert && assert( MULTI_COIN_ANIMATION_QUANTITIES.includes( coinQuantity ), 'unsupported number of coins' );
    let radius;
    if ( coinQuantity === 10 ) {
      radius = 12;
    }
    else {
      radius = 6;
    }

    return radius;
  }

  public static readonly SIZE = BOX_SIZE;
}

quantumMeasurement.register( 'MultiCoinTestBox', MultiCoinTestBox );

export default MultiCoinTestBox;