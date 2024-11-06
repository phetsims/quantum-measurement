// Copyright 2024, University of Colorado Boulder

/**
 * ParticleRays contains the data for the particle ray paths in the UI.
 *
 * All possible paths are indexed as such:
 * 0 - Source to SG0
 * 1 - SG0 to infinity (top)
 * 2 - SG0 to infinity (bottom)
 * 3 - SG0 to SG1
 * 4 - SG1 to infinity (top)
 * 5 - SG1 to infinity (bottom)
 * 6 - SG1 to SG2
 * 7 - SG2 to infinity (top)
 * 8 - SG2 to infinity (bottom)
 * 9 - SG0 to blocking (top)
 * 10 - SG0 to blocking (bottom)
 *
 * @author Agustín Vallejo
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import ParticleSourceModel from './ParticleSourceModel.js';
import { ParticleWithSpin } from './ParticleWithSpin.js';
import { BLOCKER_OFFSET } from './SpinModel.js';
import SternGerlach from './SternGerlach.js';

type SternGerlachConnection = {
  source?: SternGerlach;
  exit?: 'top' | 'bottom'; // By which hole of the Stern Gerlach the particle is going to exit
  destination: SternGerlach;
};

export default class ParticleRays {

  // Lists of points of the possible allPossiblePaths
  public allPossiblePaths: Vector2[][] = [];
  public activePaths: Vector2[][] = [];

  // Recieves the probabilities of spin-up and stores them. They will control the path opacities
  public pathProbabilities: number[] = [];

  public isShortExperiment = true;

  public constructor( particleSourceModel: ParticleSourceModel, sternGerlachs: SternGerlach[] ) {

    const allConnections: SternGerlachConnection[] = [
      {
        destination: sternGerlachs[ 0 ]
      },
      {
        source: sternGerlachs[ 0 ],
        exit: 'top',
        destination: sternGerlachs[ 1 ]
      },
      {
        source: sternGerlachs[ 0 ],
        exit: 'bottom',
        destination: sternGerlachs[ 2 ]
      }
    ];

    this.allPossiblePaths = [ [
      particleSourceModel.exitPositionProperty.value,
      sternGerlachs[ 0 ].entrancePositionProperty.value
    ] ];

    const extendExits = ( sternGerlach: SternGerlach, extension: Vector2 ) => {
      // Creates a pair of vectors from the exit to extension and adds them to allPossiblePaths
      this.allPossiblePaths.push( [ sternGerlach.topExitPositionProperty.value, sternGerlach.topExitPositionProperty.value.plus( extension ) ] );
      this.allPossiblePaths.push( [ sternGerlach.bottomExitPositionProperty.value, sternGerlach.bottomExitPositionProperty.value.plus( extension ) ] );
    };

    allConnections.forEach( ( connection, index ) => {
      const source = connection.source;
      const destination = connection.destination;

      // If there is a source, connect the source and destination
      if ( source ) {
        const initialPoint = connection.exit === 'top' ?
                             source.topExitPositionProperty.value : source.bottomExitPositionProperty.value;
        this.allPossiblePaths.push( [ initialPoint, destination.entrancePositionProperty.value ] );
      }

      extendExits( destination, new Vector2( 10, 0 ) );
    } );

    // Add the two paths that go into blocking
    extendExits( sternGerlachs[ 0 ], BLOCKER_OFFSET );
  }

  public updateExperiment(): void {
    this.activePaths = this.isShortExperiment ?
                       [ this.allPossiblePaths[ 0 ], this.allPossiblePaths[ 1 ], this.allPossiblePaths[ 2 ] ] :
                       [ this.allPossiblePaths[ 0 ], ...this.allPossiblePaths.slice( 3, this.allPossiblePaths.length ) ];
  }

  public assignRayToParticle( particle: ParticleWithSpin ): void {
    if ( this.isShortExperiment ) {
      particle.path = [
        ...this.allPossiblePaths[ 0 ], // Source to SG0
        ...this.allPossiblePaths[ particle.isSpinUp[ 1 ] ? 1 : 2 ] // SG0 to infinity
      ];
    }
    else {
      particle.path = [
        ...this.allPossiblePaths[ 0 ], // Source to SG0
        ...this.allPossiblePaths[ particle.isSpinUp[ 1 ] ? 3 : 6 ], // SG0 to SG1 or SG2
        ...this.allPossiblePaths[ 4 + ( particle.isSpinUp[ 1 ] ? 0 : 3 ) + ( particle.isSpinUp[ 2 ] ? 0 : 1 ) ] // SG1 or SG2 to infinity
      ];
    }

    particle.updateSpeed();
  }

  public reset(): void {
    this.pathProbabilities = [];
  }
}

quantumMeasurement.register( 'ParticleRays', ParticleRays );