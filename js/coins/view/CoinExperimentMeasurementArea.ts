// Copyright 2024, University of Colorado Boulder

/**
 * CoinExperimentMeasurementArea is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where uses can flip and reveal coins.  Depending on how this is parameterized, the coins may either
 * be physical or "quantum coins".
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Circle, Color, HBox, LinearGradient, Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
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
import Range from '../../../../dot/js/Range.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import TwoStateSystem from '../../common/model/TwoStateSystem.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const SINGLE_COIN_AREA_RECT_LINE_WIDTH = 36;
const MULTIPLE_COIN_TEST_BOX_SIZE = new Dimension2( 200, 200 );
const SINGLE_COIN_TEST_BOX_SIZE = new Dimension2( 165, 145 );
const SINGLE_COIN_TEST_BOX_UNREVEALED_FILL = new LinearGradient( 0, 0, SINGLE_COIN_TEST_BOX_SIZE.width, 0 )
  .addColorStop( 0, new Color( '#eeeeee' ) )
  .addColorStop( 0.9, new Color( '#bae3e0' ) );
const COIN_FLIP_RATE = 3; // full flips per second
const COIN_ROTATION_CHANGE_RANGE = new Range( Math.PI / 8, Math.PI * 0.9 );
const COIN_TRAVEL_ANIMATION_DURATION = QuantumMeasurementConstants.PREPARING_TO_BE_MEASURED_TIME * 0.95;
const RADIO_BUTTON_FONT = new PhetFont( 12 );

export default class CoinExperimentMeasurementArea extends VBox {

  // A boolean property that tracks whether the coins are fully ensconced in their test boxes.  This is fully internal
  // and not available to phet-io.
  private readonly coinsInTestBoxesProperty: TProperty<boolean>;

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColor = sceneModel.systemType === 'quantum' ? Color.BLUE : Color.BLACK;
    const coinsInTestBoxesProperty = new BooleanProperty( false );

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
      sceneModel.singleCoin as TwoStateSystem<string>,
      sceneModel.systemType,
      coinsInTestBoxesProperty,
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
    sceneModel.singleCoin.measurementStateProperty.link( singleCoinMeasurementState => {
      singleCoinTestBoxRectangle.fill = singleCoinMeasurementState === 'measuredAndRevealed' ?
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
      sceneModel.coinSet,
      sceneModel.systemType,
      coinsInTestBoxesProperty,
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
        tandemName: valueText
      };
    };
    const numberOfCoinsRadioButtonGroup = new VerticalAquaRadioButtonGroup(
      sceneModel.coinSet.numberOfActiveSystemsProperty,
      [
        createRadioButtonGroupItem( 10 ),
        createRadioButtonGroupItem( 100 ),
        createRadioButtonGroupItem( 10000 )
      ],
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

    // Create the composite node that represents to test box and controls where the user will experiment with multiple
    // coins at once.
    const multipleCoinMeasurementArea = new HBox( {
      children: [ multipleCoinTestBox, numberOfCoinsSelector, multipleCoinExperimentButtonSet ],
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

    this.coinsInTestBoxesProperty = coinsInTestBoxesProperty;

    // Create the node that will be used to cover (aka "mask") the coin so that its state can't be seen.
    const coinMask = new Circle( InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS, {
      fill: new Color( '#cccccc' ),
      stroke: new Color( '#888888' ),
      lineWidth: 4,
      visibleProperty: new DerivedProperty(
        [ sceneModel.preparingExperimentProperty, sceneModel.singleCoin.measurementStateProperty ],
        ( preparingExperiment, singleCoinExperimentState ) =>
          !preparingExperiment && singleCoinExperimentState !== 'measuredAndRevealed'
      )
    } );
    singleCoinTestBox.addChild( coinMask );

    // variables to support the coin animations
    let singleCoinNode: CoinNode | null = null;
    let animationFromPrepAreaToEdgeOfSingleCoinTestBox: Animation | null = null;
    let animationFromEdgeOfTestBoxToInsideIt: Animation | null = null;
    let flippingAnimationStepListener: null | TEmitterListener<number[]> = null;

    // Create a closure function for clearing out the single coin test box.
    const clearSingleCoinTestBox = () => {
      assert && assert(
      !animationFromPrepAreaToEdgeOfSingleCoinTestBox && !animationFromEdgeOfTestBoxToInsideIt,
        'this function should not be invoked while animations are in progress'
      );
      if ( singleCoinNode && singleCoinTestBox.hasChild( singleCoinNode ) ) {
        singleCoinTestBox.removeChild( singleCoinNode );
        singleCoinNode.dispose();
        singleCoinNode = null;
      }
      coinMask.right = singleCoinTestBox.left;
      coinMask.y = singleCoinTestBox.centerY;
      this.coinsInTestBoxesProperty.value = false;
    };

    // Create a closure function for aborting the animation of the incoming single coin.  This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally.  If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    const abortIngressAnimationForSingleCoin = () => {

      // Stop any of the animations that exist.
      animationFromPrepAreaToEdgeOfSingleCoinTestBox && animationFromPrepAreaToEdgeOfSingleCoinTestBox.stop();
      animationFromEdgeOfTestBoxToInsideIt && animationFromEdgeOfTestBoxToInsideIt.stop();

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( this.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = this.getParent() as CoinsExperimentSceneView;

      if ( singleCoinNode ) {
        if ( sceneGraphParent.hasChild( singleCoinNode ) ) {
          sceneGraphParent.removeChild( singleCoinNode );
        }
        else if ( singleCoinTestBox.hasChild( singleCoinNode ) ) {
          singleCoinTestBox.removeChild( singleCoinNode );
        }
        singleCoinNode.dispose();
        singleCoinNode = null;
      }
    };

    // Create a closure function for creating and starting the animation of a single coin coming from the preparation
    // area into the single coin test box.
    const startIngressAnimationForSingleCoin = ( forReprepare: boolean ) => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( this.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = this.getParent() as CoinsExperimentSceneView;

      // Clear out the test box if there's anything in there.
      clearSingleCoinTestBox();

      // Create the coin that will travel from the preparation area into this measurement area.
      if ( sceneModel.systemType === 'physical' ) {
        singleCoinNode = new PhysicalCoinNode(
          sceneModel.singleCoin.measuredValueProperty as TReadOnlyProperty<PhysicalCoinStates>,
          InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        );
      }
      else {
        singleCoinNode = new QuantumCoinNode(
          sceneModel.singleCoin.measuredValueProperty as TReadOnlyProperty<QuantumCoinStates>,
          sceneModel.stateBiasProperty,
          InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        );
      }

      // Add the coin to our parent node.  This is done so that we don't change our bounds, which could mess up the
      // layout.  It will be added back to this area when it is back within the bounds.
      sceneGraphParent.addCoinNode( singleCoinNode, forReprepare );

      // Make sure the coin mask is outside the test box so that it isn't visible.
      coinMask.x = -SINGLE_COIN_TEST_BOX_SIZE.width * 2;

      // Create and start an animation to move the single coin to the side of the single coin text box.  The entire
      // process consists of two animations, one to move the coin to the left edge of the test box while the test box is
      // potentially also moving, then a second one to move the coin into the box.  The durations must be set up such
      // that the test box is in place before the 2nd animation begins or the coin won't end up in the right place.
      const testAreaXOffset = forReprepare ? 200 : 350;
      const leftOfTestArea = singleCoinMeasurementArea.center.minusXY( testAreaXOffset, 0 );
      const leftOfTestAreaInParentCoords = this.localToParentPoint( leftOfTestArea );
      animationFromPrepAreaToEdgeOfSingleCoinTestBox = new Animation( {
        setValue: value => { singleCoinNode!.center = value; },
        getValue: () => singleCoinNode!.center,
        to: leftOfTestAreaInParentCoords,
        duration: COIN_TRAVEL_ANIMATION_DURATION / 2,
        easing: Easing.LINEAR
      } );
      animationFromPrepAreaToEdgeOfSingleCoinTestBox.finishEmitter.addListener( () => {

        assert && assert( singleCoinNode, 'There should be a singleCoinNode instance at the end of this animation.' );

        // Get a reference to the coin Node that allows the code to omit all the exclamation points and such.
        const assuredSingleCoinNode = singleCoinNode!;
        assuredSingleCoinNode.moveToBack();

        // Move the mask to be on top of the coin Node.
        coinMask.center = singleCoinTestBox.parentToLocalPoint( this.parentToLocalPoint( assuredSingleCoinNode.center ) );

        // Start the 2nd portion of the animation, which moves the masked coin into the test box.
        animationFromEdgeOfTestBoxToInsideIt = new Animation( {
          setValue: value => {
            assuredSingleCoinNode.center = value;
            coinMask.center = singleCoinMeasurementArea.parentToLocalPoint(
              singleCoinTestBox.parentToLocalPoint( this.parentToLocalPoint( assuredSingleCoinNode.center ) )
            );
          },
          getValue: () => assuredSingleCoinNode.center,
          to: this.localToParentPoint( singleCoinMeasurementArea.localToParentPoint( singleCoinTestBox.center ) ),
          duration: COIN_TRAVEL_ANIMATION_DURATION / 2,
          easing: Easing.CUBIC_OUT
        } );
        animationFromEdgeOfTestBoxToInsideIt.finishEmitter.addListener( () => {

          // Now that the coin is within the bounds of the test box, remove it from the parent and add it as a child.
          sceneGraphParent.removeChild( assuredSingleCoinNode );
          assuredSingleCoinNode.center = singleCoinTestBox.center;
          singleCoinTestBox.insertChild( 0, assuredSingleCoinNode );
          coinMask.center = singleCoinTestBox.center;

          if ( sceneModel.systemType === 'quantum' ) {

            // "Collapse" the state of the coin node so that it shows a single state, not a superimposed one.
            const quantumCoinNode = singleCoinNode as QuantumCoinNode;
            quantumCoinNode.showSuperpositionProperty.value = false;
            sceneModel.singleCoin.prepareInstantly();
          }

          // The coin is in the test box, so update the flag that makes this known.
          this.coinsInTestBoxesProperty.value = true;
        } );

        // Regardless of how the animation terminated its reference needs to be cleared when it is done.
        animationFromEdgeOfTestBoxToInsideIt.endedEmitter.addListener( () => {
          animationFromEdgeOfTestBoxToInsideIt = null;
        } );

        // Kick off the 2nd animation.
        animationFromEdgeOfTestBoxToInsideIt.start();
      } );

      // Regardless of how the animation terminated its reference needs to be cleared when it is done.
      animationFromPrepAreaToEdgeOfSingleCoinTestBox.endedEmitter.addListener( () => {
        animationFromPrepAreaToEdgeOfSingleCoinTestBox = null;
      } );

      // Kick off the 1st animation.
      animationFromPrepAreaToEdgeOfSingleCoinTestBox.start();
    };

    sceneModel.preparingExperimentProperty.lazyLink( preparingExperiment => {
      if ( preparingExperiment ) {

        // Abort any in-progress animations - the scene model is going back into the preparation mode.  If there are no
        // such animations, this has no effect.
        abortIngressAnimationForSingleCoin();

        // Clear out the test box.
        clearSingleCoinTestBox();
      }
      else {

        // The user is ready to make measurements on the coin, so animate a transition from the prep area to this area.
        startIngressAnimationForSingleCoin( false );
      }
    } );

    // Listen to the state of the coin and animate a flipping motion for the physical coin or a travel-from-the-prep-
    // area animation for the quantum coin.
    sceneModel.singleCoin.measurementStateProperty.lazyLink( singleCoinMeasurementState => {
      if ( sceneModel.systemType === 'physical' ) {

        if ( singleCoinMeasurementState === 'preparingToBeMeasured' ) {

          // state checking
          assert && assert( !flippingAnimationStepListener, 'something is off - there should be no listener' );
          assert && assert( singleCoinNode, 'something is off - there should be a coin node' );

          // Set the initial state of things prior to starting the animation.
          let flippingAnimationPhase = 0;
          let rotation = dotRandom.nextDouble() * Math.PI;
          let previousXScale = 0;
          coinMask.setRotation( rotation );
          singleCoinNode!.setRotation( rotation );

          // Create and hook up a step listener to perform the animation.
          flippingAnimationStepListener = ( dt: number ) => {

            flippingAnimationPhase += 2 * Math.PI * COIN_FLIP_RATE * dt;
            if ( flippingAnimationPhase >= Math.PI * 2 ) {

              // A full flip as been performed.  Rotate the coins by a random amount to make things look a bit more
              // random.  The transform is being reset here because adding new rotations was causing a pile up of some
              // sort of floating point errors, and this just worked out better.
              rotation += dotRandom.nextDoubleInRange( COIN_ROTATION_CHANGE_RANGE );
              coinMask.resetTransform();
              coinMask.center = singleCoinTestBox.center;
              coinMask.setRotation( rotation );
              singleCoinNode!.resetTransform();
              singleCoinNode!.center = singleCoinTestBox.center;
              singleCoinNode!.setRotation( rotation );

              // Reset the phase.
              flippingAnimationPhase = 0;
            }

            let xScale = Math.sin( flippingAnimationPhase );

            // Handle the case where we hit zero, since the scale can't be set to that value.
            if ( xScale === 0 ) {
              xScale = previousXScale < 0 ? 0.01 : -0.01;
            }

            // Scale the coins on the x-axis to make it look like they are rotating.
            coinMask.setScaleMagnitude( xScale, 1 );
            singleCoinNode && singleCoinNode.setScaleMagnitude( xScale, 1 );

            // Save some state for next time through.
            previousXScale = xScale;
          };
          stepTimer.addListener( flippingAnimationStepListener );
        }
        else if ( flippingAnimationStepListener ) {

          // The coin is no longer in the flipping state, so set it to be fully round and in the center of the test box.
          // The transform is being reset here because floating point errors were piling up during the animation, and
          // this just worked better.
          coinMask.resetTransform();
          coinMask.center = singleCoinTestBox.center;
          if ( singleCoinNode ) {
            singleCoinNode.resetTransform();
            singleCoinNode.center = singleCoinTestBox.center;
          }

          // Remove the step listener that was performing the flip animation.
          stepTimer.removeListener( flippingAnimationStepListener );
          flippingAnimationStepListener = null;
        }
      }
      else if ( sceneModel.systemType === 'quantum' ) {

        if ( singleCoinMeasurementState === 'preparingToBeMeasured' ) {

          // Abort any previous animations and clear out the test box.
          abortIngressAnimationForSingleCoin();
          clearSingleCoinTestBox();

          // Animate a coin from the prep area to the single coin test box to indicate that a new "quantum coin" is
          // being prepared for measurement.
          startIngressAnimationForSingleCoin( true );
        }
      }
    } );

    sceneModel.coinSet.measurementStateProperty.link( measurementState => {
      console.log( '---------------------------------' );
      console.log( `measurementState = ${measurementState}` );
      if ( measurementState === 'measuredAndRevealed' ) {
        const measurementResults = sceneModel.coinSet.measure();
        console.log( `measurementResults.length = ${measurementResults.length}` );
        for ( let i = 0; i < measurementResults.length; i++ ) {
          console.log( `measurementResults.measuredValues[ i ] = ${measurementResults.measuredValues[ i ]}` );
        }
      }

    } );


  }
}

quantumMeasurement.register( 'CoinExperimentMeasurementArea', CoinExperimentMeasurementArea );