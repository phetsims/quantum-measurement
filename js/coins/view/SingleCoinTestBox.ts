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
const SIZE = new Dimension2( 165, 145 ); // in screen coordinates
const CONTENTS_HIDDEN_FILL = new LinearGradient( 0, 0, SIZE.width, 0 )
  .addColorStop( 0, QuantumMeasurementColors.testBoxLinearGradient1ColorProperty.value.withAlpha( 0.8 ) )
  .addColorStop( 0.9, QuantumMeasurementColors.testBoxLinearGradient2ColorProperty.value.withAlpha( 0.8 ) );

class SingleCoinTestBox extends Node {

  // The mask layer has a clip area.  This is where children should be added if clients want them to only be visible
  // when they are inside the box.
  private readonly maskLayer: Node;

  // The coin layer is layer where coins should be added so that they are between the front and back of the box and
  // behind the mask layer.
  private readonly coinLayer: Node;

  public constructor( measurementStateProperty: Property<ExperimentMeasurementState> ) {

    // Define the bounds such that the center of the box is at the origin.  This makes it easier to work with when
    // positioning children.
    const testBoxBounds = new Bounds2(
      -SIZE.width / 2,
      -SIZE.height / 2,
      SIZE.width / 2,
      SIZE.height / 2
    );

    // Add the background of the box, which is at the back of the Z-order.
    const background = new Rectangle( testBoxBounds, {
      fill: QuantumMeasurementColors.testBoxBackgroundFillProperty
    } );

    // Add the layers that will be used to hold the coin and the mask that will hide it.
    const coinLayer = new Node();
    const maskLayer = new Node( {
      clipArea: Shape.bounds( testBoxBounds )
    } );

    // Add the main rectangular area that will define the test box.  All content in the box will be behind this in the
    // Z-order.
    const testBoxRectangle = new Rectangle( testBoxBounds, {
        lineWidth: 18,
        stroke: QuantumMeasurementColors.testBoxRectangleStrokeColorProperty
      }
    );

    // Make the box cover transparent when the state of the measurement indicates that the coin is revealed to the user.
    measurementStateProperty.link( singleCoinMeasurementState => {
      testBoxRectangle.fill = singleCoinMeasurementState === 'revealed' ?
                              Color.TRANSPARENT :
                              CONTENTS_HIDDEN_FILL;
    } );

    super( { children: [ background, coinLayer, maskLayer, testBoxRectangle ] } );

    this.maskLayer = maskLayer;
    this.coinLayer = background;
  }

  /**
   * Clear all coin nodes from the box.  This disposes the coins nodes.  Note that this does NOT clear the mask layer.
   * That's because the mask is generally long-lived, and is moved out the test box elsewhere in the code.
   */
  public clearCoins(): void {
    this.coinLayer.getChildren().forEach( child => {
      this.coinLayer.removeChild( child );
      child.dispose();
    } );
  }

  public addCoinNode( coinNode: Node ): void {
    this.coinLayer.addChild( coinNode );
  }

  public addCoinMaskNode( coinNode: Node ): void {
    this.maskLayer.addChild( coinNode );
  }

  public static readonly SIZE = SIZE;
}

quantumMeasurement.register( 'SingleCoinTestBox', SingleCoinTestBox );

export default SingleCoinTestBox;