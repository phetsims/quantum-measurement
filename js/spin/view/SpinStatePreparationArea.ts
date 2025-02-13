// Copyright 2024-2025, University of Colorado Boulder

/**
 * SpinStatePreparationArea is a composite UI component that allows users to prepare the spin state of a quantum system
 * between three options: Z+, X+, Z-. It also shows a Bloch Sphere that represents the quantum state of the system.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProbabilityValueControl from '../../coins/view/ProbabilityValueControl.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import DashedArrowNode from '../../common/view/DashedArrowNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { SpinDirection } from '../model/SpinDirection.js';
import SpinExperiment from '../model/SpinExperiment.js';
import SpinModel from '../model/SpinModel.js';
import BlochSphereWithProjectionNode from './BlochSphereWithProjectionNode.js';

const ALPHA = MathSymbols.ALPHA;
const BETA = MathSymbols.BETA;
const UP = `${QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER}<sub>Z</sub>`;
const DOWN = `${QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER}<sub>Z</sub>`;
const KET = QuantumMeasurementConstants.KET;

export default class SpinStatePreparationArea extends VBox {

  public constructor(
    model: SpinModel,
    layoutBounds: Bounds2,
    tandem: Tandem ) {

    const spinStateRadioButtonGroupTandem = tandem.createTandem( 'spinStateRadioButtonGroup' );

    const basisRadioButtonTextOptions = { font: new PhetFont( { size: 22, weight: 'bold' } ) };
    const basisRadioGroupItems = SpinDirection.enumeration.values.map( basis => {
      return {
        value: basis,
        createNode: () => new RichText(
          basis.direction, basisRadioButtonTextOptions
        ),
        tandemName: `${basis.tandemName}RadioButton`
      };
    } );

    const pointerAreaDilation = 6;
    const spinStateRadioButtonGroup = new AquaRadioButtonGroup( model.particleSourceModel.spinStateProperty, basisRadioGroupItems, {
      orientation: 'vertical',
      margin: 5,
      radioButtonOptions: {
        radius: 10,
        mouseAreaXDilation: pointerAreaDilation,
        mouseAreaYDilation: pointerAreaDilation,
        touchAreaXDilation: pointerAreaDilation,
        touchAreaYDilation: pointerAreaDilation
      },
      tandem: spinStateRadioButtonGroupTandem,
      visibleProperty: new GatedVisibleProperty( new DerivedProperty( [ model.currentExperimentProperty ], currentExperiment => currentExperiment !== SpinExperiment.CUSTOM ), spinStateRadioButtonGroupTandem )
    } );

    const spinStatePanel = new VBox( {
      children: [
        spinStateRadioButtonGroup
      ]
    } );

    const blochSphereNode = new BlochSphereWithProjectionNode(
      model.blochSphere,
      model.derivedSpinStateProperty,
      model.isCustomExperimentProperty,
      {
        tandem: tandem.createTandem( 'blochSphereNode' ),
        scale: 0.9
      } );

    const stateToPrepareText = new RichText( QuantumMeasurementStrings.spinStateToPrepareStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bolder' } ),
      maxWidth: 250
    } );
    const symbolicEquationText = new RichText( `${ALPHA}|${UP}${KET} + ${BETA}|${DOWN}${KET}`,
      { font: new PhetFont( { size: 18, weight: 'bolder' } ) } );

    const stateReadoutStringProperty = new DerivedProperty(
      [
        model.derivedSpinStateProperty
      ],
      spinState => {

        const upProbability = ( spinState.dot( new Vector2( 0, 1 ) ) + 1 ) / 2;
        const downProbability = 1 - upProbability;
        const alphaValue = Utils.toFixed( Math.sqrt( upProbability ), 3 );
        const betaValue = Utils.toFixed( Math.sqrt( downProbability ), 3 );
        return `${alphaValue}|${UP}${KET} + ${betaValue}|${DOWN}${KET}`;
      } );

    const stateReadout = new RichText( stateReadoutStringProperty, { font: new PhetFont( 18 ) } );

    const probabilityControlBox = new VBox( {
      visibleProperty: new DerivedProperty( [ model.currentExperimentProperty ], currentExperiment => currentExperiment === SpinExperiment.CUSTOM ),
      children: [
        new ProbabilityValueControl(
          `|${MathSymbols.ALPHA}|<sup>2`,
          model.alphaSquaredProperty,
          tandem.createTandem( 'alphaSquaredControl' )
        ),
        new ProbabilityValueControl(
          `|${MathSymbols.BETA}|<sup>2`,
          model.betaSquaredProperty,
          tandem.createTandem( 'betaSquaredControl' )
        )
      ]
    } );


    const projectionsCheckboxesTandem = tandem.createTandem( 'projectionsCheckboxes' );
    const zProjectionCheckbox = new Checkbox(
      model.blochSphere.showZProjectionProperty,
      new HBox( {
        spacing: 5,
        children: [
          new Text( 'Z', { font: new PhetFont( 15 ) } ),
          new DashedArrowNode( 0, 0, 0, -20, { stroke: 'blue', fill: 'blue', scale: 1 } )
        ]
      } ),
      {
        tandem: projectionsCheckboxesTandem.createTandem( 'zProjectionCheckbox' ),
        boxWidth: 18
      }
    );

    const xProjectionCheckbox = new Checkbox(
      model.blochSphere.showXProjectionProperty,
      new HBox( {
        spacing: 5,
        children: [
          new Text( 'X', { font: new PhetFont( 15 ) } ),
          new DashedArrowNode( 0, 0, 20, 0, { stroke: 'red', fill: 'red', scale: 1 } )
        ]
      } ),
      {
        tandem: projectionsCheckboxesTandem.createTandem( 'xProjectionCheckbox' ),
        boxWidth: 18
      }
    );

    const projectionCheckboxes = new HBox( {
      spacing: 20,
      tandem: projectionsCheckboxesTandem,
      visibleProperty: model.isCustomExperimentProperty,
      children: [
        new Text( QuantumMeasurementStrings.projectionStringProperty, {
          font: new PhetFont( 15 ),
          maxWidth: 100
        } ),
        zProjectionCheckbox,
        xProjectionCheckbox
      ]
    } );

    super( {
      children: [
        blochSphereNode,
        projectionCheckboxes,
        new VBox( { children: [ stateToPrepareText, symbolicEquationText ], spacing: 5 } ),
        stateReadout,
        spinStatePanel,
        probabilityControlBox
      ],
      spacing: 20
    } );

    // Reposition for a wider layout
    model.currentExperimentProperty.link( () => {
      this.centerY = layoutBounds.centerY;
    } );
  }
}

quantumMeasurement.register( 'SpinStatePreparationArea', SpinStatePreparationArea );