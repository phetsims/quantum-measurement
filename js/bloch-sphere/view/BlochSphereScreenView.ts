// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Bloch Sphere" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import blochSphereScreenMockup_png from '../../../images/blochSphereScreenMockup_png.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ComplexBlochSphere from '../model/ComplexBlochSphere.js';

export default class BlochSphereScreenView extends QuantumMeasurementScreenView {

  public readonly blochSphere: ComplexBlochSphere;

  public constructor( model: BlochSphereModel, tandem: Tandem ) {

    super( {
      initialMockupOpacity: 0,
      mockupImage: new Image( blochSphereScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / blochSphereScreenMockup_png.width
      } ),
      tandem: tandem
    } );

    this.blochSphere = new ComplexBlochSphere( {
      tandem: tandem.createTandem( 'blochSphere' )
    } );

    const azimuthSlider = new Slider( this.blochSphere.azimutalAngleProperty, this.blochSphere.azimutalAngleProperty.range, {
      center: new Vector2( 100, 100 ),
      tandem: tandem.createTandem( 'azimuthSlider' )
    } );
    const polarSlider = new Slider( this.blochSphere.polarAngleProperty, this.blochSphere.polarAngleProperty.range, {
      center: new Vector2( 100, 200 ),
      tandem: tandem.createTandem( 'polarSlider' )
    } );

    const slidersPanel = new Panel( new VBox( {
      spacing: 10,
      children: [
        new Text( 'Polar Angle (θ): ', { font: new PhetFont( 15 ) } ), // Theta symbol: θ
        polarSlider,
        new Text( 'Azimuthal Angle (φ)', { font: new PhetFont( 15 ) } ), // Phi symbol: φ
        azimuthSlider
      ]
    } ), {
      fill: QuantumMeasurementColors.controlPanelFillColorProperty,
      stroke: QuantumMeasurementColors.controlPanelStrokeColorProperty,
      yMargin: 10,
      minWidth: 270
    } );

    const blochSphereNode = new BlochSphereNode(
      this.blochSphere, {
        tandem: tandem.createTandem( 'blochSphereNode' ),
        center: this.layoutBounds.center,
        scale: 2.5
      } );

    const blochSpherePreparationArea = new VBox( {
      centerX: this.layoutBounds.centerX,
      spacing: 20,
      align: 'center',
      children: [
        new Text( 'State to Prepare', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),
        blochSphereNode,
        slidersPanel,
        new Slider( blochSphereNode.xAxisOffsetAngleProperty, new Range( 0, 2 * Math.PI ), {
          tandem: Tandem.OPT_OUT
        } )
      ]
    } );

    // this.addChild( blochSpherePreparationArea );

    const leftProperty = new NumberProperty( 0 );
    const rightProperty = new NumberProperty( 1 );


    // TODO: These guys shouldn't live here, see https://github.com/phetsims/quantum-measurement/issues/22
    this.addChild( new HBox( {
        spacing: 10,
        center: this.layoutBounds.center,
        children: [
          new QuantumMeasurementHistogram( leftProperty, rightProperty,
            [
              new RichText( 'V', { font: new PhetFont( { size: 17, weight: 'bold' } ) } ),
              new RichText( 'H', { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
            ],
            {
              displayMode: 'number',
              matchLabelColors: true,
              visibleProperty: new BooleanProperty( true ),
              tandem: Tandem.OPT_OUT
            } ),
          new QuantumMeasurementHistogram( leftProperty, rightProperty,
            [
              new RichText( 'V', { font: new PhetFont( { size: 17, weight: 'bold' } ), fill: QuantumMeasurementColors.verticalPolarizationColorProperty } ),
              new RichText( 'H', { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
            ],
            {
              displayMode: 'fraction',
              orientation: 'horizontal',
              matchLabelColors: true,
              leftFillColorProperty: QuantumMeasurementColors.verticalPolarizationColorProperty,
              rightFillColorProperty: QuantumMeasurementColors.horizontalPolarizationColorProperty,
              visibleProperty: new BooleanProperty( true ),
              tandem: Tandem.OPT_OUT
            } ),
          new QuantumMeasurementHistogram( leftProperty, rightProperty,
            [
              new RichText( 'S<sub>z</sub>' + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER, { font: new PhetFont( { size: 17, weight: 'bold' } ) } ),
              new RichText( 'S<sub>z</sub>' + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER, { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
            ],
            {
              displayMode: 'percent',
              leftFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
              visibleProperty: new BooleanProperty( true ),
              tandem: Tandem.OPT_OUT,
              numberDisplayOptions: {
                textOptions: {
                  font: new PhetFont( 17 )
                }
              }
            } )
        ]
      } )
    );

    const duration = 500;
    const animation = new Animation( {
      setValue: value => {
        const T = 100;
        leftProperty.value = T * ( Math.sin( value ) + 1 ) / 2;
        rightProperty.value = T - leftProperty.value;
      },
      from: 0,
      to: duration,
      duration: duration,
      easing: Easing.LINEAR
    } );

    animation.start();


    this.mockupOpacityProperty && this.mockupOpacityProperty.link( opacity => {
      blochSpherePreparationArea.opacity = 1 - opacity;
    } );
  }

  public override reset(): void {
    super.reset();
    this.blochSphere.reset();
  }
}

quantumMeasurement.register( 'BlochSphereScreenView', BlochSphereScreenView );