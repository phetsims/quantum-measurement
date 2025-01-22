// Copyright 2024, University of Colorado Boulder

/**
 * ParticleSprites is a class that can be used to perform high-performance rendering of a set of particles.  It uses
 * scenery's Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'.
 *
 * Understanding this implementation requires an understanding of the scenery Sprites API. In a nutshell: Sprites has an
 * array of Sprite and an array of SpriteInstance. The array of Sprite is the complete unique set of images used to
 * render all SpriteInstances. Each SpriteInstance has a reference to a Sprite (which determines what it looks like) and
 * a Matrix3 (which determines how it's transformed).  At each model step, the positions of the ParticleInstance instances
 * are updated by adjusting their matrix, and then invalidatePaint is called to re-render the sprites.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { ParticleWithSpin } from '../model/ParticleWithSpin.js';

export default class ParticleSprites extends Sprites {

  private readonly spriteInstances: SpriteInstance[];
  private readonly particles: ParticleWithSpin[];
  private readonly modelViewTransform: ModelViewTransform2;

  // The sprite used to render the particles
  private particleSprite: Sprite | null = null;

  public constructor( particles: ParticleWithSpin[], modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {

    // array of sprite instances, there will be one for each particle that is rendered
    const spriteInstances: SpriteInstance[] = [];

    super( {
      sprites: [],
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false,
      canvasBounds: canvasBounds
    } );

    let particleSprite: Sprite;
    new ShadedSphereNode( 15, {
      mainColor: QuantumMeasurementColors.particleColorProperty,
      highlightColor: 'white'
    } ).toCanvas( ( canvas, x, y ) => {
      // Create the sprite that will be used to represent the particles.
      particleSprite = new Sprite( new SpriteImage(
        canvas,
        new Vector2( canvas.width / 2, canvas.height / 2 ),
        { pickable: false }
      ) );

      this.mutate( { sprites: [ particleSprite ] } );
      this.particleSprite = particleSprite;

    } );

    // local variables needed for the methods
    this.spriteInstances = spriteInstances;
    this.particles = particles;
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Update the information needed to render the particles as sprites and then trigger a re-rendering.
   */
  public update(): void {

    let numberOfParticlesDisplayed = 0;

    for ( let i = 0; i < this.particles.length; i++ ) {

      const particle = this.particles[ i ];

      numberOfParticlesDisplayed++;

      // Add a new sprite instance to our list if we don't have enough.
      if ( numberOfParticlesDisplayed > this.spriteInstances.length ) {
        const newSpriteInstance = SpriteInstance.pool.fetch();
        newSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
        this.spriteInstances.push( newSpriteInstance );
      }

      // Update the matrix that controls where this particle is rendered.
      const spriteInstance = this.spriteInstances[ numberOfParticlesDisplayed - 1 ];
      spriteInstance.sprite = this.particleSprite;
      spriteInstance.matrix.setToAffine(
        1,
        0,
        this.modelViewTransform.modelToViewX( particle.position.x ),
        0,
        1,
        this.modelViewTransform.modelToViewY( particle.position.y )
      );
    }

    // Free up any unused sprite instances.
    while ( this.spriteInstances.length > numberOfParticlesDisplayed ) {
      const unusedSpriteInstance = this.spriteInstances.pop();
      unusedSpriteInstance && unusedSpriteInstance.freeToPool();
    }

    // Trigger a re-rendering of the sprites.
    this.invalidatePaint();
  }
}

quantumMeasurement.register( 'ParticleSprites', ParticleSprites );