// Copyright 2024-2025, University of Colorado Boulder

/**
 * PolarizingBeamSplitterNode is a view element that represents a device that splits a beam of photons into two beams
 * based on the polarization of the photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PolarizingBeamSplitter from '../model/PolarizingBeamSplitter.js';

type SelfOptions = EmptySelfOptions;
type PolarizingBeamSplitterNodeOptions = SelfOptions & PickRequired<RectangleOptions, 'tandem'>;

export default class PolarizingBeamSplitterNode extends Node {

  public constructor( model: PolarizingBeamSplitter,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions?: PolarizingBeamSplitterNodeOptions ) {

    const nodeSize = new Dimension2(
      modelViewTransform.modelToViewDeltaX( model.size.width ),
      -modelViewTransform.modelToViewDeltaY( model.size.height )
    );

    const enclosureNode = new Rectangle( 0, 0, nodeSize.width, nodeSize.height, {
      fill: QuantumMeasurementColors.splitterEnclosureNodeFillProperty,
      center: modelViewTransform.modelToViewPosition( model.centerPosition )
    } );

    const lineNode = new Line( 0, nodeSize.height, nodeSize.width, 0, {
      stroke: QuantumMeasurementColors.splitterLineNodeFillProperty,
      lineWidth: 2,
      lineCap: 'butt',
      center: modelViewTransform.modelToViewPosition( model.centerPosition )
    } );

    const label = new RichText( QuantumMeasurementStrings.polarizingBeamSplitterStringProperty, {
      font: QuantumMeasurementConstants.SMALL_LABEL_FONT,
      centerX: lineNode.centerX,
      top: lineNode.bottom + 4,
      align: 'center',
      maxWidth: 100,
      maxHeight: 50
    } );
    label.localBoundsProperty.link( () => {
      label.centerX = lineNode.centerX;
      label.top = lineNode.bottom + 4;
    } );

    const options = optionize<PolarizingBeamSplitterNodeOptions, SelfOptions, RectangleOptions>()( {
      children: [ lineNode, enclosureNode, label ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PolarizingBeamSplitterNode', PolarizingBeamSplitterNode );