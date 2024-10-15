// Copyright 2024, University of Colorado Boulder

/**
 * PhotonEmitterNode represents the photon emitter in the view.  It allows the user to set the rate at which photons are
 * produced, or to produce them one at a time.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonEmitter from '../model/PhotonEmitter.js';

type SelfOptions = EmptySelfOptions;
type PhotonEmitterNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class PhotonEmitterNode extends Node {

  public constructor( model: PhotonEmitter,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PhotonEmitterNodeOptions ) {

    const photonSourceNode = new LaserPointerNode( model.photonProductionEnabledProperty, {
      bodySize: new Dimension2( 95, 55 ),
      nozzleSize: new Dimension2( 15, 45 ),
      buttonRadius: 18
    } );

    const options = optionize<PhotonEmitterNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ photonSourceNode ],
      right: modelViewTransform.modelToViewX( model.position.x ),
      centerY: modelViewTransform.modelToViewY( model.position.y )
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonEmitterNode', PhotonEmitterNode );