// Copyright 2024, University of Colorado Boulder

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
import { Color, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import OutcomeProbabilityControl from './OutcomeProbabilityControl.js';
import ProbabilityEquationsNode from './ProbabilityEquationsNode.js';
import SceneSectionHeader from './SceneSectionHeader.js';

export default class CoinExperimentPreparationArea extends VBox {

  private readonly initialCoinStateSelectorNode: InitialCoinStateSelectorNode;

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColor = sceneModel.systemType === 'quantum' ? Color.BLUE : Color.BLACK;

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

    const prepAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way. See https://github.com/phetsims/quantum-measurement/issues/35.
      preparingExperiment => preparingExperiment ? 250 : 100
    );
    const preparationAreaHeader = new SceneSectionHeader(
      prepAreaHeadingTextProperty,
      prepAreaHeaderLineWidthProperty,
      { textColor: textColor }
    );

    // Create the UI element that will allow the user to specify the initial state of the coin.
    const initialCoinStateSelectorNode = new InitialCoinStateSelectorNode(
      sceneModel.initialCoinStateProperty,
      sceneModel.upProbabilityProperty,
      sceneModel.preparingExperimentProperty,
      sceneModel.systemType,
      tandem.createTandem( 'coinStateSelectorNode' )
    );

    // Create the node that will show the probabilities for the possible outcomes as equations.
    const probabilityEquationsNode = new ProbabilityEquationsNode(
      sceneModel.upProbabilityProperty,
      sceneModel.systemType
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
        probabilityEquationsNode,
        outcomeProbabilityControl
      ],
      spacing: 15
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