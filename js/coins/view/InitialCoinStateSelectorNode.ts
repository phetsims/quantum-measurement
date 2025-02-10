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
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates, ClassicalCoinStateValues } from '../model/ClassicalCoinStates.js';
import { CoinFaceStates } from '../model/CoinFaceStates.js';
import { QuantumCoinStates, QuantumCoinStateValues } from '../model/QuantumCoinStates.js';
import ClassicalCoinNode from './ClassicalCoinNode.js';
import CoinNode from './CoinNode.js';
import QuantumCoinNode from './QuantumCoinNode.js';

const RADIO_BUTTON_COIN_NODE_RADIUS = 16;
const INDICATOR_COIN_NODE_RADIUS = 36;

export default class InitialCoinStateSelectorNode extends VBox {

  public readonly orientationIndicatorCoinNode: CoinNode;

  public constructor( initialCoinStateProperty: Property<CoinFaceStates>,
                      upProbabilityProperty: TReadOnlyProperty<number>,
                      preparingExperimentProperty: TReadOnlyProperty<boolean>,
                      coinType: SystemType,
                      tandem: Tandem ) {

    assert && assert(
      coinType === 'classical' &&
      ClassicalCoinStateValues.includes( initialCoinStateProperty.value as ClassicalCoinStates ) ||
      coinType === 'quantum' &&
      QuantumCoinStateValues.includes( initialCoinStateProperty.value as QuantumCoinStates ),
      'the specified coinType does not match with initialCoinStateProperty'
    );

    const titleStringProperty = coinType === 'classical' ?
                                QuantumMeasurementStrings.initialOrientationStringProperty :
                                QuantumMeasurementStrings.basisStateStringProperty;

    const selectionPanelTitle = new Text( titleStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      maxWidth: 250
    } );

    const radioButtonGroupTandem = tandem.createTandem( 'radioButtonGroup' );

    const toTitleCase = ( str: string ) => {
      return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
    };
    let initialCoinStateItems; //: RectangularRadioButtonGroupItem[];
    if ( coinType === 'classical' ) {
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
            accessibleName: toTitleCase( stateValue )
          }
        };
      } );
    }
    else {

      // The user isn't allowed to directly select the 'superposed' state, so we don't include it in the list.
      const collapsedQuantumCoinStateValues = QuantumCoinStateValues.filter( stateValue => stateValue !== 'superposed' );
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
            accessibleName: toTitleCase( stateValue )
          }
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
        labelTagName: 'h4',
        accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.initialOrientationStringProperty,
        helpText: QuantumMeasurementStrings.a11y.coinsScreen.initialOrientationHelpTextStringProperty,
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
    if ( coinType === 'classical' ) {
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