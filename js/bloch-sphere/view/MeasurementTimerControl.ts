// Copyright 2025, University of Colorado Boulder

/**
 * MeasurementTimerControl is the node that contains the UI elements for controlling the time at which the
 * Bloch Sphere is measured.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Node, Path, Text } from '../../../../scenery/js/imports.js';
import { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
export type MeasurementTimerControlOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

const SLIDER_TRACK_SIZE = new Dimension2( 150, 0.1 );

export default class MeasurementTimerControl extends Node {

  public constructor(
    timeToMeasurementProperty: NumberProperty,
    measurementTimeProperty: NumberProperty,
    providedOptions: MeasurementTimerControlOptions
  ) {

    const thumbOffset = 30;
    const thumbDimensions = new Dimension2( 30, 30 );
    const timeToMeasurementSlider = new Slider( timeToMeasurementProperty, timeToMeasurementProperty.range, {
      tandem: providedOptions.tandem.createTandem( 'timeToMeasurementSlider' ),
      thumbSize: thumbDimensions,
      thumbYOffset: thumbOffset,
      thumbFill: 'white',
      thumbFillHighlighted: '#ddd',
      thumbCenterLineStroke: null,
      trackSize: SLIDER_TRACK_SIZE,
      trackFillEnabled: Color.BLACK,
      constrainValue: value => Utils.roundToInterval( value, 0.2 ),
      orientation: Orientation.HORIZONTAL,
      majorTickLength: 10,
      minorTickLength: 5
    } );
    timeToMeasurementSlider.addMajorTick( 0, new Text( '0', { font: new PhetFont( 15 ) } ) );
    timeToMeasurementSlider.addMajorTick( 1, new Text( 't', { font: new PhetFont( 15 ) } ) );
    timeToMeasurementSlider.addMinorTick( 0.2 );
    timeToMeasurementSlider.addMinorTick( 0.4 );
    timeToMeasurementSlider.addMinorTick( 0.6 );
    timeToMeasurementSlider.addMinorTick( 0.8 );

    const timeIndicatorScale = 15;
    const timeIndicator = new ArrowNode( 0, timeIndicatorScale, 0, 0, {
      fill: 'magenta',
      stroke: null,
      headHeight: timeIndicatorScale,
      headWidth: timeIndicatorScale,
      tailWidth: 0
    } );

    measurementTimeProperty.link( measurementTime => {
      timeIndicator.centerX = measurementTime / 2 * SLIDER_TRACK_SIZE.width;
    } );

    const thumbLine = new Path( new Shape().circle( 0, 0, 2 ).moveTo( 0, 0 ).lineTo( 0, thumbOffset - thumbDimensions.height / 2 ), {
      fill: '#bbb',
      stroke: 'black',
      lineWidth: 2
    } );

    const measurementSymbol = new Node( {
      scale: 0.8,
      children: [
        new Path( Shape.arc( 0, 0, 20, 0, Math.PI, true ), {
          stroke: 'black',
          lineWidth: 5,
          lineCap: 'round',
          lineJoin: 'round',
          center: new Vector2( 0, 5 ),
          scale: 0.6
        } ),
        new ArrowNode( 0, 0, 30, -35, {
          fill: 'black',
          stroke: 'black',
          lineWidth: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
          center: new Vector2( 5, 4 ),
          scale: 0.6
        } )
      ]
    } );

    timeToMeasurementProperty.link( time => {
      thumbLine.centerX = time * SLIDER_TRACK_SIZE.width;
      thumbLine.top = -2;

      measurementSymbol.centerX = time * SLIDER_TRACK_SIZE.width;
      measurementSymbol.centerY = thumbOffset / 2 + thumbDimensions.height / 2;
    } );

    const options = optionize<MeasurementTimerControlOptions, SelfOptions, PanelOptions>()( {
      children: [
        timeIndicator,
        timeToMeasurementSlider,
        thumbLine,
        measurementSymbol
      ]
    }, providedOptions );

    super( options );

  }
}

quantumMeasurement.register( 'MeasurementTimerControl', MeasurementTimerControl );