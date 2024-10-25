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
const AXES_STROKE = 'gray';
const AXES_LINE_WIDTH = 0.1;
const AXES_LINE_DASH = [ 1, 1 ];
const LABELS_OFFSET = 5;
const LABELS_FONT = new PhetFont( { size: 5, weight: 'bold' } );

const AXES_OPTIONS = {
  stroke: AXES_STROKE,
  lineWidth: AXES_LINE_WIDTH,
  lineDash: AXES_LINE_DASH
};

export default class PolarizationPlaneRepresentation extends Node {

  public readonly xAxisOffsetAngleProperty: NumberProperty;

  public constructor( polarizationAngleProperty: TReadOnlyProperty<number>,
                      providedOptions?: PolarizationPlaneRepresentationOptions ) {

    const sphereRadius = 50;

    const meridianPlaneSemiMajorAxis = sphereRadius;
    const meridianPlaneInclinationAngle = Utils.toRadians( 10 );
    const meridianPlaneSemiMinorAxis = Math.sin( meridianPlaneInclinationAngle ) * meridianPlaneSemiMajorAxis;
    const meridianPlaneLine = new Path(
      new Shape().ellipse( 0, 0, meridianPlaneSemiMinorAxis, meridianPlaneSemiMajorAxis, 0 ),
      {
        fill: 'black',
        opacity: 0.2
      }
    );

    const xAxisOffsetAngleProperty = new NumberProperty( Utils.toRadians( 20 ) );

    let pointOnTheEquator = ( azimuth: number ) => {
      return new Vector2(
        meridianPlaneSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngleProperty.value ),
        meridianPlaneSemiMajorAxis * Math.cos( azimuth + xAxisOffsetAngleProperty.value ) * Math.sin( meridianPlaneInclinationAngle )
      );
    };

    // let pointOnTheSphere = ( azimuth: number, polar: number ) => {
    //   return new Vector2(
    //     meridianPlaneSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngleProperty.value ) * Math.cos( polar ),
    //     meridianPlaneSemiMajorAxis *
    //     ( -Math.sin( polar ) + Math.cos( azimuth + xAxisOffsetAngleProperty.value ) * Math.sin( meridianPlaneInclinationAngle ) * Math.cos( polar ) )
    //   );
    // };

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

    xAxisOffsetAngleProperty.link( xAxisOffsetAngle => {
      pointOnTheEquator = ( azimuth: number ) => {
        return new Vector2(
          meridianPlaneSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngle ),
          meridianPlaneSemiMajorAxis * Math.cos( azimuth + xAxisOffsetAngle ) * Math.sin( meridianPlaneInclinationAngle )
        );
      };

      // pointOnTheSphere = ( azimuth: number, polar: number ) => {
      //   return new Vector2(
      //     meridianPlaneSemiMajorAxis * Math.sin( azimuth + xAxisOffsetAngle ) * Math.cos( polar ),
      //     meridianPlaneSemiMajorAxis *
      //     ( -Math.sin( polar ) + Math.cos( azimuth + xAxisOffsetAngle ) * Math.sin( meridianPlaneInclinationAngle ) * Math.cos( polar ) )
      //   );
      // };

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

    } );

    const polarizationVectorOptions = {
      headWidth: 3,
      headHeight: 3,
      tailWidth: 0.1,
      fill: 'green'
    };
    const polarizationVectorPlus = new ArrowNode( 0, 0, 0, -sphereRadius, polarizationVectorOptions );
    const polarizationVectorMinus = new ArrowNode( 0, 0, 0, sphereRadius, polarizationVectorOptions );

    Multilink.multilink(
      [
        polarizationAngleProperty,
        xAxisOffsetAngleProperty
      ], ( polarizationAngle, xAxisOffsetAngle ) => {
        const tip = pointOnTheEquator( polarizationAngle );
        polarizationVectorPlus.setTip( tip.x, tip.y );
        polarizationVectorPlus.opacity = Math.cos( xAxisOffsetAngle ) < 0 ? 0.4 : 1;

        polarizationVectorMinus.setTip( tip.x, -tip.y );
        polarizationVectorMinus.opacity = Math.cos( xAxisOffsetAngle ) > 0 ? 0.4 : 1;
      }
    );

    const options = optionize<PolarizationPlaneRepresentationOptions, SelfOptions, NodeOptions>()( {
      children: [
        meridianPlaneLine,
        xAxis,
        yAxis,
        zAxis,
        xAxisLabel,
        yAxisLabel,
        zAxisLabel,
        polarizationVectorPlus,
        polarizationVectorMinus
      ],
      // Increasing bounds horizontally so the labels have space to move
      localBounds: new Bounds2( -1.5 * sphereRadius, -sphereRadius, 1.5 * sphereRadius, sphereRadius )
    }, providedOptions );

    super( options );

    this.xAxisOffsetAngleProperty = xAxisOffsetAngleProperty;
  }
}

quantumMeasurement.register( 'PolarizationPlaneRepresentation', PolarizationPlaneRepresentation );