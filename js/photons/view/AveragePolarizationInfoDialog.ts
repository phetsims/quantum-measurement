// Copyright 2025, University of Colorado Boulder

/**
 * AveragePolarizationInfoDialog is a dialog that shows a key to the math symbols used in the 'Discrete' screen.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

// constants
const MAX_WIDTH = 800; // determined empirically

export default class AveragePolarizationInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const titleText = new Text( QuantumMeasurementStrings.averagePolarizationRepresentationStringProperty, {
      font: new PhetFont( { size: 18, weight: 'bold' } ),
      maxWidth: MAX_WIDTH
    } );

    const richTextOptions = {
      font: new PhetFont( 18 )
    };
    const strings = [
      'A thing',
      'Another thing',
      '3rd thing'
    ];
    const children = strings.map( myString => new RichText( myString, richTextOptions ) );

    const content = new VBox( {
      children: children,
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