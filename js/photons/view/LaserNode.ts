// Copyright 2024, University of Colorado Boulder

/**
 * LaserNode represents the laser, which emits photons, in the view.  It allows the user to set the rate at which
 * photons are produced, or to produce them one at a time.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignBox, Color, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import Laser from '../model/Laser.js';

type SelfOptions = EmptySelfOptions;
type LaserNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class LaserNode extends Node {

  public constructor( model: Laser,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: LaserNodeOptions ) {

    // The button on the laser is only used in single-photon mode, but the property for it has to be created and passed
    // in to the node regardless.
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
    const nozzleSize = new Dimension2( 15, 45 );
    const laserPointerNode = new LaserPointerNode( buttonOnProperty, {
      bodySize: laserBodySize,
      nozzleSize: nozzleSize,
      hasButton: model.emissionMode === 'singlePhoton',
      buttonType: 'momentary',
      buttonOptions: {
        radius: 18
      },
      right: modelViewTransform.modelToViewX( model.position.x ),
      centerY: modelViewTransform.modelToViewY( model.position.y ),
      tandem: providedOptions.tandem.createTandem( 'laserPointerNode' )
    } );
    const caption = new Text( QuantumMeasurementStrings.photonSourceStringProperty, {
      font: new PhetFont( 12 ),
      centerX: laserPointerNode.centerX,
      top: laserPointerNode.bottom + 5
    } );

    const nodeChildren: Node[] = [ laserPointerNode, caption ];

    // If the laser is in many-photon mode, we need a slider to control the rate of photon emission.  And a label for
    // the rate.
    if ( model.emissionMode === 'manyPhotons' ) {
      const emissionRateSlider = new HSlider( model.emissionRateProperty, model.emissionRateProperty.range, {
        trackSize: new Dimension2( laserBodySize.width * 0.67, 2 ),
        trackStroke: Color.DARK_GRAY,
        trackFillEnabled: Color.BLACK,
        thumbSize: new Dimension2( laserBodySize.height * 0.25, laserBodySize.height * 0.5 ),
        thumbFill: QuantumMeasurementColors.photonBaseColorProperty,
        thumbFillHighlighted: 'rgb( 0, 200, 0)',
        center: laserPointerNode.bounds.center.plusXY( -nozzleSize.width / 2, 0 ),
        constrainValue: value => Utils.roundSymmetric( value ),
        tandem: providedOptions.tandem.createTandem( 'emissionRateSlider' )
      } );
      nodeChildren.push( emissionRateSlider );

      const label = new Text(
        new PatternStringProperty( QuantumMeasurementStrings.eventsPerSecondPatternStringProperty, {
          value: model.emissionRateProperty
        } ),
        {
          font: new PhetFont( 16 )
        }
      );
      const labelAlignBox = new AlignBox( label, {
        alignBounds: new Bounds2(
          laserPointerNode.bounds.x,
          laserPointerNode.bounds.y - +label.height * 1.5,
          laserPointerNode.bounds.maxX,
          laserPointerNode.bounds.y
        ),
        align: 'center'
      } );
      nodeChildren.push( labelAlignBox );
    }
    const options = optionize<LaserNodeOptions, SelfOptions, NodeOptions>()( {
      children: nodeChildren
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'LaserNode', LaserNode );