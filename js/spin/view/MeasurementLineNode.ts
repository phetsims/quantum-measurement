// Copyright 2024, University of Colorado Boulder

/**
 * MeasurementLineNode contains the UI elements of the single particle measurement zone. It includes a simple bloch sphere,
 * and a camera node which lights on trigger.
 *
 * @author Agustín Vallejo
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Path, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import cameraSolidShape from '../../../../sherpa/js/fontawesome-5/cameraSolidShape.js';
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

    const cameraPath = new Path( cameraSolidShape, {
      fill: 'black',
      scale: 0.05
    } );

    simpleBlochSphere.stateVectorVisibleProperty.value = false;

    measurementLine.measurementStateProperty.link( measurementState => {
      simpleBlochSphere.stateVectorVisibleProperty.value = measurementState !== MeasurementState.NOT_MEASURED;
      cameraPath.fill = measurementState === MeasurementState.MEASURING ? 'magenta' : 'black';
    } );

    const options = optionize<MeasurementLineNodeOptions, SelfOptions, VBoxOptions>()( {
      children: [
        simpleBlochSphere,
        cameraPath
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