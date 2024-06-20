// Copyright 2024, University of Colorado Boulder


/**
 * CoinNode portrays a coin with two faces.  It can show one or the other, and also supports cross-fading between the
 * two faces in order to produce a "transposed" look.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Circle, Node, NodeOptions, TPaint } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// type for specifying the attributes for one face of the coin
export type CoinFaceParameters = {
  stroke?: TPaint;
  fill?: TPaint;
  content?: Node;
};

type SelfOptions = EmptySelfOptions;
export type CoinNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class CoinNode extends Node {

  public constructor( radius: number,
                      crossFadeProperty: TReadOnlyProperty<number>,
                      coinFaceParameters: CoinFaceParameters[],
                      providedOptions?: CoinNodeOptions ) {

    const options = optionize<CoinNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    // parameter checking
    assert && assert( coinFaceParameters.length === 2, 'there should be exactly two sets of coin face parameters' );

    super( options );

    // Create the nodes that represent each of the two faces.
    const coinFaceNodes: Node[] = [];
    coinFaceParameters.forEach( coinFaceParameterSet => {
      const coinFace = new Circle( radius, {
        stroke: coinFaceParameterSet.stroke,
        lineWidth: Math.floor( radius / 6 ),
        fill: coinFaceParameterSet.fill
      } );
      if ( coinFaceParameterSet.content ) {
        const content = coinFaceParameterSet.content;
        const scale = Math.min(
          Math.min( 2 * radius / content.width, 1 ),
          Math.min( 2 * radius / content.height, 1 )
        );
        content.setScaleMagnitude( scale );
        content.center = Vector2.ZERO;
        coinFace.addChild( coinFaceParameterSet.content );
      }
      this.addChild( coinFace );
      coinFaceNodes.push( coinFace );
    } );

    // Update the visibility of the coin faces.
    crossFadeProperty.link( crossFade => {
      coinFaceNodes[ 0 ].opacity = crossFade;
      coinFaceNodes[ 1 ].opacity = 1 - crossFade;
    } );
  }
}

quantumMeasurement.register( 'CoinNode', CoinNode );