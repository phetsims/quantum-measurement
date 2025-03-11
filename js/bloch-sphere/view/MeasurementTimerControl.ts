// Copyright 2025, University of Colorado Boulder

/**
 * MeasurementTimerControl is the node that contains the UI elements for controlling the time at which the Bloch Sphere
 * is measured.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import MeasurementSymbolNode from '../../common/view/MeasurementSymbolNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
export type MeasurementTimerControlOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

// constants
const SLIDER_TRACK_SIZE = new Dimension2( 150, 0.1 );
const NUMBER_OF_MINOR_TICKS = 7;

export default class MeasurementTimerControl extends Node {

  public constructor( timeToMeasurementProperty: NumberProperty,
                      measurementTimeProperty: NumberProperty,
                      providedOptions: MeasurementTimerControlOptions ) {

    // Create the tandem for the slider, since we'll need it for other things before creating the slider itself.
    const sliderTandem = providedOptions.tandem.createTandem( 'timeToMeasurementSlider' );

    // Create the thumb node for the slider that will control the time at which the system is measured.
    const thumbOffset = 30;
    const thumbDimensions = new Dimension2( 30, 30 );
    const thumbPathOptions = {
      fill: QuantumMeasurementColors.measurementTimerFillColorProperty,
      fillHighlighted: QuantumMeasurementColors.measurementTimerFillColorProperty.value.colorUtilsBrighter( 0.5 ),
      stroke: 'black',
      lineWidth: 2
    };
    const thumbNodeRect = new Path( new Shape().roundRect(
      -thumbDimensions.width / 2,
      thumbOffset - thumbDimensions.height / 2,
      thumbDimensions.width,
      thumbDimensions.height,
      5,
      5
    ), thumbPathOptions );
    const thumbNode = new Node( {
      children: [
        new Path( new Shape().circle( 0, 0, 2 ).moveTo( 0, 0 ).lineTo( 0, thumbOffset - thumbDimensions.height / 2 ), thumbPathOptions ),
        thumbNodeRect,
        new MeasurementSymbolNode( {
          center: new Vector2( 0, thumbOffset ),
          scale: 0.8,
          stroke: QuantumMeasurementColors.measurementTimerIconStrokeColorProperty
        } )
      ],
      touchArea: thumbNodeRect.bounds.dilated( 10 ),
      mouseArea: thumbNodeRect.bounds,
      tandem: sliderTandem.createTandem( 'thumbNode' )
    } );

    // highlight thumb on pointer over
    const pressListener = new PressListener( {
      attach: false,
      tandem: Tandem.OPT_OUT // Highlighting doesn't need instrumentation
    } );
    pressListener.isHighlightedProperty.link( isHighlighted => {
      thumbNodeRect.fill = isHighlighted ? thumbPathOptions.fillHighlighted : thumbPathOptions.fill;
    } );
    thumbNode.addInputListener( pressListener );

    const sliderStep = timeToMeasurementProperty.range.getLength() / 8;

    // Function to constrain the value to intervals but don't allow it going under minMeasurementTime
    const mappingValue = ( value: number ) => {
      const roundedValue = roundToInterval( value, sliderStep );
      return Math.max( minMeasurementTime, roundedValue );
    };

    // Create the slider that will control the time at which the system is measured.
    const minMeasurementTime = timeToMeasurementProperty.rangeProperty.value.getLength() / ( NUMBER_OF_MINOR_TICKS + 1 );
    const maxMeasurementTime = timeToMeasurementProperty.rangeProperty.value.max;
    const timeToMeasurementSlider = new Slider( timeToMeasurementProperty, timeToMeasurementProperty.range, {
      tandem: sliderTandem,
      thumbNode: thumbNode,
      thumbYOffset: thumbOffset - 8,
      trackSize: SLIDER_TRACK_SIZE,
      trackFillEnabled: Color.BLACK,
      orientation: Orientation.HORIZONTAL,
      majorTickLength: 10,
      minorTickLength: 5,

      constrainValue: mappingValue,
      pdomMapValue: mappingValue,
      keyboardStep: sliderStep,
      shiftKeyboardStep: sliderStep,
      pageKeyboardStep: sliderStep * 2,
      valueChangeSoundGeneratorOptions: {
        numberOfMiddleThresholds: timeToMeasurementProperty.range.getLength() / sliderStep - 1
      }
    } );

    // Add the major and minor tick marks to the slider.
    timeToMeasurementSlider.addMajorTick( 0, new Text( '0', { font: QuantumMeasurementConstants.CONTROL_FONT } ) );
    timeToMeasurementSlider.addMajorTick( maxMeasurementTime, new Text( '1', { font: QuantumMeasurementConstants.CONTROL_FONT } ) );
    _.times( NUMBER_OF_MINOR_TICKS, i => {
      const fraction = ( i + 1 ) / ( NUMBER_OF_MINOR_TICKS + 1 );
      timeToMeasurementSlider.addMinorTick( fraction * maxMeasurementTime );
    } );

    const timeIndicatorScale = 15;
    const timeIndicator = new ArrowNode( 0, timeIndicatorScale, 0, 0, {
      fill: 'magenta',
      stroke: null,
      headHeight: timeIndicatorScale,
      headWidth: timeIndicatorScale,
      tailWidth: 0
    } );

    measurementTimeProperty.link( measurementTime => {
      timeIndicator.centerX = measurementTime / timeToMeasurementProperty.rangeProperty.value.max * SLIDER_TRACK_SIZE.width;
    } );

    const options = optionize<MeasurementTimerControlOptions, SelfOptions, PanelOptions>()( {
      children: [
        timeIndicator,
        timeToMeasurementSlider
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'MeasurementTimerControl', MeasurementTimerControl );