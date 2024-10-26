// Copyright 2024, University of Colorado Boulder
/**
 * Visual representation of the Bloch Sphere, meaning an orb with axis and the state vector.
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
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
export type PolarizationPlaneRepresentationOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// Constants
const AXES_STROKE = 'black';
const AXES_LINE_WIDTH = 0.5;
const LABELS_OFFSET = 5;
const LABELS_FONT = new PhetFont( { size: 5, weight: 'bold' } );

const AXES_OPTIONS = {
  stroke: AXES_STROKE,
  lineWidth: AXES_LINE_WIDTH
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

    const xAxis = new Path( null, AXES_OPTIONS );
    const yAxis = new Path( null, AXES_OPTIONS );
    const zAxis = new Path( null, AXES_OPTIONS );

    const xAxisLabel = new Text( 'X', {
      fill: 'black',
      font: LABELS_FONT
    } );
    const yAxisLabel = new Text( 'Y', {
      fill: 'black',
      font: LABELS_FONT
    } );
    const zAxisLabel = new Text( 'Z', {
      centerX: -LABELS_OFFSET,
      centerY: -sphereRadius + LABELS_OFFSET,
      fill: 'black',
      font: LABELS_FONT
    } );

    const xAxisOffsetAngleProperty = new NumberProperty( Utils.toRadians( 320 ) );

    xAxisOffsetAngleProperty.link( xAxisOffsetAngle => {
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

      const plusX = pointOnTheEquator( 0 );
      const minusX = pointOnTheEquator( Math.PI );
      xAxis.shape = new Shape().moveTo( plusX.x, plusX.y ).lineTo( minusX.x, minusX.y );

      const plusY = pointOnTheEquator( Math.PI / 2 );
      const minusY = pointOnTheEquator( -Math.PI / 2 );
      yAxis.shape = new Shape().moveTo( plusY.x, plusY.y ).lineTo( minusY.x, minusY.y );
      zAxis.shape = new Shape().moveTo( 0, -sphereRadius ).lineTo( 0, sphereRadius );

      xAxisLabel.centerX = plusX.x + LABELS_OFFSET;
      xAxisLabel.centerY = plusX.y;
      yAxisLabel.centerX = plusY.x;
      yAxisLabel.centerY = plusY.y - LABELS_OFFSET;

      XZPlane.shape = new Shape().ellipse( 0, 0, sphereRadius * Math.sin( xAxisOffsetAngle ), sphereRadius, 0 );

    } );

    const polarizationVectorOptions = {
      headWidth: 6,
      headHeight: 6,
      tailWidth: 0.5,
      stroke: '#0f0',
      fill: '#0f0'
    };
    const polarizationVectorPlus = new ArrowNode( 0, 0, 0, -sphereRadius, polarizationVectorOptions );
    const polarizationVectorMinus = new ArrowNode( 0, 0, 0, sphereRadius, polarizationVectorOptions );

    Multilink.multilink(
      [
        polarizationAngleProperty,
        xAxisOffsetAngleProperty
      ], ( polarizationAngle, xAxisOffsetAngle ) => {
        const tipPlus = pointOnTheXZPlane( Utils.toRadians( -polarizationAngle ) );
        const tipMinus = pointOnTheXZPlane( Utils.toRadians( -polarizationAngle ) + Math.PI );

        polarizationVectorPlus.setTip( tipPlus.x, tipPlus.y );
        polarizationVectorMinus.setTip( tipMinus.x, tipMinus.y );
      }
    );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {
      children: [
        XZPlane,
        polarizationVectorPlus,
        polarizationVectorMinus,
        xAxis,
        yAxis,
        zAxis,
        xAxisLabel,
        yAxisLabel,
        zAxisLabel
      ],
      // Increasing bounds horizontally so the labels have space to move
      localBounds: new Bounds2( -1.5 * sphereRadius, -sphereRadius, 1.5 * sphereRadius, sphereRadius )
    }, providedOptions );

    super( options );

    this.xAxisOffsetAngleProperty = xAxisOffsetAngleProperty;
  }
}

quantumMeasurement.register( 'PolarizationPlaneRepresentation', PolarizationPlaneRepresentation );