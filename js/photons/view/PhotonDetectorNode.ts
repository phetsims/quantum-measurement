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
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, LinearGradient, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonDetector from '../model/PhotonDetector.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// The size of the detector body.  The width is for the dimension perpendicular to the detection direction, and the
// height (which is really more like the depth) is for the dimension parallel to the detection direction.
const DETECTOR_BODY_SIZE = new Dimension2( 85, 100 );

export default class PhotonDetectorNode extends Node {

  public constructor( model: PhotonDetector,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PhotonDetectorNodeOptions ) {

    // detector body
    const bodyRectangle = new Rectangle( 0, 0, DETECTOR_BODY_SIZE.width, DETECTOR_BODY_SIZE.height, {
      cornerRadius: 10,
      fill: new Color( '#D1E2FA' )
    } );

    // detection aperture
    const apertureDiameterInView = -modelViewTransform.modelToViewDeltaY( model.apertureDiameter );
    const aperture = new Rectangle( 0, 0, apertureDiameterInView, 8, {
      fill: new LinearGradient( 0, 0, apertureDiameterInView, 0 )
        .addColorStop( 0, new Color( '#FFDDEE' ) )
        .addColorStop( 1, Color.DARK_GRAY )
    } );

    // Add a readout of either the detection rate or the detection count.
    // TODO: This is just a placeholder for now.  We'll need to add the actual readout later.  See https://github.com/phetsims/quantum-measurement/issues/52.
    const countReadout = new Text( '0', {
      font: new PhetFont( 20 ),
      maxWidth: DETECTOR_BODY_SIZE.width * 0.95
    } );

    // Update the readout when the count changes.
    model.detectionCountProperty.link( count => {
      countReadout.setString( count );
      countReadout.center = bodyRectangle.center;
    } );

    const internalOptions: OptionizeDefaults<EmptySelfOptions, NodeOptions, PhotonDetectorNodeOptions> = {
      children: [ aperture, bodyRectangle, countReadout ]
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
      internalOptions, providedOptions
    );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonDetectorNode', PhotonDetectorNode );