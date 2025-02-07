// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinExperimentMeasurementArea is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where users can flip and reveal coins. Depending on how this is parameterized, the coins may either
 * be classical or quantum coins.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinsExperimentSceneModel, { MAX_COINS, MULTI_COIN_EXPERIMENT_QUANTITIES } from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentButtonSet from './CoinExperimentButtonSet.js';
import CoinMeasurementHistogram from './CoinMeasurementHistogram.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import ManyCoinNodeManager from './ManyCoinNodeManager.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';
import MultipleCoinNodeManager from './MultipleCoinNodeManager.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import SingleCoinNodeManager from './SingleCoinNodeManager.js';
import SingleCoinTestBox from './SingleCoinTestBox.js';

const RADIO_BUTTON_FONT = new PhetFont( 12 );

class CoinExperimentMeasurementArea extends VBox {

  // Boolean Properties that track whether the coins that go into the test boxes are fully enclosed there. This is an
  // internal-only thing and is not available to phet-io.
  private readonly singleCoinInTestBoxProperty: TProperty<boolean>;
  private readonly coinSetInTestBoxProperty: TProperty<boolean>;

  public readonly manyCoinsAnimations: ManyCoinNodeManager;

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColorProperty = sceneModel.systemType === 'quantum' ?
                              QuantumMeasurementColors.quantumSceneTextColorProperty :
                              QuantumMeasurementColors.classicalSceneTextColorProperty;
    const singleCoinInTestBoxProperty = new BooleanProperty( false );
    const coinSetInTestBoxProperty = new BooleanProperty( false );

    // Add the top header for the measurement area. It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way. See https://github.com/phetsims/quantum-measurement/issues/35.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    const singleCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColorProperty }
    );

    // Create the box where the single coin will be placed while it is experimented with.
    const singleCoinTestBox = new SingleCoinTestBox( sceneModel.singleCoin.measurementStateProperty );

    // Create the buttons that will be used to control the single-coin test box.
    const singleCoinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.singleCoin,
      singleCoinInTestBoxProperty,
      {
        tandem: tandem.createTandem( 'singleCoinExperimentButtonSet' ),
        visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty ),
        singleCoin: true
      }
    );

    // Create the composite node that represents the test box and the controls where the user will experiment with a
    // single coin.
    const singleCoinMeasurementArea = new HBox( {
      children: [ singleCoinTestBox, singleCoinExperimentButtonSet ],
      spacing: 30,
      accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.singleCoinMeasurementsStringProperty,
      tagName: 'div',
      labelTagName: 'h3'
    } );

    // Add the lower heading for the measurement area.
    const multiCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.multipleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColorProperty }
    );

    // Add the area where the multiple coins will be hidden and revealed.
    const multipleCoinTestBox = new MultiCoinTestBox(
      sceneModel.coinSet,
      sceneModel.coinSet.measurementStateProperty,
      sceneModel.coinSet.numberOfActiveSystemsProperty,
      sceneModel.coinSet.measuredDataChangedEmitter
    );
    const multiCoinExperimentHistogramTandem = tandem.createTandem( 'multiCoinExperimentHistogram' );
    const multiCoinExperimentHistogram = new CoinMeasurementHistogram( sceneModel.coinSet, sceneModel.systemType, {
      visibleProperty: new GatedVisibleProperty(
        DerivedProperty.not( sceneModel.preparingExperimentProperty ),
        multiCoinExperimentHistogramTandem
      ),
      tandem: multiCoinExperimentHistogramTandem,
      leftFillColorProperty: sceneModel.systemType === 'classical' ? QuantumMeasurementColors.headsColorProperty : QuantumMeasurementColors.upColorProperty,
      rightFillColorProperty: sceneModel.systemType === 'classical' ? QuantumMeasurementColors.tailsColorProperty : QuantumMeasurementColors.downColorProperty
    } );
    const multipleCoinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.coinSet,
      coinSetInTestBoxProperty,
      {
        tandem: tandem.createTandem( 'multipleCoinExperimentButtonSet' ),
        visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty ),
        singleCoin: false
      }
    );

    // Create a control that consists of a label and a group of radio buttons for selecting the number of coins to model
    // in the multi-coin mode.
    const numberOfCoinsSelectorTitle = new Text( QuantumMeasurementStrings.identicalCoinsStringProperty, {
      font: new PhetFont( 14 ),
      maxWidth: 200 // empirically determined
    } );

    const createRadioButtonGroupItem = ( value: number ) => {
      const valueText = value.toString();
      return {
        createNode: () => new Text( valueText, { font: RADIO_BUTTON_FONT } ),
        value: value,
        tandemName: `${valueText}CoinsRadioButton`,
        options: {
          accessibleName: valueText
        }
      };
    };

    const numberOfCoinsRadioButtonGroupTandem = tandem.createTandem( 'numberOfCoinsRadioButtonGroup' );
    const numberOfCoinsRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      sceneModel.coinSet.numberOfActiveSystemsProperty,
      MULTI_COIN_EXPERIMENT_QUANTITIES.map( quantity => createRadioButtonGroupItem( quantity ) ),
      {
        spacing: 10,
        tandem: numberOfCoinsRadioButtonGroupTandem.createTandem( 'radioButtonGroup' ),
        phetioVisiblePropertyInstrumented: false,
        accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.identicalCoinsStringProperty,
        helpText: QuantumMeasurementStrings.a11y.coinsScreen.identicalCoinsHelpTextStringProperty,
        labelTagName: 'h4'
      }
    );

    const numberOfCoinsSelector = new VBox( {
      children: [ numberOfCoinsSelectorTitle, numberOfCoinsRadioButtonGroup ],
      spacing: 12,
      visibleProperty: new GatedVisibleProperty( sceneModel.preparingExperimentProperty, numberOfCoinsRadioButtonGroupTandem ),
      tandem: numberOfCoinsRadioButtonGroupTandem
    } );

    const multipleCoinTestBoxContainer = new Node( {
      children: [
        multipleCoinTestBox
      ]
    } );

    // Create the composite node that represents to test box and controls where the user will experiment with multiple
    // coins at once.
    const multipleCoinMeasurementArea = new HBox( {
      children: [
        multipleCoinTestBoxContainer,
        numberOfCoinsSelector,
        multiCoinExperimentHistogram,
        multipleCoinExperimentButtonSet
      ],
      spacing: 30,
      accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.multipleCoinMeasurementsStringProperty,
      tagName: 'div',
      labelTagName: 'h3'
    } );

    super( {
      children: [
        singleCoinSectionHeader,
        singleCoinMeasurementArea,
        multiCoinSectionHeader,
        multipleCoinMeasurementArea
      ],
      spacing: 25
    } );

    this.singleCoinInTestBoxProperty = singleCoinInTestBoxProperty;
    this.coinSetInTestBoxProperty = coinSetInTestBoxProperty;

    // Create the node that will be used to cover (aka "mask") the coin so that its state can't be seen.
    const maskRadius = InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS * 1.02;
    const coinMask = new Circle( maskRadius, {
      fill: QuantumMeasurementColors.maskedFillColorProperty,
      stroke: QuantumMeasurementColors.coinStrokeColorProperty,
      lineWidth: 7,
      visibleProperty: new DerivedProperty(
        [ sceneModel.preparingExperimentProperty, sceneModel.singleCoin.measurementStateProperty ],
        ( preparingExperiment, singleCoinExperimentState ) =>
          !preparingExperiment && singleCoinExperimentState !== 'revealed'
      )
    } );
    singleCoinTestBox.clippedTestBox.addChild( coinMask );
    coinMask.moveToBack();

    const singleCoinAnimations = new SingleCoinNodeManager(
      sceneModel,
      this,
      coinMask,
      singleCoinTestBox.clippedTestBox,
      this.singleCoinInTestBoxProperty
    );

    const multipleCoinAnimations = new MultipleCoinNodeManager(
      sceneModel,
      this,
      multipleCoinTestBox,
      this.coinSetInTestBoxProperty
    );

    const manyCoinsAnimations = new ManyCoinNodeManager(
      sceneModel,
      this,
      multipleCoinTestBox,
      this.coinSetInTestBoxProperty
    );

    // Monitor the preparation state and start or stop animations as needed.
    sceneModel.preparingExperimentProperty.lazyLink( preparingExperiment => {
      if ( preparingExperiment ) {

        // Abort any in-progress animations - the scene model is going back into the preparation mode. If there are no
        // such animations, this has no effect.
        singleCoinAnimations.abortIngressAnimationForSingleCoin();
        multipleCoinAnimations.abortIngressAnimationForCoinSet();
        manyCoinsAnimations.abortIngressAnimationForCoinSet();

        // Clear out the test boxes.
        singleCoinAnimations.clearSingleCoinTestBox();
        multipleCoinTestBox.clearContents();
      }
      else {

        // The user is ready to make measurements on the coins, so animate the coins for both the single and multi-coin
        // experiments from the preparation area to the measurement area.
        singleCoinAnimations.startIngressAnimationForSingleCoin( false );
        if ( sceneModel.coinSet.numberOfActiveSystemsProperty.value === MAX_COINS ) {
          manyCoinsAnimations.startIngressAnimationForCoinSet( false );
        }
        else {
          multipleCoinAnimations.startIngressAnimationForCoinSet( false );
        }
      }
    } );

    // Listen to the state of the coin and animate a flipping motion for the classical coin or a travel-from-the-prep-
    // area animation for the quantum coin.
    sceneModel.singleCoin.measurementStateProperty.lazyLink( singleCoinAnimations.flipCoin );

    sceneModel.coinSet.measurementStateProperty.link( measurementState => {

      if ( measurementState === 'preparingToBeMeasured' ) {
        if ( sceneModel.systemType === 'quantum' ) {

          // Abort any previous animations and clear out the test box.
          multipleCoinAnimations.abortIngressAnimationForCoinSet();
          manyCoinsAnimations.abortIngressAnimationForCoinSet();
          multipleCoinTestBox.clearContents();

          // Animate a coin from the prep area to the single coin test box to indicate that a new "quantum coin" is
          // being prepared for measurement.
          if ( sceneModel.coinSet.numberOfActiveSystemsProperty.value === MAX_COINS ) {
            manyCoinsAnimations.startIngressAnimationForCoinSet( true );
          }
          else {
            multipleCoinAnimations.startIngressAnimationForCoinSet( true );
          }
        }
      }
    } );

    this.manyCoinsAnimations = manyCoinsAnimations;
  }
}

quantumMeasurement.register( 'CoinExperimentMeasurementArea', CoinExperimentMeasurementArea );

export default CoinExperimentMeasurementArea;