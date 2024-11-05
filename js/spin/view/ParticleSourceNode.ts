// Copyright 2024, University of Colorado Boulder

/**
 * ParticleSourceNode contains the UI elements of the particle source, including the particle-shooter,
 * and other UI elements to control the source mode between 'single particle' and 'continuous' ray.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, LinearGradient, Node, Path, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import RoundMomentaryButton from '../../../../sun/js/buttons/RoundMomentaryButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import ParticleSourceModel from '../model/ParticleSourceModel.js';
import { SourceMode } from '../model/SourceMode.js';
import HBarFractionNode from './HBarFractionNode.js';

const SPACING = 10;

export default class ParticleSourceNode extends Node {

  public constructor(
    particleSourceModel: ParticleSourceModel,
    modelViewTransform: ModelViewTransform2,
    tandem: Tandem ) {

    // Constants
    const PARTICLE_SOURCE_WIDTH = modelViewTransform.modelToViewDeltaX( ParticleSourceModel.PARTICLE_SOURCE_WIDTH );
    const PARTICLE_SOURCE_HEIGHT = modelViewTransform.modelToViewDeltaY( -ParticleSourceModel.PARTICLE_SOURCE_HEIGHT ); // Minus because of inverted Y
    const PARTICLE_SOURCE_CORNER_RADIUS = modelViewTransform.modelToViewDeltaX( ParticleSourceModel.PARTICLE_SOURCE_CORNER_RADIUS );

    // Main shape of the component
    const particleSourceRectangle = new Path( new Shape()
        .roundRect( 0, 0, PARTICLE_SOURCE_WIDTH, PARTICLE_SOURCE_HEIGHT, PARTICLE_SOURCE_CORNER_RADIUS, PARTICLE_SOURCE_CORNER_RADIUS ),
      {
        stroke: 'black',
        lineWidth: 0.5,
        fill: new LinearGradient( 0, 0, 0, 100 )
          .addColorStop( 0, '#88f' )
          .addColorStop( 0.2, 'white' )
          .addColorStop( 1, 'blue' )
      } );

    const particleSourceBarrelWidth = PARTICLE_SOURCE_WIDTH / 5;
    const particleSourceBarrel = new Path( new Shape()
      .roundRect( PARTICLE_SOURCE_WIDTH - particleSourceBarrelWidth / 2,
        PARTICLE_SOURCE_HEIGHT / 2 - particleSourceBarrelWidth / 2, particleSourceBarrelWidth, particleSourceBarrelWidth, 4, 4 ),
      {
        stroke: 'black',
        lineWidth: 0.5,
        fill: new LinearGradient( 0, 0, 0, PARTICLE_SOURCE_WIDTH / 10 )
          .addColorStop( 0, '#88f' )
          .addColorStop( 0.2, 'white' )
          .addColorStop( 1, 'blue' )
      } );
    particleSourceBarrel.rotateAround( particleSourceBarrel.center, Math.PI / 4 );
    particleSourceBarrel.center.y = particleSourceRectangle.center.y;

    // Button for 'single' mode
    const shootParticleButton = new RoundMomentaryButton<boolean>(
      particleSourceModel.currentlyShootingParticlesProperty, false, true, {
        scale: 0.7,
        baseColor: QuantumMeasurementColors.downColorProperty,
        visibleProperty: new DerivedProperty( [ particleSourceModel.sourceModeProperty ], sourceMode => sourceMode === SourceMode.SINGLE ),
        center: particleSourceRectangle.center,
        tandem: tandem.createTandem( 'shootParticleButton' )
      } );

    // Slider for 'continuous' mode
    const sliderRange = particleSourceModel.particleAmmountProperty.range;
    const particleAmmountSlider = new HSlider( particleSourceModel.particleAmmountProperty, sliderRange, {
      thumbFill: QuantumMeasurementColors.downColorProperty,
      visibleProperty: new DerivedProperty( [ particleSourceModel.sourceModeProperty ], sourceMode => sourceMode === SourceMode.CONTINUOUS ),
      center: particleSourceRectangle.center,
      trackSize: new Dimension2( PARTICLE_SOURCE_WIDTH * 0.7, 1 ),
      tandem: tandem.createTandem( 'particleAmmountSlider' ),
      majorTickLength: 15
    } );

    // major ticks at 0%, 33%, 66%, 100%
    const tickLabelOptions = { font: new PhetFont( 12 ) };
    particleAmmountSlider.addMajorTick( sliderRange.min, new Text( 'None', tickLabelOptions ) );
    particleAmmountSlider.addMajorTick( sliderRange.max, new Text( 'Lots', tickLabelOptions ) );
    particleAmmountSlider.addMajorTick( sliderRange.min + ( sliderRange.max - sliderRange.min ) / 3 );
    particleAmmountSlider.addMajorTick( sliderRange.min + 2 * ( sliderRange.max - sliderRange.min ) / 3 );

    const particleSourceApparatus = new Node( {
        children: [
          particleSourceBarrel,
          particleSourceRectangle,
          shootParticleButton,
          particleAmmountSlider
        ]
      } );

    particleSourceApparatus.center = modelViewTransform.modelToViewPosition( particleSourceModel.positionProperty.value );

    super( {
      tandem: tandem.createTandem( 'particleSourceNode' ),
      children: [
        new HBox( {
          bottom: particleSourceApparatus.top - SPACING,
          left: particleSourceApparatus.left,
          spacing: SPACING,
          children: [
            new HBarFractionNode( 20 ),
            new RichText( QuantumMeasurementStrings.SpinSourceStringProperty, { font: new PhetFont( 20 ) } )
          ]
        } ),
        particleSourceApparatus,
        new VBox( {
          top: particleSourceApparatus.bottom + SPACING,
          left: particleSourceApparatus.left,
          spacing: SPACING,
          children: [
            new RichText( QuantumMeasurementStrings.SourceModeStringProperty, { font: new PhetFont( { size: 20, weight: 'bold' } ) } ),
            new AquaRadioButtonGroup( particleSourceModel.sourceModeProperty, SourceMode.enumeration.values.map( sourceMode => {
              return {
                value: sourceMode,
                createNode: () => new Text( sourceMode.sourceName, { font: new PhetFont( 15 ) } ),
                options: {
                  accessibleName: sourceMode.sourceName
                },
                tandemName: `${sourceMode.tandemName}RadioButton`
              };
            } ), {
              tandem: tandem.createTandem( 'sourceModeRadioButtonGroup' ),
              spacing: SPACING
            } )
          ]
        } )
      ]
    } );
  }
}

quantumMeasurement.register( 'ParticleSourceNode', ParticleSourceNode );