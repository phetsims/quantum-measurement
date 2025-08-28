// Copyright 2024-2025, University of Colorado Boulder

/**
 * FlatPolarizationAngleIndicator provides a visual representation of the photon polarization angle in a flat drawing.
 * The angle of propagation is into the page in this representation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import VectorTailNode from './VectorTailNode.js';

type SelfOptions = EmptySelfOptions;
export type PolarizationPlaneRepresentationOptions = SelfOptions & NodeOptions;

// constants
const AXIS_COLOR = Color.BLACK;
const AXIS_LINE_WIDTH = 0.5;
const AXIS_LENGTH = 50; // Length of the axes in screen coordinates
const AXIS_OPTIONS: ArrowNodeOptions = {
  stroke: AXIS_COLOR,
  fill: AXIS_COLOR,
  tailWidth: AXIS_LINE_WIDTH,
  headWidth: 4,
  headHeight: 4,
  doubleHead: true
};
const LABELS_OFFSET = 2;

// Define the unit length to use for the unit circle and the polarization vectors.
const UNIT_LENGTH = AXIS_LENGTH * 0.75;

export default class FlatPolarizationAngleIndicator extends Node {

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number | null>,
                      providedOptions?: PolarizationPlaneRepresentationOptions ) {

    // Create the vertical axis.
    const verticalAxis = new ArrowNode( 0, AXIS_LENGTH, 0, -AXIS_LENGTH, AXIS_OPTIONS );

    // Create and position the vertical axis label.
    const verticalAxisLabel = new Text( QuantumMeasurementStrings.VStringProperty, {
      centerX: 0,
      bottom: verticalAxis.top - LABELS_OFFSET,
      fill: QuantumMeasurementColors.verticalPolarizationColorProperty,
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      maxWidth: 20
    } );
    QuantumMeasurementStrings.VStringProperty.link( () => {
      verticalAxisLabel.centerX = 0;
    } );

    // Create the horizontal axis.
    const horizontalAxis = new ArrowNode( -AXIS_LENGTH, 0, AXIS_LENGTH, 0, AXIS_OPTIONS );

    // Create and position the x-axis label.
    const horizontalAxisLabel = new Text( QuantumMeasurementStrings.HStringProperty, {
      fill: QuantumMeasurementColors.horizontalPolarizationColorProperty,
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      left: horizontalAxis.right + LABELS_OFFSET,
      centerY: horizontalAxis.centerY,
      maxWidth: 20
    } );

    // Create a Property for the fill used for the unit circle, since it changes when the photons are unpolarized.
    const unitCircleFillProperty = new DerivedProperty(
      [
        polarizationAngleProperty,
        QuantumMeasurementColors.polarizationArrowFillProperty,
        QuantumMeasurementColors.angleIndicatorUnitCircleFillProperty
      ],
      ( polarizationAngle, polarizationArrowColor, angleIndicatorUnitCircleColor ) => polarizationAngle === null ?
                                                                               polarizationArrowColor :
                                                                               angleIndicatorUnitCircleColor
    );

    // Create a unit circle.
    const unitCircle = new Circle( UNIT_LENGTH, {
      fill: unitCircleFillProperty,
      opacity: 0.3
    } );

    // Create the vector tail symbol.
    const vectorTailSymbol = new VectorTailNode( UNIT_LENGTH * 0.175 );

    const polarizationVectorNode = new ArrowNode( -AXIS_LENGTH, 0, AXIS_LENGTH, 0, {
      doubleHead: true,
      headWidth: 8,
      headHeight: 8,
      tailWidth: 2,
      stroke: QuantumMeasurementColors.polarizationArrowStrokeProperty,
      lineWidth: 0.5,
      fill: QuantumMeasurementColors.polarizationArrowFillProperty
    } );

    // Create and position the angle readout label.
    const thetaNode = new Text( MathSymbols.THETA, {
      font: new MathSymbolFont( 14 )
    } );
    const angleReadoutText = new Text( new DerivedStringProperty(
        [ polarizationAngleProperty ],
        angle => angle === null ? '' : ` = ${angle}°`
      ),
      { font: QuantumMeasurementConstants.CONTROL_FONT }
    );
    const angleReadoutLabel = new HBox( {
      children: [ thetaNode, angleReadoutText ],
      centerX: horizontalAxis.centerX + 40,
      centerY: verticalAxis.top,
      visibleProperty: DerivedProperty.valueNotEqualsConstant( polarizationAngleProperty, null )
    } );

    // Create the angle indicator, which is the curved line between the horizontal axis and the polarization vector.
    const angleArc = new Path( null, {
      stroke: 'black',
      lineWidth: 1
    } );
    const arrowHeadShape = new Shape();
    const arrowHeadWidth = 5;
    const arrowHeadLength = 8;
    arrowHeadShape.moveTo( 0, 0 )
      .lineTo( -arrowHeadWidth / 2, arrowHeadLength )
      .lineTo( arrowHeadWidth / 2, arrowHeadLength )
      .close();
    const angleArcArrowHead = new Path( arrowHeadShape, {
      lineWidth: 1,
      fill: 'black'
    } );

    // Create the angle indicator symbol (theta) that will appear near the angle indicator when there's sufficient space.
    const angleIndicatorSymbol = new Text( MathSymbols.THETA, {
      font: new MathSymbolFont( 12 )
    } );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {
      children: [
        unitCircle,
        horizontalAxis,
        verticalAxis,
        angleArc,
        angleArcArrowHead,
        horizontalAxisLabel,
        verticalAxisLabel,
        polarizationVectorNode,
        vectorTailSymbol,
        angleReadoutLabel,
        angleIndicatorSymbol
      ]
    }, providedOptions );

    super( options );

    // Update the positions of the polarization vectors as the polarization angle changes.
    polarizationAngleProperty.link( polarizationAngle => {
      if ( polarizationAngle === null ) {
        angleArc.shape = null;
        angleArcArrowHead.visible = false;
        polarizationVectorNode.visible = false;
        angleIndicatorSymbol.visible = false;
      }
      else {
        polarizationVectorNode.visible = true;

        // Update the angle arc and arrow head.
        angleArc.shape = new Shape().ellipticalArc(
          0,
          0,
          UNIT_LENGTH / 2,
          UNIT_LENGTH / 2,
          0,
          0,
          toRadians( -polarizationAngle ),
          true
        );
        if ( polarizationAngle > 30 ) {
          angleArcArrowHead.visible = true;
          angleArcArrowHead.x = angleArc.shape.bounds.minX;
          angleArcArrowHead.y = angleArc.shape.bounds.minY;
          angleArcArrowHead.rotation = -toRadians( polarizationAngle - 12 );
        }
        else {
          angleArcArrowHead.visible = false;
        }

        angleIndicatorSymbol.center = new Vector2( 1.5 * UNIT_LENGTH / 2, 0 ).rotated( -toRadians( polarizationAngle / 2 ) );
        angleIndicatorSymbol.visible = polarizationAngle > 30;

        // Calculate the positions for the two ends of the polarization vector.
        const polarizationVectorTipPosition = new Vector2(
          Math.cos( -toRadians( polarizationAngle ) ),
          Math.sin( -toRadians( polarizationAngle ) )
        ).times( UNIT_LENGTH );
        const polarizationVectorTailPosition = polarizationVectorTipPosition.times( -1 );

        // Project the vectors and set the tips of the arrows accordingly.
        polarizationVectorNode.setTip( polarizationVectorTipPosition.x, polarizationVectorTipPosition.y );
        polarizationVectorNode.setTail( polarizationVectorTailPosition.x, polarizationVectorTailPosition.y );
      }
    } );
  }
}

quantumMeasurement.register( 'FlatPolarizationAngleIndicator', FlatPolarizationAngleIndicator );