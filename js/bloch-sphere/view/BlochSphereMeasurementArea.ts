// Copyright 2025, University of Colorado Boulder

/**
 * BlochSphereMeasurementArea is the node that contains the measurement area for the Bloch Sphere screen. It contains
 * the UI elements for controlling various aspects of the measurement that is to be performed.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, NodeOptions, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import BlochSphereModel from '../model/BlochSphereModel.js';
import { MeasurementAxis } from '../model/MeasurementAxis.js';
import { StateDirection } from '../model/StateDirection.js';
import BlochSphereNumericalEquationNode from './BlochSphereNumericalEquationNode.js';
import MagneticFieldControl from './MagneticFieldControl.js';
import MeasurementTimerControl from './MeasurementTimerControl.js';
import SystemUnderTestNode from './SystemUnderTestNode.js';

type SelfOptions = EmptySelfOptions;

type BlochSphereMeasurementAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class BlochSphereMeasurementArea extends Node {

  public constructor( model: BlochSphereModel, providedOptions: BlochSphereMeasurementAreaOptions ) {

    const aquaRadioButtonGroupItems: AquaRadioButtonGroupItem<StateDirection>[] = QuantumMeasurementConstants.plusDirections.map( direction => {
      return {
        value: direction,
        createNode: () => new Text( direction.shortName, { font: new PhetFont( 16 ) } ),
        tandemName: direction.tandemName
      };
    } );

    const equationBasisBox = new HBox( {
      spacing: 5,
      children: [
        new Text( 'Basis: ', { font: new PhetFont( 16 ) } ),
        new AquaRadioButtonGroup( model.equationBasisProperty, aquaRadioButtonGroupItems, { orientation: 'horizontal', margin: 5 } )
      ]
    } );

    const equationNode = new BlochSphereNumericalEquationNode( model.singleMeasurementBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'equationNode' ),
      basisProperty: model.equationBasisProperty
    } );

    const equationNodePanel = new Panel( new VBox( {
      spacing: 5,
      children: [
        equationNode,
        equationBasisBox
      ],
      visibleProperty: model.isSingleMeasurementModeProperty
    } ), QuantumMeasurementConstants.panelOptions );

    const singleMeasurementBlochSphereNode = new BlochSphereNode( model.singleMeasurementBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'singleMeasurementBlochSphereNode' ),
      drawTitle: false,
      drawKets: false,
      drawAngleIndicators: true,
      top: equationNodePanel.bottom + 25,
      left: equationNodePanel.left,
      visibleProperty: model.isSingleMeasurementModeProperty
    } );

    const multipleMeasurementBlochSpheresTandem = providedOptions.tandem.createTandem( 'multipleMeasurementBlochSpheres' );
    const multipleMeasurementBlochSpheresNode = new Node( {
      visibleProperty: DerivedProperty.not( model.isSingleMeasurementModeProperty )
    } );
    const blochSpheresSpacing = 70;
    const lattice = [ 3, 2, 3, 2 ];
    let currentRow = 0;
    let currentColumn = 0;
    model.multiMeasurementBlochSpheres.forEach( ( blochSphere, index ) => {
      const blochSphereNode = new BlochSphereNode( blochSphere, {
        tandem: multipleMeasurementBlochSpheresTandem.createTandem( `blochSphere${index}` ),
        scale: 0.3,
        drawTitle: false,
        drawKets: false,
        drawAngleIndicators: true,
        centerX: currentColumn * blochSpheresSpacing,
        centerY: currentRow * blochSpheresSpacing
      } );
      multipleMeasurementBlochSpheresNode.addChild( blochSphereNode );

      currentColumn++;
      if ( currentColumn >= lattice[ currentRow % lattice.length ] ) {
        currentColumn = lattice[ currentRow % lattice.length ] === 3 ? 0.5 : 0;
        currentRow++;
      }
    } );
    multipleMeasurementBlochSpheresNode.centerX = singleMeasurementBlochSphereNode.centerX;
    multipleMeasurementBlochSpheresNode.top = 70;

    const spinUpLabelStringProperty = new DerivedStringProperty(
      [ model.measurementAxisProperty ],
      measurementAxis => measurementAxis.label.value + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER
    );
    const spinDownLabelStringProperty = new DerivedStringProperty(
      [ model.measurementAxisProperty ],
      measurementAxis => measurementAxis.label.value + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER
    );

    const measurementResultHistogram = new QuantumMeasurementHistogram(
      model.upMeasurementCountProperty,
      model.downMeasurementCountProperty,
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
          value: isSingleMeasurement,
          tandemName: isSingleMeasurement ? 'singleMeasurementRadioButton' : 'multipleMeasurementRadioButton'
        };
      } );
    const singleOrMultipleRadioButtonGroup = new AquaRadioButtonGroup( model.isSingleMeasurementModeProperty, radioButtonItems, {
      orientation: 'vertical',
      tandem: providedOptions.tandem.createTandem( 'singleOrMultipleRadioButtonGroup' )
    } );

    const basisRadioButtonTextOptions: RichTextOptions = {
      font: new PhetFont( 18 ),
      fill: 'black'
    };

    // Create and add the radio buttons that select the chart type view in the nuclideChartAccordionBox.
    const basisRadioButtonGroupTandem = providedOptions.tandem.createTandem( 'basisRadioButtonGroup' );

    const basisRadioGroupItems = MeasurementAxis.enumeration.values.map( basis => {
      return {
        value: basis,
        createNode: () => new RichText(
          basis.label, basisRadioButtonTextOptions
        ),
        tandemName: `${basis.tandemName}RadioButton`
      };
    } );

    const basisRadioButtonGroup = new RectangularRadioButtonGroup<MeasurementAxis>(
      model.measurementAxisProperty,
      basisRadioGroupItems,
      {
        orientation: 'horizontal',
        tandem: basisRadioButtonGroupTandem,
        phetioFeatured: true,
        radioButtonOptions: {
          baseColor: QuantumMeasurementColors.controlPanelFillColorProperty,
          phetioVisiblePropertyInstrumented: false
        }
      }
    );

    const measurementTimerControl = new MeasurementTimerControl( model.timeToMeasurementProperty, model.measurementTimeProperty, {
      tandem: providedOptions.tandem.createTandem( 'measurementTimerControl' ),
      visibleProperty: model.magneticFieldEnabledProperty
    } );

    const measurementControlPanel = new Panel( new VBox( {
      spacing: 10,
      align: 'left',
      children: [
        new Text( QuantumMeasurementStrings.measurementParametersStringProperty, { font: new PhetFont( 18 ) } ),
        singleOrMultipleRadioButtonGroup,
        new Text( QuantumMeasurementStrings.measurementAxisStringProperty, { font: new PhetFont( 16 ) } ),
        basisRadioButtonGroup,
        measurementTimerControl
      ]
    } ), QuantumMeasurementConstants.panelOptions );

    const prepareObserveButtonTextProperty = new DerivedStringProperty(
      [
        model.measurementStateProperty,
        QuantumMeasurementStrings.startStringProperty,
        QuantumMeasurementStrings.reprepareStringProperty
      ],
      ( measurementState, startString, reprepareString ) => measurementState === 'observed' ?
                                                            reprepareString :
                                                            startString
    );

    const prepareObserveButton = new TextPushButton(
      prepareObserveButtonTextProperty,
      {
        listener: () => {
          if ( model.measurementStateProperty.value === 'prepared' ) {
            model.initiateObservation();
          }
          else {
            model.reprepare();
          }
        },
        baseColor: QuantumMeasurementColors.experimentButtonColorProperty,
        font: new PhetFont( 18 ),
        enabledProperty: DerivedProperty.valueNotEqualsConstant( model.measurementStateProperty, 'timingObservation' ),
        xMargin: 20,
        yMargin: 6,
        maxWidth: measurementControlPanel.width,
        tandem: providedOptions.tandem.createTandem( 'prepareObserveButton' )
      }
    );

    const measurementControls = new VBox( {
      left: singleMeasurementBlochSphereNode.right + 20,
      top: equationNodePanel.bottom - 40,
      spacing: 10,
      children: [
        measurementResultHistogram,
        measurementControlPanel,
        prepareObserveButton
      ]
    } );

    const magneticFieldCheckbox = new Checkbox(
      model.magneticFieldEnabledProperty,
      // TODO: This text should be localized, see https://github.com/phetsims/quantum-measurement/issues/54
      new Text( 'Enable Magnetic Field', { font: new PhetFont( { size: 16 } ) } ),
      {
        spacing: 10,
        centerX: multipleMeasurementBlochSpheresNode.centerX,
        bottom: QuantumMeasurementConstants.LAYOUT_BOUNDS.bottom - 55,
        tandem: providedOptions.tandem.createTandem( 'magneticFieldCheckbox' )
      }
    );

    const magneticFieldControl = new MagneticFieldControl( model.magneticFieldStrengthProperty, {
      visibleProperty: model.magneticFieldEnabledProperty,
      tandem: providedOptions.tandem.createTandem( 'magneticFieldControl' )
    } );

    const systemUnderTestNode = new SystemUnderTestNode(
      new Dimension2( 150, 180 ),
      model.magneticFieldEnabledProperty,
      model.magneticFieldStrengthProperty,
      model.isSingleMeasurementModeProperty,
      model.measurementStateProperty
    );

    const magneticFieldAndStrengthControl = new HBox( {
      children: [ magneticFieldControl, systemUnderTestNode ],
      spacing: 12,
      centerX: singleMeasurementBlochSphereNode.centerX,
      bottom: magneticFieldCheckbox.top - 20
    } );

    magneticFieldAndStrengthControl.localBoundsProperty.link( () => {
      magneticFieldAndStrengthControl.centerX = singleMeasurementBlochSphereNode.centerX;
    } );

    const options = optionize<BlochSphereMeasurementAreaOptions, SelfOptions, NodeOptions>()( {
      children: [
        equationNodePanel,
        singleMeasurementBlochSphereNode,
        multipleMeasurementBlochSpheresNode,
        measurementControls,
        magneticFieldAndStrengthControl,
        magneticFieldCheckbox
      ]
    }, providedOptions );

    super( options );

    this.pdomOrder = [
      measurementControlPanel,
      prepareObserveButton
    ];
  }
}

quantumMeasurement.register( 'BlochSphereMeasurementArea', BlochSphereMeasurementArea );