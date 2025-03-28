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
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import { getCoinAccessibleName } from '../model/CoinStates.js';
import InitialCoinStateSelectorNode from './InitialCoinStateSelectorNode.js';
import OutcomeProbabilityControl from './OutcomeProbabilityControl.js';
import ProbabilityEquationsNode from './ProbabilityEquationsNode.js';
import SceneSectionHeader from './SceneSectionHeader.js';

class CoinExperimentPreparationArea extends VBox {

  private readonly initialCoinStateSelectorNode: InitialCoinStateSelectorNode;

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColorProperty = sceneModel.systemType === SystemType.QUANTUM ?
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
        QuantumMeasurementStrings.a11y.preparationAreaHeader.classicalCoinToPrepareStringProperty,
        QuantumMeasurementStrings.a11y.preparationAreaHeader.classicalCoinStringProperty,
        QuantumMeasurementStrings.a11y.preparationAreaHeader.quantumCoinToPrepareStringProperty,
        QuantumMeasurementStrings.a11y.preparationAreaHeader.preparedStateStringProperty
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
            item: sceneModel.systemType === SystemType.CLASSICAL ? coinString : quantumCoinString
          } );
          preparationAreaAccessibleNameStringProperty.value = sceneModel.systemType === SystemType.CLASSICAL ?
                                                              a11yClassicalCoinToPrepareString : a11yQuantumCoinToPrepareString;

        }
        else {
          preparationAreaHeadingTextProperty.value = sceneModel.systemType === SystemType.CLASSICAL ? coinString : preparedStateString;
          preparationAreaAccessibleNameStringProperty.value = sceneModel.systemType === SystemType.CLASSICAL ?
                                                              a11yClassicalCoinString : a11yPreparedStateString;
        }
      }
    );

    const formattedUpProbabilityProperty = new DerivedProperty( [ sceneModel.upProbabilityProperty ], upProbability => {
      return toFixed( upProbability, 3 );
    } );

    const formattedDownProbabilityProperty = new DerivedProperty( [ sceneModel.downProbabilityProperty ], downProbability => {
      return toFixed( downProbability, 3 );
    } );

    const coinStateStringProperty = getCoinAccessibleName( sceneModel.initialCoinStateProperty );

    const patternStringProperty = sceneModel.systemType === SystemType.CLASSICAL ?
                                  QuantumMeasurementStrings.a11y.preparationAreaHeader.classicalAccessibleParagraphPatternStringProperty :
                                  QuantumMeasurementStrings.a11y.preparationAreaHeader.quantumAccessibleParagraphPatternStringProperty;

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
        maxWidth: 250
      }
    );

    // Limit the max width of the preparation area header based on whether the user is preparing an experiment or not.
    // This is necessary because the preparation area is significantly narrower when in measurement (i.e.
    // non-preparation) mode.
    const maxHeadingWidthDuringMeasurement = 150;
    sceneModel.preparingExperimentProperty.link( preparingExperiment => {
      const scale = preparationAreaHeader.width > maxHeadingWidthDuringMeasurement && !preparingExperiment ?
                    maxHeadingWidthDuringMeasurement / preparationAreaHeader.width :
                    1;
      preparationAreaHeader.setScaleMagnitude( scale );
    } );

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
      sceneModel.systemType,
      {
        maxWidth: 150, // empirically determined to work well with layout
        tandem: tandem.createTandem( 'probabilityEquationsNode' ),
        phetioVisiblePropertyInstrumented: true
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

    // For the layout, adjust the spacing between the probability indicators and the bias controls based on the type of
    // system being modeled.  This is necessary because the quantum system has an additional line of text that is
    // displayed.
    const spacerHeight = sceneModel.systemType === SystemType.CLASSICAL ? 5 : 0;

    super( {
      children: [
        preparationAreaHeader,
        initialCoinStateSelectorNode,
        probabilityEquationsNode,
        new Spacer( 0, spacerHeight ),
        outcomeProbabilityControl
      ],
      spacing: 15
    } );

    this.initialCoinStateSelectorNode = initialCoinStateSelectorNode;
  }

  /**
   * Get the position of the coin that indicates the initial orientation or prepared state in the global coordinate
   * frame. This is generally used when trying to animate the movement of coin between parent nodes.
   */
  public getIndicatorCoinGlobalCenter(): Vector2 {
    const orientationIndicatorGlobalBounds = this.initialCoinStateSelectorNode.orientationIndicatorCoinNode.getGlobalBounds();
    return orientationIndicatorGlobalBounds.center;
  }
}

quantumMeasurement.register( 'CoinExperimentPreparationArea', CoinExperimentPreparationArea );

export default CoinExperimentPreparationArea;