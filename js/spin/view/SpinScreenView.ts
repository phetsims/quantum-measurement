// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view class for the "Spin" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Image, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import spinScreenMockup_png from '../../../images/spinScreenMockup_png.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere, { SPIN_VALUES } from '../model/SimpleBlochSphere.js';
import SpinModel from '../model/SpinModel.js';

export default class SpinScreenView extends QuantumMeasurementScreenView {

  public readonly blochSphere: SimpleBlochSphere;

  public constructor( model: SpinModel, tandem: Tandem ) {

    super( {
      initialMockupOpacity: 0,
      mockupImage: new Image( spinScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / spinScreenMockup_png.width
      } ),
      tandem: tandem
    } );

    this.blochSphere = new SimpleBlochSphere( {
      tandem: tandem.createTandem( 'blochSphere' )
    } );

    type SpinValue = typeof SPIN_VALUES[number]; // Creates a union type of 'Z_PLUS' | 'Z_MINUS' | 'X_PLUS'
    const spinLabelsMap: Record<SpinValue, string> = {
      Z_PLUS: '"+Z"    ⟨Sz⟩ = +ħ/2',
      Z_MINUS: '"-Z"    ⟨Sz⟩ = -ħ/2',
      X_PLUS: '"+X"    ⟨Sz⟩ = 0'
    };

    const createRadioButtonGroupItem = ( value: string ) => {
      const valueText = spinLabelsMap[ value ] || value; // Map the value to the formatted string
      return {
        createNode: () => new Text( valueText, { font: new PhetFont( 15 ) } ),
        value: value
      };
    };

    const numberOfCoinsRadioButtonGroup = new RectangularRadioButtonGroup(
      this.blochSphere.spinStateProperty,
      SPIN_VALUES.map( quantity => createRadioButtonGroupItem( quantity ) ),
      {
        spacing: 10,
        center: new Vector2( 100, 100 ),
        tandem: tandem.createTandem( 'numberOfCoinsRadioButtonGroup' ),
        radioButtonOptions: {
          baseColor: QuantumMeasurementColors.selectorButtonDeselectedColorProperty
        }
      }
    );


    const spinStatePanel = new VBox( {
      children: [
        numberOfCoinsRadioButtonGroup
      ]
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
        spinStatePanel,
        new Slider( blochSphereNode.xAxisOffsetAngleProperty, new Range( 0, 2 * Math.PI ) )
      ]
    } );

    this.mockupOpacityProperty && this.mockupOpacityProperty.link( opacity => {
      blochSpherePreparationArea.opacity = 1 - opacity;
    } );

    this.addChild( blochSpherePreparationArea );
  }

  public override reset(): void {
    super.reset();
    this.blochSphere.reset();
  }
}

quantumMeasurement.register( 'SpinScreenView', SpinScreenView );