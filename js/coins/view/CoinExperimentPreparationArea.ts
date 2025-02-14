// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinExperimentPreparationArea is a composite UI component that allows users to configure a two-state classical or
 * quantum system - basically a classical or quantum coin - for a set of experiments where the user can flip and reveal
 * the coins. This is implemented as a VBox that acts as a column in the UI.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
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
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

class CoinExperimentPreparationArea extends VBox {

  private readonly initialCoinStateSelectorNode: InitialCoinStateSelectorNode;

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColorProperty = sceneModel.systemType === 'quantum' ?
                              QuantumMeasurementColors.quantumSceneTextColorProperty : QuantumMeasurementColors.classicalSceneTextColorProperty;

    const preparationAreaHeadingTextProperty = new StringProperty( '' );

    const preparationAreaAccessibleNameStringProperty = new StringProperty( '' );

    // TODO: For consistency and symetry, should we add redundant translatable strings??? https://github.com/phetsims/quantum-measurement/issues/92
    // Create the header. It is somewhat different depending on whether this is for a classical or quantum system.
    Multilink.multilink(
      [
        sceneModel.preparingExperimentProperty,
        QuantumMeasurementStrings.coinStringProperty,
        QuantumMeasurementStrings.quantumCoinQuotedStringProperty,
        QuantumMeasurementStrings.itemToPreparePatternStringProperty,
        QuantumMeasurementStrings.preparedStateStringProperty,
        QuantumMeasurementStrings.a11y.translatable.preparationAreaHeader.classicalCoinToPrepareStringProperty,
        QuantumMeasurementStrings.a11y.translatable.preparationAreaHeader.classicalCoinStringProperty,
        QuantumMeasurementStrings.a11y.translatable.preparationAreaHeader.quantumCoinToPrepareStringProperty,
        QuantumMeasurementStrings.a11y.translatable.preparationAreaHeader.preparedStateStringProperty
      ],
      (
        preparingExperiment,
        coinString,
        quantumCoinString,
        itemToPreparePattern,
        preparedStateString,
        a11yClassicalCoinToPrepareString,
        a11yClassicalCoinString,
        a11yQuantumCoinToPrepareString,
        a11yPreparedStateString
      ) => {
        if ( preparingExperiment ) {
          preparationAreaHeadingTextProperty.value = StringUtils.fillIn( itemToPreparePattern, {
            item: sceneModel.systemType === 'classical' ? coinString : quantumCoinString
          } );
          preparationAreaAccessibleNameStringProperty.value = sceneModel.systemType === 'classical' ?
                                                              a11yClassicalCoinToPrepareString : a11yQuantumCoinToPrepareString;

        }
        else {
          preparationAreaHeadingTextProperty.value = sceneModel.systemType === 'classical' ? coinString : preparedStateString;
          preparationAreaAccessibleNameStringProperty.value = sceneModel.systemType === 'classical' ?
                                                              a11yClassicalCoinString : a11yPreparedStateString;
        }
      }
    );

    const formattedUpProbabilityProperty = new DerivedProperty( [ sceneModel.upProbabilityProperty ], upProbability => {
      return Utils.toFixed( upProbability, 3 );
    } );

    const formattedDownProbabilityProperty = new DerivedProperty( [ sceneModel.downProbabilityProperty ], downProbability => {
      return Utils.toFixed( downProbability, 3 );
    } );

    const coinStateStringProperty = new DerivedProperty( [
      sceneModel.initialCoinFaceStateProperty,
      QuantumMeasurementStrings.a11y.translatable.coinsScreen.coinStates.upStringProperty,
      QuantumMeasurementStrings.a11y.translatable.coinsScreen.coinStates.downStringProperty,
      QuantumMeasurementStrings.a11y.translatable.coinsScreen.coinStates.headsStringProperty,
      QuantumMeasurementStrings.a11y.translatable.coinsScreen.coinStates.tailsStringProperty,
      QuantumMeasurementStrings.a11y.translatable.coinsScreen.coinStates.superposedStringProperty
    ], (
      initialCoinFaceState,
      upString,
      downString,
      headsString,
      tailsString,
      superposedString
    ) => {
      let returnString: string;
      switch( initialCoinFaceState ) {
        case 'up':
          returnString = upString;
          break;
        case 'down':
          returnString = downString;
          break;
        case 'heads':
          returnString = headsString;
          break;
        case 'tails':
          returnString = tailsString;
          break;
        case 'superposed':
          returnString = superposedString;
          break;
        default:
          returnString = '';
      }

      assert && assert( !!returnString, `Invalid initial coin face state: ${initialCoinFaceState}` );
      return returnString;
    } );

    const patternStringProperty = sceneModel.systemType === 'classical' ?
                                  QuantumMeasurementStrings.a11y.translatable.preparationAreaHeader.classicalAccessibleParagraphPatternStringProperty :
                                  QuantumMeasurementStrings.a11y.translatable.preparationAreaHeader.quantumAccessibleParagraphPatternStringProperty;

    const classicalAccessibleParagraphPatternStringProperty = new PatternStringProperty( patternStringProperty, {
      initialCoinFaceState: coinStateStringProperty,
      upProbability: formattedUpProbabilityProperty,
      downProbability: formattedDownProbabilityProperty
    } );

    const preparationAreaHeader = new SceneSectionHeader(
      preparationAreaHeadingTextProperty,
      {
        accessibleName: preparationAreaAccessibleNameStringProperty,
        accessibleParagraph: classicalAccessibleParagraphPatternStringProperty,
        textColor: textColorProperty,
        maxWidth: 200
      }
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

export default CoinExperimentPreparationArea;