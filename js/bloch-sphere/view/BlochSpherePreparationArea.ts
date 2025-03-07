// Copyright 2024-2025, University of Colorado Boulder

/**
 * Zone where the Bloch Sphere direction is set by the user. It includes sliders for the polar and azimuthal angles and
 * a ComboBox to select the direction.
 *
 * @author Agustín Vallejo
 */

import BlochSphereModel from 'model/BlochSphereModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider, { SliderOptions } from '../../../../sun/js/Slider.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { StateDirection } from '../model/StateDirection.js';
import BlochSphereNumericalEquationNode from './BlochSphereNumericalEquationNode.js';
import BlochSphereSymbolicEquationNode from './BlochSphereSymbolicEquationNode.js';

type SelfOptions = EmptySelfOptions;

export type BlochSpherePreparationAreaOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class BlochSpherePreparationArea extends VBox {

  public constructor( model: BlochSphereModel, parentNode: Node, providedOptions: BlochSpherePreparationAreaOptions ) {

    const sliderStep = Math.PI / 12;
    const polarSlider = new Slider(
      model.preparationBlochSphere.polarAngleProperty,
      model.preparationBlochSphere.polarAngleProperty.range,
      combineOptions<SliderOptions>( {
        tandem: providedOptions.tandem.createTandem( 'polarSlider' ),
        constrainValue: value => roundToInterval( value, sliderStep ),
        keyboardStep: sliderStep,
        shiftKeyboardStep: sliderStep,
        pageKeyboardStep: sliderStep * 3,
        valueChangeSoundGeneratorOptions: {
          interThresholdDelta: sliderStep
        }
      }, QuantumMeasurementConstants.DEFAULT_CONTROL_SLIDER_OPTIONS )
    );
    const azimuthSlider = new Slider(
      model.preparationBlochSphere.azimuthalAngleProperty,
      model.preparationBlochSphere.azimuthalAngleProperty.range,
      combineOptions<SliderOptions>( {
        tandem: providedOptions.tandem.createTandem( 'azimuthSlider' ),
        constrainValue: value => roundToInterval( value, sliderStep ),
        keyboardStep: sliderStep,
        shiftKeyboardStep: sliderStep,
        pageKeyboardStep: sliderStep * 3,
        valueChangeSoundGeneratorOptions: {
          interThresholdDelta: sliderStep
        }
      }, QuantumMeasurementConstants.DEFAULT_CONTROL_SLIDER_OPTIONS )
    );

    polarSlider.addMajorTick( 0, new Text( '0', { font: QuantumMeasurementConstants.CONTROL_FONT } ) );
    _.times( 3, i => polarSlider.addMinorTick( ( i + 1 ) * Math.PI / 4 ) );
    polarSlider.addMajorTick( Math.PI, new Text( `${MathSymbols.PI}`, { font: QuantumMeasurementConstants.CONTROL_FONT } ) );

    azimuthSlider.addMajorTick( 0, new Text( '0', { font: QuantumMeasurementConstants.CONTROL_FONT } ) );
    _.times( 7, i => azimuthSlider.addMinorTick( ( i + 1 ) * Math.PI / 4 ) );
    azimuthSlider.addMajorTick( 2 * Math.PI, new Text( `2${MathSymbols.PI}`, { font: QuantumMeasurementConstants.CONTROL_FONT } ) );

    const comboBoxItems: ComboBoxItem<StateDirection>[] = StateDirection.enumeration.values.map( direction => {

      // Most of these use the description as the value, and they are not translatable, but the custom one is.
      const itemText = direction === StateDirection.CUSTOM ?
                       QuantumMeasurementStrings.customStringProperty :
                       direction.description;
      return {
        value: direction,
        createNode: () => new Text( itemText, { font: QuantumMeasurementConstants.CONTROL_FONT } )
      };
    } );

    const directionComboBox = new ComboBox( model.selectedStateDirectionProperty, comboBoxItems, parentNode, {
      yMargin: 6,
      tandem: providedOptions.tandem.createTandem( 'directionComboBox' )
    } );

    const sliderTitleOptions = { font: QuantumMeasurementConstants.CONTROL_FONT, maxWidth: 200 };
    const slidersPanel = new Panel(
      new VBox( {
        spacing: 20,
        children: [
          directionComboBox,
          new VBox( {
            spacing: QuantumMeasurementConstants.TITLE_AND_SLIDER_SPACING,
            children: [
              new Text(
                new PatternStringProperty(
                  QuantumMeasurementStrings.polarAngleParenthesesSymbolPatternStringProperty,
                  { symbol: MathSymbols.THETA }
                ), sliderTitleOptions ), // Theta symbol: θ
              polarSlider
            ]
          } ),
          new VBox( {
            spacing: QuantumMeasurementConstants.TITLE_AND_SLIDER_SPACING,
            children: [
              new Text(
                new PatternStringProperty(
                  QuantumMeasurementStrings.azimuthalAngleParenthesesSymbolPatternStringProperty,
                  { symbol: MathSymbols.PHI }
                ), sliderTitleOptions ), // Phi symbol: φ
              azimuthSlider
            ]
          } )
        ]
      } ),
      combineOptions<PanelOptions>( { minWidth: 270 }, QuantumMeasurementConstants.PANEL_OPTIONS )
    );

    const blochSphereNode = new BlochSphereNode(
      model.preparationBlochSphere, {
        tandem: providedOptions.tandem.createTandem( 'blochSphereNode' ),
        expandBounds: false,
        drawTitle: false,
        drawAngleIndicators: true,
        scale: 0.9
      }
    );

    const options = optionize<BlochSpherePreparationAreaOptions, SelfOptions, VBoxOptions>()( {
      spacing: 14,
      align: 'center',
      children: [
        new Text( QuantumMeasurementStrings.spinStateToPrepareStringProperty, {
          font: QuantumMeasurementConstants.BOLD_HEADER_FONT,
          maxWidth: 250
        } ),
        new BlochSphereSymbolicEquationNode(),
        new Panel( new BlochSphereNumericalEquationNode( model.preparationBlochSphere ), {
          fill: new DerivedProperty(
            [ QuantumMeasurementColors.blockSphereMainColorProperty ],
            color => color.colorUtilsBrighter( 0.5 )
          ),
          cornerRadius: 5,
          stroke: null,
          xMargin: 10
        } ),
        blochSphereNode,
        slidersPanel
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'BlochSpherePreparationArea', BlochSpherePreparationArea );