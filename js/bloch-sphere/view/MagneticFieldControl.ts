// Copyright 2025, University of Colorado Boulder

/**
 * MagneticFieldControl is the node that contains the UI elements for controlling the magnetic field in the Bloch Sphere
 * screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Spacer from '../../../../scenery/js/nodes/Spacer.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import MagneticFieldArrowNode from './MagneticFieldArrowNode.js';

type SelfOptions = EmptySelfOptions;
export type MagneticFieldControlOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

const SLIDER_TRACK_SIZE = new Dimension2( 0.1, 110 );

export default class MagneticFieldControl extends Panel {

  public constructor( magneticFieldStrengthProperty: NumberProperty,
                      providedOptions: MagneticFieldControlOptions ) {

    const options = optionize<MagneticFieldControlOptions, SelfOptions, PanelOptions>()(
      QuantumMeasurementConstants.PANEL_OPTIONS,
      providedOptions
    );

    const magneticFieldIndicator = new Node( {
      children: [
        new Path( new Shape().moveTo( 0, -SLIDER_TRACK_SIZE.height / 2 ).lineTo( 0, SLIDER_TRACK_SIZE.height / 2 ), {
          stroke: 'gray',
          lineWidth: 1,
          lineDash: [ 2, 2 ]
        } ),
        new MagneticFieldArrowNode( magneticFieldStrengthProperty, SLIDER_TRACK_SIZE.height / 2 )
      ],
      tandem: Tandem.OPT_OUT
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
        new Text( '0', { font: QuantumMeasurementConstants.SMALL_LABEL_FONT } ),
        magneticFieldIndicator
      ],
      spacing: 5,
      resize: false
    } );

    const sliderStep = 0.25;
    const magneticFieldStrengthSlider = new Slider(
      magneticFieldStrengthProperty,
      magneticFieldStrengthProperty.range,
      {
        thumbSize: new Dimension2( 26, 12 ),
        thumbFill: QuantumMeasurementColors.magneticFieldThumbFillProperty,
        thumbFillHighlighted: QuantumMeasurementColors.magneticFieldArrowFillProperty,
        thumbCenterLineStroke: Color.BLACK,
        trackSize: SLIDER_TRACK_SIZE,
        trackFillEnabled: Color.BLACK,
        orientation: Orientation.VERTICAL,
        majorTickLength: 20,
        constrainValue: value => roundToInterval( value, sliderStep ),
        keyboardStep: sliderStep,
        shiftKeyboardStep: sliderStep,
        pageKeyboardStep: sliderStep * 2,
        valueChangeSoundGeneratorOptions: {
          numberOfMiddleThresholds: magneticFieldStrengthProperty.range.getLength() / sliderStep - 1
        },
        tandem: providedOptions.tandem.createTandem( 'magneticFieldStrengthSlider' )
      }
    );
    magneticFieldStrengthSlider.addMajorTick( -1 );
    magneticFieldStrengthSlider.addMajorTick( 1 );

    const indicatorAndSlider = new HBox( {
      children: [ labeledMagneticFieldIndicator, magneticFieldStrengthSlider ],
      spacing: 20,
      resize: false
    } );

    // Calculate a max width for the title based on the options provided or the width of the indicator and slider.
    const maxPanelTitleWidth = options.minWidth && options.xMargin ?
                               options.minWidth - 2 * options.xMargin :
                               indicatorAndSlider.width;

    // Create the title for the panel.
    const panelTitle = new Text( QuantumMeasurementStrings.magneticFieldStringProperty, {
      font: QuantumMeasurementConstants.TITLE_FONT,
      maxWidth: maxPanelTitleWidth
    } );

    // Assemble the children of the panel, and stick in a couple of spacers so that the slider and readout are
    // vertically centered between the title and the bottom of the panel.
    const vboxContentChildren = [ panelTitle, new Spacer( 0, 1 ), indicatorAndSlider, new Spacer( 0, 1 ) ];

    super( new VBox( { children: vboxContentChildren } ), options );
  }
}

quantumMeasurement.register( 'MagneticFieldControl', MagneticFieldControl );