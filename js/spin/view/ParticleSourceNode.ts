// Copyright 2024, University of Colorado Boulder

/**
 * ParticleSourceNode contains the UI elements around the particle source, including the particle-shooting apparatus,
 * and other UI elements to control the source mode.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, Path, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import RoundMomentaryButton from '../../../../sun/js/buttons/RoundMomentaryButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SpinModel, { SourceMode } from '../model/SpinModel.js';

// Constants
const PARTICLE_SOURCE_WIDTH = 100;
const PARTICLE_SOURCE_HEIGHT = 100;
const PARTICLE_SOURCE_CORNER_RADIUS = 10;

export default class ParticleSourceNode extends VBox {

  public constructor( model: SpinModel, tandem: Tandem ) {

    const particleSourceView = new Path( new Shape().roundRect( 0, 0, PARTICLE_SOURCE_WIDTH, PARTICLE_SOURCE_HEIGHT, PARTICLE_SOURCE_CORNER_RADIUS, PARTICLE_SOURCE_CORNER_RADIUS ),
      {
        fill: new LinearGradient( 0, 0, 0, 100 )
          .addColorStop( 0, '#88f' )
          .addColorStop( 0.2, 'white' )
          .addColorStop( 1, 'blue' )
      } );

    const shootParticleButton = new RoundMomentaryButton<boolean>(
      model.currentlyShootingParticlesProperty, false, true, {
        scale: 0.7,
        baseColor: QuantumMeasurementColors.downColorProperty,
        visibleProperty: new DerivedProperty( [ model.sourceModeProperty ], sourceMode => sourceMode === SourceMode.SINGLE ),
        center: particleSourceView.center,
        tandem: tandem.createTandem( 'shootParticleButton' )
      } );

    const sliderRange = model.particleAmmountProperty.range;
    const particleAmmountSlider = new HSlider( model.particleAmmountProperty, sliderRange, {
      thumbFill: QuantumMeasurementColors.downColorProperty,
      visibleProperty: new DerivedProperty( [ model.sourceModeProperty ], sourceMode => sourceMode === SourceMode.CONTINUOUS ),
      center: particleSourceView.center,
      trackSize: new Dimension2( PARTICLE_SOURCE_WIDTH * 0.7, 1 ),
      tandem: tandem.createTandem( 'particleAmmountSlider' ),
      majorTickLength: 15
    } );

    // major ticks
    const tickLabelOptions = { font: new PhetFont( 12 ) };
    particleAmmountSlider.addMajorTick( sliderRange.min, new Text( 'None', tickLabelOptions ) );
    particleAmmountSlider.addMajorTick( sliderRange.getCenter() );
    particleAmmountSlider.addMajorTick( sliderRange.max, new Text( 'Lots', tickLabelOptions ) );

    super( {
      tandem: tandem.createTandem( 'particleSourceNode' ),
      spacing: 20,
      children: [
        new RichText( 'Spin ℏ/2 Source', { font: new PhetFont( 20 ) } ),
        new Node( {
          children: [
            particleSourceView,
            shootParticleButton,
            particleAmmountSlider
          ]
        } ),
        new RichText( 'Source Mode', { font: new PhetFont( { size: 20, weight: 'bold' } ) } ),
        new AquaRadioButtonGroup( model.sourceModeProperty, SourceMode.enumeration.values.map( sourceMode => {
          return {
            value: sourceMode,
            labelContent: sourceMode.sourceName,
            createNode: () => new Text( sourceMode.sourceName, { font: new PhetFont( 15 ) } ),
            tandemName: `${sourceMode.tandemName}RadioButton`
          };
        } ), {
          spacing: 10
        } )
      ]
    } );
  }
}

quantumMeasurement.register( 'ParticleSourceNode', ParticleSourceNode );