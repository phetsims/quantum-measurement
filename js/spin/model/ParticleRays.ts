// Copyright 2024, University of Colorado Boulder

/**
 * ParticleRays contains the data for the particle ray paths in the UI.
 *
 * All possible paths are indexed as such:
 * 0 - Source to SG1
 * 1 - SG1 to infinity (top)
 * 2 - SG1 to infinity (bottom)
 * 3 - SG1 to SG2
 * 4 - SG2 to infinity (top)
 * 5 - SG2 to infinity (bottom)
 * 6 - SG2 to SG3
 * 7 - SG3 to infinity (top)
 * 8 - SG3 to infinity (bottom)
 *
 * @author Agustín Vallejo
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ParticleWithSpinModel } from './ParticleWithSpinModel.js';
import SternGerlach from './SternGerlach.js';

type SternGerlachConnection = {
  source?: SternGerlach;
  exit?: 'top' | 'bottom'; // By which hole of the Stern Gerlach the particle is going to exit
  afterDestination: 'infinity' | 'covered'; // If the ray is going to be covered or if it'll travel to infinity
  destination: SternGerlach;
};

export default class ParticleRays {

  // Lists of points of the possible allPossiblePaths
  public allPossiblePaths: Vector2[][] = [];
  public activePaths: Vector2[][] = [];

  // Recieves the probabilities of spin-up and stores them. They will control the path opacities
  public pathProbabilities: number[] = [];

  public isShortExperiment = true;

  public readonly updatedEmitter = new Emitter();

  public constructor( firstPair: Vector2[], allConnections: SternGerlachConnection[] ) {

    this.allPossiblePaths = [ firstPair ];

    allConnections.forEach( ( connection, index ) => {
      const source = connection.source;
      const destination = connection.destination;

      // If there is a source, connect the source and destination
      if ( source ) {
        const initialPoint = connection.exit === 'top' ?
                             source.topExitPosition.plus( source.positionProperty.value ) : source.bottomExitPosition.plus( source.positionProperty.value );
        this.allPossiblePaths.push( [ initialPoint, destination.entrancePosition.plus( destination.positionProperty.value ) ] );
      }

      // Set the destination apparatus exit allPossiblePaths to go either to infinity or to the blocking
      const afterDestinationVector = connection.afterDestination === 'infinity' ? new Vector2( 1, 0 ) : new Vector2( 0.1, 0 );
      this.allPossiblePaths.push( [ destination.topExitPosition.plus( destination.positionProperty.value ), destination.topExitPosition.plus( destination.positionProperty.value ).plus( afterDestinationVector ) ] );
      this.allPossiblePaths.push( [ destination.bottomExitPosition.plus( destination.positionProperty.value ), destination.bottomExitPosition.plus( destination.positionProperty.value ).plus( afterDestinationVector ) ] );
    } );

  }

  public updateExperiment(): void {
    this.activePaths = this.isShortExperiment ?
                       [ this.allPossiblePaths[ 0 ], this.allPossiblePaths[ 1 ], this.allPossiblePaths[ 2 ] ] :
                       [ this.allPossiblePaths[ 0 ], ...this.allPossiblePaths.slice( 3, this.allPossiblePaths.length ) ];

    this.updatedEmitter.emit();
  }

  public assignRayToParticle( particle: ParticleWithSpinModel ): void {
    if ( this.isShortExperiment ) {
      particle.path = [
        ...this.allPossiblePaths[ 0 ], // Source to SG1
        ...this.allPossiblePaths[ particle.secondSpinUp ? 1 : 2 ] // SG1 to infinity
      ];
    }
    else {
      particle.path = [
        ...this.allPossiblePaths[ 0 ], // Source to SG1
        ...this.allPossiblePaths[ particle.secondSpinUp ? 3 : 6 ], // SG1 to SG2
        ...this.allPossiblePaths[ 4 + ( particle.secondSpinUp ? 0 : 3 ) + ( particle.thirdSpinUp ? 0 : 1 ) ]
      ];
    }

    particle.updateSpeed();
  }

  public updateProbabilities( probabilities: number[] ): void {
    this.pathProbabilities = probabilities;
    this.updatedEmitter.emit();
  }

  public reset(): void {
    this.pathProbabilities = [];
  }
}

quantumMeasurement.register( 'ParticleRays', ParticleRays );