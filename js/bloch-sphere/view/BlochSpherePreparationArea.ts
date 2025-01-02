// Copyright 2024, University of Colorado Boulder

/**
 * Zone where the Bloch Sphere direction is set by the user,
 * it includdes sliders for the polar and azimuthal angles and a ComboBox to select the direction.
 *
 * @author Agustín Vallejo
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Panel from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { StateDirection } from '../model/StateDirection.js';
import BlochSphereNumericalEquationNode from './BlochSphereNumericalEquationNode.js';
import BlochSphereSymbolicEquationNode from './BlochSphereSymbolicEquationNode.js';

type SelfOptions = EmptySelfOptions;

export type BlochSpherePreparationAreaOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class BlochSpherePreparationArea extends VBox {

  public constructor( model: BlochSphereModel, parentNode: Node, providedOptions: BlochSpherePreparationAreaOptions ) {

    const polarSlider = new Slider( model.blochSphere.polarAngleProperty, model.blochSphere.polarAngleProperty.range, {
      center: new Vector2( 100, 200 ),
      tandem: providedOptions.tandem.createTandem( 'polarSlider' ),
      thumbFill: '#444',
      trackSize: new Dimension2( 150, 0.5 ),
      majorTickLength: 10
    } );
    const azimuthSlider = new Slider( model.blochSphere.azimuthalAngleProperty, model.blochSphere.azimuthalAngleProperty.range, {
      center: new Vector2( 100, 100 ),
      tandem: providedOptions.tandem.createTandem( 'azimuthSlider' ),
      thumbFill: '#444',
      trackSize: new Dimension2( 150, 0.5 ),
      majorTickLength: 10
    } );

    polarSlider.addMajorTick( 0, new Text( '0', { font: new PhetFont( 15 ) } ) );
    polarSlider.addMajorTick( Math.PI, new Text( 'π', { font: new PhetFont( 15 ) } ) );

    azimuthSlider.addMajorTick( 0, new Text( '0', { font: new PhetFont( 15 ) } ) );
    azimuthSlider.addMajorTick( 2 * Math.PI, new Text( '2π', { font: new PhetFont( 15 ) } ) );

    const comboBoxItems: ComboBoxItem<StateDirection>[] = StateDirection.enumeration.values.map( direction => {
      return {
        value: direction,
        createNode: () => new Text( direction.description, { font: new PhetFont( 16 ) } )
      };
    } );

    const directionComboBox = new ComboBox( model.selectedStateDirectionProperty, comboBoxItems, parentNode, {
      tandem: providedOptions.tandem.createTandem( 'directionComboBox' )
    } );

    const slidersPanel = new Panel( new VBox( {
      spacing: 10,
      children: [
        directionComboBox,
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
        tandem: providedOptions.tandem.createTandem( 'blochSphereNode' ),
        expandBounds: false,
        drawTitle: false,
        scale: 0.9
      } );

    const options = optionize<BlochSpherePreparationAreaOptions, SelfOptions, VBoxOptions>()( {
      spacing: 10,
      align: 'center',
      children: [
        new Text( 'State to Prepare', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),
        new BlochSphereSymbolicEquationNode(),
        new Panel(
          new BlochSphereNumericalEquationNode( model ), {
            fill: '#aff',
            cornerRadius: 5,
            stroke: null,
            xMargin: 10
          }
        ),
        blochSphereNode,
        slidersPanel
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'BlochSpherePreparationArea', BlochSpherePreparationArea );