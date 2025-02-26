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
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
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
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import BlochSphereModel from '../model/BlochSphereModel.js';
import { MeasurementAxis } from '../model/MeasurementAxis.js';
import { SpinMeasurementState } from '../model/SpinMeasurementState.js';
import { StateDirection } from '../model/StateDirection.js';
import BlochSphereNumericalEquationNode from './BlochSphereNumericalEquationNode.js';
import MagneticFieldControl from './MagneticFieldControl.js';
import MeasurementTimerControl from './MeasurementTimerControl.js';
import SystemUnderTestNode, { ATOM_NODE_OPTIONS } from './SystemUnderTestNode.js';

type SelfOptions = EmptySelfOptions;
type BlochSphereMeasurementAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// constants
const TIMES = MathSymbols.TIMES;

// nominal max width of text elements, empirically determined
const MAX_WIDTH = 200;

const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class BlochSphereMeasurementArea extends Node {

  public constructor( model: BlochSphereModel, providedOptions: BlochSphereMeasurementAreaOptions ) {

    const aquaRadioButtonGroupItems: AquaRadioButtonGroupItem<StateDirection>[] = QuantumMeasurementConstants.plusDirections.map( direction => {
      return {
        value: direction,
        createNode: () => new Text( direction.shortName, { font: new PhetFont( 16 ) } ),
        tandemName: `${direction.tandemName}RadioButton`
      };
    } );

    const equationPanelTandem = providedOptions.tandem.createTandem( 'equationPanel' );

    const equationBasisBox = new HBox( {
      spacing: 5,
      children: [
        new Text( QuantumMeasurementStrings.basisColonStringProperty, { font: new PhetFont( 16 ), maxWidth: 100 } ),
        new AquaRadioButtonGroup( model.equationBasisProperty, aquaRadioButtonGroupItems, {
          orientation: 'horizontal',
          margin: 5,
          radioButtonOptions: {
            mouseAreaXDilation: 4,
            mouseAreaYDilation: 6,
            touchAreaXDilation: 4,
            touchAreaYDilation: 6
          },
          tandem: equationPanelTandem.createTandem( 'equationBasisRadioButtonGroup' )
        } )
      ]
    } );

    const equationNode = new BlochSphereNumericalEquationNode( model.singleMeasurementBlochSphere, {
      tandem: equationPanelTandem.createTandem( 'equationNode' ),
      basisProperty: model.equationBasisProperty
    } );

    const equationNodePanel = new Panel( new VBox( {
      spacing: 5,
      children: [
        equationNode,
        equationBasisBox
      ],
      tandem: equationPanelTandem,
      visibleProperty: model.isSingleMeasurementModeProperty
    } ), QuantumMeasurementConstants.panelOptions );

    // Keep the equation node panel centered based on its initial position.
    const equationNodePanelInitialCenterX = equationNodePanel.centerX;
    equationNodePanel.localBoundsProperty.link( () => {
      equationNodePanel.centerX = equationNodePanelInitialCenterX;
    } );

    const singleMeasurementBlochSphereNode = new BlochSphereNode( model.singleMeasurementBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'singleMeasurementBlochSphereNode' ),
      drawTitle: false,
      drawKets: false,
      drawAngleIndicators: true,
      centerX: equationNodePanel.centerX,
      top: equationNodePanel.bottom + 25,
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
        tandem: multipleMeasurementBlochSpheresTandem.createTandem( `blochSphere${index}` ),
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
      centerX: equationNodePanel.centerX,
      top: 70, // empirically determined
      visibleProperty: DerivedProperty.not( model.isSingleMeasurementModeProperty )
    } );

    const spinUpLabelStringProperty = new DerivedStringProperty(
      [ model.measurementAxisProperty ],
      measurementAxis => `|${UP}<sub>${measurementAxis.label}</sub>${KET}`
    );
    const spinDownLabelStringProperty = new DerivedStringProperty(
      [ model.measurementAxisProperty ],
      measurementAxis => `|${DOWN}<sub>${measurementAxis.label}</sub>${KET}`
    );

    const measurementResultHistogramTandem = providedOptions.tandem.createTandem( 'measurementResultHistogram' );
    const measurementResultHistogram = new QuantumMeasurementHistogram(
      model.upMeasurementCountProperty,
      model.downMeasurementCountProperty,
      [
        new RichText( spinUpLabelStringProperty ),
        new RichText( spinDownLabelStringProperty ) ],
      {
        tandem: measurementResultHistogramTandem
      }
    );

    const resetCountsButton = new EraserButton( {
      listener: () => model.resetCounts(),
      tandem: measurementResultHistogramTandem.createTandem( 'resetCountsButton' )
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
              new Text( isSingleMeasurement ? `${TIMES}1` : `${TIMES}10`, { font: new PhetFont( 18 ) } )
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
      font: new PhetFont( 18 ),
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

    const measurementTimerControl = new MeasurementTimerControl( model.timeToMeasurementProperty, model.measurementTimeProperty, {
      tandem: measurementDelayControlTandem.createTandem( 'measurementTimerControl' ),
      phetioVisiblePropertyInstrumented: false // Visibility controlled by parent node
    } );

    const boxSpacing = 5;
    const measurementControlPanel = new Panel( new VBox( {
      spacing: 10,
      align: 'left',
      tandem: measurementControlsTandem,
      children: [
        // The panel contains multiple sections for a specific control and smaller spacing. Title and component
        new VBox( {
          spacing: boxSpacing,
          children: [
            new Text( QuantumMeasurementStrings.numberOfAtomsStringProperty, { font: new PhetFont( 16 ), maxWidth: MAX_WIDTH } ),
            numberOfAtomsRadioButtonGroup
          ],
          tandem: numberOfAtomsControlTandem
        } ),

        new VBox( {
          spacing: boxSpacing,
          children: [
            new Text( QuantumMeasurementStrings.spinMeasurementAxisStringProperty, { font: new PhetFont( 16 ), maxWidth: MAX_WIDTH } ),
            measurementAxisRadioButtonGroup
          ],
          tandem: measurementAxisControlTandem
        } ),

        new VBox( {
          spacing: boxSpacing,
          children: [
            new Text( QuantumMeasurementStrings.measurementDelayStringProperty, { font: new PhetFont( 16 ), maxWidth: MAX_WIDTH } ),
            measurementTimerControl
          ],
          tandem: measurementDelayControlTandem,
          visibleProperty: new GatedVisibleProperty( model.magneticFieldEnabledProperty, measurementDelayControlTandem )
        } )
      ]
    } ), QuantumMeasurementConstants.panelOptions );

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
      measurementState => measurementState === SpinMeasurementState.OBSERVED ?
                          QuantumMeasurementColors.experimentButtonColorProperty.value :
                          QuantumMeasurementColors.startMeasurementButtonColorProperty.value
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
        font: new PhetFont( 18 ),
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
      left: singleMeasurementBlochSphereNode.right + 20,
      align: 'left',
      top: 10,
      spacing: 10,
      children: [
        new VBox( {
          children: [
            measurementResultHistogram,
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
      new Text( QuantumMeasurementStrings.enableMagneticFieldStringProperty, {
        font: new PhetFont( { size: 16 } ), maxWidth: MAX_WIDTH
      } ),
      {
        spacing: 10,
        centerX: multipleMeasurementBlochSpheresNode.centerX,
        bottom: QuantumMeasurementConstants.LAYOUT_BOUNDS.bottom - 55,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5,
        touchAreaXDilation: 5,
        touchAreaYDilation: 5,
        tandem: magneticFieldControlsTandem.createTandem( 'magneticFieldCheckbox' )
      }
    );

    const magneticFieldControl = new MagneticFieldControl( model.magneticFieldStrengthProperty, {
      visibleProperty: model.magneticFieldEnabledProperty,
      tandem: magneticFieldControlsTandem
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
      equationNodePanel,
      measurementControlPanel,
      magneticFieldAndStrengthControl,
      magneticFieldCheckbox,
      experimentControlButton,
      measurementResultHistogram
    ];
  }
}

quantumMeasurement.register( 'BlochSphereMeasurementArea', BlochSphereMeasurementArea );