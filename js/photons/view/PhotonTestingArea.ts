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
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import PhotonDetectorNode from './PhotonDetectorNode.js';
import PolarizingBeamSplitterNode from './PolarizingBeamSplitterNode.js';
import PhotonEmitterNode from './PhotonEmitterNode.js';

type SelfOptions = EmptySelfOptions;
type PhotonTestingAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class PhotonTestingArea extends Node {

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonTestingAreaOptions ) {

    const photonTestingAreaModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      // TODO: Revise and document this when all element have been added, see https://github.com/phetsims/quantum-measurement/issues/52
      Vector2.ZERO,
      new Vector2( 100, 100 ),
      500 // empirically determined
    );

    const photonEmitterNode = new PhotonEmitterNode( model.photonEmitter, photonTestingAreaModelViewTransform, {
      tandem: providedOptions.tandem.createTandem( 'photonEmitterNode' )
    } );

    const verticalPolarizationDetector = new PhotonDetectorNode(
      model.verticalPolarizationDetector,
      photonTestingAreaModelViewTransform,
      {
        tandem: providedOptions.tandem.createTandem( 'verticalPolarizationDetector' )
      }
    );
    const horizontalPolarizationDetector = new PhotonDetectorNode(
      model.horizontalPolarizationDetector,
      photonTestingAreaModelViewTransform,
      {
        tandem: providedOptions.tandem.createTandem( 'horizontalPolarizationDetector' )
      }
    );

    const polarizingBeamSplitterNode = new PolarizingBeamSplitterNode(
      model.polarizingBeamSplitter,
      photonTestingAreaModelViewTransform,
      {
        tandem: providedOptions.tandem.createTandem( 'polarizingBeamSplitterNode' )
      }
    );

    const options = optionize<PhotonTestingAreaOptions, SelfOptions, NodeOptions>()( {
      children: [
        photonEmitterNode,
        polarizingBeamSplitterNode,
        verticalPolarizationDetector,
        horizontalPolarizationDetector
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonTestingArea', PhotonTestingArea );