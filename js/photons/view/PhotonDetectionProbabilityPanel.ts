// Copyright 2024, University of Colorado Boulder

/**
 *
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
import { PresetPolarizationDirections } from '../model/Laser.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectionProbabilityPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

const FONT_SIZE = 18;
const NORMAL_FONT = new PhetFont( FONT_SIZE );
const BOLD_FONT = new PhetFont( { size: FONT_SIZE, weight: 'bold' } );

export default class PhotonDetectionProbabilityPanel extends Panel {

  public constructor( presetPolarizationDirectionProperty: TReadOnlyProperty<PresetPolarizationDirections>,
                      customPolarizationAngleProperty: TReadOnlyProperty<number>,
                      providedOptions: PhotonDetectionProbabilityPanelOptions ) {

    const options = optionize<PhotonDetectionProbabilityPanelOptions, SelfOptions, PanelOptions>()( {
      fill: QuantumMeasurementColors.screenBackgroundColorProperty,
      stroke: null
    }, providedOptions );

    const probabilityOfVerticalProperty = new DerivedProperty(
      [ presetPolarizationDirectionProperty, customPolarizationAngleProperty ],
      ( presetPolarizationDirection, customPolarizationAngle ) => {
        return presetPolarizationDirection === 'vertical' ? 1 :
               presetPolarizationDirection === 'horizontal' ? 0 :
               presetPolarizationDirection === 'fortyFiveDegrees' ? 0.5 :
               1 - Math.cos( customPolarizationAngle ) ** 2;
      }
    );

    const probabilityOfHorizontalProperty = new DerivedProperty(
      [ probabilityOfVerticalProperty ],
      probabilityOfVertical => 1 - probabilityOfVertical
    );

    const probabilityOfVerticalStringProperty = new DerivedProperty(
      [
        probabilityOfVerticalProperty,
        QuantumMeasurementStrings.PStringProperty,
        QuantumMeasurementStrings.VStringProperty,
        QuantumMeasurementColors.verticalPolarizationColorProperty
      ],
      ( probabilityOfVertical, pString, vString, verticalColor ) => {
        return `${pString}(${getColoredString( vString, verticalColor )}) = ${Utils.toFixed( probabilityOfVertical, 2 )}`;
      }
    );

    const probabilityOfHorizontalStringProperty = new DerivedProperty(
      [
        probabilityOfHorizontalProperty,
        QuantumMeasurementStrings.PStringProperty,
        QuantumMeasurementStrings.HStringProperty,
        QuantumMeasurementColors.horizontalPolarizationColorProperty
      ],
      ( probabilityOfHorizontal, pString, hString, horizontalColor ) => {
        return `${pString}(${getColoredString( hString, horizontalColor )}) = ${Utils.toFixed( probabilityOfHorizontal, 2 )}`;
      }
    );

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