// Copyright 2024, University of Colorado Boulder

/**
 * PhotonDetectionProbabilityPanel displays the probabilities for detection of photons being measured as vertically or
 * horizontally polarized.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectionProbabilityPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

const FONT_SIZE = 18;
const NORMAL_FONT = new PhetFont( FONT_SIZE );
const BOLD_FONT = new PhetFont( { size: FONT_SIZE, weight: 'bold' } );

export default class PhotonDetectionProbabilityPanel extends Panel {

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number | null>,
                      providedOptions: PhotonDetectionProbabilityPanelOptions ) {

    const options = optionize<PhotonDetectionProbabilityPanelOptions, SelfOptions, PanelOptions>()( {
      fill: QuantumMeasurementColors.screenBackgroundColorProperty,
      stroke: null
    }, providedOptions );

    // Calculate the probability of a photon being detected as horizontally polarized.  A null value indicates that the
    // probability is unknown.
    const probabilityOfHorizontalProperty = new DerivedProperty(
      [ polarizationAngleProperty ],
      polarizationAngle => polarizationAngle === null ? null : Math.cos( Utils.toRadians( polarizationAngle ) ) ** 2
    );

    // Calculate the probability of a photon being detected as vertically polarized.  A null value indicates that the
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
                          Utils.toFixed( probabilityOfHorizontal, 2 );
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
                          Utils.toFixed( probabilityOfVertical, 2 );
        return `${leftSide} = ${rightSide}`;
      }
    );

    // Create the textual nodes and assemble them in a VBox.
    const title = new Text( QuantumMeasurementStrings.probabilityStringProperty, { font: BOLD_FONT } );
    const probabilityOfVerticalText = new RichText( probabilityOfVerticalStringProperty, { font: NORMAL_FONT } );
    const probabilityOfHorizontalText = new RichText( probabilityOfHorizontalStringProperty, { font: NORMAL_FONT } );
    const content = new VBox( {
      children: [ title, probabilityOfVerticalText, probabilityOfHorizontalText ],
      spacing: 15
    } );

    super( content, options );
  }
}

const getColoredString = ( text: string, color: Color ): string => {
  return `<span style="font-weight: bold; color: ${color.toCSS()};">${text}</span>`;
};

quantumMeasurement.register( 'PhotonDetectionProbabilityPanel', PhotonDetectionProbabilityPanel );