// Copyright 2024, University of Colorado Boulder

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
import { Color, Line, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PolarizingBeamSplitter from '../model/PolarizingBeamSplitter.js';

type SelfOptions = EmptySelfOptions;
type PolarizingBeamSplitterNodeOptions = SelfOptions & PickRequired<RectangleOptions, 'tandem'>;

export default class PolarizingBeamSplitterNode extends Rectangle {

  public constructor( model: PolarizingBeamSplitter,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PolarizingBeamSplitterNodeOptions ) {

    const nodeSize = new Dimension2(
      modelViewTransform.modelToViewDeltaX( model.size.width ),
      -modelViewTransform.modelToViewDeltaY( model.size.height )
    );

    const lineNode = new Line( 0, nodeSize.height, nodeSize.width, 0, {
      stroke: new Color( '#50FFFF' ),
      lineWidth: 2,
      lineCap: 'butt'
    } );

    const options = optionize<PolarizingBeamSplitterNodeOptions, SelfOptions, RectangleOptions>()( {
      fill: new Color( '#A3FFFF' ),
      center: modelViewTransform.modelToViewPosition( model.centerPosition ),
      children: [ lineNode ]
    }, providedOptions );

    super( 0, 0, nodeSize.width, nodeSize.height, options );
  }
}

quantumMeasurement.register( 'PolarizingBeamSplitterNode', PolarizingBeamSplitterNode );