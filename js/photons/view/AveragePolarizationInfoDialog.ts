// Copyright 2025, University of Colorado Boulder

/**
 * AveragePolarizationInfoDialog is a dialog that shows a key to the math symbols used in the 'Discrete' screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

// constants
const MAX_WIDTH = 800; // determined empirically
const TITLE_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const ITEM_FONT = new PhetFont( 18 );

export default class AveragePolarizationInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const titleText = new Text( QuantumMeasurementStrings.averagePolarizationDialog.titleStringProperty, {
      font: TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    const textOptions = {
      font: ITEM_FONT,
      maxWidth: MAX_WIDTH
    };
    const subtitle = new Text( QuantumMeasurementStrings.averagePolarizationDialog.subTitleStringProperty, textOptions );
    const numberOfVerticalExplanationStringProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.NStringProperty,
        QuantumMeasurementStrings.VStringProperty,
        QuantumMeasurementStrings.verticalStringProperty,
        QuantumMeasurementStrings.averagePolarizationDialog.numberOfPhotonsPatternPhraseStringProperty
      ],
      ( nString, vString, verticalString, numberOfPhotonsPatternString ) => {
        const functionString = `${nString}(${vString})`;
        return StringUtils.fillIn( numberOfPhotonsPatternString, {
          function: functionString,
          direction: verticalString
        } );
      }
    );
    const numberOfHorizontalExplanationStringProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.NStringProperty,
        QuantumMeasurementStrings.HStringProperty,
        QuantumMeasurementStrings.horizontalStringProperty,
        QuantumMeasurementStrings.averagePolarizationDialog.numberOfPhotonsPatternPhraseStringProperty
      ],
      ( nString, hString, horizontalString, numberOfPhotonsPatternString ) => {
        const functionString = `${nString}(${hString})`;
        return StringUtils.fillIn( numberOfPhotonsPatternString, {
          function: functionString,
          direction: horizontalString
        } );
      }
    );
    const totalExplanationStringProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.NStringProperty,
        QuantumMeasurementStrings.totalStringProperty,
        QuantumMeasurementStrings.averagePolarizationDialog.totalNumberOfPhotonsPatternPhraseStringProperty
      ],
      ( nString, totalString, totalPhotonsPatternString ) => {
        const functionString = `${nString}(${totalString})`;
        return StringUtils.fillIn( totalPhotonsPatternString, {
          function: functionString
        } );
      }
    );

    const equationExplanationStringProperties = [
      numberOfVerticalExplanationStringProperty,
      numberOfHorizontalExplanationStringProperty,
      totalExplanationStringProperty
    ];
    const functionElementWithExplanationNodes = equationExplanationStringProperties.map(
      stringProperty => new Text( stringProperty, textOptions )
    );

    const explanatoryParagraphProperty = new RichText(
      QuantumMeasurementStrings.averagePolarizationDialog.explanatoryParagraphStringProperty,
      {
        font: ITEM_FONT,
        lineWrap: MAX_WIDTH * 0.8
      }
    );

    const content = new VBox( {
      children: [
        new Spacer( 0, 5 ),
        subtitle,
        ...functionElementWithExplanationNodes,
        new Spacer( 0, 10 ),
        explanatoryParagraphProperty
      ],
      align: 'left',
      spacing: 11
    } );

    super( content, {

      // DialogOptions
      isDisposable: false,
      title: titleText,
      xSpacing: 30,
      cornerRadius: 5,
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}

quantumMeasurement.register( 'AveragePolarizationInfoDialog', AveragePolarizationInfoDialog );