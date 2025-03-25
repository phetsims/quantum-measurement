// Copyright 2024-2025, University of Colorado Boulder

/**
 * ParticleSourceNode contains the UI elements of the particle source, including the particle-shooter,
 * and other UI elements to control the source mode between 'single particle' and 'continuous' ray.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import Shape from '../../../../kite/js/Shape.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import HSlider from '../../../../sun/js/HSlider.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import ParticleSourceModel from '../model/ParticleSourceModel.js';
import { SingleParticleCollection } from '../model/SingleParticleCollection.js';
import { SourceMode } from '../model/SourceMode.js';

const SPACING = 10;

export default class ParticleSourceNode extends Node {

  public constructor(
    particleSourceModel: ParticleSourceModel,
    singleParticlesCollection: SingleParticleCollection,
    modelViewTransform: ModelViewTransform2,
    tandem: Tandem ) {

    // constants
    const PARTICLE_SOURCE_WIDTH = modelViewTransform.modelToViewDeltaX( ParticleSourceModel.PARTICLE_SOURCE_WIDTH );
    const PARTICLE_SOURCE_HEIGHT = modelViewTransform.modelToViewDeltaY( -ParticleSourceModel.PARTICLE_SOURCE_HEIGHT ); // Minus because of inverted Y
    const PARTICLE_SOURCE_CORNER_RADIUS = modelViewTransform.modelToViewDeltaX( ParticleSourceModel.PARTICLE_SOURCE_CORNER_RADIUS );

    // main shape of the component
    const particleSourceRectangle = new Path(
      new Shape().roundRect(
        0, 0, PARTICLE_SOURCE_WIDTH, PARTICLE_SOURCE_HEIGHT, PARTICLE_SOURCE_CORNER_RADIUS, PARTICLE_SOURCE_CORNER_RADIUS
      ),
      {
        stroke: 'black',
        lineWidth: 0.5,
        fill: new LinearGradient( 0, 0, 0, 100 )
          .addColorStop( 0, QuantumMeasurementColors.particleSourceGradient1ColorProperty )
          .addColorStop( 0.2, QuantumMeasurementColors.particleSourceGradient2ColorProperty )
          .addColorStop( 1, QuantumMeasurementColors.particleSourceGradient3ColorProperty )
      }
    );

    const particleSourceBarrelDimension = PARTICLE_SOURCE_WIDTH / 5;
    const particleSourceBarrel = new Path(
      new Shape().roundRect(
        PARTICLE_SOURCE_WIDTH - particleSourceBarrelDimension / 2,
        PARTICLE_SOURCE_HEIGHT / 2 - particleSourceBarrelDimension / 2,
        particleSourceBarrelDimension,
        particleSourceBarrelDimension,
        4,
        4
      ),
      {
        stroke: 'black',
        lineWidth: 0.5,
        fill: new LinearGradient( 0, 0, 0, PARTICLE_SOURCE_WIDTH / 10 )
          .addColorStop( 0, QuantumMeasurementColors.particleSourceGradient1ColorProperty )
          .addColorStop( 0.2, QuantumMeasurementColors.particleSourceGradient2ColorProperty )
          .addColorStop( 1, QuantumMeasurementColors.particleSourceGradient3ColorProperty )
      }
    );
    particleSourceBarrel.rotateAround( particleSourceBarrel.center, Math.PI / 4 );
    particleSourceBarrel.center.y = particleSourceRectangle.center.y;

    // button for 'single' mode
    const shootParticleButtonTandem = tandem.createTandem( 'shootParticleButton' );
    const shootParticleButton = new RoundPushButton( {
        radius: 21,
        baseColor: QuantumMeasurementColors.downColorProperty,
        listener: () => { singleParticlesCollection.shootSingleParticle(); },
        fireOnDown: true,
        visibleProperty: new GatedVisibleProperty(
          DerivedProperty.not( particleSourceModel.isContinuousModeProperty ),
          shootParticleButtonTandem
        ),
        soundPlayer: sharedSoundPlayers.get( 'release' ),
        center: particleSourceRectangle.center,
        touchAreaDilation: 20,
        tandem: shootParticleButtonTandem
      }
    );

    // slider for 'continuous' mode
    const sliderStep = 0.05;
    const sliderRange = particleSourceModel.particleAmountProperty.range;
    const particleAmountSliderTandem = tandem.createTandem( 'particleAmountSlider' );
    const particleAmountSlider = new HSlider( particleSourceModel.particleAmountProperty, sliderRange, {
      thumbFill: QuantumMeasurementColors.downColorProperty,
      thumbFillHighlighted: QuantumMeasurementColors.downColorProperty.value.colorUtilsBrighter( 0.5 ),
      visibleProperty: new GatedVisibleProperty( particleSourceModel.isContinuousModeProperty, particleAmountSliderTandem ),
      center: particleSourceRectangle.center,
      trackSize: new Dimension2( PARTICLE_SOURCE_WIDTH * 0.7, 1 ),
      tandem: particleAmountSliderTandem,
      majorTickLength: 15,

      constrainValue: value => roundToInterval( value, sliderStep ),
      keyboardStep: sliderStep,
      shiftKeyboardStep: sliderStep,
      pageKeyboardStep: sliderStep * 5,
      valueChangeSoundGeneratorOptions: {
        numberOfMiddleThresholds: sliderRange.getLength() / sliderStep - 1
      }
    } );

    // major ticks at 0%, 33%, 66%, 100%
    const tickLabelOptions = { font: QuantumMeasurementConstants.SMALL_LABEL_FONT, maxWidth: 40 };
    particleAmountSlider.addMajorTick( sliderRange.min, new Text( QuantumMeasurementStrings.noneStringProperty, tickLabelOptions ) );
    particleAmountSlider.addMajorTick( sliderRange.max, new Text( QuantumMeasurementStrings.lotsStringProperty, tickLabelOptions ) );
    particleAmountSlider.addMinorTick( sliderRange.min + ( sliderRange.max - sliderRange.min ) / 4 );
    particleAmountSlider.addMinorTick( sliderRange.min + 2 * ( sliderRange.max - sliderRange.min ) / 4 );
    particleAmountSlider.addMinorTick( sliderRange.min + 3 * ( sliderRange.max - sliderRange.min ) / 4 );

    const particleSourceApparatus = new Node( {
      children: [
        particleSourceBarrel,
        particleSourceRectangle,
        shootParticleButton,
        particleAmountSlider
      ]
    } );

    particleSourceApparatus.center = modelViewTransform.modelToViewPosition( particleSourceModel.positionProperty.value );

    const sourceModeRadioButtonGroup = new AquaRadioButtonGroup(
      particleSourceModel.sourceModeProperty,
      SourceMode.enumeration.values.map( sourceMode => {
        return {
          value: sourceMode,
          createNode: () => new Text( sourceMode.sourceName, { font: QuantumMeasurementConstants.CONTROL_FONT, maxWidth: 150 } ),
          options: {
            accessibleName: sourceMode.sourceName
          },
          tandemName: `${sourceMode.tandemName}RadioButton`
        };
      } ),
      {
        tandem: tandem.createTandem( 'sourceModeRadioButtonGroup' ),
        spacing: SPACING
      }
    );
    const sourceModeTitle = new RichText( QuantumMeasurementStrings.sourceModeStringProperty, {
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      maxWidth: 200,
      visibleProperty: sourceModeRadioButtonGroup.visibleProperty
    } );

    const sourceModeBox = new VBox( {
      top: particleSourceApparatus.bottom + SPACING,
      left: particleSourceApparatus.left,
      align: 'left',
      spacing: SPACING,
      children: [
        sourceModeTitle,
        sourceModeRadioButtonGroup
      ]
    } );

    super( {
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false,
      children: [
        new RichText( QuantumMeasurementStrings.spinSourceStringProperty, {
          font: QuantumMeasurementConstants.SMALL_LABEL_FONT,
          bottom: particleSourceApparatus.top - SPACING,
          left: particleSourceApparatus.left + SPACING,
          maxWidth: 200
        } ),
        particleSourceApparatus,
        sourceModeBox
      ]
    } );
  }
}

quantumMeasurement.register( 'ParticleSourceNode', ParticleSourceNode );