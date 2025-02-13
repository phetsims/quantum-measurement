// Copyright 2024-2025, University of Colorado Boulder

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

  public constructor( model: SpinModel,
                      maxParticles: number,
                      tandem: Tandem ) {
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
      const behindMeasurementDevice: boolean[] = this.model.measurementDevices.map( device => device.isParticleBehind( particle.position ) );

      particle.step( dt );
      this.decideParticleDestiny( particle );

      // If the particle crosses a measurement device, we update the device
      this.model.measurementDevices.forEach( ( device, index ) => {
        if ( behindMeasurementDevice[ index ] && !device.isParticleBehind( particle.position ) ) {
          device.measurementEmitter.emit();
          device.spinStateProperty.value = particle.spinVectors[ index ];
          // particle.stageCompleted[ index ] = true;
        }
      } );
    } );
  }
}


quantumMeasurement.register( 'SingleParticleCollection', SingleParticleCollection );