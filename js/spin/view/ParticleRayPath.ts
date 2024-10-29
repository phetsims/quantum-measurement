// Copyright 2024, University of Colorado Boulder

/**
 * ParticleRayPath is the visual representation of a particle ray path in the UI.
 * Coordinates for the possible rays are provided, and the paths are drawn accordingly.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Node, Path, PathOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ParticleRays from '../model/ParticleRays.js';
import { ParticleWithSpin } from '../model/ParticleWithSpin.js';
import { SourceMode } from '../model/SourceMode.js';

export default class ParticleRayPath extends Node {

  public constructor(
    particleRays: ParticleRays,
    modelViewTransform: ModelViewTransform2,
    sourceModeProperty: TReadOnlyProperty<SourceMode>,
    particles: ParticleWithSpin[],
    tandem: Tandem ) {

    const rayPathOptions: PathOptions = {
      lineWidth: 10,
      stroke: QuantumMeasurementColors.downColorProperty,
      lineCap: 'round',
      visibleProperty: new DerivedProperty( [ sourceModeProperty ], sourceMode => sourceMode === SourceMode.CONTINUOUS )
    };

    // Create 9 paths for the possible rays
    const rayPaths = _.range( 9 ).map( i => {
      return new Path( null, rayPathOptions );
    } );

    const singleParticleNodes = particles.map( particle => {
      const particleNode = new ShadedSphereNode( 15, {
        mainColor: 'magenta',
        highlightColor: 'white',
        visibleProperty: particle.activeProperty
      } );

      particle.positionProperty.link( position => {
        particleNode.translation = modelViewTransform.modelToViewPosition( position );
      } );

      return particleNode;
    } );

    super( {
      tandem: tandem,
      localBounds: new Bounds2( 0, 0, 0, 0 ),
      children: [ ...rayPaths, ...singleParticleNodes ]
    } );

    particleRays.updatedEmitter.addListener( () => {
      rayPaths.forEach( ( rayPath, i ) => {
        if ( i < particleRays.pathProbabilities.length ) {
          rayPath.opacity = particleRays.pathProbabilities[ i ];

          const shapePoints = particleRays.activePaths[ i ];

          if ( shapePoints ) {
            const pointFromTransformed = modelViewTransform.modelToViewPosition( shapePoints[ 0 ] );
            const pointToTransformed = modelViewTransform.modelToViewPosition( shapePoints[ 1 ] );

            rayPath.shape = new Shape().moveToPoint( pointFromTransformed )
              .lineToPoint( pointToTransformed );
          }
        }
        else {
          rayPath.opacity = 0;
        }
      } );
    } );
  }
}

quantumMeasurement.register( 'ParticleRayPath', ParticleRayPath );