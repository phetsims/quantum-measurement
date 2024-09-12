// Copyright 2024, University of Colorado Boulder


/**
 * OutcomeProbabilityControl is a UI component that allows the user to manipulate the probability of the outcome for
 * the measurement of a two-state system. For a physical coin, this is essentially setting the bias of the coin. For
 * a quantum system, it is more like preparing the state of an experiment.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { Node, RichText, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SystemType } from '../../common/model/SystemType.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import ProbabilityValueControl from './ProbabilityValueControl.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';

type SelfOptions = EmptySelfOptions;
type OutcomeProbabilityControlOptions = SelfOptions & PickRequired<VBox, 'tandem' | 'visibleProperty'>;

// constants
const TITLE_AND_LABEL_FONT = new PhetFont( 16 );
const ALPHA = QuantumMeasurementConstants.ALPHA;
const BETA = QuantumMeasurementConstants.BETA;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;
const BRA_KET_TITLE_STRING = `( ${ALPHA}|${UP}${KET} + <span style="color: magenta;">${BETA}</span>|<span style="color: magenta;">${DOWN}</span>${KET} )`;

// REVIEW TODO: H and T should be variables, see https://github.com/phetsims/quantum-measurement/issues/20
const P_OF_H = 'P(<b>H</b>)';
const P_OF_T = 'P(<span style="color: magenta;"><b>T</b></span>)';

const MAGNITUDE_OF_ALPHA_SQUARED = `|${ALPHA}|<sup>2`;
const MAGNITUDE_OF_BETA_SQUARED = `<span style="color: magenta;">|${BETA}|<sup>2</span>`;

export default class OutcomeProbabilityControl extends VBox {

  public constructor( systemType: SystemType,
                      outcomeProbabilityProperty: NumberProperty,
                      providedOptions: OutcomeProbabilityControlOptions ) {

    let title: Node;
    if ( systemType === 'classical' ) {
      title = new Text( QuantumMeasurementStrings.coinBiasStringProperty, {
        font: TITLE_AND_LABEL_FONT,
        fontWeight: 'bold'
      } );
    }
    else {
      const titleStringProperty = new DerivedStringProperty(
        [ QuantumMeasurementStrings.stateToPrepareStringProperty ],
        stateToPrepareString => `<b>${stateToPrepareString}</b> ${BRA_KET_TITLE_STRING}`
      );
      title = new RichText( titleStringProperty, {
        font: TITLE_AND_LABEL_FONT
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

    const upperProbabilityControlTitleProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.probabilityOfPatternStringProperty,
        QuantumMeasurementStrings.headsStringProperty,
        QuantumMeasurementStrings.upStringProperty
      ],
      ( probabilityOfPatternString, headsString ) => {

        // This is only dynamic in the physical case as of this writing, but may change, and it is easier to handle the
        // physical and quantum cases together.
        let result: string;
        if ( systemType === 'classical' ) {
          result = `${StringUtils.fillIn( probabilityOfPatternString, { outcome: headsString } )} ${P_OF_H}`;
        }
        else {
          result = MAGNITUDE_OF_ALPHA_SQUARED;
        }
        return result;
      }
    );
    const lowerProbabilityControlTitleProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.probabilityOfPatternStringProperty,
        QuantumMeasurementStrings.tailsStringProperty
      ],
      ( probabilityOfPatternString, tailsString ) => {

        // This is only dynamic in the physical case as of this writing, but may change, and it is easier to handle the
        // physical and quantum cases together.
        let result: string;
        if ( systemType === 'classical' ) {
          result = `${StringUtils.fillIn( probabilityOfPatternString, { outcome: tailsString } )} ${P_OF_T}`;
        }
        else {
          result = MAGNITUDE_OF_BETA_SQUARED;
        }
        return result;
      }
    );

    let children: Node[];
    if ( systemType === 'classical' ) {
      children = [
        title,
        new ProbabilityValueControl( upperProbabilityControlTitleProperty, outcomeProbabilityProperty ),
        new ProbabilityValueControl( lowerProbabilityControlTitleProperty, inverseOutcomeProbabilityProperty )
      ];
    }
    else {

      // There is an additional child node in the quantum case that shows the quantum state and updates dynamically.
      const quantumStateReadoutStringProperty = new DerivedProperty(
        [ outcomeProbabilityProperty ],
        outcomeProbability => {

          // TODO: Make sure the values are correct here, see https://github.com/phetsims/quantum-measurement/issues/23
          const alphaValue = Utils.toFixed( Math.sqrt( outcomeProbability ), 3 );
          const betaValue = Utils.toFixed( Math.sqrt( 1 - outcomeProbability ), 3 );
          return `${alphaValue}|${UP}${KET} + <span style="color: magenta;">${betaValue}</span>|<span style="color: magenta;">${DOWN}</span>${KET}`;
        }
      );

      const quantumReadout = new RichText( quantumStateReadoutStringProperty, { font: TITLE_AND_LABEL_FONT } );

      children = [
        title,
        quantumReadout,
        new ProbabilityValueControl( upperProbabilityControlTitleProperty, outcomeProbabilityProperty ),
        new ProbabilityValueControl( lowerProbabilityControlTitleProperty, inverseOutcomeProbabilityProperty )
      ];
    }

    const options = optionize<OutcomeProbabilityControlOptions, SelfOptions, VBoxOptions>()( {
      children: children,
      spacing: 12
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'OutcomeProbabilityControl', OutcomeProbabilityControl );