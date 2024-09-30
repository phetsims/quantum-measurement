// Copyright 2024, University of Colorado Boulder

/**
 * CoinExperimentMeasurementArea is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where users can flip and reveal coins. Depending on how this is parameterized, the coins may either
 * be classical or quantum coins.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinsExperimentSceneModel, { MAX_COINS, MULTI_COIN_EXPERIMENT_QUANTITIES } from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentButtonSet from './CoinExperimentButtonSet.js';
import CoinMeasurementHistogram from './CoinMeasurementHistogram.js';
import CoinSetPixelRepresentation from './CoinSetPixelRepresentation.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';
import MultipleCoinAnimations from './MultipleCoinAnimations.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import SingleCoinAnimations from './SingleCoinAnimations.js';
import TwoStateSystem from '../../common/model/TwoStateSystem.js';
import SingleCoinTestBox from './SingleCoinTestBox.js';

const RADIO_BUTTON_FONT = new PhetFont( 12 );

export default class CoinExperimentMeasurementArea extends VBox {

  // Boolean Properties that track whether the coins that go into the test boxes are fully enclosed there. This is an
  // internal-only thing and is not available to phet-io.
  private readonly singleCoinInTestBoxProperty: TProperty<boolean>;
  private readonly coinSetInTestBoxProperty: TProperty<boolean>;

  private measuredCoinsPixelRepresentation: CoinSetPixelRepresentation;

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColor = sceneModel.systemType === 'quantum' ? Color.BLUE : Color.BLACK;
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
      { textColor: textColor }
    );

    // Create the box where the single coin will be placed while it is experimented with.
    const singleCoinTestBox = new SingleCoinTestBox( sceneModel.singleCoin.measurementStateProperty, {
      tandem: tandem.createTandem( 'singleCoinTestBox' )
    } );

    // Create the buttons that will be used to control the single-coin test box.
    const singleCoinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.singleCoin as TwoStateSystem<string>,
      sceneModel.systemType,
      singleCoinInTestBoxProperty,
      {
        tandem: tandem.createTandem( 'singleCoinExperimentButtonSet' ),
        visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty )
      }
    );

    // Create the composite node that represents the test box and the controls where the user will experiment with a
    // single coin.
    const singleCoinMeasurementArea = new HBox( {
      children: [ singleCoinTestBox, singleCoinExperimentButtonSet ],
      spacing: 30
    } );

    // Add the lower heading for the measurement area.
    const multiCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.multipleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColor }
    );

    // Add the area where the multiple coins will be hidden and revealed.
    const multipleCoinTestBox = new MultiCoinTestBox(
      sceneModel.coinSet,
      sceneModel.coinSet.measurementStateProperty,
      sceneModel.coinSet.numberOfActiveSystemsProperty,
      { tandem: tandem.createTandem( 'multipleCoinTestBox' ) }
    );
    const multiCoinExperimentHistogram = new CoinMeasurementHistogram( sceneModel.coinSet, sceneModel.systemType, {
      visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty ),
      tandem: tandem.createTandem( 'multiCoinExperimentHistogram' )
    } );
    const multipleCoinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.coinSet,
      sceneModel.systemType,
      coinSetInTestBoxProperty,
      {
        tandem: tandem.createTandem( 'multipleCoinExperimentButtonSet' ),
        visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty )
      }
    );

    // Create a control that consists of a label and a group of radio buttons for selecting the number of coins to model
    // in the multi-coin mode.
    const numberOfCoinsSelectorTitle = new Text( QuantumMeasurementStrings.identicalCoinsStringProperty, {
      font: new PhetFont( 14 )
    } );

    const createRadioButtonGroupItem = ( value: number ) => {
      const valueText = value.toString();
      return {
        createNode: () => new Text( valueText, { font: RADIO_BUTTON_FONT } ),
        value: value,
        tandemName: `${valueText}CoinsRadioButton`
      };
    };
    const numberOfCoinsRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      sceneModel.coinSet.numberOfActiveSystemsProperty,
      MULTI_COIN_EXPERIMENT_QUANTITIES.map( quantity => createRadioButtonGroupItem( quantity ) ),
      {
        spacing: 10,
        tandem: tandem.createTandem( 'numberOfCoinsRadioButtonGroup' )
      }
    );

    const numberOfCoinsSelector = new VBox( {
      children: [ numberOfCoinsSelectorTitle, numberOfCoinsRadioButtonGroup ],
      spacing: 12,
      visibleProperty: sceneModel.preparingExperimentProperty
    } );

    const measuredCoinsPixelRepresentation = new CoinSetPixelRepresentation( sceneModel.systemType );

    const multipleCoinTestBoxContainer = new Node( {
      children: [
        multipleCoinTestBox,
        measuredCoinsPixelRepresentation
      ],
      localBounds: multipleCoinTestBox.getGlobalBounds()
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
      spacing: 30
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
    this.measuredCoinsPixelRepresentation = measuredCoinsPixelRepresentation;
    this.measuredCoinsPixelRepresentation.setPixelScale(
      multipleCoinTestBox.width / 100 * QuantumMeasurementConstants.COIN_SET_AREA_PROPORTION
    );
    this.measuredCoinsPixelRepresentation.setCanvasBounds(
      new Bounds2(
        0,
        0,
        multipleCoinTestBox.width,
        multipleCoinTestBox.height
      )
    );

    const offset = multipleCoinTestBox.width * ( 1 - QuantumMeasurementConstants.COIN_SET_AREA_PROPORTION ) / 2;
    this.measuredCoinsPixelRepresentation.setX( offset );
    this.measuredCoinsPixelRepresentation.setY( offset );

    Multilink.multilink(
      [
        sceneModel.coinSet.numberOfActiveSystemsProperty,
        sceneModel.coinSet.measurementStateProperty
      ],
      ( numberOfActiveSystems, state ) => {
        if ( numberOfActiveSystems === MAX_COINS && state === 'measuredAndRevealed' ) {
          this.measuredCoinsPixelRepresentation.redraw( sceneModel.coinSet.measuredValues );
          this.measuredCoinsPixelRepresentation.visible = true;
        }
        else {
          this.measuredCoinsPixelRepresentation.visible = false;
        }
      }
    );

    // Create the node that will be used to cover (aka "mask") the coin so that its state can't be seen.
    const maskRadius = InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS * 1.02;
    const coinMask = new Circle( maskRadius, {
      fill: new Color( '#cccccc' ),
      stroke: new Color( '#888888' ),
      lineWidth: 7,
      visibleProperty: new DerivedProperty(
        [ sceneModel.preparingExperimentProperty, sceneModel.singleCoin.measurementStateProperty ],
        ( preparingExperiment, singleCoinExperimentState ) =>
          !preparingExperiment && singleCoinExperimentState !== 'measuredAndRevealed'
      )
    } );
    singleCoinTestBox.clippedTestBox.addChild( coinMask );
    coinMask.moveToBack();

    const singleCoinAnimations = new SingleCoinAnimations(
      sceneModel,
      this,
      coinMask,
      singleCoinTestBox.clippedTestBox,
      singleCoinMeasurementArea,
      this.singleCoinInTestBoxProperty
    );

    const multipleCoinAnimations = new MultipleCoinAnimations(
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

        // Clear out the test boxes.
        singleCoinAnimations.clearSingleCoinTestBox();
        multipleCoinTestBox.clearContents();
      }
      else {

        // The user is ready to make measurements on the coins, so animate the coins for both the single and multi-coin
        // experiments moving from the preparation area to the measurement area.
        singleCoinAnimations.startIngressAnimationForSingleCoin( false );
        multipleCoinAnimations.startIngressAnimationForCoinSet( false );
      }
    } );

    // Listen to the state of the coin and animate a flipping motion for the classical coin or a travel-from-the-prep-
    // area animation for the quantum coin.
    sceneModel.singleCoin.measurementStateProperty.lazyLink( singleCoinAnimations.flipCoin );

    sceneModel.coinSet.measurementStateProperty.link( measurementState => {

      if ( measurementState === 'preparingToBeMeasured' && sceneModel.systemType === 'quantum' ) {

        // Abort any previous animations and clear out the test box.
        multipleCoinAnimations.abortIngressAnimationForCoinSet();
        multipleCoinTestBox.clearContents();

        // Animate a coin from the prep area to the single coin test box to indicate that a new "quantum coin" is
        // being prepared for measurement.
        multipleCoinAnimations.startIngressAnimationForCoinSet( true );
      }
    } );
  }
}

quantumMeasurement.register( 'CoinExperimentMeasurementArea', CoinExperimentMeasurementArea );