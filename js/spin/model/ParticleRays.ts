// Copyright 2024, University of Colorado Boulder

/**
 * ParticleRays contains the data for the particle ray paths in the UI.
 *
 * @author Agustín Vallejo
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class ParticleRays {

  // Lists of points of the possible rays
  public raysPoints: Vector2[][] = [];

  // Recieves the probabilities of spin-up and stores them. They will control the path opacities
  public pathProbabilities: number[] = [];

  public readonly probabilitiesUpdatedEmitter = new Emitter();

  public constructor() {
    // no-op
  }

  public updateRays( raysPoints: Vector2[][] ): void {
    this.raysPoints = raysPoints;
  }

  public updateProbabilities( probabilities: number[] ): void {
    this.pathProbabilities = probabilities;
    this.probabilitiesUpdatedEmitter.emit();
  }
}

quantumMeasurement.register( 'ParticleRays', ParticleRays );