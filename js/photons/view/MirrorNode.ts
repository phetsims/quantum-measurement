// Copyright 2024, University of Colorado Boulder

/**
 * MirrorNode is a view element that represents a mirror viewed from the side that reflects photons.  It is basically
 * just a simple line.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import Mirror from '../model/Mirror.js';

type SelfOptions = EmptySelfOptions;
type MirrorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class MirrorNode extends Node {

  public constructor( model: Mirror,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: MirrorNodeOptions ) {

    const mirrorLine = new Line(
      modelViewTransform.modelToViewPosition( model.mirrorSurfaceLine.start ),
      modelViewTransform.modelToViewPosition( model.mirrorSurfaceLine.end ), {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 5
    } );

    const label = new Text( QuantumMeasurementStrings.mirrorStringProperty, {
      font: new PhetFont( 12 ),
      left: mirrorLine.centerX + 2,
      bottom: mirrorLine.centerY
    } );

    const options = optionize<MirrorNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ mirrorLine, label ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'MirrorNode', MirrorNode );