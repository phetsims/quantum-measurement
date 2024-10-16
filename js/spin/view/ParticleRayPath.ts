// Copyright 2024, University of Colorado Boulder

/**
 * ParticleRayPath is the visual representation of a particle ray path in the UI.
 * Coordinates for the possible rays are provided, and the paths are drawn accordingly.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Node, Path, PathOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ParticleRays from '../model/ParticleRays.js';
import { ParticleWithSpinModel } from '../model/ParticleWithSpinModel.js';
import { SourceMode } from '../model/SourceMode.js';

export default class ParticleRayPath extends Node {

  public readonly updatePaths: (
    rayPointsPairs: Vector2[][]
  ) => void;

  public constructor(
    particleRays: ParticleRays,
    sourceModeProperty: TReadOnlyProperty<SourceMode>,
    particles: ParticleWithSpinModel[],
    tandem: Tandem ) {

    const rayPathOptions: PathOptions = {
      lineWidth: 10,
      stroke: QuantumMeasurementColors.downColorProperty,
      lineCap: 'round',
      visibleProperty: new DerivedProperty( [ sourceModeProperty ], sourceMode => sourceMode === SourceMode.CONTINUOUS )
    };

    // Create 7 paths for the possible rays
    const rayPaths = _.range( 7 ).map( i => {
      return new Path( null, rayPathOptions );
    } );

    const singleParticleNodes = particles.map( particle => {
      const particleNode = new ShadedSphereNode( 15, {
        mainColor: 'magenta',
        highlightColor: 'white',
        visibleProperty: particle.activeProperty
      } );

      particle.positionProperty.link( position => {
        particleNode.translation = position;
      } );

      return particleNode;
    } );

    super( {
      tandem: tandem,
      localBounds: null,
      children: [ ...rayPaths, ...singleParticleNodes ]
    } );

    this.updatePaths = (
      rayPointsPairs: Vector2[][]
    ) => {
      // Grab all the pairs of points and create rays for each pair
      const allMappedRayPoints: Vector2[][] = [];
      for ( let i = 0; i < 7; i++ ) {
        if ( i < rayPointsPairs.length ) {
          // If the ray exists, update its shape, otherwise set it to null
          const rayPointsPair = rayPointsPairs[ i ];
          const mappedRayPoints = rayPointsPair.map( point => this.globalToLocalPoint( point ) );
          rayPaths[ i ].shape = new Shape().moveTo( mappedRayPoints[ 0 ].x, mappedRayPoints[ 0 ].y )
            .lineTo( mappedRayPoints[ 1 ].x, mappedRayPoints[ 1 ].y );
          rayPaths[ i ].opacity = 1;
          allMappedRayPoints.push( mappedRayPoints );
        }
        else {
          rayPaths[ i ].shape = null;
        }
      }

      // Update the particles' positions
      particles.forEach( ( particle, i ) => {
        // TODO: YUCK! https://github.com/phetsims/quantum-measurement/issues/53
        particle.mappedPaths = allMappedRayPoints;
      } );
    };

    particleRays.probabilitiesUpdatedEmitter.addListener( () => {
      rayPaths.forEach( ( rayPath, i ) => {
        if ( i < particleRays.pathProbabilities.length ) {
          rayPath.opacity = particleRays.pathProbabilities[ i ];
        }
        else {
          rayPath.opacity = 0;
        }
      } );
    } );
  }
}

quantumMeasurement.register( 'ParticleRayPath', ParticleRayPath );