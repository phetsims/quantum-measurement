// Copyright 2024, University of Colorado Boulder

/**
 * PhotonTestingArea is a view element that contains all the components for production, reflecting, and detecting
 * photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Color, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import PolarizingBeamSplitterNode from './PolarizingBeamSplitterNode.js';

type SelfOptions = EmptySelfOptions;
type PhotonTestingAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class PhotonTestingArea extends Node {

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonTestingAreaOptions ) {

    const sizingRectColor = new Color( '#947A0C' );
    const sizingRect = new Rectangle( 0, 0, 370, 505, {
      fill: sizingRectColor,
      stroke: sizingRectColor.darkerColor( 0.5 ),
      opacity: 0.5,
      lineWidth: 2
    } );

    const photonTestingAreaModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      // TODO: Revise and document this when all element have been added, see https://github.com/phetsims/quantum-measurement/issues/52
      Vector2.ZERO,
      new Vector2( 100, 100 ),
      500 // empirically determined
    );

    const polarizingBeamSplitterNode = new PolarizingBeamSplitterNode(
      model.polarizingBeamSplitter,
      photonTestingAreaModelViewTransform,
      {
        tandem: providedOptions.tandem.createTandem( 'polarizingBeamSplitterNode' )
      }
    );

    const options = optionize<PhotonTestingAreaOptions, SelfOptions, NodeOptions>()( {
      children: [ sizingRect, polarizingBeamSplitterNode ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonTestingArea', PhotonTestingArea );