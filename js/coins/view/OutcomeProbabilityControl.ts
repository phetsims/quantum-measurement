// Copyright 2024, University of Colorado Boulder


/**
 * OutcomeProbabilityControl is a UI component that allows the user to manipulate the probability of the outcome for
 * the measurement of a two-state system.  For a physical coin, this is essentially setting the bias of the coin.  For
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

type SelfOptions = EmptySelfOptions;
type OutcomeProbabilityControlOptions = SelfOptions & PickRequired<VBox, 'tandem' | 'visibleProperty'>;


const TITLE_FONT = new PhetFont( 16 );
const ALPHA = QuantumMeasurementConstants.ALPHA;
const BETA = QuantumMeasurementConstants.BETA;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const BRA_KET_TITLE_STRING = `( ${ALPHA}|${UP}${KET} + <span style="color: magenta;">${BETA}|${DOWN}${KET}</span> )`;
const P_OF_H = 'P(<b>H</b>)';
const P_OF_T = 'P(<span style="color: magenta;"><b>T</b></span>)';

export default class OutcomeProbabilityControl extends VBox {

  public constructor( systemType: SystemType,
                      outcomeProbabilityProperty: NumberProperty,
                      providedOptions: OutcomeProbabilityControlOptions ) {

    let title: Node;
    if ( systemType === 'physical' ) {
      title = new Text( QuantumMeasurementStrings.coinBiasStringProperty, {
        font: TITLE_FONT,
        fontWeight: 'bold'
      } );
    }
    else {
      const titleStringProperty = new DerivedStringProperty(
        [ QuantumMeasurementStrings.stateToPrepareStringProperty ],
        stateToPrepareString => `<b>${stateToPrepareString}</b> ${BRA_KET_TITLE_STRING}`
      );
      title = new RichText( titleStringProperty, {
        font: TITLE_FONT
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
      [ QuantumMeasurementStrings.probabilityOfHeadsStringProperty ],
      probabilityOfHeadsString => `${probabilityOfHeadsString} ${P_OF_H}`
    );
    const lowerProbabilityControlTitleProperty = new DerivedStringProperty(
      [ QuantumMeasurementStrings.probabilityOfTailsStringProperty ],
      probabilityOfTailsString => `${probabilityOfTailsString} ${P_OF_T}`
    );

    const options = optionize<OutcomeProbabilityControlOptions, SelfOptions, VBoxOptions>()( {
      children: [
        title,
        new ProbabilityValueControl( upperProbabilityControlTitleProperty, outcomeProbabilityProperty ),
        new ProbabilityValueControl( lowerProbabilityControlTitleProperty, inverseOutcomeProbabilityProperty )
      ],
      spacing: 12
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'OutcomeProbabilityControl', OutcomeProbabilityControl );