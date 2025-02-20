// Copyright 2024, University of Colorado Boulder

/**
 * MultipleParticleCollection handles the nuances of the continuous mode, where particles are created at a certain rate.
 *
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ParticleCollection } from './ParticleCollection.js';
import SpinModel from './SpinModel.js';

const MAX_PARTICLE_CREATION_RATE = 5; // max rate of particles created per second

export class MultipleParticleCollection extends ParticleCollection {

  // The fractional accumulator for the emission rate, which is used to determine how many particles to create each step.
  private fractionalEmissionAccumulator = 0;

  public constructor(
    model: SpinModel,
    maxParticles: number,
    tandem: Tandem
  ) {
    super( model, maxParticles, tandem );
  }

  private shootMultipleParticles(): void {

    // Calculate the number of particles to produce in this time step based on the particle amount property, the max
    // creation rate, and the time step. This could include a fractional amount.
    const particlesToCreate = this.model.particleSourceModel.particleAmountProperty.value * MAX_PARTICLE_CREATION_RATE;

    // Calculate the whole number to actually activate, and use the fractional accumlator in the process.
    let wholeParticlesToCreate = Math.floor( particlesToCreate );

    this.fractionalEmissionAccumulator += particlesToCreate - wholeParticlesToCreate;

    if ( this.fractionalEmissionAccumulator >= 1 ) {
      wholeParticlesToCreate++;
      this.fractionalEmissionAccumulator -= 1;
    }

    // Activate the particles.
    for ( let i = 0; i < wholeParticlesToCreate; i++ ) {
      if ( this.particles.length < this.maxParticles ) {
        this.createParticle();
      }
    }
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    super.step( dt );

    // Generates the stream of particles. They are activated, not created, as they are already created at construction.
    this.shootMultipleParticles();

    // Step all active particles, and deactivate them if they cross the exit blocker position, and step them
    // normally if not.
    this.particles.forEach( particle => {
      particle.step( dt );
      this.decideParticleDestiny( particle );
    } );
  }
}


quantumMeasurement.register( 'MultipleParticleCollection', MultipleParticleCollection );