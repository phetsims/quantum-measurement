// Copyright 2025, University of Colorado Boulder

/**
 * BlochSphereMeasurementArea is the Scenery Node that contains the measurement area for the Bloch Sphere screen. It
 * contains the UI elements for controlling various aspects of the measurement that is to be performed.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup, { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import BlochSphereModel from '../model/BlochSphereModel.js';
import { MeasurementAxis } from '../model/MeasurementAxis.js';
import { SpinMeasurementState } from '../model/SpinMeasurementState.js';
import { StateDirection } from '../model/StateDirection.js';
import BlochSphereHistogram from './BlochSphereHistogram.js';
import BlochSphereNumericalEquationNode from './BlochSphereNumericalEquationNode.js';
import MagneticFieldControl from './MagneticFieldControl.js';
import MeasurementTimerControl from './MeasurementTimerControl.js';
import SystemUnderTestNode, { ATOM_NODE_OPTIONS } from './SystemUnderTestNode.js';

type SelfOptions = EmptySelfOptions;
type BlochSphereMeasurementAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// constants
const TIMES = MathSymbols.TIMES;

// nominal max width of text elements, empirically determined
const TEXT_NODE_MAX_WIDTH = 200;

export default class BlochSphereMeasurementArea extends Node {

  public constructor( model: BlochSphereModel, providedOptions: BlochSphereMeasurementAreaOptions ) {

    const aquaRadioButtonGroupItems: AquaRadioButtonGroupItem<StateDirection>[] = QuantumMeasurementConstants.PLUS_DIRECTIONS.map( direction => {
      return {
        value: direction,
        createNode: () => new Text( direction.shortName, { font: QuantumMeasurementConstants.CONTROL_FONT } ),
        tandemName: `${direction.tandemName}RadioButton`
      };
    } );

    const equationPanelTandem = providedOptions.tandem.createTandem( 'equationPanel' );
    const equationBasisRadioButtonControlTandem = equationPanelTandem.createTandem( 'equationBasisRadioButtonControl' );

    const equationBasisRadioButtonControl = new HBox( {
      spacing: 5,
      children: [
        new Text( QuantumMeasurementStrings.basisColonStringProperty, { font: QuantumMeasurementConstants.CONTROL_FONT, maxWidth: 100 } ),
        new AquaRadioButtonGroup( model.equationBasisProperty, aquaRadioButtonGroupItems, {
          orientation: 'horizontal',
          margin: 5,
          radioButtonOptions: {
            mouseAreaXDilation: 4,
            mouseAreaYDilation: 6,
            touchAreaXDilation: 4,
            touchAreaYDilation: 6
          },
          tandem: equationBasisRadioButtonControlTandem.createTandem( 'radioButtonGroup' ),
          phetioVisiblePropertyInstrumented: false // visibility controlled by parent node
        } )
      ],
      tandem: equationBasisRadioButtonControlTandem
    } );

    const equationNode = new BlochSphereNumericalEquationNode( model.singleMeasurementBlochSphere, {
      tandem: Tandem.OPT_OUT,
      basisProperty: model.equationBasisProperty
    } );

    const equationPanel = new Panel( new VBox( {
      spacing: 5,
      children: [
        equationNode,
        equationBasisRadioButtonControl
      ],
      tandem: equationPanelTandem,
      visibleProperty: new GatedVisibleProperty( model.isSingleMeasurementModeProperty, equationPanelTandem )
    } ), QuantumMeasurementConstants.PANEL_OPTIONS );

    // Keep the equation node panel centered based on its initial position.
    const equationNodePanelInitialCenterX = equationPanel.centerX;
    equationPanel.localBoundsProperty.link( () => {
      equationPanel.centerX = equationNodePanelInitialCenterX;
    } );

    const singleMeasurementBlochSphereNode = new BlochSphereNode( model.singleMeasurementBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'singleMeasurementBlochSphereNode' ),
      drawTitle: false,
      drawKets: false,
      drawAngleIndicators: true,
      centerX: equationPanel.centerX,
      top: equationPanel.bottom + 35,
      visibleProperty: model.isSingleMeasurementModeProperty
    } );

    const multipleMeasurementBlochSpheresTandem = providedOptions.tandem.createTandem( 'multipleMeasurementBlochSpheres' );
    const blochSpheresSpacing = 70;
    const lattice = [ 3, 2, 3, 2 ];
    let currentRow = 0;
    let currentColumn = 0;
    const multipleMeasurementBlochSpheresNodes: BlochSphereNode[] = [];
    model.multiMeasurementBlochSpheres.forEach( ( blochSphere, index ) => {
      const blochSphereNode = new BlochSphereNode( blochSphere, {
        tandem: multipleMeasurementBlochSpheresTandem.createTandem( `blochSphereNode${index}` ),
        scale: 0.3,
        drawTitle: false,
        drawKets: false,
        drawAngleIndicators: true,
        drawAxesLabels: false,
        stateVectorScale: 2,
        centerX: currentColumn * blochSpheresSpacing,
        centerY: currentRow * blochSpheresSpacing
      } );
      multipleMeasurementBlochSpheresNodes.push( blochSphereNode );

      currentColumn++;
      if ( currentColumn >= lattice[ currentRow % lattice.length ] ) {
        currentColumn = lattice[ currentRow % lattice.length ] === 3 ? 0.5 : 0;
        currentRow++;
      }
    } );

    const multipleMeasurementBlochSpheresNode = new Node( {
      children: multipleMeasurementBlochSpheresNodes,
      centerX: equationPanel.centerX,
      top: 70, // empirically determined
      visibleProperty: DerivedProperty.not( model.isSingleMeasurementModeProperty )
    } );

    const histogramNode = new BlochSphereHistogram(
      model.upMeasurementCountProperty,
      model.downMeasurementCountProperty,
      model.measurementAxisProperty, {
        tandem: providedOptions.tandem.createTandem( 'histogramNode' ),
        phetioFeatured: true
      }
    );

    const resetCountsButton = new EraserButton( {
      listener: () => model.resetCounts(),
      tandem: providedOptions.tandem.createTandem( 'resetCountsButton' )
    } );

    const measurementControlsTandem = providedOptions.tandem.createTandem( 'measurementControls' );
    const numberOfAtomsControlTandem = measurementControlsTandem.createTandem( 'numberOfAtomsControl' );
    const measurementAxisControlTandem = measurementControlsTandem.createTandem( 'measurementAxisControl' );
    const measurementDelayControlTandem = measurementControlsTandem.createTandem( 'measurementDelayControl' );

    const radioButtonItems = [ true, false ].map(
      isSingleMeasurement => {
        return {
          createNode: () => new HBox( {
            children: [
              new ShadedSphereNode( 14, ATOM_NODE_OPTIONS ),
              new Text( isSingleMeasurement ? `${TIMES}1` : `${TIMES}10`, { font: QuantumMeasurementConstants.TITLE_FONT } )
            ],
            spacing: 5
          } ),
          value: isSingleMeasurement,
          tandemName: isSingleMeasurement ? 'singleMeasurementRadioButton' : 'multipleMeasurementRadioButton'
        };
      }
    );
    const numberOfAtomsRadioButtonGroup = new AquaRadioButtonGroup(
      model.isSingleMeasurementModeProperty,
      radioButtonItems,
      {
        orientation: 'vertical',
        stretch: false,
        tandem: numberOfAtomsControlTandem.createTandem( 'numberOfAtomsRadioButtonGroup' ),
        phetioVisiblePropertyInstrumented: false // Visibility controlled by parent node
      }
    );

    const basisRadioButtonTextOptions: RichTextOptions = {
      font: QuantumMeasurementConstants.CONTROL_FONT,
      fill: 'black'
    };

    const measurementAxisRadioGroupItems = MeasurementAxis.enumeration.values.map( basis => {
      return {
        value: basis,
        createNode: () => new RichText(
          basis.label, basisRadioButtonTextOptions
        ),
        tandemName: `${basis.tandemName}RadioButton`
      };
    } );

    const measurementAxisRadioButtonGroup = new AquaRadioButtonGroup(
      model.measurementAxisProperty,
      measurementAxisRadioGroupItems,
      {
        orientation: 'horizontal',
        margin: 5,
        radioButtonOptions: {
          mouseAreaXDilation: 4,
          mouseAreaYDilation: 6,
          touchAreaXDilation: 4,
          touchAreaYDilation: 6
        },
        tandem: measurementAxisControlTandem.createTandem( 'measurementAxisRadioButtonGroup' ),
        phetioVisiblePropertyInstrumented: false // Visibility controlled by parent node
      }
    );

    const measurementTimerControl = new MeasurementTimerControl(
      model.timeToMeasurementProperty,
      model.measurementTimeProperty,
      {
        tandem: measurementDelayControlTandem.createTandem( 'measurementTimerControl' ),
        phetioVisiblePropertyInstrumented: false // Visibility controlled by parent node
      }
    );

    const labelTextOptions = { font: QuantumMeasurementConstants.CONTROL_FONT, maxWidth: TEXT_NODE_MAX_WIDTH };
    const titleToControlSpacing = 5;
    const numberOfAtomsControl = new VBox( {
      spacing: titleToControlSpacing,
      children: [
        new Text( QuantumMeasurementStrings.numberOfAtomsStringProperty, labelTextOptions ),
        numberOfAtomsRadioButtonGroup
      ],
      align: 'left',
      tandem: numberOfAtomsControlTandem
    } );
    const spinMeasurementAxisControl = new VBox( {
      spacing: titleToControlSpacing,
      children: [
        new Text( QuantumMeasurementStrings.spinMeasurementAxisStringProperty, labelTextOptions ),
        measurementAxisRadioButtonGroup
      ],
      align: 'left',
      tandem: measurementAxisControlTandem
    } );
    const measurementDelayControl = new VBox( {
      spacing: titleToControlSpacing,
      children: [
        new Text( QuantumMeasurementStrings.measurementDelayStringProperty, labelTextOptions ),
        measurementTimerControl
      ],
      align: 'left',
      tandem: measurementDelayControlTandem,
      visibleProperty: new GatedVisibleProperty( model.magneticFieldEnabledProperty, measurementDelayControlTandem )
    } );
    const panelWidth = Math.max(
      numberOfAtomsControl.localBounds.width,
      spinMeasurementAxisControl.localBounds.width,
      measurementDelayControl.localBounds.width
    );

    const measurementControlPanel = new Panel(
      new VBox( {
        spacing: 15,
        align: 'left',
        tandem: measurementControlsTandem,
        minContentWidth: panelWidth,
        children: [ numberOfAtomsControl, spinMeasurementAxisControl, measurementDelayControl ]
      } ),
      QuantumMeasurementConstants.PANEL_OPTIONS
    );

    // Define a DerivedStringProperty for the label that will appear on the button.
    const experimentControlButtonTextProperty = new DerivedStringProperty(
      [
        model.measurementStateProperty,
        model.magneticFieldEnabledProperty,
        QuantumMeasurementStrings.startStringProperty,
        QuantumMeasurementStrings.observeStringProperty,
        QuantumMeasurementStrings.reprepareStringProperty
      ],
      ( measurementState, magneticFieldEnabled, startString, observeString, reprepareString ) => {
        let buttonText;
        if ( measurementState === SpinMeasurementState.OBSERVED ) {
          buttonText = reprepareString;
        }
        else if ( magneticFieldEnabled ) {
          buttonText = startString;
        }
        else {
          buttonText = observeString;
        }
        return buttonText;
      }
    );

    // Define a derived Property for the color of the button, which changes based on the measurement state.
    const experimentControlButtonColorProperty = new DerivedProperty(
      [ model.measurementStateProperty ],
      measurementState => measurementState.colorProperty.value
    );

    const experimentControlButton = new TextPushButton(
      experimentControlButtonTextProperty,
      {
        listener: () => {
          if ( model.measurementStateProperty.value === SpinMeasurementState.PREPARED ) {
            model.initiateObservation();
          }
          else {
            model.reprepare();
          }
        },
        baseColor: experimentControlButtonColorProperty,
        font: QuantumMeasurementConstants.TITLE_FONT,
        enabledProperty: DerivedProperty.valueNotEqualsConstant( model.measurementStateProperty, SpinMeasurementState.TIMING_OBSERVATION ),
        xMargin: 20,
        yMargin: 6,
        maxWidth: measurementControlPanel.width,
        touchAreaXDilation: 5,
        touchAreaYDilation: 5,
        tandem: providedOptions.tandem.createTandem( 'experimentControlButton' ),
        textNodeOptions: {
          maxWidth: 150
        }
      }
    );

    const measurementControls = new VBox( {
      left: singleMeasurementBlochSphereNode.right + 60,
      align: 'center',
      top: 10,
      spacing: 10,
      children: [
        new VBox( {
          children: [
            histogramNode,
            resetCountsButton
          ]
        } ),
        measurementControlPanel,
        experimentControlButton
      ]
    } );

    const magneticFieldControlsTandem = providedOptions.tandem.createTandem( 'magneticFieldControls' );

    const magneticFieldCheckbox = new Checkbox(
      model.magneticFieldEnabledProperty,
      new Text( QuantumMeasurementStrings.magneticFieldStringProperty, {
        font: QuantumMeasurementConstants.CONTROL_FONT, maxWidth: TEXT_NODE_MAX_WIDTH
      } ),
      {
        spacing: 5,
        boxWidth: QuantumMeasurementConstants.CHECKBOX_BOX_WIDTH,
        bottom: QuantumMeasurementConstants.LAYOUT_BOUNDS.bottom - 30,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5,
        touchAreaXDilation: 5,
        touchAreaYDilation: 5,
        tandem: magneticFieldControlsTandem.createTandem( 'magneticFieldCheckbox' )
      }
    );
    magneticFieldCheckbox.localBoundsProperty.link( () => {
      magneticFieldCheckbox.centerX = multipleMeasurementBlochSpheresNode.centerX;
    } );

    const systemUnderTestNode = new SystemUnderTestNode(
      model.magneticFieldEnabledProperty,
      model.magneticFieldStrengthProperty,
      model.isSingleMeasurementModeProperty,
      model.measurementStateProperty,
      {
        tandem: providedOptions.tandem.createTandem( 'systemUnderTestNode' )
      }
    );

    const magneticFieldControl = new MagneticFieldControl( model.magneticFieldStrengthProperty, {
      visibleProperty: model.magneticFieldEnabledProperty,
      tandem: magneticFieldControlsTandem,

      // Make this the same height as the system under test node.
      minHeight: systemUnderTestNode.height,
      minWidth: systemUnderTestNode.width
    } );

    // As a design aesthetic, we want the magnetic field control to be roughly the same size as the system under test
    // node.  This assertion verifies that this is true.  If it fails, something has changed that needs to be fixed.
    assert && assert(
      magneticFieldControl.localBounds.equalsEpsilon( systemUnderTestNode.localBounds, 2 ),
      `magneticFieldControl and systemUnderTestNode should be roughly the same size but are ${magneticFieldControl.localBounds} and ${systemUnderTestNode.localBounds}`
    );

    const magneticFieldAndStrengthControl = new HBox( {
      children: [ magneticFieldControl, systemUnderTestNode ],
      spacing: 12,
      bottom: magneticFieldCheckbox.top - 20
    } );

    // Keep the two panels for the magnetic field and strength control and the system under test node centered.
    magneticFieldAndStrengthControl.localBoundsProperty.link( localBounds => {
      if ( localBounds.isFinite() ) {
        magneticFieldAndStrengthControl.left = singleMeasurementBlochSphereNode.centerX - localBounds.width / 2;
      }
    } );

    const options = optionize<BlochSphereMeasurementAreaOptions, SelfOptions, NodeOptions>()( {
      children: [
        equationPanel,
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
      experimentControlButton,
      magneticFieldCheckbox,
      magneticFieldAndStrengthControl,
      equationPanel,
      histogramNode
    ];
  }
}

quantumMeasurement.register( 'BlochSphereMeasurementArea', BlochSphereMeasurementArea );