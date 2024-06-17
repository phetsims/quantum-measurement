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
import Property from '../../../../axon/js/Property.js';
import { PhysicalCoinStates } from '../model/PhysicalCoinStates.js';
import QuantumCoinNode from './QuantumCoinNode.js';
import CoinNode from './CoinNode.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import { Shape } from '../../../../kite/js/imports.js';
import CoinExperimentButtonSet from './CoinExperimentButtonSet.js';

const SINGLE_COIN_AREA_RECT_LINE_WIDTH = 17;

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
    const singleCoinTestAreaSideWidth = 150;
    const singleCoinMeasurementRectangle = new Rectangle( 0, 0, singleCoinTestAreaSideWidth, 130, {
      fill: new LinearGradient( 0, 0, singleCoinTestAreaSideWidth, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      opacity: 0.8,
      lineWidth: SINGLE_COIN_AREA_RECT_LINE_WIDTH,
      stroke: new Color( '#222222' )
    } );
    const singleCoinMeasurementArea = new Node( {
      children: [ singleCoinMeasurementRectangle ],
      clipArea: Shape.bounds( singleCoinMeasurementRectangle.getRectBounds() )
    } );
    const singleCoinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.systemType,
      {
        tandem: tandem.createTandem( 'singleCoinExperimentButtonSet' ),
        visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty )
      }
    );

    const singleCoinAreaAndControls = new HBox( {
      children: [ singleCoinMeasurementArea, singleCoinExperimentButtonSet ],
      spacing: 30
    } );

    // Add the lower heading for the measurement area.
    const multiCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.multipleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColor }
    );

    // Add the area where the multiple coins will be hidden and revealed.
    const multipleCoinTestAreaSideLength = 200;
    const multipleCoinMeasurementArea = new Rectangle( 0, 0, multipleCoinTestAreaSideLength, multipleCoinTestAreaSideLength, {
      fill: new LinearGradient( 0, 0, multipleCoinTestAreaSideLength, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      lineWidth: 2,
      stroke: new Color( '#666666' )
    } );

    super( {
      children: [
        singleCoinSectionHeader,
        singleCoinAreaAndControls,
        multiCoinSectionHeader,
        multipleCoinMeasurementArea
      ],
      spacing: 25
    } );

    // When the scene switches from preparing the experiment to making measurements, coins are added that migrate from
    // the preparation area to this (the measurement) area.
    let singleCoinNode: CoinNode | null = null;
    let coinMask: Circle | null = null;
    let animationFromPrepToMeasurementArea: Animation | null = null;
    let animationFromEdgeOfScreenToBehindIt: Animation | null = null;
    sceneModel.preparingExperimentProperty.lazyLink( preparingExperiment => {

      // Create a typed reference to the parent node, since we'll need to invoke some methods on it.
      assert && assert( this.getParent() instanceof CoinsExperimentSceneView );
      const sceneGraphParent = this.getParent() as CoinsExperimentSceneView;

      if ( preparingExperiment ) {
        if ( singleCoinNode ) {
          if ( singleCoinMeasurementArea.hasChild( singleCoinNode ) ) {
            singleCoinMeasurementArea.removeChild( singleCoinNode );
          }
          else if ( sceneGraphParent.hasChild( singleCoinNode ) ) {
            sceneGraphParent.removeChild( singleCoinNode );
          }
          singleCoinNode.dispose();
          singleCoinNode = null;
        }
        if ( coinMask ) {
          singleCoinMeasurementArea.removeChild( coinMask );
          coinMask.dispose();
          coinMask = null;
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
        // preparation area to the measurement area.  Start be creating the node used for single coin measurements.
        if ( sceneModel.systemType === 'physical' ) {
          singleCoinNode = new PhysicalCoinNode(
            new Property<PhysicalCoinStates>( sceneModel.initialCoinStateProperty.value as PhysicalCoinStates ),
            InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          );
        }
        else {
          singleCoinNode = new QuantumCoinNode(
            sceneModel.stateBiasProperty,
            InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS,
            Tandem.OPT_OUT
          );
        }

        // Add the coin to our parent node.  This is done so that we don't change our bounds, which could mess up the
        // layout.  It will be added back to this area when it is back within the bounds.
        sceneGraphParent.addCoinNode( singleCoinNode );

        // Create and start an animation to move this coin to the top test area in the measurement area.
        const leftOfTestArea = singleCoinAreaAndControls.center.minusXY( 350, 0 );
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

          // Add a "mask" that will appear on top of the coin that will be used to hide it when it's in the test area.
          // It is not a child of the coin node because it's being clipped by the test area.
          coinMask = new Circle( InitialCoinStateSelectorNode.INDICATOR_COIN_NODE_RADIUS, {
            fill: new Color( '#cccccc' ),
            stroke: new Color( '#888888' ),
            lineWidth: 4
          } );
          coinMask.center = singleCoinMeasurementArea.parentToLocalPoint( this.parentToLocalPoint( coinNode.center ) );
          singleCoinMeasurementArea.insertChild( 0, coinMask );

          // Do the 2nd portion of the animation, which moves it into the actual test area.
          animationFromEdgeOfScreenToBehindIt = new Animation( {
            setValue: value => {
              coinNode.center = value;
              coinMask!.center = singleCoinAreaAndControls.parentToLocalPoint(
                singleCoinMeasurementArea.parentToLocalPoint(
                  this.parentToLocalPoint( coinNode.center )
                )
              );
            },
            getValue: () => coinNode.center,
            to: this.localToParentPoint( singleCoinAreaAndControls.localToParentPoint( singleCoinMeasurementArea.center ) ),
            duration: 0.7,
            easing: Easing.CUBIC_OUT
          } );
          animationFromEdgeOfScreenToBehindIt.finishEmitter.addListener( () => {

            // Now that the coin is within the bounds of the measurement area, remove it from the parent node and add it
            // to the measurement area.
            sceneGraphParent.removeChild( coinNode );
            coinNode.centerX = singleCoinMeasurementArea.width / 2;
            coinNode.centerY = singleCoinMeasurementArea.height / 2;
            singleCoinMeasurementArea.insertChild( 0, coinNode );
          } );

          // Kick off the animation.
          animationFromEdgeOfScreenToBehindIt.start();
        } );
      }
    } );
  }
}

quantumMeasurement.register( 'CoinExperimentMeasurementArea', CoinExperimentMeasurementArea );