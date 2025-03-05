// Copyright 2024-2025, University of Colorado Boulder

/**
 * LaserNode represents the laser, which emits photons, in the view. It allows the user to set the rate at which
 * photons are produced, or to produce them one at a time.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LaserPointerNode from '../../../../scenery-phet/js/LaserPointerNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import ExperimentModeValues from '../model/ExperimentModeValues.js';
import Laser from '../model/Laser.js';

type SelfOptions = EmptySelfOptions;
type LaserNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// constants
const LASER_BODY_SIZE = new Dimension2( 95, 55 );
const NOZZLE_SIZE = new Dimension2( 15, 45 );

export default class LaserNode extends Node {

  public constructor( model: Laser,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: LaserNodeOptions ) {

    // Create the control for emitting photons.  For single-photon mode, this is a button.  For many-photon mode, it's
    // a slider.
    const laserPointerNodeChildren: Node[] = [];
    if ( model.emissionMode === ExperimentModeValues.SINGLE_PHOTON ) {
      laserPointerNodeChildren.push( new RoundPushButton( {
        baseColor: 'red',
        radius: 18,
        fireOnDown: true,
        listener: () => model.emitAPhoton(),
        centerX: -( NOZZLE_SIZE.width + LASER_BODY_SIZE.width / 2 ),
        touchAreaDilation: 15,
        tandem: providedOptions.tandem.createTandem( 'emitPhotonButton' ),
        accessibleName: QuantumMeasurementStrings.a11y.translatable.photonsScreen.emitPhotonButtonStringProperty
      } ) );
    }
    else {
      const sliderStep = 10;
      const emissionRateSlider = new HSlider( model.emissionRateProperty, model.emissionRateProperty.range, {
        trackSize: new Dimension2( LASER_BODY_SIZE.width * 0.67, 2 ),
        trackStroke: Color.DARK_GRAY,
        trackFillEnabled: Color.BLACK,
        thumbSize: new Dimension2( LASER_BODY_SIZE.height * 0.25, LASER_BODY_SIZE.height * 0.5 ),
        thumbFill: QuantumMeasurementColors.photonBaseColorProperty,
        thumbFillHighlighted: 'rgb( 0, 200, 0)',
        centerX: -( NOZZLE_SIZE.width + LASER_BODY_SIZE.width / 2 ),
        tandem: providedOptions.tandem.createTandem( 'emissionRateSlider' ),
        constrainValue: value => roundToInterval( value, sliderStep ),
        keyboardStep: sliderStep,
        shiftKeyboardStep: sliderStep / 10,
        pageKeyboardStep: sliderStep * 5,
        valueChangeSoundGeneratorOptions: {
          interThresholdDelta: sliderStep
        }
      } );
      laserPointerNodeChildren.push( emissionRateSlider );
    }

    // Create the laser pointer node.
    const dummyProperty = new BooleanProperty( false ); // required by LaserPointerNode
    const laserPointerNode = new LaserPointerNode( dummyProperty, {
      bodySize: LASER_BODY_SIZE,
      nozzleSize: NOZZLE_SIZE,
      hasButton: false, // Due to this sim's specific needs we have to supply our own button.
      children: laserPointerNodeChildren,
      right: modelViewTransform.modelToViewX( model.position.x ) + NOZZLE_SIZE.width,
      centerY: modelViewTransform.modelToViewY( model.position.y ),
      phetioVisiblePropertyInstrumented: false,
      tandem: providedOptions.tandem.createTandem( 'laserPointerNode' )
    } );
    const caption = new Text( QuantumMeasurementStrings.photonSourceStringProperty, {
      font: new PhetFont( 12 ),
      centerX: laserPointerNode.centerX,
      top: laserPointerNode.bottom + 5,
      maxWidth: 150
    } );
    QuantumMeasurementStrings.photonSourceStringProperty.link( () => {
      caption.centerX = laserPointerNode.centerX;
    } );

    const nodeChildren: Node[] = [ laserPointerNode, caption ];

    // If the laser is in many-photon mode, we need a label that will show the number of photons emitted per second.
    if ( model.emissionMode === ExperimentModeValues.MANY_PHOTONS ) {
      const emissionRateLabel = new Text(
        new PatternStringProperty( QuantumMeasurementStrings.eventsPerSecondPatternStringProperty, {
          value: model.emissionRateProperty
        } ),
        {
          font: new PhetFont( 16 ),
          maxWidth: 100
        }
      );
      const labelAlignBox = new AlignBox( emissionRateLabel, {
        alignBounds: new Bounds2(
          laserPointerNode.bounds.x,
          laserPointerNode.bounds.y - emissionRateLabel.height * 1.5,
          laserPointerNode.bounds.maxX,
          laserPointerNode.bounds.y
        ),
        align: 'center'
      } );
      nodeChildren.push( labelAlignBox );
    }
    const options = optionize<LaserNodeOptions, SelfOptions, NodeOptions>()( {
      children: nodeChildren,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    this.addLinkedElement( model );
  }
}

quantumMeasurement.register( 'LaserNode', LaserNode );