// Copyright 2024, University of Colorado Boulder

/**
 * CoinExperimentMeasurementArea is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where uses can flip and reveal coins.  Depending on how this is parameterized, the coins may either
 * be physical or "quantum coins".
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Circle, Color, HBox, LinearGradient, Node, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhysicalCoinNode from './PhysicalCoinNode.js';
import { PhysicalCoinStates } from '../model/PhysicalCoinStates.js';
import QuantumCoinNode from './QuantumCoinNode.js';
import CoinNode from './CoinNode.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { Shape } from '../../../../kite/js/imports.js';
import CoinExperimentButtonSet from './CoinExperimentButtonSet.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { TEmitterListener } from '../../../../axon/js/TEmitter.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';

const SINGLE_COIN_AREA_RECT_LINE_WIDTH = 36;
const MULTIPLE_COIN_TEST_BOX_SIZE = new Dimension2( 200, 200 );
const SINGLE_COIN_TEST_BOX_SIZE = new Dimension2( 165, 145 );
const SINGLE_COIN_TEST_BOX_UNREVEALED_FILL = new LinearGradient( 0, 0, SINGLE_COIN_TEST_BOX_SIZE.width, 0 )
  .addColorStop( 0, new Color( '#eeeeee' ) )
  .addColorStop( 0.9, new Color( '#bae3e0' ) );
const COIN_FLIP_RATE = 2; // full flips per second

export default class CoinExperimentMeasurementArea extends VBox {

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColor = sceneModel.systemType === 'quantum' ? Color.BLUE : Color.BLACK;

    // Add the top header for the measurement area.  It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    const singleCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColor }
    );

    // Add the area where the single coin will be hidden and revealed.
    const singleCoinTestBoxRectangle = new Rectangle(
      0,
      0,
      SINGLE_COIN_TEST_BOX_SIZE.width,
      SINGLE_COIN_TEST_BOX_SIZE.height,
      {
        lineWidth: SINGLE_COIN_AREA_RECT_LINE_WIDTH,
        stroke: new Color( '#555555' ),
        opacity: 0.8
      }
    );
    const singleCoinTestBox = new Node( {
      children: [ singleCoinTestBoxRectangle ],
      clipArea: Shape.bounds( singleCoinTestBoxRectangle.getRectBounds() )
    } );
    const singleCoinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.systemType,
      sceneModel.singleCoinExperimentStateProperty,
      sceneModel.prepareSingleCoinExperiment.bind( sceneModel ),
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

    // Make the single-coin test box transparent when the state of the coin is being revealed to the user.
    sceneModel.singleCoinExperimentStateProperty.link( singleCoinExperimentState => {
      singleCoinTestBoxRectangle.fill = singleCoinExperimentState === 'revealedAndStill' ?
                                        Color.TRANSPARENT :
                                        SINGLE_COIN_TEST_BOX_UNREVEALED_FILL;
    } );

    // Add the lower heading for the measurement area.
    const multiCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.multipleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColor }
    );

    // Add the area where the multiple coins will be hidden and revealed.
    const multipleCoinTestBoxRectangle = new Rectangle(
      0,
      0,
      MULTIPLE_COIN_TEST_BOX_SIZE.width,
      MULTIPLE_COIN_TEST_BOX_SIZE.height,
      {
        fill: new LinearGradient( 0, 0, MULTIPLE_COIN_TEST_BOX_SIZE.width, 0 )
          .addColorStop( 0, new Color( '#eeeeee' ) )
          .addColorStop( 1, new Color( '#cceae8' ) ),
        lineWidth: 2,
        stroke: new Color( '#666666' )
      }
    );
    const multipleCoinTestBox = new Node( {
      children: [ multipleCoinTestBoxRectangle ],
      clipArea: Shape.bounds( multipleCoinTestBoxRectangle.getRectBounds() )
    } );
    const multipleCoinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.systemType,
      sceneModel.multiCoinExperimentStateProperty,
      () => { console.log( 'Preparing the experiment is not yet implement for the multi-coin case.' ); },
      {
        tandem: tandem.createTandem( 'multipleCoinExperimentButtonSet' ),
        visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty )
      }
    );

    // Create the composite node that represents to test box and controls where the user will experiment with multiple
    // coins at once.
    const multipleCoinMeasurementArea = new HBox( {
      children: [ multipleCoinTestBox, multipleCoinExperimentButtonSet ],
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

    // Create the node that will be used to cover (aka "mask") the coin so that its state can't be seen.
    const coinMask = new Circle( InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS, {
      fill: new Color( '#cccccc' ),
      stroke: new Color( '#888888' ),
      lineWidth: 4,
      visibleProperty: new DerivedProperty(
        [ sceneModel.preparingExperimentProperty, sceneModel.singleCoinExperimentStateProperty ],
        ( preparingExperiment, singleCoinExperimentState ) =>
          !preparingExperiment && singleCoinExperimentState !== 'revealedAndStill'
      )
    } );
    singleCoinTestBox.addChild( coinMask );

    // When the scene switches from preparing the experiment to making measurements, coins are added that migrate from
    // the preparation area to this (the measurement) area.
    let singleCoinNode: CoinNode | null = null;
    let animationFromPrepToMeasurementArea: Animation | null = null;
    let animationFromEdgeOfScreenToBehindIt: Animation | null = null;
    sceneModel.preparingExperimentProperty.lazyLink( preparingExperiment => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( this.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = this.getParent() as CoinsExperimentSceneView;

      if ( preparingExperiment ) {
        if ( singleCoinNode ) {
          if ( singleCoinTestBox.hasChild( singleCoinNode ) ) {
            singleCoinTestBox.removeChild( singleCoinNode );
          }
          else if ( sceneGraphParent.hasChild( singleCoinNode ) ) {
            sceneGraphParent.removeChild( singleCoinNode );
          }
          singleCoinNode.dispose();
          singleCoinNode = null;
        }
        if ( animationFromPrepToMeasurementArea ) {
          animationFromPrepToMeasurementArea.stop();
          animationFromPrepToMeasurementArea = null;
        }
        if ( animationFromEdgeOfScreenToBehindIt ) {
          animationFromEdgeOfScreenToBehindIt.stop();
          animationFromEdgeOfScreenToBehindIt = null;
        }
      }
      else {

        // The scene is transitioning from preparation to measurement mode, and we need to animate coins coming from the
        // preparation area to the measurement area.  Start by creating the node used for single coin measurements.
        if ( sceneModel.systemType === 'physical' ) {
          singleCoinNode = new PhysicalCoinNode(
            sceneModel.singleCoin.currentStateProperty as TReadOnlyProperty<PhysicalCoinStates>,
            InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          );
        }
        else {
          singleCoinNode = new QuantumCoinNode(
            sceneModel.singleCoin.currentStateProperty as TReadOnlyProperty<QuantumCoinStates>,
            sceneModel.stateBiasProperty,
            InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          );
        }

        // Add the coin to our parent node.  This is done so that we don't change our bounds, which could mess up the
        // layout.  It will be added back to this area when it is back within the bounds.
        sceneGraphParent.addCoinNode( singleCoinNode );

        // Make sure the coin mask is outside the test box so that it isn't visible.
        coinMask.x = -SINGLE_COIN_TEST_BOX_SIZE.width * 2;

        // Create and start an animation to move this coin to the top test area in the measurement area.
        const leftOfTestArea = singleCoinMeasurementArea.center.minusXY( 350, 0 );
        const leftOfTestAreaInParentCoords = this.localToParentPoint( leftOfTestArea );
        animationFromPrepToMeasurementArea = new Animation( {
          setValue: value => { singleCoinNode!.center = value; },
          getValue: () => singleCoinNode!.center,
          to: leftOfTestAreaInParentCoords,
          duration: 0.5,
          easing: Easing.LINEAR
        } );
        animationFromPrepToMeasurementArea.start();
        animationFromPrepToMeasurementArea.finishEmitter.addListener( () => {

          const coinNode = singleCoinNode!;
          coinNode.moveToBack();

          // Move the mask to be on top of the coin.
          coinMask.center = singleCoinTestBox.parentToLocalPoint( this.parentToLocalPoint( coinNode.center ) );

          // Do the 2nd portion of the animation, which moves it into the actual test area.
          animationFromEdgeOfScreenToBehindIt = new Animation( {
            setValue: value => {
              coinNode.center = value;
              coinMask.center = singleCoinMeasurementArea.parentToLocalPoint(
                singleCoinTestBox.parentToLocalPoint(
                  this.parentToLocalPoint( coinNode.center )
                )
              );
            },
            getValue: () => coinNode.center,
            to: this.localToParentPoint( singleCoinMeasurementArea.localToParentPoint( singleCoinTestBox.center ) ),
            duration: 0.7,
            easing: Easing.CUBIC_OUT
          } );
          animationFromEdgeOfScreenToBehindIt.finishEmitter.addListener( () => {

            // Now that the coin is within the bounds of the measurement area, remove it from the parent node and add it
            // to the measurement area.
            sceneGraphParent.removeChild( coinNode );
            coinNode.centerX = singleCoinTestBox.width / 2;
            coinNode.centerY = singleCoinTestBox.height / 2;
            singleCoinTestBox.insertChild( 0, coinNode );

            if ( sceneModel.systemType === 'quantum' ) {

              // "Collapse" the state of the coin node so that it shows a single state, not a superimposed one.
              const quantumCoinNode = singleCoinNode as QuantumCoinNode;
              quantumCoinNode.showSuperpositionProperty.value = false;
            }
          } );

          // Kick off the animation.
          animationFromEdgeOfScreenToBehindIt.start();
        } );
      }
    } );

    // Add the listener that will animation the flipping motion of the coin.
    let flippingAnimationStepListener: null | TEmitterListener<number[]> = null;
    let flippingAnimationPhase = 0;
    sceneModel.singleCoinExperimentStateProperty.lazyLink( singleCoinExperimentState => {
      if ( singleCoinExperimentState === 'flipping' ) {

        // state checking
        assert && assert( !flippingAnimationStepListener, 'something is off - there should be no listener' );
        assert && assert( singleCoinNode, 'something is off - there should be a coin node' );

        // Create and hook up a step listener to perform the animation.
        flippingAnimationStepListener = ( dt: number ) => {
          flippingAnimationPhase = ( flippingAnimationPhase + 2 * Math.PI * COIN_FLIP_RATE * dt ) % ( 2 * Math.PI );
          let xScaleMagnitude = Math.sin( flippingAnimationPhase );
          if ( xScaleMagnitude === 0 ) {
            xScaleMagnitude = 0.01;
          }
          coinMask.setScaleMagnitude( xScaleMagnitude, 1 );
          singleCoinNode!.setScaleMagnitude( xScaleMagnitude, 1 );
        };
        stepTimer.addListener( flippingAnimationStepListener );
      }
      else if ( flippingAnimationStepListener ) {

        // The coin is no longer in the flipping state, so remove the function that was doing the animation and set the
        // coin to be fully round.
        stepTimer.removeListener( flippingAnimationStepListener );
        flippingAnimationPhase = 0;
        coinMask.setScaleMagnitude( 1, 1 );
        singleCoinNode!.setScaleMagnitude( 1, 1 );
        flippingAnimationStepListener = null;
      }
    } );
  }
}

quantumMeasurement.register( 'CoinExperimentMeasurementArea', CoinExperimentMeasurementArea );