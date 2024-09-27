// Copyright 2024, University of Colorado Boulder


/**
 * InitialCoinStateSelectorNode is a UI component that enables the user to select the initial state of a classical or
 * quantum coin.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, GatedVisibleProperty, HBox, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButton, { RectangularRadioButtonOptions } from '../../../../sun/js/buttons/RectangularRadioButton.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates, ClassicalCoinStateValues } from '../model/ClassicalCoinStates.js';
import { QuantumCoinStates, QuantumCoinStateValues, QuantumUncollapsedCoinStates } from '../model/QuantumCoinStates.js';
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
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    const radioButtonOptions = {
        xMargin: 4,
        yMargin: 4,
        baseColor: Color.WHITE
      };

    const radioButtonGroupTandem = tandem.createTandem( 'radioButtonGroup' );

    const createCoinRadioButton = ( stateValue: string, coinNode: CoinNode ) => {
      return new RectangularRadioButton(
        initialCoinStateProperty as Property<ClassicalCoinStates>,
        stateValue,
        combineOptions<RectangularRadioButtonOptions>( {
          content: coinNode,
          tandem: radioButtonGroupTandem.createTandem( `${stateValue.toLowerCase()}RadioButton` )
        }, radioButtonOptions )
      );
    };

    let initialCoinStateItems;
    if ( systemType === 'classical' ) {
      initialCoinStateItems = ClassicalCoinStateValues.map( stateValue => {
        return createCoinRadioButton( stateValue, new ClassicalCoinNode(
          new Property<ClassicalCoinStates>( stateValue ),
          RADIO_BUTTON_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        ) );
      } );
    }
    else {
      initialCoinStateItems = QuantumCoinStateValues.map( stateValue => {
        return createCoinRadioButton( stateValue, new QuantumCoinNode(
          new Property<QuantumCoinStates>( stateValue ),
          new NumberProperty( stateValue === 'up' ? 1 : 0 ),
          RADIO_BUTTON_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        ) );
      } );
    }

    const initialOrientationRadioButtonGroup = new HBox( {
      children: initialCoinStateItems,
      spacing: 22
    } );

    const selectorPanelContent = new VBox( {
      children: [ selectionPanelTitle, initialOrientationRadioButtonGroup ],
      spacing: 10
    } );

    const selectorPanel = new Panel( selectorPanelContent, {
      fill: new Color( '#eeeeee' ),
      stroke: null,
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
        tandem.createTandem( 'coinIndicatorNode' )
      );
    }
    else {
      orientationIndicatorCoinNode = new QuantumCoinNode(
        initialCoinStateProperty as Property<QuantumCoinStates>,
        upProbabilityProperty,
        INDICATOR_COIN_NODE_RADIUS,
        tandem.createTandem( 'coinIndicatorNode' )
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