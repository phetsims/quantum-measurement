// Copyright 2024, University of Colorado Boulder

/**
 * MirrorNode is a view element that represents a mirror viewed from the side that reflects photons.  It is basically
 * just a simple line.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../../dot/js/Vector2.js';
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

    // Define an offset for positioning the mirror.  This is needed because the photons reflect based on their center
    // positions, and if the mirror isn't offset a bit, the photons can appear to go partially through the mirror.
    // The value is in screen coordinates and is empirically determined.  This only works for a mirror that is oriented
    // the way this one is, and isn't a general solution.
    const mirrorPositionOffset = new Vector2( 2, -2 );

    const mirrorLine = new Line(
      modelViewTransform.modelToViewPosition( model.mirrorSurfaceLine.start ).plus( mirrorPositionOffset ),
      modelViewTransform.modelToViewPosition( model.mirrorSurfaceLine.end ).plus( mirrorPositionOffset ),
      {
        stroke: Color.LIGHT_GRAY,
        lineWidth: 5
      }
    );

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