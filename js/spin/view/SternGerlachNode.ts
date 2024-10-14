// Copyright 2024, University of Colorado Boulder

/**
 * SternGerlachNode is the visual representation of a Stern Gerlach node in the UI.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Path, RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SternGerlachModel from '../model/SternGerlachModel.js';

export default class SternGerlachNode extends Node {

  public constructor( experimentModel: SternGerlachModel, tandem: Tandem ) {
    super( {
      tandem: tandem,
      children: [
        new Path( new Shape().rect( 0, 0, 150, 100 ),
          { fill: 'black', visibleProperty: experimentModel.isVisibleProperty } ),
        new RichText( new DerivedProperty(
            [ experimentModel.isZOrientedProperty ],
            ( isZOriented: boolean ) => isZOriented ? 'SG<sub>Z' : 'SG<sub>X' ),
          { font: new PhetFont( 16 ), fill: 'white', center: new Vector2( 25, 80 ) } )
      ]
    } );
  }
}

quantumMeasurement.register( 'SternGerlachNode', SternGerlachNode );