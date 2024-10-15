// Copyright 2024, University of Colorado Boulder

/**
 * PhotonNode is a view element that depicts photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Color } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon from '../model/Photon.js';

const PHOTON_RADIUS = 1.5;

export default class PhotonNode extends Circle {

  public constructor( photonModel: Photon,
                      modelViewTransform: ModelViewTransform2 ) {

    super( PHOTON_RADIUS, {
      fill: Color.GREEN,
      visibleProperty: photonModel.activeProperty
    } );

    photonModel.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

quantumMeasurement.register( 'PhotonNode', PhotonNode );