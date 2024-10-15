// Copyright 2024, University of Colorado Boulder

/**
 * ParticleRayPath is the visual representation of a particle ray path in the UI.
 * Coordinates for the possible rays are provided, and the paths are drawn accordingly.
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path, PathOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class ParticleRayPath extends Node {

  public readonly updatePaths: (
    rayPointsPairs: Vector2[][]
  ) => void;

  public readonly updateOpacities: (
    opacities: number[]
  ) => void;

  public constructor(
    particleAmmountProperty: TReadOnlyProperty<number>,
    tandem: Tandem ) {

    const rayPathOptions: PathOptions = {
      lineWidth: 10,
      stroke: QuantumMeasurementColors.downColorProperty,
      lineCap: 'round'
    };

    let rayOpacity = 1;

    // Create 7 paths for the possible rays
    const rayPaths = _.range( 7 ).map( i => {
      return new Path( null, rayPathOptions );
    } );

    super( {
      tandem: tandem,
      localBounds: null,
      children: [ ...rayPaths ]
    } );

    this.updatePaths = (
      rayPointsPairs: Vector2[][]
    ) => {
      // Grab all the pairs of points and create rays for each pair
      for ( let i = 0; i < 7; i++ ) {
        if ( i < rayPointsPairs.length ) {
          // If the ray exists, update its shape, otherwise set it to null
          const rayPointsPair = rayPointsPairs[ i ];
          const mappedRayPoints = rayPointsPair.map( point => this.globalToLocalPoint( point ) );
          rayPaths[ i ].shape = new Shape().moveTo( mappedRayPoints[ 0 ].x, mappedRayPoints[ 0 ].y )
            .lineTo( mappedRayPoints[ 1 ].x, mappedRayPoints[ 1 ].y );
          rayPaths[ i ].opacity = rayOpacity;
        }
        else {
          rayPaths[ i ].shape = null;
        }
      }
    };

    this.updateOpacities = (
      opacities: number[]
    ) => {
      for ( let i = 0; i < 7; i++ ) {
        if ( i < opacities.length ) {
          rayPaths[ i ].opacity = opacities[ i ];
        }
        else {
          rayPaths[ i ].opacity = 0;
        }
      }
    };

    // TODO: Multilink for when we have another value in the model for the opacity of secondary and tertiary rays https://github.com/phetsims/quantum-measurement/issues/53
    Multilink.multilink(
      [ particleAmmountProperty ],
      particleAmmount => {
        rayOpacity = particleAmmount;
        this.updateOpacities( _.times( 7, () => rayOpacity ) );
      }
    );
  }
}

quantumMeasurement.register( 'ParticleRayPath', ParticleRayPath );