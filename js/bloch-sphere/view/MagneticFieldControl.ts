// Copyright 2025, University of Colorado Boulder

/**
 * MagneticFieldControl is the node that contains the UI elements for controlling the magnetic field in the Bloch Sphere
 * screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
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
      yMargin: 20
    }, providedOptions );

    const magneticFieldIndicator = new Node( {
      children: [
        new Path( new Shape().moveTo( 0, -SLIDER_TRACK_SIZE.height / 2 ).lineTo( 0, SLIDER_TRACK_SIZE.height / 2 ), {
          stroke: 'grey',
          lineWidth: 1,
          lineDash: [ 2, 2 ]
        } ),
        new MagneticFieldArrowNode( magneticFieldStrengthProperty, SLIDER_TRACK_SIZE.height / 2 )
      ],
      tandem: providedOptions.tandem.createTandem( 'magneticFieldIndicator' )
    } );

    // Add horizontal lines to the magnetic field indicator.
    const numberOfIndicatorLines = 5;
    _.times( numberOfIndicatorLines, num => {
      const indicatorLine = new Line( -5, 0, 5, 0, {
        stroke: 'gray',
        centerY: -SLIDER_TRACK_SIZE.height / 2 + num * SLIDER_TRACK_SIZE.height / ( numberOfIndicatorLines - 1 )
      } );
      magneticFieldIndicator.addChild( indicatorLine );
      indicatorLine.moveToBack();
    } );

    const labeledMagneticFieldIndicator = new HBox( {
      children: [
        new Text( '0', { font: new PhetFont( 12 ) } ),
        magneticFieldIndicator
      ],
      spacing: 5,
      resize: false
    } );

    const magneticFieldStrengthSlider = new Slider( magneticFieldStrengthProperty, magneticFieldStrengthProperty.range, {
      tandem: providedOptions.tandem.createTandem( 'magneticFieldStrengthSlider' ),
      thumbSize: new Dimension2( 28, 14 ),
      thumbFill: QuantumMeasurementColors.magneticFieldThumbFillColorProperty,
      thumbFillHighlighted: QuantumMeasurementColors.magneticFieldColorProperty,
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
      children: [ labeledMagneticFieldIndicator, magneticFieldStrengthSlider ],
      spacing: 20,
      resize: false
    } );

    const panelTitle = new Text( QuantumMeasurementStrings.magneticFieldStringProperty, {
      font: new PhetFont( 18 ),
      maxWidth: 150
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