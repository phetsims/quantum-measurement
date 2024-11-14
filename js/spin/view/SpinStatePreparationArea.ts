// Copyright 2024, University of Colorado Boulder

/**
 * SpinStatePreparationArea is a composite UI component that allows users to prepare the spin state of a quantum system
 * between three options: Z+, X+, Z-. It also shows a Bloch Sphere that represents the quantum state of the system.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ProbabilityValueControl from '../../coins/view/ProbabilityValueControl.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import DashedArrowNode from '../../common/view/DashedArrowNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { SpinDirection } from '../model/SpinDirection.js';
import SpinExperiment from '../model/SpinExperiment.js';
import SpinModel from '../model/SpinModel.js';
import BlochSphereWithProjectionNode from './BlochSphereWithProjectionNode.js';
import HBarOverTwoNode from './HBarOverTwoNode.js';

const ALPHA = QuantumMeasurementConstants.ALPHA;
const BETA = QuantumMeasurementConstants.BETA;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class SpinStatePreparationArea extends VBox {

  public constructor(
    model: SpinModel,
    layoutBounds: Bounds2,
    tandem: Tandem ) {

    const createRadioButtonGroupItem = ( spinDirection: SpinDirection ) => {
      const textSize = 15;
      const textOptions = { font: new PhetFont( textSize ) };
      return {
        createNode: () => new HBox( {
          justify: 'center',
          spacing: 30,
          children: [
            new Text( spinDirection.direction, textOptions ),
            new HBox( {
              justify: 'center',
              children: [
                new Text( spinDirection.description, textOptions ),
                spinDirection === SpinDirection.X_PLUS ? new Node() : new HBarOverTwoNode( textSize )
              ]
            } )
          ]
        } ),
        value: spinDirection,
        tandemName: `${spinDirection.tandemName}SpinDirectionRadioButton`
      };
    };

    const spinStateRadioButtonGroup = new RectangularRadioButtonGroup(
      model.particleSourceModel.spinStateProperty,
      SpinDirection.enumeration.values.map( quantity => createRadioButtonGroupItem( quantity ) ),
      {
        spacing: 10,
        center: new Vector2( 100, 100 ),
        tandem: tandem.createTandem( 'spinStateRadioButtonGroup' ),
        visibleProperty: new DerivedProperty( [ model.currentExperimentProperty ], currentExperiment => currentExperiment !== SpinExperiment.CUSTOM ),
        radioButtonOptions: {
          minWidth: 200,
          baseColor: QuantumMeasurementColors.controlPanelFillColorProperty
        }
      }
    );

    const spinStatePanel = new VBox( {
      children: [
        spinStateRadioButtonGroup
      ]
    } );

    const blochSphereNode = new BlochSphereWithProjectionNode(
      model.blochSphere,
      model.particleSourceModel.customSpinStateProperty,
      model.isCustomExperimentProperty,
      {
        tandem: tandem.createTandem( 'blochSphereNode' ),
        scale: 0.9
      } );

    const stateToPrepareStringProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.stateToPrepareStringProperty,
        QuantumMeasurementColors.tailsColorProperty,
        QuantumMeasurementColors.downColorProperty
      ],
      stateToPrepareString => `<b>${stateToPrepareString}</b> ( ${ALPHA}|${UP}${KET} + ${BETA}|${DOWN}${KET} )`
    );
    const stateToPrepareText = new RichText( stateToPrepareStringProperty, { font: new PhetFont( { size: 18, weight: 'bolder' } ) } );

    const stateReadoutStringProperty = new DerivedProperty(
      [
        model.particleSourceModel.customSpinStateProperty
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
          `|${QuantumMeasurementConstants.ALPHA}|<sup>2`,
          model.upProbabilityProperty,
          tandem.createTandem( 'classicalUpProbabilityControl' )
        ),
        new ProbabilityValueControl(
          `|${QuantumMeasurementConstants.BETA}|<sup>2`,
          model.downProbabilityProperty,
          tandem.createTandem( 'classicalDownProbabilityControl' )
        )
      ]
    } );


    const zProjectionCheckbox = new Checkbox(
      model.blochSphere.showZProjectionProperty,
      new HBox( {
        spacing: 5,
        children: [
          new Text( QuantumMeasurementStrings.zProjectionStringProperty, { font: new PhetFont( 15 ) } ),
          new DashedArrowNode( 0, 0, 0, -20, { stroke: 'blue', fill: 'blue', scale: 1 } )
        ]
      } ),
      {
        visibleProperty: model.isCustomExperimentProperty,
        tandem: tandem.createTandem( 'zProjectionCheckbox' )
      }
    );

    const xProjectionCheckbox = new Checkbox(
      model.blochSphere.showXProjectionProperty,
      new HBox( {
        spacing: 5,
        children: [
          new Text( QuantumMeasurementStrings.xProjectionStringProperty, { font: new PhetFont( 15 ) } ),
          new DashedArrowNode( 0, 0, 20, 0, { stroke: 'red', fill: 'red', scale: 1 } )
        ]
      } ),
      {
        visibleProperty: model.isCustomExperimentProperty,
        tandem: tandem.createTandem( 'xProjectionCheckbox' )
      }
    );


    super( {
      children: [
        blochSphereNode,
        stateToPrepareText,
        stateReadout,
        spinStatePanel,
        probabilityControlBox,
        new VBox( {
          spacing: 20,
          children: [
            zProjectionCheckbox,
            xProjectionCheckbox
          ],
          align: 'left'
        } )
      ],
      spacing: 20,
      centerY: layoutBounds.centerY
    } );
  }
}

quantumMeasurement.register( 'SpinStatePreparationArea', SpinStatePreparationArea );