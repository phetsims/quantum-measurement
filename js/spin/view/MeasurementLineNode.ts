// Copyright 2024, University of Colorado Boulder

/**
 * MeasurementLineNode contains the UI elements of the single particle measurement zone. It includes a simple bloch sphere,
 * and a camera node which lights on trigger.
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { Node, Path, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import MeasurementLine, { MeasurementState } from '../model/MeasurementLine.js';

type SelfOptions = EmptySelfOptions;

type MeasurementLineNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class MeasurementLineNode extends VBox {
  public constructor( measurementLine: MeasurementLine, modelViewTransform: ModelViewTransform2, providedOptions: MeasurementLineNodeOptions ) {

    const simpleBlochSphere = new BlochSphereNode( measurementLine.simpleBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'simpleBlochSphere' ),
      drawKets: false,
      drawTitle: false,
      scale: 0.5
    } );


    const cameraPath = new Path( new Shape(
      'M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48z'
    ).makeImmutable(), {
      fill: 'black',
      scale: 0.1,
      center: Vector2.ZERO
    } );
    const measurementArcPath = new Path( Shape.arc( 0, 0, 20, 0, Math.PI, true ), {
      stroke: 'white',
      lineWidth: 5,
      lineCap: 'round',
      lineJoin: 'round',
      center: new Vector2( 0, 5 ),
      scale: 0.6
    } );
    const measurementArrowPath = new ArrowNode( 0, 0, 30, -35, {
      fill: 'white',
      stroke: 'white',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      center: new Vector2( 5, 4 ),
      scale: 0.6
    } );
    const cameraNode = new Node( {
      children: [ cameraPath, measurementArcPath, measurementArrowPath ]
    } );

    simpleBlochSphere.stateVectorVisibleProperty.value = false;

    measurementLine.measurementStateProperty.link( measurementState => {
      simpleBlochSphere.stateVectorVisibleProperty.value = measurementState !== MeasurementState.NOT_MEASURED;
      cameraPath.fill = measurementState === MeasurementState.MEASURING ?
                        QuantumMeasurementColors.particleColor :
                        'black';
    } );

    const options = optionize<MeasurementLineNodeOptions, SelfOptions, VBoxOptions>()( {
      children: [
        simpleBlochSphere,
        cameraNode
      ],
      spacing: 25,
      visibleProperty: measurementLine.isActiveProperty
    }, providedOptions );

    super( options );

    measurementLine.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

quantumMeasurement.register( 'MeasurementLineNode', MeasurementLineNode );