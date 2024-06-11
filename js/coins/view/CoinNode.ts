// Copyright 2024, University of Colorado Boulder


/**
 * CoinNode portrays a single coin in the view, allowing users to see its orientation, e.g. heads up or tails up.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Circle, Color, Node, NodeOptions, TPaint } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// type for specifying the attributes for one face of the coin
export type CoinFaceOptions = {
  stroke?: TPaint;
  fill?: TPaint;
  content?: Node;
};

type SelfOptions = {
  faceOptionsMap?: Map<string, CoinFaceOptions>;
};
export type CoinNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

const DEFAULT_FILL = new Color( '#EFE4B0' );
const DEFAULT_STROKE = Color.BLACK;

export default class CoinNode<T extends string> extends Node {

  public constructor( coinState: TReadOnlyProperty<T>, radius: number, providedOptions?: CoinNodeOptions ) {

    const options = optionize<CoinNodeOptions, SelfOptions, NodeOptions>()( {
      faceOptionsMap: new Map<string, CoinFaceOptions>()
    }, providedOptions );

    super( options );

    // Add the main outline.
    const outline = new Circle( radius, {
      stroke: Color.BLACK,
      lineWidth: Math.floor( radius / 6 ),
      fill: new Color( '#EFE4B0' )
    } );
    this.addChild( outline );

    // Track any content that is currently being shown on the face of the coin.
    let contentNode: Node | null = null;

    // Update the appearance as the state changes.
    coinState.link( state => {

      // Remove previous content node if present.
      if ( contentNode ) {
        this.removeChild( contentNode );
        contentNode = null;
      }

      // Set up the appearance of the coin face based on the new state.
      const faceOptions = options.faceOptionsMap.get( state );
      if ( faceOptions ) {
        outline.fill = faceOptions.fill || DEFAULT_FILL;
        outline.stroke = faceOptions.stroke || DEFAULT_STROKE;
        if ( faceOptions.content ) {

          contentNode = faceOptions.content;

          // Scale the content to fit on the coin.  Note that this only scales down, not up.  Also, it is scaling based
          // on rectangular bounds to fit in a circular area, so this might not work in all cases.  If possible, it's
          // best to make sure the content node fits in the specified radius.
          const scale = Math.min(
            Math.min( 2 * radius / contentNode.width, 1 ),
            Math.min( 2 * radius / contentNode.height, 1 )
          );
          contentNode.setScaleMagnitude( scale );
          contentNode.centerX = 0;
          contentNode.centerY = 0;
          this.addChild( contentNode );
        }
      }
    } );
  }
}

quantumMeasurement.register( 'CoinNode', CoinNode );