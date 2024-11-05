// Copyright 2024, University of Colorado Boulder

/**
 * ManyParticlesCanvasNode handles the ray of particles shot by the particle source.
 *
 * @author Agustín Vallejo
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ParticleWithSpin } from '../model/ParticleWithSpin.js';

const debug = false;

export default class ManyParticlesCanvasNode extends CanvasNode {

  public constructor(
    private readonly particles: ParticleWithSpin[],
    private readonly modelViewTransform: ModelViewTransform2,
    layoutBounds: Bounds2,
    providedOptions?: CanvasNodeOptions
  ) {
    super( providedOptions );

    this.setCanvasBounds( layoutBounds );
  }

  /**
   * Paints the grid lines on the canvas node.
   */
  public paintCanvas( context: CanvasRenderingContext2D ): void {
    //If the debug flag is enabled, it will show the bounds of the canvas
    if ( debug ) {
      context.fillStyle = 'rgba(50,50,50,0.5)';
      context.fillRect( 0, 0, this.bounds.maxX, this.bounds.maxY );
    }

    context.fillStyle = 'magenta';
    for ( let i = 0; i < this.particles.length; i++ ) {
      const position = this.modelViewTransform.modelToViewPosition( this.particles[ i ].positionProperty.value );
      context.fillRect( position.x, position.y, 2, 2 );
    }
  }

  public step(): void {
    this.invalidatePaint();
  }
}

quantumMeasurement.register( 'ManyParticlesCanvasNode', ManyParticlesCanvasNode );