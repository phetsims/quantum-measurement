// Copyright 2024, University of Colorado Boulder

/**
 * PhotonDetectorNode represents the photon detector in the view.  It appears to absorb photons and presents either a
 * total count or a rate of detection.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions, OptionizeDefaults } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Color, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonDetector from '../model/PhotonDetector.js';
import { PHOTON_BEAM_WIDTH } from '../model/PhotonsExperimentSceneModel.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

const DETECTOR_BODY_SIZE = new Dimension2( 50, 75 );

export default class PhotonDetectorNode extends Node {

  public constructor( model: PhotonDetector,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PhotonDetectorNodeOptions ) {

    // detector body
    const bodyRectangle = Rectangle.dimension( DETECTOR_BODY_SIZE, {
      fill: new Color( '#D1E2FA' )
    } );

    // detection aperture
    const aperture = new Rectangle( 0, 0, -modelViewTransform.modelToViewDeltaY( PHOTON_BEAM_WIDTH * 1.1 ), 10, {
      fill: Color.GRAY
    } );

    const internalOptions: OptionizeDefaults<EmptySelfOptions, NodeOptions, PhotonDetectorNodeOptions> = {
      children: [ aperture, bodyRectangle ]
    };

    // Position the detector body and aperture based on the detection direction.
    if ( model.detectionDirection === 'up' ) {

      // Position the aperture at the bottom of the detector body.
      aperture.centerX = bodyRectangle.centerX;
      aperture.top = bodyRectangle.bottom;

      // Set up the position options for the node as a whole.
      internalOptions.centerX = modelViewTransform.modelToViewX( model.position.x );
      internalOptions.bottom = modelViewTransform.modelToViewY( model.position.y );
    }
    else if ( model.detectionDirection === 'down' ) {

      // Position the aperture at the top of the detector body.
      aperture.centerX = bodyRectangle.centerX;
      aperture.bottom = bodyRectangle.top;

      // Set up the position options for the node as a whole.
      internalOptions.centerX = modelViewTransform.modelToViewX( model.position.x );
      internalOptions.top = modelViewTransform.modelToViewY( model.position.y );
    }
    else {
      assert && assert( false, `unsupported detection direction: ${model.detectionDirection}` );
    }

    const options = optionize<PhotonDetectorNodeOptions, SelfOptions, NodeOptions>()(
      internalOptions, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonDetectorNode', PhotonDetectorNode );