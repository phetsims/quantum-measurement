// Copyright 2024, University of Colorado Boulder

/**
 * CoinExperimentMeasurementArea is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where users can flip and reveal coins. Depending on how this is parameterized, the coins may either
 * be classical or quantum coins.
 *
 * REVIEW TODO: Move some of the animation logic into its own subclass https://github.com/phetsims/quantum-measurement/issues/20
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { TEmitterListener } from '../../../../axon/js/TEmitter.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, HBox, LinearGradient, Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import TwoStateSystem from '../../common/model/TwoStateSystem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import { QuantumCoinStates } from '../model/QuantumCoinStates.js';
import ClassicalCoinNode from './ClassicalCoinNode.js';
import CoinExperimentButtonSet from './CoinExperimentButtonSet.js';
import CoinMeasurementHistogram from './CoinMeasurementHistogram.js';
import CoinNode from './CoinNode.js';
import CoinSetPixelRepresentation from './CoinSetPixelRepresentation.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import MultiCoinTestBox from './MultiCoinTestBox.js';
import QuantumCoinNode from './QuantumCoinNode.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import SmallCoinNode from './SmallCoinNode.js';

const SINGLE_COIN_AREA_RECT_LINE_WIDTH = 36;
const SINGLE_COIN_TEST_BOX_SIZE = new Dimension2( 165, 145 );
const SINGLE_COIN_TEST_BOX_UNREVEALED_FILL = new LinearGradient( 0, 0, SINGLE_COIN_TEST_BOX_SIZE.width, 0 )
  .addColorStop( 0, new Color( '#eeeeee' ) )
  .addColorStop( 0.9, new Color( '#bae3e0' ) );
const COIN_FLIP_RATE = 3; // full flips per second
const COIN_TRAVEL_ANIMATION_DURATION = QuantumMeasurementConstants.PREPARING_TO_BE_MEASURED_TIME * 0.95;
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

      // TODO: Values below are empirically determined, but there is probably a better way. See https://github.com/phetsims/quantum-measurement/issues/1.
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
    // Make the single-coin test box transparent when the state of the coin is being revealed to the user.
    sceneModel.singleCoin.measurementStateProperty.link( singleCoinMeasurementState => {
      singleCoinTestBoxRectangle.fill = singleCoinMeasurementState === 'measuredAndRevealed' ?
                                        Color.TRANSPARENT :
                                        SINGLE_COIN_TEST_BOX_UNREVEALED_FILL;
    } );

    const singleCoinTestBox = new Node( {
      children: [ singleCoinTestBoxRectangle ],
      clipArea: Shape.bounds( singleCoinTestBoxRectangle.getRectBounds() )
    } );
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

    const measuredCoinsPixelRepresentation = new CoinSetPixelRepresentation( sceneModel.systemType );

    const multipleCoinTestBoxContainer = new Node( {
      children: [
        multipleCoinTestBox,
        measuredCoinsPixelRepresentation
      ]
    } );

    // Scaling in proportion to the test box, but a little smaller
    measuredCoinsPixelRepresentation.scale(
      QuantumMeasurementConstants.COIN_SET_AREA_PROPORTION * multipleCoinTestBox.width / measuredCoinsPixelRepresentation.width
    );
    const offset = multipleCoinTestBox.width - measuredCoinsPixelRepresentation.width;
    measuredCoinsPixelRepresentation.x = offset / 2;
    measuredCoinsPixelRepresentation.y = offset / 2;

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

    Multilink.multilink(
      [
        sceneModel.coinSet.numberOfActiveSystemsProperty,
        sceneModel.coinSet.measurementStateProperty
      ],
      ( numberOfActiveSystems, state ) => {
        if ( numberOfActiveSystems === 10000 && state === 'measuredAndRevealed' ) {
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
    singleCoinTestBox.addChild( coinMask );
    coinMask.moveToBack();

    // variables to support the coin animations
    let singleCoinNode: CoinNode | null = null;
    let singleCoinAnimationFromPrepAreaToEdgeOfTestBox: Animation | null = null;
    let singleCoinAnimationFromEdgeOfTestBoxToInside: Animation | null = null;
    let flippingAnimationStepListener: null | TEmitterListener<number[]> = null;

    // Create a closure function for clearing out the single coin test box.
    const clearSingleCoinTestBox = () => {
      assert && assert(
      !singleCoinAnimationFromPrepAreaToEdgeOfTestBox && !singleCoinAnimationFromEdgeOfTestBoxToInside,
        'this function should not be invoked while animations are in progress'
      );
      if ( singleCoinNode && singleCoinTestBox.hasChild( singleCoinNode ) ) {
        singleCoinTestBox.removeChild( singleCoinNode );
        singleCoinNode.dispose();
        singleCoinNode = null;
      }
      coinMask.right = singleCoinTestBox.left;
      coinMask.y = singleCoinTestBox.centerY;
      this.singleCoinInTestBoxProperty.value = false;
    };

    // Create a closure function for aborting the animation of the incoming single coin. This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally. If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    const abortIngressAnimationForSingleCoin = () => {

      // Stop any of the animations that exist.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox && singleCoinAnimationFromPrepAreaToEdgeOfTestBox.stop();
      singleCoinAnimationFromEdgeOfTestBoxToInside && singleCoinAnimationFromEdgeOfTestBoxToInside.stop();

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
      if ( sceneModel.systemType === 'classical' ) {
        singleCoinNode = new ClassicalCoinNode(
          sceneModel.singleCoin.measuredValueProperty as TReadOnlyProperty<ClassicalCoinStates>,
          InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        );
      }
      else {
        singleCoinNode = new QuantumCoinNode(
          sceneModel.singleCoin.measuredValueProperty as TReadOnlyProperty<QuantumCoinStates>,
          sceneModel.upProbabilityProperty,
          InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
          Tandem.OPT_OUT
        );
      }

      // Add the coin to our parent node. This is done so that we don't change our bounds, which could mess up the
      // layout. It will be added back to this area when it is back within the bounds.
      sceneGraphParent.addSingleCoinNode( singleCoinNode );

      // Make sure the coin mask is outside the test box so that it isn't visible.
      // REVIEW TODO: Why not just hide it? https://github.com/phetsims/quantum-measurement/issues/20
      coinMask.x = -SINGLE_COIN_TEST_BOX_SIZE.width * 2;

      // Create and start an animation to move the single coin to the side of the single coin test box. The entire
      // process consists of two animations, one to move the coin to the left edge of the test box while the test box is
      // potentially also moving, then a second one to move the coin into the box. The durations must be set up such
      // that the test box is in place before the 2nd animation begins or the coin won't end up in the right place.
      const testAreaXOffset = forReprepare ? 200 : 420; // empirically determined
      const leftOfTestArea = singleCoinMeasurementArea.center.minusXY( testAreaXOffset, 0 );
      const leftOfTestAreaInParentCoords = this.localToParentPoint( leftOfTestArea );
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox = new Animation( {
        setValue: value => { singleCoinNode!.center = value; },
        getValue: () => singleCoinNode!.center,
        to: leftOfTestAreaInParentCoords,
        duration: COIN_TRAVEL_ANIMATION_DURATION / 2,
        easing: Easing.LINEAR
      } );
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.finishEmitter.addListener( () => {

        assert && assert( singleCoinNode, 'There should be a singleCoinNode instance at the end of this animation.' );

        // Get a reference to the coin Node that allows the code to omit all the exclamation points and such.
        const assuredSingleCoinNode = singleCoinNode!;
        assuredSingleCoinNode.moveToBack();

        // Move the mask to be on top of the coin Node.
        coinMask.center = singleCoinTestBox.parentToLocalPoint( this.parentToLocalPoint( assuredSingleCoinNode.center ) );

        // Start the 2nd portion of the animation, which moves the masked coin into the test box.
        singleCoinAnimationFromEdgeOfTestBoxToInside = new Animation( {
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
        singleCoinAnimationFromEdgeOfTestBoxToInside.finishEmitter.addListener( () => {

          // Now that the coin is within the bounds of the test box, remove it from the parent and add it as a child.
          sceneGraphParent.removeChild( assuredSingleCoinNode );
          assuredSingleCoinNode.center = singleCoinTestBox.center;
          singleCoinTestBox.insertChild( 0, assuredSingleCoinNode );
          coinMask.center = singleCoinTestBox.center;

          if ( sceneModel.systemType === 'quantum' ) {

            // "Collapse" the state of the coin node so that it shows a single state, not a superposed one.
            const quantumCoinNode = singleCoinNode as QuantumCoinNode;
            quantumCoinNode.showSuperpositionProperty.value = false;
            sceneModel.singleCoin.prepareInstantly();
          }

          // The coin is in the test box, so update the flag that makes this known.
          this.singleCoinInTestBoxProperty.value = true;
        } );

        // Regardless of how the animation terminated its reference needs to be cleared when it is done.
        singleCoinAnimationFromEdgeOfTestBoxToInside.endedEmitter.addListener( () => {
          singleCoinAnimationFromEdgeOfTestBoxToInside = null;
        } );

        // Kick off the 2nd animation.
        singleCoinAnimationFromEdgeOfTestBoxToInside.start();
      } );

      // Regardless of how the animation terminated its reference needs to be cleared when it is done.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.endedEmitter.addListener( () => {
        singleCoinAnimationFromPrepAreaToEdgeOfTestBox = null;
      } );

      // Kick off the 1st animation.
      singleCoinAnimationFromPrepAreaToEdgeOfTestBox.start();
    };

    const animationsToEdgeOfMultiCoinTestBox: Animation[] = [];
    const animationsFromEdgeOfMultiCoinBoxToInside: Animation[] = [];

    // Create a closure function for aborting the animation of the incoming single coin. This is intended to be called
    // when a state change occurs that prevents the ingress animation from finishing normally. If no animation is in
    // progress, this does nothing, so it safe to call as a preventative measure.
    const abortIngressAnimationForCoinSet = () => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( this.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = this.getParent() as CoinsExperimentSceneView;

      // Stop any of the animations that exist.
      animationsToEdgeOfMultiCoinTestBox.forEach( animation => animation.stop() );
      animationsFromEdgeOfMultiCoinBoxToInside.forEach( animation => animation.stop() );

      // Clear out any coins that made it to the test box.
      multipleCoinTestBox.clearContents();

      // Remove any coin nodes that are moving from the prep area out from the scene graph parent.
      sceneGraphParent.children.filter( child => child instanceof SmallCoinNode ).forEach( smallCoinNode => {
        sceneGraphParent.removeChild( smallCoinNode );
      } );

      // Set the flag to indicate that the coins are not in the box.
      this.coinSetInTestBoxProperty.value = false;
    };

    const startIngressAnimationForCoinSet = ( forReprepare: boolean ) => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( this.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = this.getParent() as CoinsExperimentSceneView;

      // Make sure the test box is empty.
      multipleCoinTestBox.clearContents();

      // Set the flag to indicate that the coins aren't in the box.
      this.coinSetInTestBoxProperty.value = false;

      // Create the coins that will travel from the preparation area into this measurement area.
      const coinRadius = MultiCoinTestBox.getRadiusFromCoinQuantity(
        sceneModel.coinSet.numberOfActiveSystemsProperty.value
      );
      const coinSetNodes: SmallCoinNode[] = [];
      const coinsToDraw = sceneModel.coinSet.numberOfActiveSystemsProperty.value === 10000 ?
                          QuantumMeasurementConstants.HOLLYWOODED_MAX_COINS : sceneModel.coinSet.numberOfActiveSystemsProperty.value;
      _.times( coinsToDraw, i => {
        // TODO: Is this tandem structure a final decision or placeholder? https://github.com/phetsims/quantum-measurement/issues/20
        const smallCoinTandem = tandem.createTandem( `multiCoin${i}` );
        coinSetNodes.push( new SmallCoinNode( coinRadius, { tandem: smallCoinTandem } ) );
      } );

      // Add the coin to our parent node. This is done so that we don't change our bounds, which could mess up the
      // layout. It will be added back to this area when it is back within the bounds.
      sceneGraphParent.addCoinNodeSet( coinSetNodes );

      // Create and start a set of animations to move these new created coin nodes to the side of the multiple coin test
      // box. The entire process consists of two animations, one to move a coin to the left edge of the test box while
      // the test box is potentially also moving, then a second one to move the coin into the box. The durations must
      // be set up such that the test box is in place before the 2nd animation begins or the coins won't end up in the
      // right places.
      const testAreaXOffset = forReprepare ? 100 : 300;
      const multipleCoinTestBoxBounds = this.globalToLocalBounds( multipleCoinTestBox.getGlobalBounds() );
      const leftOfTestBox = multipleCoinTestBoxBounds.center.minusXY( testAreaXOffset, 0 );
      const leftOfTestAreaInParentCoords = this.localToParentPoint( leftOfTestBox );
      coinSetNodes.forEach( ( coinNode, index ) => {

        // Get the final destination for this coin node in terms of its offset from the center of the test box.
        const finalDestinationOffset = multipleCoinTestBox.getOffsetFromCenter( index );

        // Calculate a destination at the edge of the test box such that this coin will just move right to its final
        // position.
        const destinationAtBoxEdge = leftOfTestAreaInParentCoords.plusXY( 0, finalDestinationOffset.y );

        // Create an animation that will move this coin node to the edge of the multi-coin test box.
        const animationToTestBoxEdge = new Animation( {
          setValue: value => { coinNode.center = value; },
          getValue: () => coinNode.center,
          to: destinationAtBoxEdge,
          duration: COIN_TRAVEL_ANIMATION_DURATION / 2,
          easing: Easing.LINEAR
        } );
        animationsToEdgeOfMultiCoinTestBox.push( animationToTestBoxEdge );
        animationToTestBoxEdge.finishEmitter.addListener( () => {

          const boxCenter = this.globalToParentBounds( multipleCoinTestBox.getGlobalBounds() ).center;

          // Start the 2nd portion of the animation, which moves the coin into the test box.
          const animationFromTestBoxEdgeToInside = new Animation( {
            setValue: value => { coinNode.center = value; },
            getValue: () => coinNode.center,
            to: boxCenter.plus( finalDestinationOffset ),
            duration: COIN_TRAVEL_ANIMATION_DURATION / 2,
            easing: Easing.CUBIC_OUT
          } );
          animationsFromEdgeOfMultiCoinBoxToInside.push( animationFromTestBoxEdgeToInside );
          animationFromTestBoxEdgeToInside.finishEmitter.addListener( () => {

            // The coin node should now be within the bounds of the multi-coin test box. Remove the coin node from the
            // scene graph parent and add it to the test box.
            sceneGraphParent.removeChild( coinNode );
            const offset = multipleCoinTestBox.getOffsetFromCenter( coinSetNodes.indexOf( coinNode ) );
            coinNode.center = multipleCoinTestBox.getLocalBounds().center.plus( offset );
            multipleCoinTestBox.addCoinNodeToBox( coinNode );

            if ( sceneModel.systemType === 'quantum' ) {

              // "Collapse" the state of the coin nodes so that they show a single state, not a superposed one.
              // TODO: https://github.com/phetsims/quantum-measurement/issues/16 - This isn't quite complete. It will
              //       need to collapse the coins as well.
              sceneModel.coinSet.prepareInstantly();
            }

            // If all animations have completed, set the flag that indicates the coins are fully in the box.
            const runningAnimations = animationsFromEdgeOfMultiCoinBoxToInside.filter(
              animation => animation.animatingProperty.value
            );
            if ( runningAnimations.length === 0 ) {
              this.coinSetInTestBoxProperty.value = true;
            }
          } );

          // Regardless of how the animation terminated its reference needs to be removed when it is done.
          animationFromTestBoxEdgeToInside.endedEmitter.addListener( () => {

            // Remove the now-completed animation from the list of active ones.
            animationsFromEdgeOfMultiCoinBoxToInside.filter(
              animation => animation !== animationFromTestBoxEdgeToInside
            );
          } );

          // Kick off the 2nd animation, which moves the coin from the edge of the test box to inside.
          animationFromTestBoxEdgeToInside.start();
        } );

        // Regardless of how the animation terminated its reference needs to be removed when it is done.
        animationToTestBoxEdge.endedEmitter.addListener( () => {
          animationsToEdgeOfMultiCoinTestBox.filter( animation => animation !== animationToTestBoxEdge );
        } );

        // Kick off the animation to the test box edge.
        animationToTestBoxEdge.start();
      } );
    };

    // Monitor the preparation state and start or stop animations as needed.
    sceneModel.preparingExperimentProperty.lazyLink( preparingExperiment => {
      if ( preparingExperiment ) {

        // Abort any in-progress animations - the scene model is going back into the preparation mode. If there are no
        // such animations, this has no effect.
        abortIngressAnimationForSingleCoin();
        abortIngressAnimationForCoinSet();

        // Clear out the test boxes.
        clearSingleCoinTestBox();
        multipleCoinTestBox.clearContents();

      }
      else {

        // The user is ready to make measurements on the coins, so animate the coins for both the single and multi-coin
        // experiments moving from the preparation area to the measurement area.
        startIngressAnimationForSingleCoin( false );
        startIngressAnimationForCoinSet( false );
      }
    } );

    // Listen to the state of the coin and animate a flipping motion for the classical coin or a travel-from-the-prep-
    // area animation for the quantum coin.
    // REVIEW: Want to change this snake case description for the actual name? https://github.com/phetsims/quantum-measurement/issues/20
    sceneModel.singleCoin.measurementStateProperty.lazyLink( singleCoinMeasurementState => {
      if ( sceneModel.systemType === 'classical' ) {

        if ( singleCoinMeasurementState === 'preparingToBeMeasured' ) {

          // state checking
          assert && assert( !flippingAnimationStepListener, 'something is off - there should be no listener' );
          assert && assert( singleCoinNode, 'something is off - there should be a coin node' );

          // Set the initial state of things prior to starting the animation.
          let flippingAnimationPhase = 0;
          const rotation = dotRandom.nextDouble() * Math.PI;
          let previousXScale = 0;
          coinMask.setRotation( rotation );
          singleCoinNode!.setRotation( rotation );

          // Create and hook up a step listener to perform the animation.
          flippingAnimationStepListener = ( dt: number ) => {
            flippingAnimationPhase += 2 * Math.PI * COIN_FLIP_RATE * dt;
            let xScale = Math.sin( flippingAnimationPhase );

            // Handle the case where we hit zero, since the scale can't be set to that value.
            if ( xScale === 0 ) {
              xScale = previousXScale < 0 ? 0.01 : -0.01;
            }

            // Scale the coin on the x-axis to make it look like they are rotating.
            // REVIEW: Why not check for coinMask? https://github.com/phetsims/quantum-measurement/issues/20
            coinMask.setScaleMagnitude( xScale, 1 );
            singleCoinNode && singleCoinNode.setScaleMagnitude( xScale, 1 );

            // Save state for handling the zero case.
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

      if ( measurementState === 'preparingToBeMeasured' && sceneModel.systemType === 'quantum' ) {

        // Abort any previous animations and clear out the test box.
        abortIngressAnimationForCoinSet();
        multipleCoinTestBox.clearContents();

        // Animate a coin from the prep area to the single coin test box to indicate that a new "quantum coin" is
        // being prepared for measurement.
        startIngressAnimationForCoinSet( true );
      }
    } );
  }
}

quantumMeasurement.register( 'CoinExperimentMeasurementArea', CoinExperimentMeasurementArea );