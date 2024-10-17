// Copyright 2024, University of Colorado Boulder

/**
 * LaserNode represents the laser, which emits photons, in the view.  It allows the user to set the rate at which
 * photons are produced, or to produce them one at a time.
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
import Laser from '../model/Laser.js';

type SelfOptions = EmptySelfOptions;
type LaserNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class LaserNode extends Node {

  public constructor( model: Laser,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: LaserNodeOptions ) {

    const laserPointerNode = new LaserPointerNode( model.photonProductionEnabledProperty, {
      bodySize: new Dimension2( 95, 55 ),
      nozzleSize: new Dimension2( 15, 45 ),
      buttonRadius: 18,
      tandem: providedOptions.tandem.createTandem( 'laserPointerNode' )
    } );

    const options = optionize<LaserNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ laserPointerNode ],
      right: modelViewTransform.modelToViewX( model.position.x ),
      centerY: modelViewTransform.modelToViewY( model.position.y )
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'LaserNode', LaserNode );