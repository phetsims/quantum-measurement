// Copyright 2024, University of Colorado Boulder

/**
 * LaserNode represents the laser, which emits photons, in the view.  It allows the user to set the rate at which
 * photons are produced, or to produce them one at a time.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import { Color, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Laser from '../model/Laser.js';

type SelfOptions = EmptySelfOptions;
type LaserNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class LaserNode extends Node {

  public constructor( model: Laser,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: LaserNodeOptions ) {

    // The button on the laser is only used in single-photon mode, but it has to be created and passed in to the node
    // regardless of the mode.
    const buttonOnProperty = new BooleanProperty( false );
    if ( model.emissionMode === 'singlePhoton' ) {
      buttonOnProperty.link( buttonOn => {
        if ( buttonOn ) {
          model.emitAPhoton();
        }
      } );
    }

    // Create the laser pointer node using a common code component.
    const laserBodySize = new Dimension2( 95, 55 );
    const laserPointerNode = new LaserPointerNode( buttonOnProperty, {
      bodySize: laserBodySize,
      nozzleSize: new Dimension2( 15, 45 ),
      hasButton: model.emissionMode === 'singlePhoton',
      buttonRadius: 18,
      buttonType: 'momentary',
      tandem: providedOptions.tandem.createTandem( 'laserPointerNode' )
    } );

    const nodeChildren: Node[] = [ laserPointerNode ];

    // If the laser is in many-photon mode, we need a slider to control the rate of photon emission.
    if ( model.emissionMode === 'manyPhotons' ) {
      const emissionRateSlider = new HSlider( model.emissionRateProperty, model.emissionRateProperty.range, {
        trackSize: new Dimension2( laserBodySize.width * 0.67, 2 ),
        trackStroke: Color.DARK_GRAY,
        trackFillEnabled: Color.BLACK,
        thumbSize: new Dimension2( laserBodySize.height * 0.25, laserBodySize.height * 0.5 ),
        thumbFill: 'rgb( 0, 255, 0)',
        thumbFillHighlighted: 'rgb( 0, 200, 0)',
        centerX: laserPointerNode.left + laserBodySize.width / 2,
        tandem: providedOptions.tandem.createTandem( 'emissionRateSlider' )
      } );
      nodeChildren.push( emissionRateSlider );
    }

    const options = optionize<LaserNodeOptions, SelfOptions, NodeOptions>()( {
      children: nodeChildren,
      right: modelViewTransform.modelToViewX( model.position.x ),
      centerY: modelViewTransform.modelToViewY( model.position.y )
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'LaserNode', LaserNode );