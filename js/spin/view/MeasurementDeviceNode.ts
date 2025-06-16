// Copyright 2024-2025, University of Colorado Boulder

/**
 * MeasurementDeviceNode contains the UI elements of the single particle measurement zone. It includes a simple bloch
 * sphere, and a camera node which lights on trigger.
 *
 * @author Agustín Vallejo
 */

import GatedVisibleProperty from '../../../../axon/js/GatedVisibleProperty.js';
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

    const blochSphereNode = new BlochSphereNode( measurementDevice.simpleBlochSphere, {
      tandem: providedOptions.tandem.createTandem( 'blochSphereNode' ),
      phetioVisiblePropertyInstrumented: false,
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

    blochSphereNode.stateVectorVisibleProperty.value = false;

    let stateVectorVisibleTimeout: null | TimerListener = null;
    let cameraPathFillTimeout: null | TimerListener = null;

    const stateVectorVisibleCallback = () => {
      blochSphereNode.stateVectorVisibleProperty.value = true;
    };

    const cameraPathFillCallback = () => {
      cameraPath.fill = QuantumMeasurementColors.cameraIdleFillProperty;
    };

    measurementDevice.measurementEmitter.addListener( () => {
      blochSphereNode.stateVectorVisibleProperty.value = false;
      cameraPath.fill = QuantumMeasurementColors.particleColorProperty;

      stateVectorVisibleTimeout = stepTimer.setTimeout( stateVectorVisibleCallback, 100 );

      cameraPathFillTimeout = stepTimer.setTimeout( cameraPathFillCallback, 500 );
    } );

    measurementDevice.resetEmitter.addListener( () => {
      stateVectorVisibleTimeout && stepTimer.clearTimeout( stateVectorVisibleTimeout );
      cameraPathFillTimeout && stepTimer.clearTimeout( cameraPathFillTimeout );
      stateVectorVisibleTimeout = null;
      cameraPathFillTimeout = null;

      // If the timeouts are cleared, call the callbacks to reset the state
      stateVectorVisibleCallback();
      cameraPathFillCallback();
      this.reset();
    } );

    const options = optionize<MeasurementDeviceNodeOptions, SelfOptions, VBoxOptions>()( {
      children: [
        blochSphereNode,
        cameraNode
      ],
      spacing: 30,
      visibleProperty: new GatedVisibleProperty( measurementDevice.isActiveProperty, providedOptions.tandem ),
      phetioFeatured: true
    }, providedOptions );

    super( options );

    this.simpleBlochSphereNode = blochSphereNode;

    measurementDevice.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );

    // Create phet-io link from this view node to the model.
    this.addLinkedElement( measurementDevice );
  }

  public reset(): void {
    this.simpleBlochSphereNode.stateVectorVisibleProperty.value = false;
  }
}

quantumMeasurement.register( 'MeasurementDeviceNode', MeasurementDeviceNode );