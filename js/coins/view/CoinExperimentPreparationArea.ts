// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinExperimentPreparationArea is a composite UI component that allows users to configure a two-state classical or
 * quantum system - basically a classical or quantum coin - for a set of experiments where the user can flip and reveal
 * the coins. This is implemented as a VBox that acts as a column in the UI.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import OutcomeProbabilityControl from './OutcomeProbabilityControl.js';
import ProbabilityEquationsNode from './ProbabilityEquationsNode.js';
import SceneSectionHeader from './SceneSectionHeader.js';

class CoinExperimentPreparationArea extends VBox {

  private readonly initialCoinStateSelectorNode: InitialCoinStateSelectorNode;

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColorProperty = sceneModel.systemType === 'quantum' ?
                              QuantumMeasurementColors.quantumSceneTextColorProperty : QuantumMeasurementColors.classicalSceneTextColorProperty;

    // Create the header. It is somewhat different depending on whether this is for a classical or quantum system.
    const prepAreaHeadingTextProperty: TReadOnlyProperty<string> = new DerivedProperty(
      [
        QuantumMeasurementStrings.coinStringProperty,
        QuantumMeasurementStrings.quantumCoinQuotedStringProperty,
        QuantumMeasurementStrings.itemToPreparePatternStringProperty,
        QuantumMeasurementStrings.preparedStateStringProperty,
        sceneModel.preparingExperimentProperty
      ],
      ( coinString, quantumCoinString, itemToPreparePattern, preparedStateString, preparingExperiment ) => {
        let returnText;
        if ( preparingExperiment ) {
          returnText = StringUtils.fillIn( itemToPreparePattern, {
            item: sceneModel.systemType === 'classical' ? coinString : quantumCoinString
          } );
        }
        else {
          returnText = sceneModel.systemType === 'classical' ? coinString : preparedStateString;
        }
        return returnText;
      }
    );

    const preparationAreaHeader = new SceneSectionHeader(
      prepAreaHeadingTextProperty,
      { textColor: textColorProperty }
    );

    // Create the UI element that will allow the user to specify the initial state of the coin.
    const initialCoinStateSelectorNode = new InitialCoinStateSelectorNode(
      sceneModel.initialCoinFaceStateProperty,
      sceneModel.upProbabilityProperty,
      sceneModel.preparingExperimentProperty,
      sceneModel.systemType,
      tandem.createTandem( 'coinStateSelectorNode' )
    );

    // Create the node that will show the probabilities for the possible outcomes as equations.
    const probabilityEquationsText = new ProbabilityEquationsNode(
      sceneModel.upProbabilityProperty,
      sceneModel.systemType,
      {
        maxWidth: 150, // empirically determined to work well with layout
        tandem: tandem.createTandem( 'probabilityEquationsText' )
      }
    );

    // Create the control that will allow the user to manipulate the probability of the various outcomes.
    const outcomeProbabilityControl = new OutcomeProbabilityControl(
      sceneModel.systemType,
      sceneModel.upProbabilityProperty,
      {
        visibleProperty: sceneModel.preparingExperimentProperty,
        tandem: tandem.createTandem( 'outcomeProbabilityControl' )
      }
    );

    super( {
      children: [
        preparationAreaHeader,
        initialCoinStateSelectorNode,
        probabilityEquationsText,
        outcomeProbabilityControl
      ],
      spacing: 15,
      accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.coinToPrepareStringProperty,
      tagName: 'div',
      labelTagName: 'h3'
    } );

    this.initialCoinStateSelectorNode = initialCoinStateSelectorNode;
  }

  /**
   * Get the position of the coin that indicates the initial orientation or prepared state in the global coordinate
   * frame.  This is generally used when trying to animate the movement of coin between parent nodes.
   */
  public getIndicatorCoinGlobalCenter(): Vector2 {
    const orientationIndicatorGlobalBounds = this.initialCoinStateSelectorNode.orientationIndicatorCoinNode.getGlobalBounds();
    return orientationIndicatorGlobalBounds.center;
  }
}

quantumMeasurement.register( 'CoinExperimentPreparationArea', CoinExperimentPreparationArea );

export default CoinExperimentPreparationArea;