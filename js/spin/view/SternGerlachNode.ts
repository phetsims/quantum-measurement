// Copyright 2024, University of Colorado Boulder

/**
 * SternGerlachNode is the visual representation of a Stern Gerlach node in the UI.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, NodeOptions, Path, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
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

    // Component for the entry and exit points of the SG sternGerlach
    const createParticleHole = ( center: Vector2 ) => {
      const path = new Path( new Shape().rect( 0, 0, PARTICLE_HOLE_WIDTH, PARTICLE_HOLE_HEIGHT ),
        {
          fill: new LinearGradient( 0, 0, 0, PARTICLE_HOLE_HEIGHT )
            .addColorStop( 0, 'grey' )
            .addColorStop( 1, 'black' )
        } );
      path.center = modelViewTransform.modelToViewDelta( center );
      return path;
    };

    const curveFunction = ( x: number ) => {
      return Math.pow( x, 2 );
    };

    // Decoration curves that go in the front of the main rectangle
    const curveUpShape = new Shape().moveTo( -STERN_GERLACH_WIDTH / 2, 0 );
    const curveDownShape = new Shape().moveTo( -STERN_GERLACH_WIDTH / 2, 0 );

    for ( let i = 0; i < 1; i += 0.1 ) {
      curveUpShape.lineTo( -STERN_GERLACH_WIDTH / 2 + i * STERN_GERLACH_WIDTH, curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 );
      curveDownShape.lineTo( -STERN_GERLACH_WIDTH / 2 + i * STERN_GERLACH_WIDTH, -curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 );
    }

    const curveUpPath = new Path( curveUpShape, { stroke: '#aff', lineWidth: 4 } );
    const curveDownPath = new Path( curveDownShape, { stroke: '#aff', lineWidth: 4 } );

    const particleEntrance = createParticleHole( sternGerlach.entranceLocalPosition );
    const topParticleExit = createParticleHole( sternGerlach.topExitLocalPosition );
    const bottomParticleExit = createParticleHole( sternGerlach.bottomExitLocalPosition );

    const mainApparatus = new Path( new Shape().rect( -STERN_GERLACH_WIDTH / 2, -STERN_GERLACH_HEIGHT / 2, STERN_GERLACH_WIDTH, STERN_GERLACH_HEIGHT ),
      { fill: 'black' } );

    const experimentLabel = new RichText( new DerivedProperty(
        [
          sternGerlach.isZOrientedProperty,
          QuantumMeasurementStrings.SGSubZStringProperty,
          QuantumMeasurementStrings.SGSubXStringProperty
        ],
        ( isZOriented, SGSubZ, SGSubX ) => isZOriented ? SGSubZ : SGSubX ),
      { font: new PhetFont( 18 ), fill: 'white', center: new Vector2( -STERN_GERLACH_WIDTH / 2 + 25, -STERN_GERLACH_HEIGHT / 2 + 70 ) } );

    const sternGerlachControls = new VBox( {
      align: 'left',
      spacing: 10,
      tandem: options.tandem.createTandem( 'sternGerlachControls' )
    } );

    const radioButtonTextOptions: RichTextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black'
    };
    // Create and add the radio buttons that select the chart type view in the nuclideChartAccordionBox.
    const orientationRadioButtonGroupTandem = options.tandem.createTandem( 'orientationRadioButtonGroup' );
    const orientationRadioButtonGroup = new RectangularRadioButtonGroup<boolean>(
      sternGerlach.isZOrientedProperty, [
        {
          value: true, createNode: () => new RichText(
            QuantumMeasurementStrings.SGSubZStringProperty, radioButtonTextOptions
          ), tandemName: 'isZOrientedRadioButton'
        },
        {
          value: false, createNode: () => new RichText(
            QuantumMeasurementStrings.SGSubZStringProperty, radioButtonTextOptions
          ), tandemName: 'isXOrientedRadioButton'
        }
      ], {
        orientation: 'horizontal',
        tandem: orientationRadioButtonGroupTandem,
        phetioFeatured: true,
        radioButtonOptions: {
          baseColor: QuantumMeasurementColors.controlPanelFillColorProperty,
          phetioVisiblePropertyInstrumented: false
        },
        visibleProperty: new GatedVisibleProperty( sternGerlach.isDirectionControllableProperty, orientationRadioButtonGroupTandem )
      } );
    sternGerlachControls.addChild( orientationRadioButtonGroup );

    if ( options.isBlockable ) {
      const blockingRadioButtonGroupTandem = options.tandem.createTandem( 'blockingRadioButtonGroup' );
      const blockingRadioButtonGroup = new AquaRadioButtonGroup( sternGerlach.blockingModeProperty, [ BlockingMode.BLOCK_UP, BlockingMode.BLOCK_DOWN ].map( blockingMode => {
        return {
          value: blockingMode,
          createNode: () => new Text(
            blockingMode === BlockingMode.BLOCK_UP ?
            QuantumMeasurementStrings.blockUpStringProperty :
            QuantumMeasurementStrings.blockDownStringProperty,
            { font: new PhetFont( 15 ) } ),
          tandemName: `${blockingMode.tandemName}RadioButton`,
          phetioVisiblePropertyInstrumented: false
        };
      } ), {
        spacing: 10,
        tandem: blockingRadioButtonGroupTandem,
        phetioFeatured: true,
        visibleProperty: new GatedVisibleProperty(
          DerivedProperty.valueNotEqualsConstant( sternGerlach.blockingModeProperty, BlockingMode.NO_BLOCKER ),
          blockingRadioButtonGroupTandem
        )
      } );
      sternGerlachControls.addChild( blockingRadioButtonGroup );
    }

    const mainApparatusNode = new Node( {
      children: [
        // Main body of the SG sternGerlach
        mainApparatus,

        // Curved paths for the particle to follow
        curveUpPath,
        curveDownPath,

        // Particle entry point
        particleEntrance,

        // Particle exit points
        topParticleExit,
        bottomParticleExit,

        // Text for the experiment name
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