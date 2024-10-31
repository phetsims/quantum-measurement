// Copyright 2024, University of Colorado Boulder

/**
 * Visual representation of the polarization angle in an oblique drawing, which gives some perspective.
 *
 * The position of the axes are like this in this view:
 *
 *                            z
 *                            ^
 *                            |
 *                            |
 *                            +----> y
 *                           /
 *                         /
 *                       /
 *                     x
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
export type PolarizationPlaneRepresentationOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// Constants
const AXIS_COLOR = Color.BLACK;
const AXIS_LINE_WIDTH = 0.5;
const AXIS_LENGTH = 50; // Length of the axes in screen coordinates
const AXIS_OPTIONS: ArrowNodeOptions = {
  stroke: AXIS_COLOR,
  fill: AXIS_COLOR,
  tailWidth: AXIS_LINE_WIDTH,
  headWidth: 2,
  headHeight: 2
};
const LABELS_OFFSET = 10;
const LABELS_FONT = new PhetFont( { size: 14, weight: 'bold' } );

// Define the unit length to use for the unit circle and the polarization vectors as a function of the graph size.
const UNIT_LENGTH = AXIS_LENGTH * 0.75;

// Define the angle of projection for the oblique drawing.
const PROJECTION_ANGLE_IN_DEGREES = 45;
const PROJECTION_ANGLE_IN_RADIANS = Utils.toRadians( PROJECTION_ANGLE_IN_DEGREES );

// Define a function that projects a 3D point into the 2D plane of the screen.  This uses what is called a "cabinet
// projection" in engineering drawing, which is a specific type of oblique projection.
const project3Dto2D = ( x: number, y: number, z: number ): Vector2 => {
  return new Vector2(
    y - 0.5 * x * Math.cos( PROJECTION_ANGLE_IN_RADIANS ),
    -z + 0.5 * x * Math.sin( PROJECTION_ANGLE_IN_RADIANS )
  );
};

export default class ObliquePolarizationAngleIndicator extends Node {

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number>,
                      providedOptions?: PolarizationPlaneRepresentationOptions ) {

    // Create the Y axis line with an arrow head.  This is pointing directly to the right.  We have to do this as a
    // separate arrow head and line because the line has a dashed pattern, which doesn't work with ArrowNode.
    const yAxisArrowHead = new ArrowNode( 0.9 * AXIS_LENGTH, 0, AXIS_LENGTH, 0, AXIS_OPTIONS );
    const yAxisLine = new Path(
      new Shape().moveTo( 0, 0 ).lineTo( AXIS_LENGTH, 0 ),
      {
        stroke: AXIS_COLOR,
        lineWidth: AXIS_LINE_WIDTH * 3,
        lineDash: [ 2, 2 ]
      }
    );

    // Add the label for the Y axis.
    const yAxisLabel = new Text( QuantumMeasurementStrings.propagationStringProperty, {
      fill: AXIS_COLOR,
      font: new PhetFont( 8 ),
      maxWidth: 50,

      // position empirically determined to match design doc
      left: 14,
      top: 4
    } );

    // Create the Z axis.  This is the up-and-down axis in the screen.
    const zAxis = new ArrowNode( 0, 0, 0, -AXIS_LENGTH, AXIS_OPTIONS );

    // Create and position the z-axis label.
    const zAxisLabel = new Text( QuantumMeasurementStrings.VStringProperty, {
      centerY: -AXIS_LENGTH - LABELS_OFFSET,
      centerX: 0,
      fill: QuantumMeasurementColors.verticalPolarizationColorProperty,
      font: LABELS_FONT
    } );

    // Create the X axis.  This is the projected dimension that is perpendicular to the screen.
    const xAxisTipPosition = project3Dto2D( AXIS_LENGTH, 0, 0 );
    const xAxis = new ArrowNode( 0, 0, xAxisTipPosition.x, xAxisTipPosition.y, AXIS_OPTIONS );

    // Create and position the x-axis label.
    const xAxisLabel = new Text( QuantumMeasurementStrings.HStringProperty, {
      fill: QuantumMeasurementColors.horizontalPolarizationColorProperty,
      font: LABELS_FONT,
      center: xAxisTipPosition.times( 1.4 )
    } );

    // Create a unit circle that is projected into the x-z plane.
    const numberOfPoints = 100;
    const projectedStartingPoint = project3Dto2D( UNIT_LENGTH, 0, 0 );
    const segmentedEllipseShape = new Shape().moveTo( projectedStartingPoint.x, projectedStartingPoint.y );
    _.times( numberOfPoints, i => {
      const angle = i * 2 * Math.PI / numberOfPoints;
      const x = UNIT_LENGTH * Math.cos( angle );
      const z = UNIT_LENGTH * Math.sin( angle );
      const projectedPoint = project3Dto2D( x, 0, z );
      segmentedEllipseShape.lineTo( projectedPoint.x, projectedPoint.y );
    } );
    segmentedEllipseShape.lineToPoint( projectedStartingPoint );
    segmentedEllipseShape.close();
    const projectedXZUnitCircle = new Path( segmentedEllipseShape, {
      fill: Color.GRAY,
      opacity: 0.3
    } );

    // Create the polarization vectors, which are arrows.
    const polarizationVectorOptions = {
      headWidth: 10,
      headHeight: 10,
      tailWidth: 2,
      stroke: '#0f0',
      fill: '#0f0'
    };
    const polarizationVectorPlus = new ArrowNode( 0, 0, 0, -AXIS_LENGTH, polarizationVectorOptions );
    const polarizationVectorMinus = new ArrowNode( 0, 0, 0, AXIS_LENGTH, polarizationVectorOptions );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {

      // Increasing bounds horizontally so the labels have space to move
      localBounds: new Bounds2( -1.5 * AXIS_LENGTH, -AXIS_LENGTH, 1.5 * AXIS_LENGTH, AXIS_LENGTH ),

      children: [
        projectedXZUnitCircle,
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

    // Update the positions of the polarization vectors as the polarization angle changes.
    polarizationAngleProperty.link( polarizationAngle => {

      // Calculate the position of the polarization unit vector in the x-z plane.
      const polarizationVectorPlusInXZPlane = new Vector2(
        Math.cos( -Utils.toRadians( polarizationAngle ) ),
        Math.sin( -Utils.toRadians( polarizationAngle ) )
      ).times( UNIT_LENGTH );
      const polarizationVectorMinusInXZPlane = polarizationVectorPlusInXZPlane.times( -1 );

      // Project the vectors and set the tips of the arrows.
      const tipPlus = project3Dto2D( polarizationVectorPlusInXZPlane.x, 0, polarizationVectorPlusInXZPlane.y );
      polarizationVectorPlus.setTip( tipPlus.x, tipPlus.y );
      const tipMinus = project3Dto2D( polarizationVectorMinusInXZPlane.x, 0, polarizationVectorMinusInXZPlane.y );
      polarizationVectorMinus.setTip( tipMinus.x, tipMinus.y );
    } );
  }
}

quantumMeasurement.register( 'ObliquePolarizationAngleIndicator', ObliquePolarizationAngleIndicator );