// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Bloch Sphere" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Image, Line, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import blochSphereScreenMockup_png from '../../../images/blochSphereScreenMockup_png.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class BlochSphereScreenView extends QuantumMeasurementScreenView {

  public constructor( model: BlochSphereModel, tandem: Tandem ) {

    super( {
      initialMockupOpacity: 0,
      mockupImage: new Image( blochSphereScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / blochSphereScreenMockup_png.width
      } ),
      tandem: tandem
    } );

    const azimuthSlider = new Slider( model.blochSphere.azimutalAngleProperty, model.blochSphere.azimutalAngleProperty.range, {
      center: new Vector2( 100, 100 ),
      tandem: tandem.createTandem( 'azimuthSlider' ),
      thumbFill: '#444'
    } );
    const polarSlider = new Slider( model.blochSphere.polarAngleProperty, model.blochSphere.polarAngleProperty.range, {
      center: new Vector2( 100, 200 ),
      tandem: tandem.createTandem( 'polarSlider' ),
      thumbFill: '#444'
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
      minWidth: 270
    } );

    const blochSphereNode = new BlochSphereNode(
      model.blochSphere, {
        tandem: tandem.createTandem( 'blochSphereNode' ),
        center: this.layoutBounds.center,
        expandBounds: false,
        drawTitle: false
      } );

    const blochSpherePreparationArea = new VBox( {
      left: this.layoutBounds.left + 20,
      spacing: 20,
      align: 'center',
      children: [
        new Text( 'State to Prepare', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),
        new RichText( 'Equation 1', { font: new MathSymbolFont( { size: 20 } ) } ),
        new Panel(
          new RichText( 'Equation 2', { font: new MathSymbolFont( { size: 20 } ) } ), {
            fill: '#aff',
            cornerRadius: 5,
            stroke: null,
            xMargin: 10,
            yMargin: 10
          }
        ),
        blochSphereNode,
        slidersPanel
      ]
    } );

    // Add the vertical line that will sit between the preparation and measurement areas.
    const dividingLineX = 350; // empirically determined
    const dividingLine = new Line( dividingLineX, 90, dividingLineX, 600, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineDash: [ 6, 5 ]
    } );
    this.addChild( dividingLine );

    this.addChild( blochSpherePreparationArea );

    this.mockupOpacityProperty && this.mockupOpacityProperty.link( opacity => {
      blochSpherePreparationArea.opacity = 1 - opacity;
    } );
  }

  public override reset(): void {
    super.reset();
  }
}

quantumMeasurement.register( 'BlochSphereScreenView', BlochSphereScreenView );