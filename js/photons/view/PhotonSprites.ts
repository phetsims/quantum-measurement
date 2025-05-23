// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonSprites is a class that can be used to perform high-performance rendering of a set of photons. It uses
 * scenery's Sprites feature, which uses renderer:'webgl', with a fallback of 'canvas'. The photons support multiple
 * position states to allow for rendering the probability of a photon being in different positions. To support this,
 * the photons are rendered with a solid exterior and an interior that varies in opacity based on the probability of the
 * photon being in that position.
 *  *
 * Understanding this implementation requires an understanding of the scenery Sprites API. In a nutshell: Sprites has an
 * array of Sprite and an array of SpriteInstance. The array of Sprite is the complete unique set of images used to
 * render all SpriteInstances. Each SpriteInstance has a reference to a Sprite (which determines what it looks like) and
 * a Matrix3 (which determines how it's transformed). At each model step, the positions of the PhotonInstance instances
 * are updated by adjusting their matrix, and then invalidatePaint is called to re-render the sprites.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Sprites from '../../../../scenery/js/nodes/Sprites.js';
import Sprite from '../../../../scenery/js/util/Sprite.js';
import SpriteImage from '../../../../scenery/js/util/SpriteImage.js';
import SpriteInstance, { SpriteInstanceTransformType } from '../../../../scenery/js/util/SpriteInstance.js';
import greenPhoton_png from '../../../images/greenPhoton_png.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon from '../model/Photon.js';

class PhotonSprites extends Sprites {

  private readonly spriteInstances: SpriteInstance[];
  private readonly photons: Photon[];
  private readonly modelViewTransform: ModelViewTransform2;

  // The scale value used to render the photon.
  private readonly photonScale: number;

  // The sprites used to render the photons.
  private readonly photonInteriorSprite: Sprite;
  private photonOutlineSprite: Sprite | null = null;

  public static readonly TARGET_PHOTON_VIEW_RADIUS = 5; // in screen coords, empirically determined to match the design

  public constructor( photons: Photon[], modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {

    // array of sprite instances, there will be two for each photon that is rendered
    const spriteInstances: SpriteInstance[] = [];

    // Invoke the superclass constructor with no sprites because creating some of the sprites is an asynchronous
    // process. The sprites are added below.
    super( {
      sprites: [],
      spriteInstances: spriteInstances,
      renderer: 'webgl',
      pickable: false,
      canvasBounds: canvasBounds
    } );

    // Create the sprite for the interior of the photons.
    this.photonInteriorSprite = new Sprite( new SpriteImage(
      greenPhoton_png,
      new Vector2( greenPhoton_png.width / 2, greenPhoton_png.height / 2 ),
      { pickable: false }
    ) );

    // Calculate the scale that will be used to render the photon.
    this.photonScale = PhotonSprites.TARGET_PHOTON_VIEW_RADIUS / ( greenPhoton_png.width / 2 );

    assert && assert(
      ( this.photonScale > 0 && this.photonScale < 100 ),
      `photon scale factor not reasonable: ${this.photonScale}`
    );

    // Create the photon outline sprite based on the color in the color profile.
    QuantumMeasurementColors.photonStrokeProperty.link( color => {

      // Create the circle that will be used to render the outline of the photon.
      const photonOutlineCircle = new Circle( greenPhoton_png.width / 2, {
        stroke: color,
        lineWidth: greenPhoton_png.width / 10
      } );

      // Create the sprite for the photon outline by rendering the circle to a canvas and then creating a sprite from that
      // canvas.  Since rendering the circle to a canvas is an asynchronous process, we need to wait for it to complete
      // before adding the sprites.
      photonOutlineCircle.toCanvas( canvas => {
        this.photonOutlineSprite = new Sprite( new SpriteImage(
          canvas,
          new Vector2( canvas.width / 2, canvas.height / 2 ),
          { pickable: false }
        ) );
        this.mutate( { sprites: [ this.photonInteriorSprite, this.photonOutlineSprite ] } );
      } );
    } );

    // local variables needed for the methods
    this.spriteInstances = spriteInstances;
    this.photons = photons;
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Update the information needed to render the photons as sprites and then trigger a re-rendering.
   */
  public update(): void {

    // Skip rendering and issue a warning if the photon sprites have not been created yet.
    if ( !this.photonOutlineSprite ) {
      console.warn( 'PhotonSprites.update() called before photon sprites have been created.' );
      return;
    }

    let numberOfPhotonsDisplayed = 0;

    for ( let i = 0; i < this.photons.length; i++ ) {

      const photon = this.photons[ i ];

      // Iterate over the photon motion states.
      for ( const photonMotionState of photon.possibleMotionStates ) {

        if ( photonMotionState.probability > 0 ) {
          numberOfPhotonsDisplayed++;
          const photonStatePosition = photonMotionState.position;

          // Add new sprite instances to our list if we don't have enough.  There are two sprite instances per photon
          // state, one for the interior and one for the outline.
          if ( numberOfPhotonsDisplayed * 2 > this.spriteInstances.length ) {

            const newInteriorSpriteInstance = SpriteInstance.pool.fetch();
            newInteriorSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
            this.spriteInstances.push( newInteriorSpriteInstance );

            const newOutlineSpriteInstance = SpriteInstance.pool.fetch();
            newOutlineSpriteInstance.transformType = SpriteInstanceTransformType.AFFINE;
            this.spriteInstances.push( newOutlineSpriteInstance );
          }

          const xPos = this.modelViewTransform.modelToViewX( photonStatePosition.x );
          const yPos = this.modelViewTransform.modelToViewY( photonStatePosition.y );
          const scale = this.photonScale;

          // Update the matrix and opacity for the photon interior.
          const interiorSpriteInstance = this.spriteInstances[ ( numberOfPhotonsDisplayed - 1 ) * 2 ];
          interiorSpriteInstance.sprite = this.photonInteriorSprite;
          interiorSpriteInstance.matrix.setToAffine( scale, 0, xPos, 0, scale, yPos );
          interiorSpriteInstance.alpha = photonMotionState.probability; // probability-based opacity

          // Update the matrix for the photon outline.
          const outlineSpriteInstance = this.spriteInstances[ ( numberOfPhotonsDisplayed - 1 ) * 2 + 1 ];
          outlineSpriteInstance.sprite = this.photonOutlineSprite;
          outlineSpriteInstance.matrix.setToAffine( scale, 0, xPos, 0, scale, yPos );
          outlineSpriteInstance.alpha = 1; // always fully opaque
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

export default PhotonSprites;