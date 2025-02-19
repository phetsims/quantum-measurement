// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonPolarizationAngleControl is a view element that allows the user to control the angle of polarization for the
 * polarizing beam splitter used in the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import Laser from '../model/Laser.js';
import FlatPolarizationAngleIndicator from './FlatPolarizationAngleIndicator.js';
import VectorTailNode from './VectorTailNode.js';

type SelfOptions = EmptySelfOptions;
type PhotonPolarizationAngleControlOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

const RADIO_BUTTON_TEXT_FONT = new PhetFont( 14 );
const TICK_MARK_TEXT_OPTIONS: TextOptions = {
  font: new PhetFont( 12 ),
  maxWidth: 50
};

export default class PhotonPolarizationAngleControl extends Panel {

  public constructor( photonSource: Laser, providedOptions: PhotonPolarizationAngleControlOptions ) {

    const options = optionize<PhotonPolarizationAngleControlOptions, SelfOptions, PanelOptions>()( {
      fill: QuantumMeasurementColors.controlPanelFillColorProperty,
      stroke: QuantumMeasurementColors.controlPanelStrokeColorProperty,
      cornerRadius: 5,
      xMargin: 10
    }, providedOptions );

    const titleNode = new Text( QuantumMeasurementStrings.photonPolarizationAngleStringProperty, {
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      maxWidth: 200
    } );

    const verticalRadioButtonLabelTextProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.verticalStringProperty,
        QuantumMeasurementStrings.VStringProperty,
        QuantumMeasurementStrings.nameAndAbbreviationPatternStringProperty
      ],
      ( verticalString, vString, nameAndAbbreviationPatternString ) =>
        StringUtils.fillIn( nameAndAbbreviationPatternString, { name: verticalString, abbreviation: vString } )
    );
    const horizontalRadioButtonLabelTextProperty = new DerivedStringProperty(
      [
        QuantumMeasurementStrings.horizontalStringProperty,
        QuantumMeasurementStrings.HStringProperty,
        QuantumMeasurementStrings.nameAndAbbreviationPatternStringProperty
      ],
      ( horizontalString, hString, nameAndAbbreviationPatternString ) =>
        StringUtils.fillIn( nameAndAbbreviationPatternString, { name: horizontalString, abbreviation: hString } )
    );

    const radioButtonTextOptions: TextOptions = {
      font: RADIO_BUTTON_TEXT_FONT,
      maxWidth: 150
    };
    const radioButtonGroupItems = [
      {
        value: 'vertical',
        createNode: () => new RichText( verticalRadioButtonLabelTextProperty,
          combineOptions<TextOptions>(
            { fill: QuantumMeasurementColors.verticalPolarizationColorProperty },
            radioButtonTextOptions
          )
        ),
        tandemName: 'verticalRadioButton'
      },
      {
        value: 'horizontal',
        createNode: () => new RichText( horizontalRadioButtonLabelTextProperty,
          combineOptions<TextOptions>(
            { fill: QuantumMeasurementColors.horizontalPolarizationColorProperty },
            radioButtonTextOptions
          )
        ),
        tandemName: 'horizontalRadioButton'
      },
      {
        value: 'fortyFiveDegrees',
        createNode: () => new Text( QuantumMeasurementStrings.fortyFiveDegreesStringProperty,
          radioButtonTextOptions ),
        tandemName: 'fortyFiveDegreesRadioButton'
      },
      {
        value: 'unpolarized',
        createNode: () => new Text( QuantumMeasurementStrings.unpolarizedStringProperty,
          radioButtonTextOptions ),
        tandemName: 'unpolarizedRadioButton'
      },

      {
        value: 'custom',
        createNode: () => new Text( QuantumMeasurementStrings.customStringProperty,
          radioButtonTextOptions ),
        tandemName: 'customRadioButton'
      }
    ];

    const presetPolarizationDirectionRadioButtonGroup = new AquaRadioButtonGroup<string>(
      photonSource.presetPolarizationDirectionProperty,
      radioButtonGroupItems,
      {
        spacing: 8,
        touchAreaXDilation: 10,
        mouseAreaXDilation: 10,
        tandem: providedOptions.tandem.createTandem( 'presetPolarizationDirectionRadioButtonGroup' )
      }
    );

    // Create a slider to control the custom angle of polarization.  It is only visible when the custom preset value
    // is selected.
    const customAngleSlider = new HSlider( photonSource.customPolarizationAngleProperty, new Range( 0, 90 ), {

      // REVIEW: Use DerivedProperty.valueEqualsConstant
      visibleProperty: new DerivedProperty(
        [ photonSource.presetPolarizationDirectionProperty ],
        value => value === 'custom'
      ),
      trackSize: new Dimension2( 140, 1.5 ),
      thumbSize: new Dimension2( 13, 26 ),
      trackStroke: null,
      trackFillEnabled: Color.BLACK,
      majorTickLength: 10,
      majorTickLineWidth: 1.5,
      constrainValue: value => Utils.roundToInterval( value, 5 ),
      tandem: providedOptions.tandem.createTandem( 'customAngleSlider' )
    } );

    // slider tick marks
    customAngleSlider.addMajorTick( 0, new Text( '0°', TICK_MARK_TEXT_OPTIONS ) );
    customAngleSlider.addMajorTick( 90, new Text( '90°', TICK_MARK_TEXT_OPTIONS ) );

    // Assemble the title, radio button group, and slider into a VBox.
    const leftPortionOfPanel = new VBox( {
      children: [ titleNode, presetPolarizationDirectionRadioButtonGroup, customAngleSlider ],
      excludeInvisibleChildrenFromBounds: false,
      align: 'left',
      spacing: 10
    } );

    // Create the polarization indicator and its caption.
    const polarizationIndicatorGraphic = new FlatPolarizationAngleIndicator( photonSource.polarizationAngleProperty, {
      scale: 1.2
    } );
    const polarizationIndicatorCaption = new HBox( {
      children: [
        new VectorTailNode( 6 ),
        new Text( QuantumMeasurementStrings.propagationIntoPageStringProperty, {
          font: new PhetFont( 14 ),
          maxWidth: 100
        } )
      ],
      spacing: 5,
      tandem: providedOptions.tandem.createTandem( 'polarizationIndicatorCaption' )
    } );

    // Put the polarization indicator and its caption into a VBox.
    const polarizationIndicator = new VBox( {
      children: [ polarizationIndicatorGraphic, polarizationIndicatorCaption ],
      spacing: 5,
      tandem: providedOptions.tandem.createTandem( 'polarizationIndicator' )
    } );

    // Put the left portion of the panel into an HBox with the polarization indicator.
    const content = new HBox( {
      children: [ leftPortionOfPanel, polarizationIndicator ]
    } );

    super( content, options );
  }
}

quantumMeasurement.register( 'PhotonPolarizationAngleControl', PhotonPolarizationAngleControl );