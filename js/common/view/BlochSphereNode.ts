// Copyright 2024, University of Colorado Boulder
/**
 * Visual representation of the Bloch Sphere, meaning an orb with axis and the state vector.
 *
 * // TODO: Show the angle indicators and clean code, see https://github.com/phetsims/quantum-measurement/issues/44
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Node, NodeOptions, Path, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import AbstractBlochSphere from '../model/AbstractBlochSphere.js';
import QuantumMeasurementConstants from '../QuantumMeasurementConstants.js';

type SelfOptions = {
  drawKets?: boolean;
  drawTitle?: boolean;
  drawAngleIndicators?: boolean;
  expandBounds?: boolean;
};
export type BlochSphereNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

// Constants
const AXES_STROKE = 'gray';
const AXES_LINE_WIDTH = 0.4;
const AXES_LINE_DASH = [ 2, 2 ];
const LABELS_OFFSET = 5;
const LABELS_FONT = new PhetFont( { size: 15, weight: 'bold' } );

const AXES_OPTIONS = {
  stroke: AXES_STROKE,
  lineWidth: AXES_LINE_WIDTH,
  lineDash: AXES_LINE_DASH
};

export default class BlochSphereNode extends Node {

  public readonly xAxisOffsetAngleProperty: NumberProperty;

  public readonly sphereRadius: number;
  public pointOnTheEquator = ( azimuth: number, xAxisOffsetAngle?: number ): Vector2 => Vector2.ZERO;

  public readonly stateVectorVisibleProperty: BooleanProperty;

  public constructor(
    blochSphere: AbstractBlochSphere,
    providedOptions: BlochSphereNodeOptions ) {

    const options = optionize<BlochSphereNodeOptions, SelfOptions, NodeOptions>()( {
      drawKets: true,
      drawTitle: true,
      drawAngleIndicators: true,
      expandBounds: true
    }, providedOptions );

    const sphereRadius = 100;

    const sphereNode = new ShadedSphereNode( 2 * sphereRadius, {
      mainColor: 'cyan',
      highlightColor: 'white',
      highlightDiameterRatio: 0.9
    } );

    const equatorSemiMajorAxis = sphereRadius;
    const equatorInclinationAngle = Utils.toRadians( 10 );
    const equatorSemiMinorAxis = Math.sin( equatorInclinationAngle ) * equatorSemiMajorAxis;
    const equatorLine = new Path(
      new Shape().ellipse( 0, 0, equatorSemiMajorAxis, equatorSemiMinorAxis, 0 ),
      AXES_OPTIONS
    );

    const xAxisOffsetAngleProperty = new NumberProperty( Utils.toRadians( 20 ) );

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
      font: LABELS_FONT
    } );
    const yAxisLabel = new Text( 'Y', {
      fill: 'black',
      font: LABELS_FONT
    } );
    const zAxisLabel = new Text( 'Z', {
      centerX: -2 * LABELS_OFFSET,
      centerY: -sphereRadius + LABELS_OFFSET,
      fill: 'black',
      font: LABELS_FONT
    } );

    const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
    const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
    const KET = QuantumMeasurementConstants.KET;
    const STATES_FONT = new PhetFont( { size: 18, weight: 'bold' } );
    const upStateLabel = new Text( `|${UP}${KET}`, {
      centerX: 0,
      centerY: -sphereRadius - 3 * LABELS_OFFSET,
      fill: 'black',
      font: STATES_FONT,
      visible: options.drawKets
    } );

    const downStateLabel = new Text( `|${DOWN}${KET}`, {
      centerX: 0,
      centerY: sphereRadius + 3 * LABELS_OFFSET,
      fill: 'black',
      font: STATES_FONT,
      visible: options.drawKets
    } );

    const title = new Text( QuantumMeasurementStrings.blochSphereStringProperty, {
      font: new PhetFont( { size: 16, weight: 'bolder' } ),
      visible: options.drawTitle,
      bottom: upStateLabel.top - 10,
      centerX: upStateLabel.centerX
    } );

    const stateVectorVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'stateVectorVisibleProperty' )
    } );
    const stateVector = new ArrowNode( 0, 0, 0, -sphereRadius, {
      tandem: options.tandem.createTandem( 'stateVector' ),
      headWidth: 10,
      headHeight: 10,
      tailWidth: 3,
      fill: 'black',
      visibleProperty: stateVectorVisibleProperty
    } );

    const ANGLE_INDICATOR_PATH_OPTIONS = {
      stroke: 'gray',
      lineWidth: 1,
      lineDash: [ 2, 2 ],
      visible: options.drawAngleIndicators
    };
    const polarAngleIndicator = new Path( null, ANGLE_INDICATOR_PATH_OPTIONS );
    const azimutalAngleIndicator = new Path( null, ANGLE_INDICATOR_PATH_OPTIONS );

    Multilink.multilink(
      [
        blochSphere.azimutalAngleProperty,
        blochSphere.polarAngleProperty,
        xAxisOffsetAngleProperty
      ], ( azimutalAngle, polarAngle, xAxisOffsetAngle ) => {
        const tip = pointOnTheSphere( azimutalAngle, polarAngle, xAxisOffsetAngleProperty.value );
        stateVector.setTip( tip.x, tip.y );
        stateVector.opacity = Math.sin( polarAngle ) < 1e-5 || Math.cos( azimutalAngle + xAxisOffsetAngle ) > 0 ? 1 : 0.4;

        polarAngleIndicator.shape = new Shape().ellipticalArc(
          // Center of the ellipse
          0,
          0,
          // Ellipse dimensions
          tip.x / 2, // Ellipse width goes to half the state vector
          equatorSemiMajorAxis / 2,
          0,
          // Begins at -PI/2; Ends at the polar angle with an adjustement due to the sphere perspective
          -Math.PI / 2,
          polarAngle - Math.PI / 2 + equatorInclinationAngle * Math.sin( polarAngle ) * Math.cos( azimutalAngle + xAxisOffsetAngle ),
          false
        );

        azimutalAngleIndicator.shape = new Shape().ellipticalArc(
          0,
          0,
          equatorSemiMajorAxis / 2,
          equatorSemiMinorAxis / 2,
          0,
          // Begins with offset; Ends at the azimutal angle with an adjustement due to the sphere perspective
          -xAxisOffsetAngle + Math.PI / 2,
          -( azimutalAngle + xAxisOffsetAngle - Math.PI / 2 ) % ( 2 * Math.PI ),
          true
        );
      }
    );

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
      azimutalAngleIndicator,
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
  }
}

quantumMeasurement.register( 'BlochSphereNode', BlochSphereNode );