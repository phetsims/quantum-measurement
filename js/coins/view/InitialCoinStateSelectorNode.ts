// Copyright 2024-2025, University of Colorado Boulder


/**
 * InitialCoinStateSelectorNode is a UI component that enables the user to select the initial state of a classical or
 * quantum coin.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates, ClassicalCoinStateValues } from '../model/ClassicalCoinStates.js';
import { QuantumUncollapsedCoinStates } from '../model/CoinsExperimentSceneModel.js';
import { QuantumCoinStates, QuantumCoinStateValues } from '../model/QuantumCoinStates.js';
import ClassicalCoinNode from './ClassicalCoinNode.js';
import CoinNode from './CoinNode.js';
import QuantumCoinNode from './QuantumCoinNode.js';

const RADIO_BUTTON_COIN_NODE_RADIUS = 16;
const INDICATOR_COIN_NODE_RADIUS = 36;

export default class InitialCoinStateSelectorNode extends VBox {

  public readonly orientationIndicatorCoinNode: CoinNode;

  public constructor( initialCoinStateProperty: Property<ClassicalCoinStates> | Property<QuantumUncollapsedCoinStates>,
                      upProbabilityProperty: TReadOnlyProperty<number>,
                      preparingExperimentProperty: TReadOnlyProperty<boolean>,
                      systemType: SystemType,
                      tandem: Tandem ) {

    assert && assert(
      systemType === 'classical' &&
      ClassicalCoinStateValues.includes( initialCoinStateProperty.value as ClassicalCoinStates ) ||
      systemType === 'quantum' &&
      QuantumCoinStateValues.includes( initialCoinStateProperty.value as QuantumCoinStates ),
      'the specified systemType does not match with initialCoinStateProperty'
    );

    const titleStringProperty = systemType === 'classical' ?
                                QuantumMeasurementStrings.initialOrientationStringProperty :
                                QuantumMeasurementStrings.basisStateStringProperty;

    const selectionPanelTitle = new Text( titleStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      maxWidth: 250
    } );

    const radioButtonGroupTandem = tandem.createTandem( 'radioButtonGroup' );

    let initialCoinStateItems;
    if ( systemType === 'classical' ) {
      initialCoinStateItems = ClassicalCoinStateValues.map( stateValue => {
        return {
          value: stateValue,
          createNode: () => new ClassicalCoinNode(
            new Property<ClassicalCoinStates>( stateValue ),
            RADIO_BUTTON_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          ),
          tandemName: `${stateValue}RadioButton`
        };
      } );
    }
    else {
      initialCoinStateItems = QuantumCoinStateValues.map( stateValue => {
        return {
          value: stateValue,
          createNode: () => new QuantumCoinNode(
            new Property<QuantumCoinStates>( stateValue ),
            new NumberProperty( stateValue === 'up' ? 1 : 0 ),
            RADIO_BUTTON_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          ),
          tandemName: `${stateValue}RadioButton`
        };
      } );
    }

    const initialOrientationRadioButtonGroup = new RectangularRadioButtonGroup(
      initialCoinStateProperty,
      initialCoinStateItems,
      {
        spacing: 22,
        tandem: radioButtonGroupTandem.createTandem( 'initialOrientationRadioButtonGroup' ),
        orientation: 'horizontal',
        phetioVisiblePropertyInstrumented: false,
        radioButtonOptions: {
          xMargin: 4,
          yMargin: 4,
          baseColor: Color.WHITE
        }
      }
    );

    const selectorPanelContent = new VBox( {
      children: [ selectionPanelTitle, initialOrientationRadioButtonGroup ],
      spacing: 10
    } );

    const selectorPanel = new Panel( selectorPanelContent, {
      fill: QuantumMeasurementColors.controlPanelFillColorProperty,
      stroke: QuantumMeasurementColors.controlPanelStrokeColorProperty,
      yMargin: 10,
      minWidth: 270,
      visibleProperty: new GatedVisibleProperty( preparingExperimentProperty, radioButtonGroupTandem ),
      tandem: radioButtonGroupTandem
    } );

    selectorPanel.addLinkedElement( initialCoinStateProperty );

    // Add the Node that will indicate the initial orientation of the coin.
    let orientationIndicatorCoinNode;
    if ( systemType === 'classical' ) {
      orientationIndicatorCoinNode = new ClassicalCoinNode(
        initialCoinStateProperty as Property<ClassicalCoinStates>,
        INDICATOR_COIN_NODE_RADIUS,
        Tandem.OPT_OUT
      );
    }
    else {
      orientationIndicatorCoinNode = new QuantumCoinNode(
        initialCoinStateProperty as Property<QuantumCoinStates>,
        upProbabilityProperty,
        INDICATOR_COIN_NODE_RADIUS,
        Tandem.OPT_OUT
      );
    }

    super( {
      children: [ selectorPanel, orientationIndicatorCoinNode ],
      spacing: 20
    } );

    this.orientationIndicatorCoinNode = orientationIndicatorCoinNode;
  }

  // radius of the state indicator coin
  public static readonly INDICATOR_COIN_NODE_RADIUS = INDICATOR_COIN_NODE_RADIUS;
}

quantumMeasurement.register( 'InitialCoinStateSelectorNode', InitialCoinStateSelectorNode );