// Copyright 2024-2025, University of Colorado Boulder

/**
 * OutcomeProbabilityControl is a UI component that allows the user to control the probability of the outcome for
 * the measurement of a two-state system. For a classical coin, this is essentially setting the bias of the coin. For
 * a quantum system, it is more like preparing the state of an experiment.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import ProbabilityValueControl from '../../common/view/ProbabilityValueControl.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import ProbabilityEquationsNode from './ProbabilityEquationsNode.js';
import ProbabilityOfSymbolBox from './ProbabilityOfSymbolBox.js';

type SelfOptions = EmptySelfOptions;
type OutcomeProbabilityControlOptions = SelfOptions & PickRequired<VBox, 'tandem' | 'visibleProperty'>;

// constants
const ALPHA = MathSymbols.ALPHA;
const BETA = MathSymbols.BETA;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;
const MAGNITUDE_OF_ALPHA_SQUARED = `|${ALPHA}|<sup>2`;
const TITLE_NODE_HBOX_SPACING = 5;
const TITLE_NODE_MAX_WIDTH = 250;

export default class OutcomeProbabilityControl extends VBox {

  public constructor( systemType: SystemType,
                      outcomeProbabilityProperty: NumberProperty,
                      providedOptions: OutcomeProbabilityControlOptions ) {

    let COLOR_SPAN: ( text: string ) => string = text => text;

    let ketTitleString = `( ${ALPHA}|${UP}${KET} + ${COLOR_SPAN( BETA )}|${COLOR_SPAN( DOWN )}${KET} )`;
    let magnitudeOfBetaSquared = COLOR_SPAN( `|${BETA}|<sup>2` );

    Multilink.multilink(
      [
        QuantumMeasurementColors.tailsColorProperty,
        QuantumMeasurementColors.downColorProperty
      ],
      ( tailsColor, downColor ) => {
        COLOR_SPAN = ( text: string ) => {
          return ProbabilityEquationsNode.COLOR_SPAN( text, systemType === SystemType.CLASSICAL ? tailsColor : downColor );
        };
        ketTitleString = `( ${ALPHA}|${UP}${KET} + ${COLOR_SPAN( BETA )}|${COLOR_SPAN( DOWN )}${KET} )`;
        magnitudeOfBetaSquared = COLOR_SPAN( `|${BETA}|<sup>2` );
      }
    );

    let title: Node;
    if ( systemType === SystemType.CLASSICAL ) {
      title = new Text( QuantumMeasurementStrings.coinBiasStringProperty, {
        font: QuantumMeasurementConstants.TITLE_FONT,
        fontWeight: 'bold',
        maxWidth: 250,
        accessibleParagraph: QuantumMeasurementStrings.coinBiasStringProperty
      } );
    }
    else {
      const titleStringProperty = new DerivedStringProperty(
        [
          QuantumMeasurementStrings.stateToPrepareStringProperty,
          QuantumMeasurementColors.tailsColorProperty,
          QuantumMeasurementColors.downColorProperty
        ],
        stateToPrepareString => `<b>${stateToPrepareString}</b> ${ketTitleString}`
      );
      title = new RichText( titleStringProperty, {
        font: QuantumMeasurementConstants.TITLE_FONT,
        maxWidth: 250,
        accessibleParagraph: QuantumMeasurementStrings.a11y.quantumCoinsAccessibleParagraphStringProperty
      } );
    }

    // Create a Property with the inverse probability as the provided one and hook the two Properties up to one another.
    const inverseOutcomeProbabilityProperty = new NumberProperty( 1 - outcomeProbabilityProperty.value );
    let changeHandlingInProgress = false;

    outcomeProbabilityProperty.link( outcomeProbability => {
      if ( !changeHandlingInProgress ) {
        changeHandlingInProgress = true;
        inverseOutcomeProbabilityProperty.value = 1 - outcomeProbability;
        changeHandlingInProgress = false;
      }
    } );
    inverseOutcomeProbabilityProperty.link( inverseOutcomeProbability => {
      if ( !changeHandlingInProgress ) {
        changeHandlingInProgress = true;
        outcomeProbabilityProperty.value = 1 - inverseOutcomeProbability;
        changeHandlingInProgress = false;
      }
    } );

    const quantumUpTitleProperty = new DerivedProperty( [
        QuantumMeasurementStrings.probabilityStringProperty,
        QuantumMeasurementStrings.probabilityOfValuePatternStringProperty
      ], ( probabilityString, probabilityOfValuePatternString ) => {
        const POfV = StringUtils.fillIn( probabilityOfValuePatternString, { value: `<b>${QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER}</b>` } );
        return `${probabilityString} ${POfV} = ${MAGNITUDE_OF_ALPHA_SQUARED}`;
      }
    );

    const quantumDownTitleProperty = new DerivedProperty( [
        QuantumMeasurementStrings.probabilityStringProperty,
        QuantumMeasurementStrings.probabilityOfValuePatternStringProperty,
        QuantumMeasurementColors.tailsColorProperty,
        QuantumMeasurementColors.downColorProperty
      ], ( probabilityString, probabilityOfValuePatternString ) => {
        const POfV = StringUtils.fillIn( probabilityOfValuePatternString, { value: COLOR_SPAN( `<b>${QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER}</b>` ) } );
        return `${probabilityString} ${POfV} = ${magnitudeOfBetaSquared}`;
      }
    );

    let upProbabilityValueControl: ProbabilityValueControl;
    let downProbabilityValueControl: ProbabilityValueControl;
    let quantumReadout: RichText;

    let children: Node[];
    if ( systemType === SystemType.CLASSICAL ) {

      const upProbabilityTitleNode = new HBox( {
        spacing: TITLE_NODE_HBOX_SPACING,
        maxWidth: TITLE_NODE_MAX_WIDTH,
        children: [
          new Text(
            QuantumMeasurementStrings.probabilityStringProperty,
            QuantumMeasurementConstants.NUMBER_CONTROL_TITLE_OPTIONS
          ),
          new ProbabilityOfSymbolBox( 'heads' )
        ]
      } );

      const downProbabilityTitleNode = new HBox( {
        spacing: TITLE_NODE_HBOX_SPACING,
        maxWidth: TITLE_NODE_MAX_WIDTH,
        children: [
          new Text(
            QuantumMeasurementStrings.probabilityStringProperty,
            QuantumMeasurementConstants.NUMBER_CONTROL_TITLE_OPTIONS
          ),
          new ProbabilityOfSymbolBox( 'tails' )
        ]
      } );

      upProbabilityValueControl = new ProbabilityValueControl(
        upProbabilityTitleNode,
        outcomeProbabilityProperty,
        providedOptions.tandem.createTandem( 'classicalUpProbabilityControl' ),
        {
          accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfHeadsStringProperty,
          accessibleHelpText: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfHeadsHelpTextStringProperty
        }
      );

      downProbabilityValueControl = new ProbabilityValueControl(
        downProbabilityTitleNode,
        inverseOutcomeProbabilityProperty,
        providedOptions.tandem.createTandem( 'classicalDownProbabilityControl' ),
        {
          accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfTailsStringProperty,
          accessibleHelpText: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfTailsHelpTextStringProperty
        }
      );

      children = [
        title,
        upProbabilityValueControl,
        downProbabilityValueControl
      ];
    }
    else {

      const equationAccessibleParagraphStringProperty = new StringProperty( '' );

      // There is an additional child node in the quantum case that shows the quantum state and updates dynamically.
      const quantumStateReadoutStringProperty = new StringProperty( '' );

      Multilink.multilink(
        [
          outcomeProbabilityProperty,
          QuantumMeasurementColors.tailsColorProperty,
          QuantumMeasurementColors.downColorProperty,
          QuantumMeasurementStrings.a11y.equationAccessibleParagraphPatternStringProperty
        ],
        ( outcomeProbability, tailsColor, downColor, equationPattern ) => {

          // Since these values will go into multiple string Properties, we opt to fill them here
          // instead of a PatternStringProperty
          const alphaValue = toFixed( Math.sqrt( outcomeProbability ), 3 );
          const betaValue = toFixed( Math.sqrt( 1 - outcomeProbability ), 3 );

          equationAccessibleParagraphStringProperty.value = StringUtils.fillIn( equationPattern, {
            alpha: alphaValue,
            beta: betaValue
          } );

          quantumStateReadoutStringProperty.value = `${alphaValue}|${UP}${KET} + ${COLOR_SPAN( betaValue )}|${COLOR_SPAN( DOWN )}${KET}`;
        }
      );

      quantumReadout = new RichText( quantumStateReadoutStringProperty, {
        font: QuantumMeasurementConstants.TITLE_FONT,
        accessibleParagraph: equationAccessibleParagraphStringProperty
      } );

      upProbabilityValueControl = new ProbabilityValueControl(
        new RichText( quantumUpTitleProperty, QuantumMeasurementConstants.NUMBER_CONTROL_TITLE_OPTIONS ),
        outcomeProbabilityProperty,
        providedOptions.tandem.createTandem( 'quantumUpProbabilityControl' ),
        {
          accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfUpStringProperty,
          accessibleHelpText: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfUpHelpTextStringProperty
        }
      );
      downProbabilityValueControl = new ProbabilityValueControl(
        new RichText( quantumDownTitleProperty, QuantumMeasurementConstants.NUMBER_CONTROL_TITLE_OPTIONS ),
        inverseOutcomeProbabilityProperty,
        providedOptions.tandem.createTandem( 'quantumDownProbabilityControl' ),
        {
          accessibleName: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfDownStringProperty,
          accessibleHelpText: QuantumMeasurementStrings.a11y.coinsScreen.probabilityNumberControls.probabilityOfDownHelpTextStringProperty
        }
      );

      children = [
        title,
        quantumReadout,
        upProbabilityValueControl,
        downProbabilityValueControl
      ];
    }

    // Only show the title and subtitle (if present) if either of the probability controls are visible.  This is for
    // phet-io support.
    Multilink.multilink(
      [
        upProbabilityValueControl.visibleProperty,
        downProbabilityValueControl.visibleProperty
      ],
      ( upVisible, downVisible ) => {
        title.visible = upVisible || downVisible;
        quantumReadout && ( quantumReadout.visible = upVisible || downVisible );
      }
    );

    const options = optionize<OutcomeProbabilityControlOptions, SelfOptions, VBoxOptions>()( {
      children: children,
      spacing: 12
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'OutcomeProbabilityControl', OutcomeProbabilityControl );