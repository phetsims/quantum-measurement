// Copyright 2024, University of Colorado Boulder
/**
 * Visual representation of the polarization plane, meaning a set of axes and an indicator of the polarization angle.
 *
 * // TODO: Show the angle indicators and clean code, see https://github.com/phetsims/quantum-measurement/issues/44
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
export type PolarizationPlaneRepresentationOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// Constants
const AXES_COLOR = 'black';
const AXES_LINE_WIDTH = 0.5;
const LABELS_OFFSET = 15;
const LABELS_FONT = new PhetFont( { size: 10, weight: 'bold' } );

const AXES_OPTIONS: ArrowNodeOptions = {
  stroke: AXES_COLOR,
  fill: AXES_COLOR,
  tailWidth: AXES_LINE_WIDTH,
  headWidth: 2,
  headHeight: 2
};

export default class PolarizationPlaneRepresentation extends Node {

  public readonly xAxisOffsetAngleProperty: NumberProperty;

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number>,
                      providedOptions?: PolarizationPlaneRepresentationOptions ) {

    let pointOnTheEquator: ( azimuth: number ) => Vector2;
    let pointOnTheSphere: ( azimuth: number, polar: number ) => Vector2;
    let pointOnTheXZPlane: ( polarizationAngle: number ) => Vector2;

    const sphereRadius = 50;

    const equatorSemiMajorAxis = sphereRadius;
    const equatorInclinationAngle = Utils.toRadians( 10 );


    const XZPlane = new Path( null, {
      fill: 'black',
      opacity: 0.3
    } );

    const xAxis = new ArrowNode( 0, 0, 0, 0, AXES_OPTIONS );
    const yAxis = new ArrowNode( 0, 0, 0, 0, AXES_OPTIONS );
    const yAxisLine = new Path( null, {
      stroke: AXES_COLOR,
      lineWidth: AXES_LINE_WIDTH * 3,
      lineDash: [ 2, 2 ]
    } );
    const zAxis = new ArrowNode( 0, 0, 0, -sphereRadius, AXES_OPTIONS );

    const yAxisLabel = new Text( 'Propagation', {
      fill: 'black',
      font: new PhetFont( 8 )
    } );
    const xAxisLabel = new Text( 'H', {
      fill: QuantumMeasurementColors.horizontalPolarizationColorProperty,
      font: LABELS_FONT
    } );
    const zAxisLabel = new Text( 'V', {
      centerY: -sphereRadius - LABELS_OFFSET,
      centerX: 0,
      fill: QuantumMeasurementColors.verticalPolarizationColorProperty,
      font: LABELS_FONT
    } );

    const xAxisOffsetAngleProperty = new NumberProperty( Utils.toRadians( 320 ) );

    const polarizationVectorOptions = {
      headWidth: 6,
      headHeight: 6,
      tailWidth: 0.5,
      stroke: '#0f0',
      fill: '#0f0'
    };
    const polarizationVectorPlus = new ArrowNode( 0, 0, 0, -sphereRadius, polarizationVectorOptions );
    const polarizationVectorMinus = new ArrowNode( 0, 0, 0, sphereRadius, polarizationVectorOptions );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {
      // Increasing bounds horizontally so the labels have space to move
      localBounds: new Bounds2( -1.5 * sphereRadius, -sphereRadius, 1.5 * sphereRadius, sphereRadius )
    }, providedOptions );

    super( options );

    this.xAxisOffsetAngleProperty = xAxisOffsetAngleProperty;


    Multilink.multilink(
      [
        polarizationAngleProperty,
        xAxisOffsetAngleProperty
      ], ( polarizationAngle, xAxisOffsetAngle ) => {
        pointOnTheEquator = ( azimuth: number ) => {
          return new Vector2(
            equatorSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngle ),
            equatorSemiMajorAxis * Math.cos( azimuth + xAxisOffsetAngle ) * Math.sin( equatorInclinationAngle )
          );
        };

        pointOnTheSphere = ( azimuth: number, polar: number ) => {
          return new Vector2(
            equatorSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngle ) * Math.cos( polar ),
            equatorSemiMajorAxis *
            ( -Math.sin( polar ) + Math.cos( azimuth + xAxisOffsetAngle ) * Math.sin( equatorInclinationAngle ) * Math.cos( polar ) )
          );
        };

        pointOnTheXZPlane = ( polarizationAngle: number ) => {
          return pointOnTheSphere( 0, polarizationAngle );
        };

        const tipPlus = pointOnTheXZPlane( Utils.toRadians( -polarizationAngle ) );
        const tipMinus = pointOnTheXZPlane( Utils.toRadians( -polarizationAngle ) + Math.PI );

        polarizationVectorPlus.setTip( tipPlus.x, tipPlus.y );
        polarizationVectorMinus.setTip( tipMinus.x, tipMinus.y );

        const plusX = pointOnTheEquator( 0 );
        xAxis.setTip( plusX.x, plusX.y );

        const plusY = pointOnTheEquator( Math.PI / 2 );
        yAxis.setTip( plusY.x, plusY.y );
        yAxis.setTail( plusY.times( 0.9 ).x, plusY.times( 0.9 ).y );
        yAxisLine.shape = new Shape().moveTo( 0, 0 ).lineTo( plusY.x, plusY.y );


        // Rotate the axis outside the arrow nodes
        xAxisLabel.centerX = plusX.times( 1.4 ).x;
        xAxisLabel.centerY = plusX.times( 1.4 ).y;

        yAxisLabel.centerX = plusY.x;
        yAxisLabel.centerY = plusY.y + 0.5 * LABELS_OFFSET;

        XZPlane.shape = new Shape().ellipse( 0, 0, sphereRadius * Math.sin( xAxisOffsetAngle ), sphereRadius, 0 );

        if ( Math.sin( xAxisOffsetAngle ) < 0 ) {
          this.children = [
            // Polarization vector drawn in front
            XZPlane,
            xAxis,
            zAxis,
            xAxisLabel,
            zAxisLabel,
            polarizationVectorPlus,
            polarizationVectorMinus,
            yAxis,
            yAxisLine,
            yAxisLabel
          ];
        }
        else {
          this.children = [
            // Polarization vector drawn in the back
            yAxis,
            yAxisLine,
            yAxisLabel,
            polarizationVectorMinus,
            polarizationVectorPlus,
            XZPlane,
            xAxis,
            zAxis,
            xAxisLabel,
            zAxisLabel
          ];
        }
      }
    );

  }
}

quantumMeasurement.register( 'PolarizationPlaneRepresentation', PolarizationPlaneRepresentation );