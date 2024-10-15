// Copyright 2024, University of Colorado Boulder

/**
 * MirrorNode is a view element that represents a mirror viewed from the side that reflects photons.  It is basically
 * just a simple line.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Color, Line, RectangleOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Mirror from '../model/Mirror.js';

type SelfOptions = EmptySelfOptions;
type MirrorNodeOptions = SelfOptions & PickRequired<RectangleOptions, 'tandem'>;

export default class MirrorNode extends Line {

  public constructor( model: Mirror,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: MirrorNodeOptions ) {

    const options = optionize<MirrorNodeOptions, SelfOptions, RectangleOptions>()( {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 5
    }, providedOptions );

    super(
      modelViewTransform.modelToViewPosition( model.mirrorSurfaceLine.start ),
      modelViewTransform.modelToViewPosition( model.mirrorSurfaceLine.end ),
      options
    );
  }
}

quantumMeasurement.register( 'MirrorNode', MirrorNode );