// Copyright 2024-2025, University of Colorado Boulder

/**
 * MeasurementDeviceNode contains the UI elements of the single particle measurement zone. It includes a simple bloch
 * sphere, and a camera node which lights on trigger.
 *
 * @author Agustín Vallejo
 */

import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import MeasurementSymbolNode from '../../common/view/MeasurementSymbolNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import MeasurementDevice from '../model/MeasurementDevice.js';

type SelfOptions = EmptySelfOptions;

type MeasurementDeviceNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class MeasurementDeviceNode extends VBox {

  private readonly simpleBlochSphereNode: BlochSphereNode;

  public constructor( measurementDevice: MeasurementDevice,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: MeasurementDeviceNodeOptions ) {

    const simpleBlochSphereNode = new BlochSphereNode( measurementDevice.simpleBlochSphere, {
      tandem: Tandem.OPT_OUT,
      drawKets: false,
      drawTitle: false,
      scale: 0.5,
      stateVectorScale: 2,
      axesLabelsScale: 1.5
    } );

    const cameraPath = new Path( new Shape(
      QuantumMeasurementConstants.CAMERA_SOLID_SHAPE_SVG
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

    let stateVectorVisibleTimeout: null | TimerListener = null;
    let cameraPathFillTimeout: null | TimerListener = null;

    measurementDevice.measurementEmitter.addListener( () => {
      simpleBlochSphereNode.stateVectorVisibleProperty.value = false;
      cameraPath.fill = QuantumMeasurementColors.particleColorProperty;

      stateVectorVisibleTimeout = stepTimer.setTimeout( () => {
        simpleBlochSphereNode.stateVectorVisibleProperty.value = true;
      }, 100 );

      cameraPathFillTimeout = stepTimer.setTimeout( () => {
        cameraPath.fill = 'black';
      }, 500 );
    } );

    measurementDevice.resetEmitter.addListener( () => {
      stateVectorVisibleTimeout && stepTimer.clearTimeout( stateVectorVisibleTimeout );
      cameraPathFillTimeout && stepTimer.clearTimeout( cameraPathFillTimeout );
      stateVectorVisibleTimeout = null;
      cameraPathFillTimeout = null;
      this.reset();
    } );

    const options = optionize<MeasurementDeviceNodeOptions, SelfOptions, VBoxOptions>()( {
      children: [
        simpleBlochSphereNode,
        cameraNode
      ],
      spacing: 30,
      visibleProperty: new GatedVisibleProperty( measurementDevice.isActiveProperty, providedOptions.tandem )
    }, providedOptions );

    super( options );

    this.simpleBlochSphereNode = simpleBlochSphereNode;

    measurementDevice.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }

  public reset(): void {
    this.simpleBlochSphereNode.stateVectorVisibleProperty.value = false;
  }
}

quantumMeasurement.register( 'MeasurementDeviceNode', MeasurementDeviceNode );