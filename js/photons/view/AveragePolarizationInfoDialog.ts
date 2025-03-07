// Copyright 2025, University of Colorado Boulder

/**
 * AveragePolarizationInfoDialog is a dialog that provides information about the average polarization equation shown in
 * the 'Photons' screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

// constants
const MAX_WIDTH = 800; // determined empirically
const TITLE_FONT = new PhetFont( { size: 18, weight: 'bold' } );
const ITEM_FONT = QuantumMeasurementConstants.SUPER_TITLE_FONT;

export default class AveragePolarizationInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const titleText = new Text( QuantumMeasurementStrings.averagePolarizationDialog.titleStringProperty, {
      font: TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    const richTextOptions = {
      font: ITEM_FONT,
      maxWidth: MAX_WIDTH
    };
    const subtitle = new Text(
      QuantumMeasurementStrings.averagePolarizationDialog.subTitleStringProperty,
      richTextOptions
    );

    // Create derived properties for the strings that explain the equation elements.
    // Does not use a PatternStringProperty because of the string composition of N and V
    const numberOfVerticalExplanationStringProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.NStringProperty,
        QuantumMeasurementStrings.VStringProperty,
        QuantumMeasurementStrings.verticalStringProperty,
        QuantumMeasurementStrings.averagePolarizationDialog.numberOfPhotonsPatternPhraseStringProperty
      ],
      ( nString, vString, verticalString, numberOfPhotonsPatternString ) => {
        return StringUtils.fillIn( numberOfPhotonsPatternString, {
          function: MathSymbolFont.getRichTextMarkup( `${nString}(${vString})` ),
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
        const functionString = MathSymbolFont.getRichTextMarkup( `${nString}(${hString})` );
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
        const functionString = MathSymbolFont.getRichTextMarkup( `${nString}(${totalString})` );
        return StringUtils.fillIn( totalPhotonsPatternString, {
          function: functionString
        } );
      }
    );

    // Create the RichText nodes for the equation explanation strings.
    const equationExplanationStringProperties = [
      numberOfVerticalExplanationStringProperty,
      numberOfHorizontalExplanationStringProperty,
      totalExplanationStringProperty
    ];
    const functionElementWithExplanationNodes = equationExplanationStringProperties.map(
      stringProperty => new RichText( stringProperty, richTextOptions )
    );

    // Create the explanatory paragraph that sits at the bottom of the dialog.
    const explanatoryParagraphProperty = new RichText(
      QuantumMeasurementStrings.averagePolarizationDialog.explanatoryParagraphStringProperty,
      {
        font: ITEM_FONT,
        lineWrap: MAX_WIDTH * 0.9
      }
    );

    // Put it all together with spacing in a vertical box.
    const content = new VBox( {
      children: [
        new Spacer( 0, 5 ),
        subtitle,
        new Spacer( 0, 3 ),
        ...functionElementWithExplanationNodes,
        new Spacer( 0, 5 ),
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