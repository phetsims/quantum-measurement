// Copyright 2024, University of Colorado Boulder


/**
 * InitialCoinStateSelectorNode is a UI component that enables the user to select the initial state of a physical or
 * quantum coin.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Color, Text, VBox } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates, ClassicalCoinStateValues } from '../model/ClassicalCoinStates.js';
import ClassicalCoinNode from './ClassicalCoinNode.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import { QuantumCoinStates, QuantumCoinStateValues } from '../model/QuantumCoinStates.js';
import QuantumCoinNode from './QuantumCoinNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CoinNode from './CoinNode.js';

const RADIO_BUTTON_COIN_NODE_RADIUS = 16;
const INDICATOR_COIN_NODE_RADIUS = 36;

export default class InitialCoinStateSelectorNode extends VBox {

  public readonly orientationIndicatorCoinNode: CoinNode;

  public constructor( initialCoinStateProperty: TReadOnlyProperty<ClassicalCoinStates> | TReadOnlyProperty<QuantumCoinStates>,
                      stateBiasProperty: TReadOnlyProperty<number>,
                      preparingExperimentProperty: TReadOnlyProperty<boolean>,
                      systemType: SystemType,
                      tandem: Tandem ) {

    assert && assert(
      systemType === 'physical' &&
      ClassicalCoinStateValues.includes( initialCoinStateProperty.value as ClassicalCoinStates ) ||
      systemType === 'quantum' &&
      QuantumCoinStateValues.includes( initialCoinStateProperty.value as QuantumCoinStates ),
      'the specified systemType does not match with initialCoinStateProperty'
    );

    const titleStringProperty = systemType === 'physical' ?
                                QuantumMeasurementStrings.initialOrientationStringProperty :
                                QuantumMeasurementStrings.basisStateStringProperty;

    const selectionPanelTitle = new Text( titleStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } )
    } );

    const radioButtonGroupOptions: RectangularRadioButtonGroupOptions = {
      orientation: 'horizontal',
      spacing: 22,
      radioButtonOptions: {
        xMargin: 4,
        yMargin: 4,
        baseColor: Color.WHITE
      },
      tandem: tandem.createTandem( 'initialOrientationRadioButtonGroup' )
    };

    let initialOrientationRadioButtonGroup;
    if ( systemType === 'physical' ) {
      const initialCoinStateItems = ClassicalCoinStateValues.map( stateValue => ( {
        createNode: () => new ClassicalCoinNode(
          new Property<ClassicalCoinStates>( stateValue ),
          RADIO_BUTTON_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        ),
        value: stateValue,
        tandemName: `${stateValue.toLowerCase()}RadioButton`
      } ) );
      initialOrientationRadioButtonGroup = new RectangularRadioButtonGroup<ClassicalCoinStates>(
        initialCoinStateProperty as Property<ClassicalCoinStates>,
        initialCoinStateItems,
        radioButtonGroupOptions
      );
    }
    else {
      const initialCoinStateItems = QuantumCoinStateValues.map( stateValue => ( {
        createNode: () => new QuantumCoinNode(
          new Property<QuantumCoinStates>( stateValue ),
          new NumberProperty( stateValue === 'up' ? 1 : 0 ),
          RADIO_BUTTON_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        ),
        value: stateValue,
        tandemName: `${stateValue.toLowerCase()}RadioButton`
      } ) );
      initialOrientationRadioButtonGroup = new RectangularRadioButtonGroup<QuantumCoinStates>(
        initialCoinStateProperty as Property<QuantumCoinStates>,
        initialCoinStateItems,
        radioButtonGroupOptions
      );
    }

    const selectorPanelContent = new VBox( {
      children: [ selectionPanelTitle, initialOrientationRadioButtonGroup ],
      spacing: 10
    } );

    const selectorPanel = new Panel( selectorPanelContent, {
      fill: new Color( '#eeeeee' ),
      stroke: null,
      yMargin: 10,
      minWidth: 270,
      visibleProperty: preparingExperimentProperty
    } );

    // Add the Node that will indicate the initial orientation of the coin.
    let orientationIndicatorCoinNode;
    if ( systemType === 'physical' ) {
      orientationIndicatorCoinNode = new ClassicalCoinNode(
        initialCoinStateProperty as Property<ClassicalCoinStates>,
        INDICATOR_COIN_NODE_RADIUS,
        tandem.createTandem( 'coinIndicatorNode' )
      );
    }
    else {
      orientationIndicatorCoinNode = new QuantumCoinNode(
        initialCoinStateProperty as Property<QuantumCoinStates>,
        stateBiasProperty,
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