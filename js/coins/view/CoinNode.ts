// Copyright 2024, University of Colorado Boulder


/**
 * CoinNode portrays a coin with two faces. It can show one or the other, and also supports cross-fading between the
 * two faces in order to produce a "transposed" look.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Circle, Node, NodeOptions, TPaint } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';

// constants
const DEFAULT_MARGIN_FACTOR = 0.1;

// type for specifying the attributes for one face of the coin
export type CoinFaceParameters = {
  stroke?: TPaint;
  fill?: TPaint;
  content?: Node;

  // These values control how the content is scaled on the coin face.  They are multipliers that are applied to the
  // coin radius to calculate the margin.  If not provided they are calculated automatically.
  minXMarginFactor?: number;
  minYMarginFactor?: number;
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

        // Scale the content to fit on the coin face based on the provided margin information.
        const content = coinFaceParameterSet.content;
        content.setScaleMagnitude( 1 );
        const minXMarginFactor = coinFaceParameterSet.minXMarginFactor === undefined ?
                                 DEFAULT_MARGIN_FACTOR :
                                 coinFaceParameterSet.minXMarginFactor;
        const minYMarginFactor = coinFaceParameterSet.minYMarginFactor === undefined ?
                                 DEFAULT_MARGIN_FACTOR :
                                 coinFaceParameterSet.minYMarginFactor;
        const scale = Math.min(
          2 * radius * ( 1 - minXMarginFactor ) / content.width,
          2 * radius * ( 1 - minYMarginFactor ) / content.height
        );
        content.setScaleMagnitude( scale );
        content.center = Vector2.ZERO;
        coinFace.addChild( content );
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