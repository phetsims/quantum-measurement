// Copyright 2024, University of Colorado Boulder

/**
 * PhotonEmitterNode represents the photon emitter in the view.  It allows the user to set the rate at which photons are
 * produced, or to produce them one at a time.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Color, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonEmitter from '../model/PhotonEmitter.js';

type SelfOptions = EmptySelfOptions;
type PhotonEmitterNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class PhotonEmitterNode extends Node {

  public constructor( model: PhotonEmitter,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PhotonEmitterNodeOptions ) {

    const testRect = new Rectangle( 0, 0, 50, 30, {
      fill: Color.LIGHT_GRAY,
      stroke: Color.DARK_GRAY
    } );

    const options = optionize<PhotonEmitterNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ testRect ],
      left: modelViewTransform.modelToViewX( model.position.x ),
      centerY: modelViewTransform.modelToViewY( model.position.y )
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonEmitterNode', PhotonEmitterNode );