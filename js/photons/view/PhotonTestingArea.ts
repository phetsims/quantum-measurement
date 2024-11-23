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
import LaserNode from './LaserNode.js';
import MirrorNode from './MirrorNode.js';
import PhotonDetectorNode from './PhotonDetectorNode.js';
import PhotonSprites from './PhotonSprites.js';
import PolarizingBeamSplitterNode from './PolarizingBeamSplitterNode.js';

type SelfOptions = EmptySelfOptions;
type PhotonTestingAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class PhotonTestingArea extends Node {

  private readonly photonSprites: PhotonSprites;

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonTestingAreaOptions ) {

    const photonTestingAreaModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      // TODO: Revise and document this when all element have been added, see https://github.com/phetsims/quantum-measurement/issues/52
      Vector2.ZERO,
      Vector2.ZERO,
      640 // empirically determined
    );

    const laserNode = new LaserNode( model.laser, photonTestingAreaModelViewTransform, {
      tandem: providedOptions.tandem.createTandem( 'laserNode' )
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

    const mirror = new MirrorNode( model.mirror, photonTestingAreaModelViewTransform, {
      tandem: providedOptions.tandem.createTandem( 'mirror' )
    } );

    const options = optionize<PhotonTestingAreaOptions, SelfOptions, NodeOptions>()( {
      children: [
        laserNode,
        polarizingBeamSplitterNode,
        verticalPolarizationDetector,
        horizontalPolarizationDetector,
        mirror
      ]
    }, providedOptions );

    super( options );

    // Add the sprites for the photons after calling the super constructor so that we can use the bounds to set the
    // canvas size.
    this.photonSprites = new PhotonSprites(
      model.photons,
      photonTestingAreaModelViewTransform,
      this.localBounds.copy()
    );
    this.addChild( this.photonSprites );
    this.photonSprites.moveToBack();
  }

  /**
   * Updates the view.  For this particular node, this means updating the photon sprites.
   */
  public update(): void {
    this.photonSprites.update();
  }
}

quantumMeasurement.register( 'PhotonTestingArea', PhotonTestingArea );