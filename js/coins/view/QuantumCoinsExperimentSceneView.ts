// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinsExperimentSceneView is the parent node in which the "Quantum Coin" scene is displayed.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, LinearGradient, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinsExperimentSceneView, { CoinsExperimentSceneViewOptions } from './CoinsExperimentSceneView.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ProbabilityEquationsNode from './ProbabilityEquationsNode.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';

type SelfOptions = EmptySelfOptions;
type QuantumCoinsExperimentSceneViewOptions = SelfOptions & CoinsExperimentSceneViewOptions;

export default class QuantumCoinsExperimentSceneView extends CoinsExperimentSceneView {

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: QuantumCoinsExperimentSceneViewOptions ) {

    const options = optionize<QuantumCoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      { visibleProperty: sceneModel.activeProperty },
      providedOptions
    );

    super( sceneModel, options );

    // Set up the header for the preparation area.
    const prepAreaHeadingTextProperty: TReadOnlyProperty<string> = new DerivedProperty(
      [
        QuantumMeasurementStrings.coinStringProperty,
        QuantumMeasurementStrings.quantumCoinQuotedStringProperty,
        QuantumMeasurementStrings.itemToPreparePatternStringProperty,
        sceneModel.preparingExperimentProperty
      ],
      ( coinString, quantumCoinString, itemToPreparePattern, preparingExperiment ) => {
        let returnText;
        if ( preparingExperiment ) {
          returnText = StringUtils.fillIn( itemToPreparePattern, { item: quantumCoinString } );
        }
        else {
          returnText = coinString;
        }
        return returnText;
      }
    );
    const prepAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 250 : 100
    );
    const preparationAreaHeader = new SceneSectionHeader(
      prepAreaHeadingTextProperty,
      prepAreaHeaderLineWidthProperty,
      { textColor: Color.BLUE }
    );
    this.preparationArea.addChild( preparationAreaHeader );

    // Add the UI element that will allow the user to specify the initial state of the coin.
    this.preparationArea.addChild( new InitialCoinStateSelectorNode(
      sceneModel.initialCoinStateProperty,
      sceneModel.preparingExperimentProperty,
      'quantum',
      options.tandem.createTandem( 'coinStateSelectorNode' )
    ) );

    // Add the node that will show the probabilities for the possible outcomes as equations.
    this.preparationArea.addChild( new ProbabilityEquationsNode( sceneModel.singleCoin.biasProperty, 'quantum' ) );

    // Set up the top header for the measurement area.  It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    const singleCoinMeasurementsHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: Color.BLUE }
    );
    this.measurementArea.addChild( singleCoinMeasurementsHeader );

    // Add the area where the single coin will be hidden and revealed.
    // TODO: See https://github.com/phetsims/quantum-measurement/issues/9.  The code below is duplicated in
    //       PhysicalCoinExperimentSceneView.  This should be consolidated.
    const singleCoinTestAreaSideLength = 150;
    const singleCoinMeasurementArea = new Rectangle( 0, 0, singleCoinTestAreaSideLength, singleCoinTestAreaSideLength, {
      fill: new LinearGradient( 0, 0, singleCoinTestAreaSideLength, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      lineWidth: 10,
      stroke: new Color( '#666666' )
    } );
    this.measurementArea.addChild( singleCoinMeasurementArea );

    // Add the lower heading for the measurement area.
    this.measurementArea.addChild( new SceneSectionHeader(
      QuantumMeasurementStrings.multipleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty
    ) );

    // Add the area where the multiple coins will be hidden and revealed.
    const multipleCoinTestAreaSideLength = 200;
    const multipleCoinMeasurementArea = new Rectangle( 0, 0, multipleCoinTestAreaSideLength, multipleCoinTestAreaSideLength, {
      fill: new LinearGradient( 0, 0, multipleCoinTestAreaSideLength, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      lineWidth: 2,
      stroke: new Color( '#666666' )
    } );
    this.measurementArea.addChild( multipleCoinMeasurementArea );

    // Update the activity area positions now that they have some content.
    this.updateActivityAreaPositions();
  }
}

quantumMeasurement.register( 'QuantumCoinsExperimentSceneView', QuantumCoinsExperimentSceneView );