// Copyright 2024-2025, University of Colorado Boulder

/**
 * SternGerlachNode is the visual representation of a Stern Gerlach node in the UI.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { BlockingMode } from '../model/BlockingMode.js';
import SternGerlach from '../model/SternGerlach.js';

type SelfOptions = {
  isBlockable?: boolean;
};

type SternGerlachNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SternGerlachNode extends Node {

  public constructor(
    sternGerlach: SternGerlach,
    modelViewTransform: ModelViewTransform2,
    providedOptions: SternGerlachNodeOptions
  ) {

    const options = optionize<SternGerlachNodeOptions, SelfOptions, NodeOptions>()( {
      isBlockable: false
    }, providedOptions );

    // Transformed constants
    const STERN_GERLACH_WIDTH = modelViewTransform.modelToViewDeltaX( SternGerlach.STERN_GERLACH_WIDTH );
    const STERN_GERLACH_HEIGHT = modelViewTransform.modelToViewDeltaY( -SternGerlach.STERN_GERLACH_HEIGHT ); // Minus because of inverted Y
    const PARTICLE_HOLE_WIDTH = modelViewTransform.modelToViewDeltaX( SternGerlach.PARTICLE_HOLE_WIDTH );
    const PARTICLE_HOLE_HEIGHT = modelViewTransform.modelToViewDeltaY( -SternGerlach.PARTICLE_HOLE_HEIGHT ); // Minus because of inverted Y

    // component for the entry and exit points of the SG sternGerlach
    const createParticleHole = ( center: Vector2 ) => {
      const path = new Rectangle( 0, 0, PARTICLE_HOLE_WIDTH, PARTICLE_HOLE_HEIGHT,
        {
          fill: new LinearGradient( 0, 0, 0, PARTICLE_HOLE_HEIGHT )
            .addColorStop( 0, 'gray' )
            .addColorStop( 1, 'black' )
        } );
      path.center = modelViewTransform.modelToViewDelta( center );
      return path;
    };

    const curveFunction = ( x: number ) => {
      return Math.pow( x, 2 );
    };

    // decoration curves that go in the front of the main rectangle
    const curveUpShape = new Shape().moveTo( -STERN_GERLACH_WIDTH / 2, 0 );
    const curveDownShape = new Shape().moveTo( -STERN_GERLACH_WIDTH / 2, 0 );

    for ( let i = 0; i < 1; i += 0.1 ) {
      curveUpShape.lineTo( -STERN_GERLACH_WIDTH / 2 + i * STERN_GERLACH_WIDTH, curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 );
      curveDownShape.lineTo( -STERN_GERLACH_WIDTH / 2 + i * STERN_GERLACH_WIDTH, -curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 );
    }

    const curveUpPath = new Path( curveUpShape, { stroke: QuantumMeasurementColors.sternGerlachCurveStrokeProperty, lineWidth: 4 } );
    const curveDownPath = new Path( curveDownShape, { stroke: QuantumMeasurementColors.sternGerlachCurveStrokeProperty, lineWidth: 4 } );

    const particleEntrance = createParticleHole( SternGerlach.ENTRANCE_LOCAL_POSITION );
    const topParticleExit = createParticleHole( SternGerlach.TOP_EXIT_LOCAL_POSITION );
    const bottomParticleExit = createParticleHole( SternGerlach.BOTTOM_EXIT_LOCAL_POSITION );

    const mainApparatus = new Rectangle( -STERN_GERLACH_WIDTH / 2, -STERN_GERLACH_HEIGHT / 2, STERN_GERLACH_WIDTH, STERN_GERLACH_HEIGHT,
      { fill: 'black' } );

    const experimentLabel = new RichText( new DerivedProperty(
        [
          sternGerlach.isZOrientedProperty
        ],
        isZOriented => isZOriented ? 'SG<sub>Z</sub>' : 'SG<sub>X</sub>' ),
      { font: QuantumMeasurementConstants.TITLE_FONT, fill: 'white', center: new Vector2( -STERN_GERLACH_WIDTH / 2 + 25, -STERN_GERLACH_HEIGHT / 2 + 70 ) } );

    const sternGerlachControls = new VBox( {
      align: 'left',
      spacing: 10,
      tandem: options.tandem.createTandem( 'sternGerlachControls' )
    } );

    const radioButtonTextOptions: RichTextOptions = {
      font: QuantumMeasurementConstants.TITLE_FONT,
      fill: 'black'
    };

    // Create and add the radio buttons that select the chart type view in the nuclideChartAccordionBox.
    const orientationRadioButtonGroupTandem = options.tandem.createTandem( 'orientationRadioButtonGroup' );
    const orientationRadioButtonGroup = new RectangularRadioButtonGroup<boolean>(
      sternGerlach.isZOrientedProperty, [
        {
          value: true, createNode: () => new RichText(
            'SG<sub>Z</sub>', radioButtonTextOptions
          ), tandemName: 'isZOrientedRadioButton'
        },
        {
          value: false, createNode: () => new RichText(
            'SG<sub>X</sub>', radioButtonTextOptions
          ), tandemName: 'isXOrientedRadioButton'
        }
      ], {
        orientation: 'horizontal',
        tandem: orientationRadioButtonGroupTandem,
        phetioFeatured: true,
        radioButtonOptions: {
          baseColor: QuantumMeasurementColors.controlPanelFillProperty,
          phetioVisiblePropertyInstrumented: false
        },
        visibleProperty: new GatedVisibleProperty( sternGerlach.isDirectionControllableProperty, orientationRadioButtonGroupTandem )
      }
    );
    sternGerlachControls.addChild( orientationRadioButtonGroup );

    if ( options.isBlockable ) {
      const blockingRadioButtonGroupTandem = options.tandem.createTandem( 'blockingRadioButtonGroup' );
      const blockingRadioButtonGroup = new AquaRadioButtonGroup(
        sternGerlach.blockingModeProperty,
        [ BlockingMode.BLOCK_UP, BlockingMode.BLOCK_DOWN ].map( blockingMode => {
          return {
            value: blockingMode,
            createNode: () => new Text(
              blockingMode === BlockingMode.BLOCK_UP ?
              QuantumMeasurementStrings.blockUpStringProperty :
              QuantumMeasurementStrings.blockDownStringProperty,
              { font: QuantumMeasurementConstants.CONTROL_FONT, maxWidth: 150 } ),
            tandemName: `${blockingMode.tandemName}RadioButton`,
            phetioVisiblePropertyInstrumented: false
          };
        } ),
        {
          spacing: 10,
          tandem: blockingRadioButtonGroupTandem,
          phetioFeatured: true,
          visibleProperty: new GatedVisibleProperty(
            DerivedProperty.valueNotEqualsConstant( sternGerlach.blockingModeProperty, BlockingMode.NO_BLOCKER ),
            blockingRadioButtonGroupTandem
          )
        }
      );
      sternGerlachControls.addChild( blockingRadioButtonGroup );
    }

    const mainApparatusNode = new Node( {
      children: [

        // main body of the SG sternGerlach
        mainApparatus,

        // curved paths for the particle to follow
        curveUpPath,
        curveDownPath,

        // particle entry point
        particleEntrance,

        // particle exit points
        topParticleExit,
        bottomParticleExit,

        // text for the experiment name
        experimentLabel
      ]
    } );

    super( {
      tandem: options.tandem,
      visibleProperty: sternGerlach.isVisibleProperty,
      children: [
        mainApparatusNode,
        sternGerlachControls
      ]
    } );

    this.addLinkedElement( sternGerlach );

    Multilink.multilink(
      [ sternGerlach.positionProperty, sternGerlach.isDirectionControllableProperty, sternGerlach.blockingModeProperty ],
      position => {
        mainApparatusNode.center = modelViewTransform.modelToViewPosition( position );
        sternGerlachControls.left = mainApparatusNode.left;
        sternGerlachControls.top = mainApparatusNode.bottom + 10;
      }
    );
  }
}

quantumMeasurement.register( 'SternGerlachNode', SternGerlachNode );