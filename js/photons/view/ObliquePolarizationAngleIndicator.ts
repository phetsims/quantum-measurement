// Copyright 2024, University of Colorado Boulder

/**
 * Visual representation of the polarization angle in an oblique drawing, which gives some perspective.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
export type PolarizationPlaneRepresentationOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// Constants
const AXES_COLOR = 'black';
const AXES_LINE_WIDTH = 0.5;
const LABELS_OFFSET = 10;
const LABELS_FONT = new PhetFont( { size: 14, weight: 'bold' } );

const AXIS_LENGTH = 50; // Length of the axes in screen coordinates
const UNIT_LENGTH = AXIS_LENGTH * 0.75;
const AXES_OPTIONS: ArrowNodeOptions = {
  stroke: AXES_COLOR,
  fill: AXES_COLOR,
  tailWidth: AXES_LINE_WIDTH,
  headWidth: 2,
  headHeight: 2
};

export default class ObliquePolarizationAngleIndicator extends Node {

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number>,
                      providedOptions?: PolarizationPlaneRepresentationOptions ) {

    const experimentalTransform = ModelViewTransform2.createOffsetXYScaleMapping( Vector2.ZERO, 0.5, 1 );

    const transformMatrix = new Matrix3();

    // transformMatrix.set20( 0.5 * Math.cos( Math.PI / 4 ) );
    // transformMatrix.set21( 0.5 * Math.sin( Math.PI / 4 ) );
    // transformMatrix.set22( 0 );
    transformMatrix.setToScale( 0.5, 1 );

    const projectedXYCircleRadius = AXIS_LENGTH * 0.75;
    const unprojectedXYCircleShape = Shape.circle( 0, 0, projectedXYCircleRadius );
    const projectedXYCircleShape = unprojectedXYCircleShape.transformed( experimentalTransform.getMatrix() );

    const projectedXYCircle = new Path( projectedXYCircleShape, {
      fill: 'black',
      opacity: 0.3
    } );

    const xAxis = new ArrowNode( 0, 0, 0, 0, AXES_OPTIONS );

    // Create the Y axis line with an arrow head.  This is pointing directly to the right.
    const yAxisArrowHead = new ArrowNode( 0.9 * AXIS_LENGTH, 0, AXIS_LENGTH, 0, AXES_OPTIONS );
    const yAxisLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( AXIS_LENGTH, 0 ),
      {
        stroke: AXES_COLOR,
        lineWidth: AXES_LINE_WIDTH * 3,
        lineDash: [ 2, 2 ]
      }
    );

    // Add the label for the Y axis.
    const yAxisLabel = new Text( QuantumMeasurementStrings.propagationStringProperty, {
      fill: 'black',
      font: new PhetFont( 8 ),
      maxWidth: 50,

      // position empirically determined to match design doc
      left: 20,
      top: 10
    } );

    const zAxis = new ArrowNode( 0, 0, 0, -AXIS_LENGTH, AXES_OPTIONS );

    const xAxisLabel = new Text( QuantumMeasurementStrings.HStringProperty, {
      fill: QuantumMeasurementColors.horizontalPolarizationColorProperty,
      font: LABELS_FONT
    } );

    const xAxisTipPosition = new Vector2( -AXIS_LENGTH * Math.cos( Math.PI / 4 ), AXIS_LENGTH * Math.sin( Math.PI / 4 ) );
    xAxis.setTip( xAxisTipPosition.x, xAxisTipPosition.y );

    // Position the label.
    xAxisLabel.center = xAxisTipPosition.times( 1.2 );

    const zAxisLabel = new Text( QuantumMeasurementStrings.VStringProperty, {
      centerY: -AXIS_LENGTH - LABELS_OFFSET,
      centerX: 0,
      fill: QuantumMeasurementColors.verticalPolarizationColorProperty,
      font: LABELS_FONT
    } );

    const polarizationVectorOptions = {
      headWidth: 6,
      headHeight: 6,
      tailWidth: 0.5,
      stroke: '#0f0',
      fill: '#0f0'
    };
    const polarizationVectorPlus = new ArrowNode( 0, 0, 0, -AXIS_LENGTH, polarizationVectorOptions );
    const polarizationVectorMinus = new ArrowNode( 0, 0, 0, AXIS_LENGTH, polarizationVectorOptions );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {

      // Increasing bounds horizontally so the labels have space to move
      localBounds: new Bounds2( -1.5 * AXIS_LENGTH, -AXIS_LENGTH, 1.5 * AXIS_LENGTH, AXIS_LENGTH ),

      children: [
        projectedXYCircle,
        xAxis,
        zAxis,
        xAxisLabel,
        zAxisLabel,
        polarizationVectorPlus,
        polarizationVectorMinus,
        yAxisArrowHead,
        yAxisLine,
        yAxisLabel
      ]
    }, providedOptions );

    super( options );

    // Update the double-headed arrow that represents the polarization angle as the angle setting changes.
    polarizationAngleProperty.link( polarizationAngle => {

      const adjustedAngle = 2 / 3 * polarizationAngle + 30;
      const angleInRadians = Utils.toRadians( adjustedAngle );
      const unitVector = new Vector2( UNIT_LENGTH, 0 );

      const tipPlus = experimentalTransform.modelToViewPosition( unitVector.rotated( -angleInRadians ) );
      const tipMinus = experimentalTransform.modelToViewPosition( unitVector.rotated( -angleInRadians - Math.PI ) );

      polarizationVectorPlus.setTip( tipPlus.x, tipPlus.y );
      polarizationVectorMinus.setTip( tipMinus.x, tipMinus.y );
    } );
  }
}

quantumMeasurement.register( 'ObliquePolarizationAngleIndicator', ObliquePolarizationAngleIndicator );