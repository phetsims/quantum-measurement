// Copyright 2024, University of Colorado Boulder

/**
 * PhotonTestingArea is a view element that contains all the components for production, reflecting, and detecting
 * photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import { SystemType, SystemTypeValues } from '../../common/model/SystemType.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
import LaserNode from './LaserNode.js';
import MirrorNode from './MirrorNode.js';
import PhotonDetectorNode from './PhotonDetectorNode.js';
import PhotonSprites from './PhotonSprites.js';
import PolarizingBeamSplitterNode from './PolarizingBeamSplitterNode.js';

type SelfOptions = EmptySelfOptions;
type PhotonTestingAreaOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

class PhotonTestingArea extends Node {

  private readonly photonSprites: PhotonSprites;

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonTestingAreaOptions ) {

    // Create the model-view transform that will be used for this node.  This maps the point (0,0) in the model to the
    // center of this node.  It also inverts the y-axis so that the positive y-axis points up.  The scale factor is
    // empirically determined.
    const photonTestingAreaModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      Vector2.ZERO,
      640 // scale - empirically determined
    );

    const laserNode = new LaserNode( model.laser, photonTestingAreaModelViewTransform, {
      tandem: providedOptions.tandem.createTandem( 'laserNode' )
    } );

    // TODO: See https://github.com/phetsims/quantum-measurement/issues/68.  This selector was added to allow designers
    //       to compare the behavior for classical versus quantum systems.  It may be removed in the future.
    const particleBehaviorModeRadioButtonGroupTandem = providedOptions.tandem.createTandem( 'particleBehaviorModeRadioButtonGroup' );
    const particleBehaviorModeRadioButtonGroup = new AquaRadioButtonGroup<SystemType>(
      model.particleBehaviorModeProperty as PhetioProperty<SystemType>,
      SystemTypeValues.map( behaviorMode => {

          const nameProperty = behaviorMode === 'classical' ?
                               QuantumMeasurementStrings.classicalStringProperty :
                               QuantumMeasurementStrings.quantumStringProperty;

          const tandemRootName = behaviorMode === 'classical' ? 'classical' : 'quantum';
          const tandemName = `${tandemRootName}RadioButton`;

          return {
            value: behaviorMode,
            createNode: () => new Text(
              nameProperty,
              { font: new PhetFont( 15 ) }
            ),
            tandemName: tandemName,
            phetioVisiblePropertyInstrumented: false
          };
        }
      ),
      {
        spacing: 10,
        left: laserNode.left,
        bottom: laserNode.top - 20,
        tandem: particleBehaviorModeRadioButtonGroupTandem,
        phetioFeatured: true
      }
    );

    const verticalPolarizationDetector = new PhotonDetectorNode(
      model.verticalPolarizationDetector,
      photonTestingAreaModelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'verticalPolarizationDetector' )
      }
    );
    const horizontalPolarizationDetector = new PhotonDetectorNode(
      model.horizontalPolarizationDetector,
      photonTestingAreaModelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'horizontalPolarizationDetector' )
      }
    );

    const polarizingBeamSplitterNode = new PolarizingBeamSplitterNode(
      model.polarizingBeamSplitter,
      photonTestingAreaModelViewTransform
    );

    const mirror = new MirrorNode( model.mirror, photonTestingAreaModelViewTransform );

    const options = optionize<PhotonTestingAreaOptions, SelfOptions, NodeOptions>()( {
      children: [
        particleBehaviorModeRadioButtonGroup,
        laserNode,
        polarizingBeamSplitterNode,
        verticalPolarizationDetector,
        horizontalPolarizationDetector,
        mirror
      ]
    }, providedOptions );

    super( options );

    // Add the sprites for the photons after calling the super constructor so that we can use the bounds to set the
    // canvas size.
    this.photonSprites = new PhotonSprites(
      model.photonCollection.photons,
      photonTestingAreaModelViewTransform,
      this.localBounds.copy()
    );
    this.addChild( this.photonSprites );
    this.photonSprites.moveToBack();
  }

  /**
   * Updates the view.  For this particular node, this means updating the photon sprites.
   */
  public update(): void {
    this.photonSprites.update();
  }
}

quantumMeasurement.register( 'PhotonTestingArea', PhotonTestingArea );
export default PhotonTestingArea;