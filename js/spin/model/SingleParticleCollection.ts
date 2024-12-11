// Copyright 2024, University of Colorado Boulder

/**
 * SingleParticleCollection is handles the behavior of particles in the single shooting mode.
 *
 * @author Agustín Vallejo
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ParticleCollection } from './ParticleCollection.js';
import SpinModel from './SpinModel.js';

export class SingleParticleCollection extends ParticleCollection {

  public constructor(
    model: SpinModel,
    maxParticles: number,
    tandem: Tandem
  ) {
    super( model, maxParticles, tandem );
  }

  public shootSingleParticle(): void {
    this.createParticle();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    super.step( dt );

    // Moves single particles and triggers measurements when they pass through Measuring Lines
    this.particles.forEach( particle => {
      const behindMeasurementDevice: boolean[] = this.model.measurementLines.map( line => line.isParticleBehind( particle.position ) );

      particle.step( dt );
      this.decideParticleDestiny( particle );

      // If the particle crosses a measurement line, we update the line
      this.model.measurementLines.forEach( ( line, index ) => {
        if ( behindMeasurementDevice[ index ] && !line.isParticleBehind( particle.position ) ) {
          line.measurementEmitter.emit();
          line.spinStateProperty.value = particle.spinVectors[ index ];
          // particle.stageCompleted[ index ] = true;
        }
      } );
    } );
  }
}


quantumMeasurement.register( 'SingleParticleCollection', SingleParticleCollection );