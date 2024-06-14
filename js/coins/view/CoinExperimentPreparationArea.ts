// Copyright 2024, University of Colorado Boulder

/**
 * CoinExperimentPreparationArea is a composite UI component that allows users to configure a two-state physical or
 * quantum system - basically a physical or quantum coin - for a set of experiments where the user can flip and reveal
 * the coins.  This is implemented as a VBox that acts as a column in the UI.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, VBox } from '../../../../scenery/js/imports.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ProbabilityEquationsNode from './ProbabilityEquationsNode.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CoinExperimentPreparationArea extends VBox {

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColor = sceneModel.systemType === 'quantum' ? Color.BLUE : Color.BLACK;

    // Create the header.  It is somewhat different depending on whether this is for a physical or quantum system.
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
            item: sceneModel.systemType === 'physical' ? coinString : quantumCoinString
          } );
        }
        else {
          returnText = sceneModel.systemType === 'physical' ? coinString : preparedStateString;
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
      { textColor: textColor }
    );

    // Create the UI element that will allow the user to specify the initial state of the coin.
    const initialCoinStateSelectorNode = new InitialCoinStateSelectorNode(
      sceneModel.initialCoinStateProperty,
      sceneModel.stateBiasProperty,
      sceneModel.preparingExperimentProperty,
      sceneModel.systemType,
      tandem.createTandem( 'coinStateSelectorNode' )
    );

    // Create the node that will show the probabilities for the possible outcomes as equations.
    const probabilityEquationsNode = new ProbabilityEquationsNode(
      sceneModel.singleCoin.biasProperty,
      sceneModel.systemType
    );

    super( {
      children: [
        preparationAreaHeader,
        initialCoinStateSelectorNode,
        probabilityEquationsNode
      ],
      spacing: 15
    } );
  }
}

quantumMeasurement.register( 'CoinExperimentPreparationArea', CoinExperimentPreparationArea );