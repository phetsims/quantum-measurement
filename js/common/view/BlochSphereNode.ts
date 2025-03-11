// Copyright 2024-2025, University of Colorado Boulder

/**
 * Visual representation of the Bloch Sphere, meaning an orb with X, Y, and Z axes and a state vector.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import AbstractBlochSphere from '../model/AbstractBlochSphere.js';
import QuantumMeasurementColors from '../QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../QuantumMeasurementConstants.js';
import DashedArrowNode, { DashedArrowNodeOptions } from './DashedArrowNode.js';

type SelfOptions = {
  drawKets?: boolean;
  drawTitle?: boolean;
  drawAngleIndicators?: boolean;
  drawAxesLabels?: boolean;
  axesLabelsScale?: number;
  stateVectorScale?: number; // Scale for the vector's widths (head, body, etc)
  expandBounds?: boolean;
};
export type BlochSphereNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// Constants
const AXES_STROKE_COLOR_PROPERTY = QuantumMeasurementColors.blochSphereAngleIndicatorDashedLineColorProperty;
const AXES_LINE_WIDTH = 0.4;
const AXES_LINE_DASH = [ 2, 2 ];
const LABELS_OFFSET = 5;

const AXES_OPTIONS = {
  stroke: AXES_STROKE_COLOR_PROPERTY,
  lineWidth: AXES_LINE_WIDTH,
  lineDash: AXES_LINE_DASH
};

export default class BlochSphereNode extends Node {

  public readonly xAxisOffsetAngleProperty: NumberProperty;

  public readonly sphereRadius: number;
  public pointOnTheEquator = ( azimuth: number, xAxisOffsetAngle?: number ): Vector2 => Vector2.ZERO;

  public readonly stateVectorVisibleProperty: BooleanProperty;

  public constructor( blochSphere: AbstractBlochSphere,
                      providedOptions?: BlochSphereNodeOptions ) {

    const options = optionize<BlochSphereNodeOptions, SelfOptions, NodeOptions>()( {
      drawKets: true,
      drawTitle: true,
      drawAngleIndicators: false,
      drawAxesLabels: true,
      expandBounds: true,
      excludeInvisibleChildrenFromBounds: true,
      stateVectorScale: 1,
      axesLabelsScale: 1
    }, providedOptions );

    const sphereRadius = 100;

    const sphereNode = new ShadedSphereNode( 2 * sphereRadius, {
      mainColor: QuantumMeasurementColors.blockSphereMainColorProperty,
      highlightColor: QuantumMeasurementColors.blockSphereHighlightColorProperty,
      highlightDiameterRatio: 0.9
    } );

    const equatorSemiMajorAxis = sphereRadius;
    const equatorInclinationAngle = toRadians( 10 );
    const equatorSemiMinorAxis = Math.sin( equatorInclinationAngle ) * equatorSemiMajorAxis;
    const equatorLine = new Path(
      new Shape().ellipse( 0, 0, equatorSemiMajorAxis, equatorSemiMinorAxis, 0 ),
      AXES_OPTIONS
    );

    const xAxisOffsetAngleProperty = new NumberProperty( toRadians( 20 ) );

    const pointOnTheEquator = ( azimuth: number, xAxisOffsetAngle = 0 ) => {
      return new Vector2(
        equatorSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngle ),
        equatorSemiMajorAxis * Math.cos( azimuth + xAxisOffsetAngle ) * Math.sin( equatorInclinationAngle )
      );
    };

    const pointOnTheSphere = ( azimuth: number, polar: number, xAxisOffsetAngle = 0 ) => {
      return new Vector2(
        equatorSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngle ) * Math.sin( polar ),
        equatorSemiMajorAxis *
        ( -Math.cos( polar ) + Math.cos( azimuth + xAxisOffsetAngle ) * Math.sin( equatorInclinationAngle ) * Math.sin( polar ) )
      );
    };

    const xAxis = new Path( null, AXES_OPTIONS );
    const yAxis = new Path( null, AXES_OPTIONS );
    const zAxis = new Path( null, AXES_OPTIONS );

    const xAxisLabel = new Text( '+X', {
      fill: 'black',
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      scale: options.axesLabelsScale,
      visible: options.drawAxesLabels
    } );
    const yAxisLabel = new Text( '+Y', {
      fill: 'black',
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      scale: options.axesLabelsScale,
      visible: options.drawAxesLabels
    } );
    const zAxisLabel = new Text( '+Z', {
      centerX: -3 * LABELS_OFFSET * options.axesLabelsScale,
      centerY: -sphereRadius + LABELS_OFFSET,
      fill: 'black',
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      scale: options.axesLabelsScale,
      visible: options.drawAxesLabels
    } );

    const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
    const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
    const KET = QuantumMeasurementConstants.KET;
    const upStateLabel = new RichText( `|${UP}<sub>Z</sub> ${KET}`, {
      centerX: 0,
      centerY: -sphereRadius - 3 * LABELS_OFFSET,
      fill: 'black',
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      visible: options.drawKets
    } );

    const downStateLabel = new RichText( `|${DOWN}<sub>Z</sub> ${KET}`, {
      centerX: 0,
      centerY: sphereRadius + 3 * LABELS_OFFSET,
      fill: 'black',
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      visible: options.drawKets
    } );

    const title = new Text( QuantumMeasurementStrings.blochSphereStringProperty, {
      font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
      maxWidth: 200,
      visible: options.drawTitle,
      bottom: upStateLabel.top - 10,
      centerX: upStateLabel.centerX
    } );
    title.boundsProperty.link( () => {
      title.centerX = upStateLabel.centerX;
    } );

    const stateVectorVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'stateVectorVisibleProperty' )
    } );
    const stateVector = new ArrowNode( 0, 0, 0, -sphereRadius, {
      tandem: options.tandem.createTandem( 'stateVector' ),
      headWidth: 10 * options.stateVectorScale,
      headHeight: 10 * options.stateVectorScale,
      tailWidth: 3 * options.stateVectorScale,
      fill: 'black',
      visibleProperty: stateVectorVisibleProperty
    } );

    const angleIndicatorPathOptions = {
      stroke: AXES_STROKE_COLOR_PROPERTY,
      lineWidth: 1,
      lineDash: [ 2, 2 ],
      visible: options.drawAngleIndicators
    };
    const polarAngleIndicator = new Path( null, angleIndicatorPathOptions );
    const azimuthalAngleIndicator = new Path( null, angleIndicatorPathOptions );
    const xyProjectionVector = new DashedArrowNode( 0, 0, 0, -sphereRadius, combineOptions<DashedArrowNodeOptions>( {
      headWidth: 4,
      headHeight: 4,
      tailWidth: 1,
      fill: AXES_STROKE_COLOR_PROPERTY
    }, angleIndicatorPathOptions ) );
    const zProjectionLine = new Path( null, angleIndicatorPathOptions );

    options.children = [
      title,
      upStateLabel,
      downStateLabel,
      sphereNode,
      equatorLine,
      xAxis,
      yAxis,
      zAxis,
      xAxisLabel,
      yAxisLabel,
      zAxisLabel,
      polarAngleIndicator,
      azimuthalAngleIndicator,
      xyProjectionVector,
      zProjectionLine,
      stateVector
    ];

    super( options );

    this.pointOnTheEquator = pointOnTheEquator;

    const plusX = this.pointOnTheEquator( 0, xAxisOffsetAngleProperty.value );
    const minusX = this.pointOnTheEquator( Math.PI, xAxisOffsetAngleProperty.value );
    xAxis.shape = new Shape().moveTo( plusX.x, plusX.y ).lineTo( minusX.x, minusX.y );

    const plusY = this.pointOnTheEquator( Math.PI / 2, xAxisOffsetAngleProperty.value );
    const minusY = this.pointOnTheEquator( -Math.PI / 2, xAxisOffsetAngleProperty.value );
    yAxis.shape = new Shape().moveTo( plusY.x, plusY.y ).lineTo( minusY.x, minusY.y );
    zAxis.shape = new Shape().moveTo( 0, -sphereRadius ).lineTo( 0, sphereRadius );

    xAxisLabel.centerX = plusX.x + 3 * LABELS_OFFSET;
    xAxisLabel.centerY = plusX.y + 2 * LABELS_OFFSET;
    yAxisLabel.centerX = plusY.x;
    yAxisLabel.centerY = plusY.y - LABELS_OFFSET;

    if ( options.expandBounds ) {
      this.setLocalBounds( new Bounds2( -1.5 * sphereRadius, this.bounds.minY, 1.5 * sphereRadius, this.bounds.maxY ) );
    }

    this.sphereRadius = sphereRadius;
    this.xAxisOffsetAngleProperty = xAxisOffsetAngleProperty;
    this.stateVectorVisibleProperty = stateVectorVisibleProperty;

    Multilink.multilink(
      [
        blochSphere.azimuthalAngleProperty,
        blochSphere.polarAngleProperty,
        xAxisOffsetAngleProperty
      ], ( azimuthalAngle, polarAngle, xAxisOffsetAngle ) => {

        const tip = pointOnTheSphere( azimuthalAngle, polarAngle, xAxisOffsetAngleProperty.value );
        stateVector.setTip( tip.x, tip.y );

        // To give the state vector a bit of a 3D effect, we will make it more transparent when it is further away from
        // the camera. This is done by calculating the distance from the back of the sphere to the tip of the state
        // vector. The further away, the more transparent it will be.
        const tipPositionCartesian = new Vector3(
          Math.sin( polarAngle ) * Math.cos( azimuthalAngle ),
          Math.sin( polarAngle ) * Math.sin( azimuthalAngle ),
          Math.cos( polarAngle )
        );
        const distanceFromMiddleBack = tipPositionCartesian.distanceXYZ( -1, 0, 0 );
        const stateVectorTipOpacity = toFixedNumber( Math.pow( distanceFromMiddleBack / 2, 2 ), 3 );
        const stateVectorGradient = new LinearGradient(
          stateVector.tailX,
          stateVector.tailY,
          stateVector.tipX,
          stateVector.tipY
        ).addColorStop( 0, 'rgba(0,0,0,0.4)' ).addColorStop( 1, `rgba(0,0,0,${stateVectorTipOpacity})` );
        stateVector.fill = stateVectorGradient;
        stateVector.stroke = stateVectorGradient;

        // If polar angle allows it, show the projection vector on the xy plane and the z projection line
        if ( Math.abs( Math.sin( polarAngle * 2 ) ) < 1e-5 ) {
          xyProjectionVector.visible = false;
          zProjectionLine.visible = false;
        }
        else {
          const xyProjectionTip = pointOnTheEquator( azimuthalAngle, xAxisOffsetAngle ).times( Math.sin( polarAngle ) );

          xyProjectionVector.visible = true;
          xyProjectionVector.setTip( xyProjectionTip.x, xyProjectionTip.y );

          zProjectionLine.visible = true;
          zProjectionLine.shape = new Shape().moveTo( tip.x, tip.y ).lineTo( tip.x, xyProjectionTip.y );
        }

        // Polar angle indicator will rotate with azimuth
        const rotationFactor = Math.sin( azimuthalAngle + xAxisOffsetAngle );

        polarAngleIndicator.shape = new Shape().ellipticalArc(
          // Center of the ellipse
          0,
          0,
          // Ellipse dimensions
          equatorSemiMajorAxis / 2 * rotationFactor, // Ellipse width goes to half the state vector
          equatorSemiMajorAxis / 2,
          0,
          // Begins at -PI/2; Ends at the polar angle with an adjustment due to the sphere perspective
          -Math.PI / 2,
          rotationFactor !== 0 ? Math.atan2( tip.y, tip.x / rotationFactor ) : -Math.PI / 2,
          false
        );

        if ( options.drawAngleIndicators && Math.abs( Math.sin( polarAngle ) ) > 1e-5 ) {
          azimuthalAngleIndicator.shape = new Shape().ellipticalArc(
            0,
            0,
            equatorSemiMajorAxis / 2,
            equatorSemiMinorAxis / 2,
            0,
            // Begins with offset; Ends at the azimuthal angle with an adjustment due to the sphere perspective
            -xAxisOffsetAngle + Math.PI / 2,
            -( azimuthalAngle + xAxisOffsetAngle - Math.PI / 2 ) % ( 2 * Math.PI ),
            true
          );
          azimuthalAngleIndicator.visible = true;
        }
        azimuthalAngleIndicator.visible = false;
      }
    );
  }
}

quantumMeasurement.register( 'BlochSphereNode', BlochSphereNode );