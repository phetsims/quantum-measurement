// Copyright 2024, University of Colorado Boulder

/**
 * FlatPolarizationAngleIndicator provides a visual representation of the photon polarization angle in a flat drawing.
 * The angle of propagation is into the page in this representation.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
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
const LABELS_FONT = new PhetFont( { size: 14, weight: 'bold' } );

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
      font: LABELS_FONT
    } );

    // Create the horizontal axis.
    const horizontalAxis = new ArrowNode( -AXIS_LENGTH, 0, AXIS_LENGTH, 0, AXIS_OPTIONS );

    // Create and position the x-axis label.
    const horizontalAxisLabel = new Text( QuantumMeasurementStrings.HStringProperty, {
      fill: QuantumMeasurementColors.horizontalPolarizationColorProperty,
      font: LABELS_FONT,
      left: horizontalAxis.right + LABELS_OFFSET,
      centerY: horizontalAxis.centerY
    } );

    // Create a Property for the fill used for the unit circle, since it changes when the photons are unpolarized.
    const unitCircleFillProperty = new DerivedProperty(
      [ polarizationAngleProperty ],
      polarizationAngle => polarizationAngle === null ?
                           QuantumMeasurementColors.photonBaseColorProperty.value :
                           Color.LIGHT_GRAY
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
      stroke: QuantumMeasurementColors.photonBaseColorProperty.value.colorUtilsDarker( 0.5 ),
      lineWidth: 0.5,
      fill: QuantumMeasurementColors.photonBaseColorProperty
    } );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {
      children: [
        unitCircle,
        horizontalAxis,
        verticalAxis,
        horizontalAxisLabel,
        verticalAxisLabel,
        polarizationVectorNode,
        vectorTailSymbol
      ]
    }, providedOptions );

    super( options );

    // Update the positions of the polarization vectors as the polarization angle changes.
    polarizationAngleProperty.link( polarizationAngle => {

      // Only show the polarization vector if the angle is not null.
      polarizationVectorNode.visible = polarizationAngle !== null;

      if ( polarizationAngle !== null ) {

        // Calculate the positions for the two ends of the polarization vector.
        const polarizationVectorTipPosition = new Vector2(
          Math.cos( -Utils.toRadians( polarizationAngle ) ),
          Math.sin( -Utils.toRadians( polarizationAngle ) )
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