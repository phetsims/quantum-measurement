// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonDetectionProbabilityPanel displays the probabilities for detection of photons being measured as vertically or
 * horizontally polarized.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectionProbabilityAccordionBoxOptions = SelfOptions & WithRequired<AccordionBoxOptions, 'tandem'>;

export default class PhotonDetectionProbabilityPanel extends AccordionBox {

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number | null>,
                      expandedProperty: Property<boolean>,
                      providedOptions: PhotonDetectionProbabilityAccordionBoxOptions ) {

    const options = optionize<PhotonDetectionProbabilityAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      stroke: null,
      titleNode: new Text( QuantumMeasurementStrings.probabilityStringProperty, {
        font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
        maxWidth: 200
      } ),
      cornerRadius: 5,
      buttonXMargin: 10,
      buttonYMargin: 5,

      expandedProperty: expandedProperty
    }, providedOptions );

    // Calculate the probability of a photon being detected as horizontally polarized. A null value indicates that the
    // probability is unknown.
    const probabilityOfHorizontalProperty = new DerivedProperty(
      [ polarizationAngleProperty ],
      polarizationAngle => polarizationAngle === null ? null : Math.cos( toRadians( polarizationAngle ) ) ** 2
    );

    // Calculate the probability of a photon being detected as vertically polarized. A null value indicates that the
    // probability is unknown.
    const probabilityOfVerticalProperty = new DerivedProperty(
      [ probabilityOfHorizontalProperty ],
      probabilityOfHorizontal => probabilityOfHorizontal === null ? null : 1 - probabilityOfHorizontal
    );

    // Create the string Properties that will be displayed in the panel.
    const probabilityOfHorizontalStringProperty = new DerivedProperty(
      [
        probabilityOfHorizontalProperty,
        QuantumMeasurementStrings.PStringProperty,
        QuantumMeasurementStrings.HStringProperty,
        QuantumMeasurementStrings.unknownProbabilitySymbolStringProperty,
        QuantumMeasurementColors.horizontalPolarizationColorProperty
      ],
      ( probabilityOfHorizontal, pString, hString, unknownProbabilitySymbol, horizontalColor ) => {
        const leftSide = `${pString}(${getColoredString( hString, horizontalColor )})`;
        const rightSide = probabilityOfHorizontal === null ?
                          unknownProbabilitySymbol :
                          toFixed( probabilityOfHorizontal, 2 );
        return `${leftSide} = ${rightSide}`;
      }
    );
    const probabilityOfVerticalStringProperty = new DerivedProperty(
      [
        probabilityOfVerticalProperty,
        QuantumMeasurementStrings.PStringProperty,
        QuantumMeasurementStrings.VStringProperty,
        QuantumMeasurementStrings.unknownProbabilitySymbolStringProperty,
        QuantumMeasurementColors.verticalPolarizationColorProperty
      ],
      ( probabilityOfVertical, pString, vString, unknownProbabilitySymbol, verticalColor ) => {
        const leftSide = `${pString}(${getColoredString( vString, verticalColor )})`;
        const rightSide = probabilityOfVertical === null ?
                          unknownProbabilitySymbol :
                          toFixed( probabilityOfVertical, 2 );
        return `${leftSide} = ${rightSide}`;
      }
    );

    // Create the textual nodes and assemble them in a VBox.
    const probabilityOfTextOptions = {
      font: QuantumMeasurementConstants.TITLE_FONT,
      maxWidth: 150
    };
    const probabilityOfVerticalText = new RichText( probabilityOfVerticalStringProperty, probabilityOfTextOptions );
    const probabilityOfHorizontalText = new RichText( probabilityOfHorizontalStringProperty, probabilityOfTextOptions );
    const content = new VBox( {
      children: [ probabilityOfVerticalText, probabilityOfHorizontalText ],
      spacing: 15
    } );

    super( content, options );
  }
}

const getColoredString = ( text: string, color: Color ): string => {
  return `<span style="font-weight: bold; color: ${color.toCSS()};">${text}</span>`;
};

quantumMeasurement.register( 'PhotonDetectionProbabilityPanel', PhotonDetectionProbabilityPanel );