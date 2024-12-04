// Copyright 2024, University of Colorado Boulder

/**
 * PhotonNode is a view element that depicts photons.  The appearance is based on photon representations used in other
 * sims, such as Greenhouse Effect, Molecules and Light, and Models of the Hydrogen Atom.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Matrix3 from '../../../../dot/js/Matrix3.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Node, Path } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon from '../model/Photon.js';

const PHOTON_RADIUS = 4;
const STAR_RADIUS = PHOTON_RADIUS * 0.9;
const STAR_CORE_RADIUS = STAR_RADIUS / 3;
const NUMBER_OF_STAR_POINTS = 6;

// Create the shape that will be used f
// or the star in all photons.
const starShape = new Shape().moveTo( STAR_CORE_RADIUS, 0 );
_.times( NUMBER_OF_STAR_POINTS, i => {
  const angle = i * 2 * Math.PI / NUMBER_OF_STAR_POINTS;
  starShape.lineTo( STAR_CORE_RADIUS * Math.cos( angle ), STAR_CORE_RADIUS * Math.sin( angle ) );
  starShape.lineTo(
    STAR_RADIUS * Math.cos( angle + Math.PI / NUMBER_OF_STAR_POINTS ),
    STAR_RADIUS * Math.sin( angle + Math.PI / NUMBER_OF_STAR_POINTS )
  );
} );
starShape.close();
const STAR_SHAPE = starShape.transformed( Matrix3.rotationAround( Math.PI / 5, 0, 0 ) );

const STAR_COLOR = QuantumMeasurementColors.photonBaseColorProperty.value.colorUtilsBrighter( 0.3 );
const HALO_COLOR = QuantumMeasurementColors.photonBaseColorProperty.value.colorUtilsDarker( 0.15 );

export default class PhotonNode extends Node {

  public constructor( photonModel: Photon,
                      modelViewTransform: ModelViewTransform2 ) {

    const starNode = new Path( STAR_SHAPE, {
      fill: STAR_COLOR,
      stroke: STAR_COLOR,
      opacity: 0.75
    } );

    const haloNode = new Circle( PHOTON_RADIUS, {
      fill: HALO_COLOR,
      opacity: 0.75
    } );

    super( {
      children: [ haloNode, starNode ],
      visibleProperty: photonModel.activeProperty
    } );

    // photonModel.positionProperty.link( position => {
    //   this.center = modelViewTransform.modelToViewPosition( position );
    // } );
  }
}

quantumMeasurement.register( 'PhotonNode', PhotonNode );