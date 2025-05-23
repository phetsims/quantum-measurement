// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonTestingArea is a view element that contains all the components for production, reflecting, and detecting
 * photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
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
      tandem: providedOptions.tandem.createTandem( 'laserNode' ),
      phetioFeatured: true
    } );

    const photonBehaviorControlTandem = providedOptions.tandem.createTandem( 'photonBehaviorControl' );
    const photonBehaviorModeRadioButtonGroup = new AquaRadioButtonGroup<SystemType>(
      model.photonBehaviorModeProperty,
      SystemType.enumeration.values.map( behaviorMode => {
          return {
            value: behaviorMode,
            createNode: () => new Text(
              behaviorMode.testingName,
              { font: QuantumMeasurementConstants.CONTROL_FONT, maxWidth: 100 }
            ),
            tandemName: `${behaviorMode.tandemName}RadioButton`,
            phetioVisiblePropertyInstrumented: false
          };
        }
      ),
      {
        spacing: 10,
        tandem: photonBehaviorControlTandem.createTandem( 'photonBehaviorModeRadioButtonGroup' ),
        phetioVisiblePropertyInstrumented: false,
        visiblePropertyOptions: {
          phetioFeatured: true
        }
      }
    );
    const photonBehaviorModeBox = new VBox( {
      spacing: 10,
      align: 'left',
      left: laserNode.left,
      bottom: laserNode.top - 15,
      tandem: photonBehaviorControlTandem,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      accessibleName: QuantumMeasurementStrings.a11y.photonsScreen.photonBehaviorModeStringProperty,
      tagName: 'div',
      children: [
        new Text( QuantumMeasurementStrings.behaviorStringProperty, {
          font: QuantumMeasurementConstants.BOLD_TITLE_FONT,
          maxWidth: 150
        } ),
        photonBehaviorModeRadioButtonGroup
      ]
    } );

    const verticalPolarizationDetectorNode = new PhotonDetectorNode(
      model.verticalPolarizationDetector,
      photonTestingAreaModelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'verticalPolarizationDetectorNode' ),
        phetioFeatured: true
      }
    );
    const horizontalPolarizationDetectorNode = new PhotonDetectorNode(
      model.horizontalPolarizationDetector,
      photonTestingAreaModelViewTransform, {
        tandem: providedOptions.tandem.createTandem( 'horizontalPolarizationDetectorNode' ),
        phetioFeatured: true
      }
    );

    const polarizingBeamSplitterNode = new PolarizingBeamSplitterNode(
      model.polarizingBeamSplitter,
      photonTestingAreaModelViewTransform
    );

    const mirror = new MirrorNode( model.mirror, photonTestingAreaModelViewTransform );

    const options = optionize<PhotonTestingAreaOptions, SelfOptions, NodeOptions>()( {
      children: [
        photonBehaviorModeBox,
        laserNode,
        polarizingBeamSplitterNode,
        verticalPolarizationDetectorNode,
        horizontalPolarizationDetectorNode,
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

    this.pdomOrder = [
      laserNode,
      photonBehaviorModeBox
    ];
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