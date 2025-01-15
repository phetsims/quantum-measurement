// Copyright 2025, University of Colorado Boulder

/**
 * BlochSphereMeasurementArea is the node that contains the measurement area for the Bloch Sphere screen. It contains the
 * UI elements for controlling magnetic field and basis of measurements...
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, RichText, RichTextOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import BlochSphereModel from '../model/BlochSphereModel.js';
import { MeasurementBasis } from '../model/MeasurementBasis.js';
import BlochSphereNumericalEquationNode from './BlochSphereNumericalEquationNode.js';
import MagneticFieldControl from './MagneticFieldControl.js';
import MagneticFieldNode from './MagneticFieldNode.js';
import MeasurementTimerControl from './MeasurementTimerControl.js';

type SelfOptions = EmptySelfOptions;

type BlochSphereMeasurementAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class BlochSphereMeasurementArea extends Node {

  public constructor( model: BlochSphereModel, providedOptions: BlochSphereMeasurementAreaOptions ) {

    const equationNode = new BlochSphereNumericalEquationNode( model, {
      tandem: providedOptions.tandem.createTandem( 'equationNode' ),
      centerY: -50
    } );

    const magneticFieldNode = new MagneticFieldNode( model.magneticFieldStrengthProperty, {
      visibleProperty: model.showMagneticFieldProperty
    } );

    const singleMeasurementBlochSphereNode = new BlochSphereNode( model.singleMeasurementBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'singleMeasurementBlochSphereNode' ),
      drawTitle: false,
      drawKets: false,
      drawAngleIndicators: true,
      center: magneticFieldNode.center,
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
    multipleMeasurementBlochSpheresNode.center = magneticFieldNode.center.plusXY( 0, 30 );

    const spinUpLabelStringProperty = new DerivedStringProperty(
      [ model.measurementBasisProperty ],
      measurementBasis => measurementBasis.label.value + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER
    );
    const spinDownLabelStringProperty = new DerivedStringProperty(
      [ model.measurementBasisProperty ],
      measurementBasis => measurementBasis.label.value + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER
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
      model.measurementBasisProperty,
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
      visibleProperty: model.showMagneticFieldProperty
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
        QuantumMeasurementStrings.observeStringProperty,
        QuantumMeasurementStrings.reprepareStringProperty
      ],
      ( measurementState, observeString, reprepareString ) => measurementState === 'observed' ?
                                                              reprepareString :
                                                              observeString
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
      top: magneticFieldNode.top - 50,
      spacing: 10,
      children: [
        measurementResultHistogram,
        measurementControlPanel,
        prepareObserveButton
      ]
    } );

    const magneticFieldControl = new MagneticFieldControl( model.magneticFieldStrengthProperty, {
      centerX: singleMeasurementBlochSphereNode.centerX,
      top: magneticFieldNode.bottom + 10,
      visibleProperty: model.showMagneticFieldProperty,
      tandem: providedOptions.tandem.createTandem( 'magneticFieldControl' )
    } );

    const options = optionize<BlochSphereMeasurementAreaOptions, SelfOptions, NodeOptions>()( {
      children: [
        equationNode,
        magneticFieldNode,
        singleMeasurementBlochSphereNode,
        multipleMeasurementBlochSpheresNode,
        measurementControls,
        magneticFieldControl
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