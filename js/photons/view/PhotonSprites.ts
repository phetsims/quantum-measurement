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
import greenPhotonOutline_png from '../../../images/greenPhotonOutline_png.js';
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

  // The sprites used to render the photons.
  private readonly photonSprite: Sprite;
  private readonly photonOutlineSprite: Sprite;

  public constructor( photons: Photon[], modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {

    // Create the sprites that will be used to represent the photons.
    const photonSprite = new Sprite( new SpriteImage(
      greenPhoton_png,
      new Vector2( greenPhoton_png.width / 2, greenPhoton_png.height / 2 ),
      { pickable: false }
    ) );

    const photonOutlineSprite = new Sprite( new SpriteImage(
      greenPhotonOutline_png,
      new Vector2( greenPhotonOutline_png.width / 2, greenPhotonOutline_png.height / 2 ),
      { pickable: false }
    ) );

    // array of sprite instances, there will be two for each photon that is rendered
    const spriteInstances: SpriteInstance[] = [];

    super( {
      sprites: [ photonSprite, photonOutlineSprite ],
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
    this.photonOutlineSprite = photonOutlineSprite;
  }

  /**
   * Update the information needed to render the photons as sprites and then trigger a re-rendering.
   */
  public update(): void {

    let numberOfPhotonsDisplayed = 0;

    for ( let i = 0; i < this.photons.length; i++ ) {

      const photon = this.photons[ i ];

      // Iterate over the photon motion states.
      for ( const photonMotionState of photon.possibleMotionStates ) {

        if ( photonMotionState.probability > 0 ) {
          numberOfPhotonsDisplayed++;
          const photonStatePosition = photonMotionState.position;

          // Add new sprite instances to our list if we don't have enough.
          if ( numberOfPhotonsDisplayed * 2 > this.spriteInstances.length ) {

            const newInteriorSpriteInstance = SpriteInstance.pool.fetch();
            newInteriorSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
            this.spriteInstances.push( newInteriorSpriteInstance );

            const newOutlineSpriteInstance = SpriteInstance.pool.fetch();
            newOutlineSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
            this.spriteInstances.push( newOutlineSpriteInstance );
          }

          // Update the matrix that controls where this photon is rendered.
          const interiorSpriteInstance = this.spriteInstances[ ( numberOfPhotonsDisplayed - 1 ) * 2 ];
          interiorSpriteInstance.sprite = this.photonSprite;
          interiorSpriteInstance.matrix.setToAffine(
            this.photonScale,
            0,
            this.modelViewTransform.modelToViewX( photonStatePosition.x ),
            0,
            this.photonScale,
            this.modelViewTransform.modelToViewY( photonStatePosition.y )
          );
          interiorSpriteInstance.alpha = photonMotionState.probability; // Probability based opacity
          // interiorSpriteInstance.alpha = Math.pow( photonMotionState.probability, 1.25 ); // Probability based opacity

          const outlineSpriteInstance = this.spriteInstances[ ( numberOfPhotonsDisplayed - 1 ) * 2 + 1 ];
          outlineSpriteInstance.sprite = this.photonOutlineSprite;
          outlineSpriteInstance.matrix.setToAffine(
            this.photonScale,
            0,
            this.modelViewTransform.modelToViewX( photonStatePosition.x ),
            0,
            this.photonScale,
            this.modelViewTransform.modelToViewY( photonStatePosition.y )
          );
          outlineSpriteInstance.alpha = 1;
        }
      }
    }

    // Free up any unused sprite instances.
    while ( this.spriteInstances.length > numberOfPhotonsDisplayed * 2 ) {
      const unusedSpriteInstance = this.spriteInstances.pop();
      unusedSpriteInstance && unusedSpriteInstance.freeToPool();
    }

    // Trigger a re-rendering of the sprites.
    this.invalidatePaint();
  }
}

quantumMeasurement.register( 'PhotonSprites', PhotonSprites );