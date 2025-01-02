// Copyright 2024, University of Colorado Boulder

/**
 * BlochSphereMeasurementArea is the node that contains the measurement area for the Bloch Sphere screen. It contains the
 * UI elements for controlling magnetic field and basis of measurements...
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Path, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import BlochSphereModel from '../model/BlochSphereModel.js';
import { BlochSphereScene } from '../model/BlochSphereScene.js';
import { MeasurementBasis } from '../model/MeasurementBasis.js';
import BlochSphereNumericalEquationNode from './BlochSphereNumericalEquationNode.js';
import MagneticFieldArrowNode from './MagneticFieldArrowNode.js';
import MagneticFieldNode from './MagneticFieldNode.js';

type SelfOptions = EmptySelfOptions;

type BlochSphereMeasurementAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class BlochSphereMeasurementArea extends Node {

  public constructor( model: BlochSphereModel, providedOptions: BlochSphereMeasurementAreaOptions ) {

    super( providedOptions );

    const equationNode = new BlochSphereNumericalEquationNode( model, {
      tandem: providedOptions.tandem.createTandem( 'equationNode' ),
      centerY: -50
    } );
    this.addChild( equationNode );

    const magneticFieldNode = new MagneticFieldNode( model.magneticFieldStrengthProperty, {
      visibleProperty: DerivedProperty.valueEqualsConstant( model.selectedSceneProperty, BlochSphereScene.PRECESSION )
    } );
    this.addChild( magneticFieldNode );

    const singleMeasurementBlochSphereNode = new BlochSphereNode( model.singleMeasurementBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'singleMeasurementBlochSphereNode' ),
      drawTitle: false,
      drawKets: false,
      drawAngleIndicators: true,
      centerX: magneticFieldNode.centerX,
      centerY: magneticFieldNode.centerY
    } );
    this.addChild( singleMeasurementBlochSphereNode );

    const spinUpLabelStringProperty = new DerivedStringProperty(
      [ model.measurementBasisProperty ],
      measurementBasis => measurementBasis.label.value + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER
    );
    const spinDownLabelStringProperty = new DerivedStringProperty(
      [ model.measurementBasisProperty ],
      measurementBasis => measurementBasis.label.value + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER
    );

    const measurementResultHistogram = new QuantumMeasurementHistogram(
      new NumberProperty( 1 ),
      new NumberProperty( 1 ),
      [
        new RichText( spinUpLabelStringProperty ),
        new RichText( spinDownLabelStringProperty ) ],
      {
        tandem: providedOptions.tandem.createTandem( 'measurementResultHistogram' )
      }
    );

    const radioButtonItems = [ true, false ].map(
      isSingleMeasurement => {
        return {
          createNode: () => new Text( isSingleMeasurement ? 'Single' : 'Multiple', { font: new PhetFont( 16 ) } ),
          value: isSingleMeasurement
        };
      } );
    const singleOrMultipleRadioButtonGroup = new AquaRadioButtonGroup( model.isSingleMeasurementModeProperty, radioButtonItems, { orientation: 'vertical' } );


    const basisRadioButtonTextOptions: RichTextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black'
    };
    // Create and add the radio buttons that select the chart type view in the nuclideChartAccordionBox.
    const basisRadioButtonGroupTandem = providedOptions.tandem.createTandem( 'basisRadioButtonGroup' );

    const basisRadioGroupItems = MeasurementBasis.enumeration.values.map( basis => {
      return {
        value: basis,
        createNode: () => new RichText(
          basis.label, basisRadioButtonTextOptions
        ),
        tandemName: `${basis.tandemName}RadioButton`
      };
    } );

    const basisRadioButtonGroup = new RectangularRadioButtonGroup<MeasurementBasis>(
      model.measurementBasisProperty, basisRadioGroupItems, {
        orientation: 'horizontal',
        tandem: basisRadioButtonGroupTandem,
        phetioFeatured: true,
        radioButtonOptions: {
          baseColor: QuantumMeasurementColors.controlPanelFillColorProperty,
          phetioVisiblePropertyInstrumented: false
        }
      } );

    const measurementControlPanel = new Panel( new VBox( {
      spacing: 10,
      align: 'left',
      children: [
        new Text( 'Measurement Parameters', { font: new PhetFont( 18 ) } ),
        singleOrMultipleRadioButtonGroup,
        new Text( 'Basis', { font: new PhetFont( 18 ) } ),
        basisRadioButtonGroup
      ]
    } ), QuantumMeasurementConstants.panelOptions );

    const measurementControls = new VBox( {
      left: singleMeasurementBlochSphereNode.right + 20,
      centerY: singleMeasurementBlochSphereNode.centerY,
      spacing: 10,
      children: [
        measurementResultHistogram,
        measurementControlPanel
      ]
    } );
    this.addChild( measurementControls );


    const magneticFieldPanel = new Panel( new Node( {
      children: [
        new Node( {
          centerX: 0,
          centerY: 0,
          children: [
            new Path( new Shape().moveTo( 0, -50 ).lineTo( 0, 50 ), {
              stroke: 'grey',
              lineWidth: 1,
              lineDash: [ 5, 5 ]
            } ),
            new MagneticFieldArrowNode( model.magneticFieldStrengthProperty )
          ]
        } ),
        new Slider( model.magneticFieldStrengthProperty, model.magneticFieldStrengthProperty.range, {
          tandem: providedOptions.tandem.createTandem( 'magneticFieldStrengthSlider' ),
          thumbFill: '#ff0',
          orientation: Orientation.VERTICAL,
          centerX: 50,
          centerY: 0
        } )
      ]
    } ), combineOptions<PanelOptions>( {
      top: singleMeasurementBlochSphereNode.bottom,
      centerX: singleMeasurementBlochSphereNode.centerX,
      visibleProperty: DerivedProperty.valueEqualsConstant( model.selectedSceneProperty, BlochSphereScene.PRECESSION )
    }, QuantumMeasurementConstants.panelOptions ) );
    this.addChild( magneticFieldPanel );

    this.mutate( providedOptions );

  }
}

quantumMeasurement.register( 'BlochSphereMeasurementArea', BlochSphereMeasurementArea );