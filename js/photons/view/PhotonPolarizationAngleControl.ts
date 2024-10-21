// Copyright 2024, University of Colorado Boulder

/**
 * PhotonPolarizationAngleControl is a view element that allows the user to control the angle of polarization for the
 * polarizing beam splitter used in the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { PresetPolarizationDirections } from '../model/Laser.js';

type SelfOptions = EmptySelfOptions;
type PhotonPolarizationAngleControlOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

const FONT_SIZE = 16;
const DEFAULT_LABEL_FONT = new PhetFont( FONT_SIZE );
const TICK_MARK_TEXT_OPTIONS: TextOptions = {
  font: new PhetFont( 12 ),
  maxWidth: 50
};

export default class PhotonPolarizationAngleControl extends Panel {

  public constructor( presetPolarizationDirectionProperty: Property<PresetPolarizationDirections>,
                      customPolarizationAngleProperty: NumberProperty,
                      providedOptions: PhotonPolarizationAngleControlOptions ) {

    const options = optionize<PhotonPolarizationAngleControlOptions, SelfOptions, PanelOptions>()( {
      fill: QuantumMeasurementColors.controlPanelFillColorProperty,
      stroke: QuantumMeasurementColors.controlPanelStrokeColorProperty,
      cornerRadius: 5
    }, providedOptions );

    const titleProperty = new Text( QuantumMeasurementStrings.photonPolarizationAngleStringProperty, {
      font: DEFAULT_LABEL_FONT
    } );

    const presetPolarizationDirectionRadioButtonGroupTandem = providedOptions.tandem.createTandem(
      'presetPolarizationDirectionRadioButtonGroup'
    );

    const radioButtonGroupItems = [
      {
        value: 'vertical',
        createNode: () => new Text( QuantumMeasurementStrings.verticalStringProperty, {
          font: new PhetFont( FONT_SIZE ),
          fill: QuantumMeasurementColors.verticalPolarizationColorProperty
        } ),
        tandemName: 'verticalRadioButton'
      },
      {
        value: 'horizontal',
        createNode: () => new Text( QuantumMeasurementStrings.horizontalStringProperty, {
          font: new PhetFont( FONT_SIZE ),
          fill: QuantumMeasurementColors.horizontalPolarizationColorProperty
        } ),
        tandemName: 'horizontalRadioButton'
      },
      {
        value: 'fortyFiveDegrees',
        createNode: () => new Text( QuantumMeasurementStrings.fortyFiveDegreesStringProperty, {
          font: DEFAULT_LABEL_FONT
        } ),
        tandemName: 'fortyFiveDegreesRadioButton'
      },
      {
        value: 'custom',
        createNode: () => new Text( QuantumMeasurementStrings.customStringProperty, {
          font: DEFAULT_LABEL_FONT
        } ),
        tandemName: 'customRadioButton'
      }
    ];

    const presetPolarizationDirectionRadioButtonGroup = new AquaRadioButtonGroup<string>(
      presetPolarizationDirectionProperty,
      radioButtonGroupItems,
      {
        spacing: 8,
        touchAreaXDilation: 10,
        mouseAreaXDilation: 10,
        tandem: presetPolarizationDirectionRadioButtonGroupTandem,
        phetioVisiblePropertyInstrumented: false // hide the entire panel if you don't want radio buttons
      }
    );

    // Create a slider to control the custom angle of polarization.  It is only visible when the custom preset value
    // is selected.
    const customAngleSlider = new HSlider( customPolarizationAngleProperty, new Range( 0, 90 ), {
      visibleProperty: new DerivedProperty( [ presetPolarizationDirectionProperty ], value => value === 'custom' ),
      trackSize: new Dimension2( 140, 1.5 ),
      thumbSize: new Dimension2( 13, 26 ),
      trackStroke: null,
      trackFillEnabled: Color.BLACK,
      majorTickLength: 10,
      majorTickLineWidth: 1.5,
      constrainValue: value => Utils.roundToInterval( value, 1 ),
      tandem: providedOptions.tandem.createTandem( 'customAngleSlider' )
    } );

    // slider tick marks
    customAngleSlider.addMajorTick( 0, new Text( 0, TICK_MARK_TEXT_OPTIONS ) );
    customAngleSlider.addMajorTick( 90, new Text( 90, TICK_MARK_TEXT_OPTIONS ) );

    const content = new VBox( {
      children: [ titleProperty, presetPolarizationDirectionRadioButtonGroup, customAngleSlider ],
      excludeInvisibleChildrenFromBounds: false,
      spacing: 10
    } );

    super( content, options );
  }
}

quantumMeasurement.register( 'PhotonPolarizationAngleControl', PhotonPolarizationAngleControl );