// Copyright 2024-2025, University of Colorado Boulder

/**
 * ManyParticlesCanvasNode displays the rays of particles shot by the particle source.
 *
 * @author Agustín Vallejo
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ParticleWithSpin } from '../model/ParticleWithSpin.js';

export default class ManyParticlesCanvasNode extends CanvasNode {

  public constructor( private readonly particles: ParticleWithSpin[],
                      private readonly modelViewTransform: ModelViewTransform2,
                      layoutBounds: Bounds2,
                      providedOptions?: CanvasNodeOptions ) {

    super( providedOptions );

    this.setCanvasBounds( layoutBounds );
  }

  /**
   * Paints the grid lines on the canvas node.
   */
  public paintCanvas( context: CanvasRenderingContext2D ): void {

    context.fillStyle = QuantumMeasurementColors.particleColorProperty.value.toCSS();
    for ( let i = 0; i < this.particles.length; i++ ) {
      const position = this.modelViewTransform.modelToViewPosition( this.particles[ i ].position );
      context.fillRect( position.x, position.y, 2, 2 );
    }
  }

  public step(): void {
    this.invalidatePaint();
  }
}

quantumMeasurement.register( 'ManyParticlesCanvasNode', ManyParticlesCanvasNode );