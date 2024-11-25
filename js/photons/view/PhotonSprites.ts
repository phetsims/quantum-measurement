// Copyright 2024, University of Colorado Boulder

/**
 * PhotonSprites is a class that can be used to perform high-performance rendering of a set of photons.  It uses
 * scenery's Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'.
 *
 * Understanding this implementation requires an understanding of the scenery Sprites API. In a nutshell: Sprites has an
 * array of Sprite and an array of SpriteInstance. The array of Sprite is the complete unique set of images used to
 * render all SpriteInstances. Each SpriteInstance has a reference to a Sprite (which determines what it looks like) and
 * a Matrix3 (which determines how it's transformed).  At each model step, the positions of the PhotonInstance instances
 * are updated by adjusting their matrix, and then invalidatePaint is called to re-render the sprites.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../../scenery/js/imports.js';
import greenPhoton_png from '../../../images/greenPhoton_png.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon from '../model/Photon.js';

// constants
const TARGET_PHOTON_IMAGE_WIDTH = 10; // in screen coords, empirically determined to match the design

export default class PhotonSprites extends Sprites {

  private readonly spriteInstances: SpriteInstance[];
  private readonly photons: Photon[];
  private readonly modelViewTransform: ModelViewTransform2;

  // The scale value used to render the photons.
  private readonly photonScale: number;

  // The sprite used to render the photons
  private readonly photonSprite: Sprite;

  public constructor( photons: Photon[], modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {

    // Create the sprite that will be used to represent the photons.
    const photonSprite = new Sprite( new SpriteImage(
      greenPhoton_png,
      new Vector2( greenPhoton_png.width / 2, greenPhoton_png.height / 2 ),
      { pickable: false }
    ) );

    // array of sprite instances, there will be one for each photon that is rendered
    const spriteInstances: SpriteInstance[] = [];

    super( {
      sprites: [ photonSprite ],
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false,
      canvasBounds: canvasBounds
    } );

    // Calculate the scale that will be used to render the photon images.
    this.photonScale = TARGET_PHOTON_IMAGE_WIDTH / greenPhoton_png.width;
    assert && assert(
    this.photonScale > 0 && this.photonScale < 100,
      `photon scale factor not reasonable: ${this.photonScale}`
    );

    // local variables needed for the methods
    this.spriteInstances = spriteInstances;
    this.photons = photons;
    this.modelViewTransform = modelViewTransform;
    this.photonSprite = photonSprite;
  }

  /**
   * Update the information needed to render the photons as sprites and then trigger a re-rendering.
   */
  public update(): void {

    let numberOfPhotonsDisplayed = 0;

    for ( let i = 0; i < this.photons.length; i++ ) {

      // Convenience constants.
      const photon = this.photons[ i ];
      const photonPosition = photon.positionProperty.value;

      // Only display active photons.
      if ( photon.activeProperty.value ) {

        numberOfPhotonsDisplayed++;

        // Add a new sprite instance to our list if we don't have enough.
        if ( numberOfPhotonsDisplayed > this.spriteInstances.length ) {
          const newSpriteInstance = SpriteInstance.pool.fetch();
          newSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
          this.spriteInstances.push( newSpriteInstance );
        }

        // Update the matrix that controls where this photon is rendered.
        const spriteInstance = this.spriteInstances[ numberOfPhotonsDisplayed - 1 ];
        spriteInstance.sprite = this.photonSprite;
        spriteInstance.matrix.setToAffine(
          this.photonScale,
          0,
          this.modelViewTransform.modelToViewX( photonPosition.x ),
          0,
          this.photonScale,
          this.modelViewTransform.modelToViewY( photonPosition.y )
        );
      }
    }

    // Free up any unused sprite instances.
    while ( this.spriteInstances.length > numberOfPhotonsDisplayed ) {
      const unusedSpriteInstance = this.spriteInstances.pop();
      unusedSpriteInstance && unusedSpriteInstance.freeToPool();
    }

    // Trigger a re-rendering of the sprites.
    this.invalidatePaint();
  }
}

quantumMeasurement.register( 'PhotonSprites', PhotonSprites );