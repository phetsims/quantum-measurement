// Copyright 2024, University of Colorado Boulder


/**
 * OutcomeProbabilityControl is a UI component that allows the user to manipulate the probability of the outcome for
 * the measurement of a two-state system. For a classical coin, this is essentially setting the bias of the coin. For
 * a quantum system, it is more like preparing the state of an experiment.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import ProbabilityValueControl from './ProbabilityValueControl.js';

type SelfOptions = EmptySelfOptions;
type OutcomeProbabilityControlOptions = SelfOptions & PickRequired<VBox, 'tandem' | 'visibleProperty'>;

// constants
const MAGENTA_SPAN = ( text: string ) => `<span style="color: magenta;">${text}</span>`;
const TITLE_AND_LABEL_FONT = new PhetFont( 16 );
const ALPHA = QuantumMeasurementConstants.ALPHA;
const BETA = QuantumMeasurementConstants.BETA;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;
const BRA_KET_TITLE_STRING = `( ${ALPHA}|${UP}${KET} + ${MAGENTA_SPAN( BETA )}|${MAGENTA_SPAN( DOWN )}${KET} )`;

const MAGNITUDE_OF_ALPHA_SQUARED = `|${ALPHA}|<sup>2`;
const MAGNITUDE_OF_BETA_SQUARED = MAGENTA_SPAN( `|${BETA}|<sup>2` );


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

    const classicalUpTitleProperty = new DerivedProperty( [
        QuantumMeasurementStrings.probabilityStringProperty,
        QuantumMeasurementStrings.probabilityOfValuePatternStringProperty
      ], ( probabilityString, probabilityOfValuePatternString ) => {
        const POfV = StringUtils.fillIn( probabilityOfValuePatternString, { value: `<b>${QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL}</b>` } );
        return `${probabilityString} ${POfV}`;
      }
    );

    const classicalDownTitleProperty = new DerivedProperty( [
        QuantumMeasurementStrings.probabilityStringProperty,
        QuantumMeasurementStrings.probabilityOfValuePatternStringProperty
      ], ( probabilityString, probabilityOfValuePatternString ) => {
        const POfV = StringUtils.fillIn( probabilityOfValuePatternString, { value: MAGENTA_SPAN( `<b>${QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL}</b>` ) } );
        return `${probabilityString} ${POfV}`;
      }
    );

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
        QuantumMeasurementStrings.probabilityOfValuePatternStringProperty
      ], ( probabilityString, probabilityOfValuePatternString ) => {
        const POfV = StringUtils.fillIn( probabilityOfValuePatternString, { value: MAGENTA_SPAN( `<b>${QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER}</b>` ) } );
        return `${probabilityString} ${POfV} = ${MAGNITUDE_OF_BETA_SQUARED}`;
      }
    );

    let children: Node[];
    if ( systemType === 'classical' ) {
      children = [
        title,
        new ProbabilityValueControl(
          classicalUpTitleProperty,
          outcomeProbabilityProperty,
          providedOptions.tandem.createTandem( 'classicalUpProbabilityControl' )
        ),
        new ProbabilityValueControl(
          classicalDownTitleProperty,
          inverseOutcomeProbabilityProperty,
          providedOptions.tandem.createTandem( 'classicalDownProbabilityControl' )
        )
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
          return `${alphaValue}|${UP}${KET} + ${MAGENTA_SPAN( betaValue )}|${MAGENTA_SPAN( DOWN )}${KET}`;
        }
      );

      const quantumReadout = new RichText( quantumStateReadoutStringProperty, { font: TITLE_AND_LABEL_FONT } );

      children = [
        title,
        quantumReadout,
        new ProbabilityValueControl(
          quantumUpTitleProperty,
          outcomeProbabilityProperty,
          providedOptions.tandem.createTandem( 'quantumUpProbabilityControl' )
        ),
        new ProbabilityValueControl(
          quantumDownTitleProperty,
          inverseOutcomeProbabilityProperty,
          providedOptions.tandem.createTandem( 'quantumDownProbabilityControl' )
        )
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