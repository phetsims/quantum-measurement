// Copyright 2024-2025, University of Colorado Boulder


/**
 * InitialCoinStateSelectorNode is a UI component that enables the user to select the initial state of a classical or
 * quantum coin.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import GatedVisibleProperty from '../../../../axon/js/GatedVisibleProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates, ClassicalCoinStateValues } from '../model/ClassicalCoinStates.js';
import { CoinStates } from '../model/CoinStates.js';
import { QuantumCoinStates, QuantumCoinStateValues } from '../model/QuantumCoinStates.js';
import ClassicalCoinNode from './ClassicalCoinNode.js';
import CoinNode from './CoinNode.js';
import QuantumCoinNode from './QuantumCoinNode.js';

const RADIO_BUTTON_COIN_NODE_RADIUS = 16;
const INDICATOR_COIN_NODE_RADIUS = 36;
const WIDTH = 260;

export default class InitialCoinStateSelectorNode extends VBox {

  public readonly orientationIndicatorCoinNode: CoinNode;

  public constructor( initialCoinStateProperty: Property<CoinStates>,
                      upProbabilityProperty: TReadOnlyProperty<number>,
                      preparingExperimentProperty: TReadOnlyProperty<boolean>,
                      coinType: SystemType,
                      tandem: Tandem ) {

    assert && assert(
      coinType === SystemType.CLASSICAL &&
      ClassicalCoinStateValues.includes( initialCoinStateProperty.value as ClassicalCoinStates ) ||
      coinType === SystemType.QUANTUM &&
      QuantumCoinStateValues.includes( initialCoinStateProperty.value as QuantumCoinStates ),
      'the specified coinType does not match with initialCoinStateProperty'
    );

    const titleStringProperty = coinType === SystemType.CLASSICAL ?
                                QuantumMeasurementStrings.initialOrientationStringProperty :
                                QuantumMeasurementStrings.basisStateStringProperty;

    const selectionPanelTitle = new Text( titleStringProperty, {
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      maxWidth: WIDTH * 0.95
    } );

    const initialOrientationControlTandem = tandem.createTandem( 'initialOrientationControl' );

    // A11y Names for each coin state
    const coinStateToA11yNameMap = new Map<CoinStates, TReadOnlyProperty<string>>(
      [
        [ 'heads', QuantumMeasurementStrings.a11y.coinsScreen.coinStates.headsStringProperty ],
        [ 'tails', QuantumMeasurementStrings.a11y.coinsScreen.coinStates.tailsStringProperty ],
        [ 'up', QuantumMeasurementStrings.a11y.coinsScreen.coinStates.upStringProperty ],
        [ 'down', QuantumMeasurementStrings.a11y.coinsScreen.coinStates.downStringProperty ]
      ]
    );

    let initialCoinStateItems; //: RectangularRadioButtonGroupItem[];
    if ( coinType === SystemType.CLASSICAL ) {
      initialCoinStateItems = ClassicalCoinStateValues.map( stateValue => {
        return {
          value: stateValue,
          createNode: () => new ClassicalCoinNode(
            new Property<ClassicalCoinStates>( stateValue ),
            RADIO_BUTTON_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          ),
          tandemName: `${stateValue}RadioButton`,
          options: {
            accessibleName: coinStateToA11yNameMap.get( stateValue )
          }
        };
      } );
    }
    else {

      // The user isn't allowed to directly select the 'superposition' state, so we don't include it in the list.
      const collapsedQuantumCoinStateValues = QuantumCoinStateValues.filter( stateValue => stateValue !== 'superposition' );
      initialCoinStateItems = collapsedQuantumCoinStateValues.map( stateValue => {
        return {
          value: stateValue,
          createNode: () => new QuantumCoinNode(
            new Property<QuantumCoinStates>( stateValue ),
            new NumberProperty( stateValue === 'up' ? 1 : 0 ),
            RADIO_BUTTON_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          ),
          tandemName: `${stateValue}RadioButton`,
          options: {
            accessibleName: coinStateToA11yNameMap.get( stateValue )
          }
        };
      } );
    }

    const initialOrientationRadioButtonGroup = new RectangularRadioButtonGroup(
      initialCoinStateProperty,
      initialCoinStateItems,
      {
        spacing: 22,
        tandem: initialOrientationControlTandem.createTandem( 'initialOrientationRadioButtonGroup' ),
        orientation: 'horizontal',
        phetioVisiblePropertyInstrumented: false,
        accessibleName: titleStringProperty,
        accessibleHelpText: QuantumMeasurementStrings.a11y.coinsScreen.initialOrientationHelpTextStringProperty,
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

    const selectorPanel = new Panel( selectorPanelContent, combineOptions<PanelOptions>( {}, QuantumMeasurementConstants.PANEL_OPTIONS, {
      minWidth: WIDTH,
      visibleProperty: new GatedVisibleProperty( preparingExperimentProperty, initialOrientationControlTandem ),
      tandem: initialOrientationControlTandem,
      fill: 'transparent'
    } ) );

    selectorPanel.addLinkedElement( initialCoinStateProperty );

    // Add the Node that will indicate the initial orientation of the coin.
    let orientationIndicatorCoinNode;
    if ( coinType === SystemType.CLASSICAL ) {
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

      // Setting the quantum coin initial state to superposition if the probability is not deterministic
      // This has to be done AFTER the creation of radio buttons because they need to be associated to a
      // valid value
      if ( ( upProbabilityProperty.value !== 1 ) && ( upProbabilityProperty.value !== 0 ) ) {
        initialCoinStateProperty.value = 'superposition';
      }
    }

    super( {
      children: [ selectorPanel, orientationIndicatorCoinNode ],
      spacing: 25,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    this.orientationIndicatorCoinNode = orientationIndicatorCoinNode;
  }

  // radius of the state indicator coin
  public static readonly INDICATOR_COIN_NODE_RADIUS = INDICATOR_COIN_NODE_RADIUS;
}

quantumMeasurement.register( 'InitialCoinStateSelectorNode', InitialCoinStateSelectorNode );