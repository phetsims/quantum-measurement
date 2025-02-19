// Copyright 2024-2025, University of Colorado Boulder

/**
 * ObliquePolarizationAngleIndicator provides a visual representation of the photon polarization angle in an oblique
 * drawing, which gives some perspective but keeps the angle of propagation horizontal.
 *
 * The position of the axes are like this in this view:
 *
 *                            z (V)
 *                            ^
 *                            |
 *                            |
 *                            +----> y (Propagation)
 *                           /
 *                         /
 *                       /
 *                     x (H)
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
export type PolarizationPlaneRepresentationOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// constants
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

// Define the unit length to use for the unit circle and the polarization vectors.
const UNIT_LENGTH = AXIS_LENGTH * 0.75;

// Define the angle of projection for the oblique drawing.
const PROJECTION_ANGLE_IN_DEGREES = 45;
const PROJECTION_ANGLE_IN_RADIANS = Utils.toRadians( PROJECTION_ANGLE_IN_DEGREES );

// Define a function that projects a 3D point into the 2D plane of the screen. This uses what is called a "cabinet
// projection" in engineering drawing, which is a specific type of oblique projection.
const project3Dto2D = ( x: number, y: number, z: number ): Vector2 => {
  return new Vector2(
    y - 0.5 * x * Math.cos( PROJECTION_ANGLE_IN_RADIANS ),
    -z + 0.5 * x * Math.sin( PROJECTION_ANGLE_IN_RADIANS )
  );
};

export default class ObliquePolarizationAngleIndicator extends Node {

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number | null>,
                      providedOptions?: PolarizationPlaneRepresentationOptions ) {

    // Create the Y axis line with an arrow head. This is pointing directly to the right.  We have to do this as a
    // separate arrow head and line because the line has a dashed pattern, which doesn't work with ArrowNode.
    const yAxisArrowHead = new ArrowNode( 0.9 * AXIS_LENGTH, 0, AXIS_LENGTH, 0, AXIS_OPTIONS );
    const yAxisLine = new Line( 0, 0, AXIS_LENGTH, 0, {
      stroke: AXIS_COLOR,
      lineWidth: AXIS_LINE_WIDTH * 3,
      lineDash: [ 2, 2 ]
    } );

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
      font: LABELS_FONT,
      maxWidth: 30
    } );
    QuantumMeasurementStrings.VStringProperty.link( () => {
      zAxisLabel.centerX = 0;
    } );

    // Create the X axis.  This is the projected dimension that is perpendicular to the screen.
    const xAxisTipPosition = project3Dto2D( AXIS_LENGTH, 0, 0 );
    const xAxis = new ArrowNode( 0, 0, xAxisTipPosition.x, xAxisTipPosition.y, AXIS_OPTIONS );

    // Create and position the x-axis label.
    const xAxisLabel = new Text( QuantumMeasurementStrings.HStringProperty, {
      fill: QuantumMeasurementColors.horizontalPolarizationColorProperty,
      font: LABELS_FONT,
      center: xAxisTipPosition.times( 1.4 ),
      maxWidth: 30
    } );
    QuantumMeasurementStrings.HStringProperty.link( () => {
      xAxisLabel.center = xAxisTipPosition.times( 1.4 );
    } );

    // Create a Property for the fill used for the unit circle, since it changes when the photons are unpolarized.
    //REVIEW: Technically `QuantumMeasurementColors.photonBaseColorProperty` should be part of what the DerivedProperty
    // is listening to. I think the only scenario where this would be buggy is in the Color Editor, but could also cause
    // a bug in PhET-iO if we gave clients the option to adjust colorProperties.
    const unitCircleFillProperty = new DerivedProperty(
      [ polarizationAngleProperty ],
      polarizationAngle => polarizationAngle === null ?
                           QuantumMeasurementColors.photonBaseColorProperty.value :
                           Color.LIGHT_GRAY
    );

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
      fill: unitCircleFillProperty,
      opacity: 0.3
    } );

    // Create the polarization vectors, which are arrows.
    const polarizationVectorOptions: ArrowNodeOptions = {
      headWidth: 6,
      headHeight: 6,
      tailWidth: 2,
      stroke: QuantumMeasurementColors.photonBaseColorProperty.value.colorUtilsDarker( 0.5 ),
      lineWidth: 0.5,
      fill: QuantumMeasurementColors.photonBaseColorProperty,
      doubleHead: true
    };
    const polarizationVectorNode = new ArrowNode( 0, AXIS_LENGTH, 0, -AXIS_LENGTH, polarizationVectorOptions );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {

      // Increasing bounds horizontally so the labels have space to move
      localBounds: new Bounds2( -1.5 * AXIS_LENGTH, -AXIS_LENGTH, 1.5 * AXIS_LENGTH, AXIS_LENGTH ),

      children: [
        projectedXZUnitCircle,
        xAxis,
        zAxis,
        xAxisLabel,
        zAxisLabel,
        polarizationVectorNode,
        yAxisArrowHead,
        yAxisLine,
        yAxisLabel
      ]
    }, providedOptions );

    super( options );

    // Update the positions of the polarization vectors as the polarization angle changes.
    polarizationAngleProperty.link( polarizationAngle => {

      // Only show the polarization vector if the angle is not null.
      polarizationVectorNode.visible = polarizationAngle !== null;

      if ( polarizationAngle !== null ) {

        // Calculate the position of the polarization unit vector in the x-z plane.
        const polarizationVectorPlusInXZPlane = new Vector2(
          Math.cos( Utils.toRadians( polarizationAngle ) ),
          Math.sin( Utils.toRadians( polarizationAngle ) )
        ).times( UNIT_LENGTH );
        const polarizationVectorMinusInXZPlane = polarizationVectorPlusInXZPlane.times( -1 );

        // Project the vectors and set the tips of the arrows accordingly.
        const tip = project3Dto2D( polarizationVectorPlusInXZPlane.x, 0, polarizationVectorPlusInXZPlane.y );
        polarizationVectorNode.setTip( tip.x, tip.y );
        const tail = project3Dto2D( polarizationVectorMinusInXZPlane.x, 0, polarizationVectorMinusInXZPlane.y );
        polarizationVectorNode.setTail( tail.x, tail.y );
      }
    } );
  }
}

quantumMeasurement.register( 'ObliquePolarizationAngleIndicator', ObliquePolarizationAngleIndicator );