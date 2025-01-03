// Copyright 2024, University of Colorado Boulder

/**
 * MagneticFieldControl is the node that contains the UI elements for controlling the magnetic field in the Bloch Sphere
 * screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, HBox, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import MagneticFieldArrowNode from './MagneticFieldArrowNode.js';

type SelfOptions = EmptySelfOptions;
export type MagneticFieldControlOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

const SLIDER_TRACK_SIZE = new Dimension2( 0.1, 100 );

export default class MagneticFieldControl extends Panel {

  public constructor( magneticFieldStrengthProperty: NumberProperty,
                      providedOptions: MagneticFieldControlOptions ) {

    const options = optionize<MagneticFieldControlOptions, SelfOptions, PanelOptions>()( {
      fill: QuantumMeasurementColors.controlPanelFillColorProperty,
      stroke: null,
      xMargin: 10,
      yMargin: 10
    }, providedOptions );

    const magneticFieldIndicator = new Node( {
      children: [
        new Path( new Shape().moveTo( 0, -SLIDER_TRACK_SIZE.height / 2 ).lineTo( 0, SLIDER_TRACK_SIZE.height / 2 ), {
          stroke: 'grey',
          lineWidth: 1,
          lineDash: [ 5, 5 ]
        } ),
        new MagneticFieldArrowNode( magneticFieldStrengthProperty )
      ],
      tandem: providedOptions.tandem.createTandem( 'magneticFieldIndicator' )
    } );

    const magneticFieldStrengthSlider = new Slider( magneticFieldStrengthProperty, magneticFieldStrengthProperty.range, {
      tandem: providedOptions.tandem.createTandem( 'magneticFieldStrengthSlider' ),
      thumbSize: new Dimension2( 28, 14 ),
      thumbFill: '#ee0',
      thumbFillHighlighted: '#ff0',
      thumbCenterLineStroke: Color.BLACK,
      trackSize: SLIDER_TRACK_SIZE,
      trackFillEnabled: Color.BLACK,
      constrainValue: value => Utils.roundToInterval( value, 0.25 ),
      orientation: Orientation.VERTICAL,
      majorTickLength: 20
    } );
    magneticFieldStrengthSlider.addMajorTick( -1 );
    magneticFieldStrengthSlider.addMajorTick( 1 );

    const indicatorAndSlider = new HBox( {
      children: [ magneticFieldIndicator, magneticFieldStrengthSlider ],
      spacing: 20,
      resize: false
    } );

    const panelTitle = new Text( QuantumMeasurementStrings.magneticFieldStringProperty, {
      font: new PhetFont( 18 )
    } );

    super(
      new VBox( {
        children: [ panelTitle, indicatorAndSlider ],
        spacing: 10
      } ),
      options
    );

  }
}

quantumMeasurement.register( 'MagneticFieldControl', MagneticFieldControl );