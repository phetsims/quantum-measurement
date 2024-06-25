// Copyright 2024, University of Colorado Boulder


/**
 * SmallCoinNode portrays the relatively small coins that are used in the "Multiple Coin Measurements" area on the Coins
 * screen. These are distinct from the larger coins shown in the "Single Coin Measurements" section.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Circle, Color, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;
export type SmallCoinNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SmallCoinNode extends Node {

  public readonly radius: number;

  public constructor( radius: number,
                      providedOptions?: SmallCoinNodeOptions ) {

    const coinCircle = new Circle( radius, {
      fill: new Color( '#cccccc' ),
      stroke: new Color( '#888888' ),
      lineWidth: Math.floor( radius / 5 )
    } );

    const options = optionize<SmallCoinNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ coinCircle ]
    }, providedOptions );

    super( options );

    this.radius = radius;
  }
}

quantumMeasurement.register( 'SmallCoinNode', SmallCoinNode );