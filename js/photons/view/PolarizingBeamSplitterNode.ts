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
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle, { RectangleOptions } from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
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
      fill: new Color( '#A3FFFF' ),
      opacity: 0.5,
      center: modelViewTransform.modelToViewPosition( model.centerPosition )
    } );

    const lineNode = new Line( 0, nodeSize.height, nodeSize.width, 0, {
      stroke: new Color( '#50FFFF' ),
      lineWidth: 2,
      lineCap: 'butt',
      center: modelViewTransform.modelToViewPosition( model.centerPosition )
    } );

    const label = new RichText( QuantumMeasurementStrings.polarizingBeamSplitterStringProperty, {
      font: new PhetFont( 12 ),
      centerX: lineNode.centerX,
      top: lineNode.bottom + 4,
      align: 'center',
      maxWidth: 100,
      maxHeight: 50
    } );
    QuantumMeasurementStrings.polarizingBeamSplitterStringProperty.link( () => {
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