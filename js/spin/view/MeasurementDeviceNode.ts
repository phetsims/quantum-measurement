// Copyright 2024-2025, University of Colorado Boulder

/**
 * MeasurementDeviceNode contains the UI elements of the single particle measurement zone. It includes a simple bloch sphere,
 * and a camera node which lights on trigger.
 *
 * @author Agustín Vallejo
 */

import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, Path, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import MeasurementDevice from '../model/MeasurementDevice.js';
import MeasurementSymbolNode from '../../common/view/MeasurementSymbolNode.js';

type SelfOptions = EmptySelfOptions;

type MeasurementDeviceNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class MeasurementDeviceNode extends VBox {

  private readonly simpleBlochSphereNode: BlochSphereNode;

  public constructor( measurementLine: MeasurementDevice, modelViewTransform: ModelViewTransform2, providedOptions: MeasurementDeviceNodeOptions ) {

    const simpleBlochSphereNode = new BlochSphereNode( measurementLine.simpleBlochSphere, {
      tandem: Tandem.OPT_OUT,
      drawKets: false,
      drawTitle: false,
      scale: 0.5
    } );

    const cameraPath = new Path( new Shape(
      quantumMeasurementConstants.CAMERA_SOLID_SHAPE_SVG
    ).makeImmutable(), {
      fill: 'black',
      scale: 0.1,
      center: Vector2.ZERO
    } );

    const measurementSymbol = new MeasurementSymbolNode();
    const cameraNode = new Node( {
      children: [ cameraPath, measurementSymbol ],
      scale: 0.7
    } );

    simpleBlochSphereNode.stateVectorVisibleProperty.value = false;

    measurementLine.measurementEmitter.addListener( () => {
      simpleBlochSphereNode.stateVectorVisibleProperty.value = false;
      cameraPath.fill = QuantumMeasurementColors.particleColorProperty;

      stepTimer.setTimeout( () => {
        simpleBlochSphereNode.stateVectorVisibleProperty.value = true;
      }, 100 );

      stepTimer.setTimeout( () => {
        cameraPath.fill = 'black';
      }, 500 );
    } );


    const options = optionize<MeasurementDeviceNodeOptions, SelfOptions, VBoxOptions>()( {
      children: [
        simpleBlochSphereNode,
        cameraNode
      ],
      spacing: 30,
      visibleProperty: new GatedVisibleProperty( measurementLine.isActiveProperty, providedOptions.tandem )
    }, providedOptions );

    super( options );

    this.simpleBlochSphereNode = simpleBlochSphereNode;

    measurementLine.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  public reset(): void {
    this.simpleBlochSphereNode.stateVectorVisibleProperty.value = false;
  }
}

quantumMeasurement.register( 'MeasurementDeviceNode', MeasurementDeviceNode );