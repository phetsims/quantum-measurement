// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonsScreen constructs both the model and the view for the "Photons" screen in the sim.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Vector2 from '../../../dot/js/Vector2.js';
import ScreenIcon, { MINIMUM_HOME_SCREEN_ICON_SIZE } from '../../../joist/js/ScreenIcon.js';
import Shape from '../../../kite/js/Shape.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Line from '../../../scenery/js/nodes/Line.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../tandem/js/Tandem.js';
import greenPhoton_png from '../../images/greenPhoton_png.js';
import QuantumMeasurementColors from '../common/QuantumMeasurementColors.js';
import QuantumMeasurementKeyboardHelpContent from '../common/view/QuantumMeasurementKeyboardHelpContent.js';
import QuantumMeasurementScreen from '../common/view/QuantumMeasurementScreen.js';
import quantumMeasurement from '../quantumMeasurement.js';
import QuantumMeasurementStrings from '../QuantumMeasurementStrings.js';
import PhotonsModel from './model/PhotonsModel.js';
import PhotonsScreenView from './view/PhotonsScreenView.js';

export default class PhotonsScreen extends QuantumMeasurementScreen<PhotonsModel, PhotonsScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: QuantumMeasurementStrings.screen.photonsStringProperty,
      homeScreenIcon: createScreenIcon(),
      createKeyboardHelpNode: () => new QuantumMeasurementKeyboardHelpContent( { includeTimeControlsKeyboardHelp: true } ),
      // TODO: Fill this in with the real help text, see https://github.com/phetsims/quantum-measurement/issues/124
      screenButtonsHelpText: 'fill me in',

      // Limit the max time step to 2x the nominal value.  This helps prevent add photon movements after screen changes.
      maxDT: 1 / 30,

      tandem: tandem
    };

    super(
      () => new PhotonsModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new PhotonsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * A standalone photon (doesn't need a model) for use in the screen icon.
 */
class StandalonePhotonNode extends Node {

  public static readonly RADIUS = 30;

  public constructor( center: Vector2 ) {
    const interiorNode = new Image( greenPhoton_png, {
      center: Vector2.ZERO
    } );
    const exteriorNode = new Circle( greenPhoton_png.width / 2, {
      stroke: QuantumMeasurementColors.photonBaseColorProperty,
      lineWidth: 4
    } );
    super( {
      children: [ exteriorNode, interiorNode ],
      scale: StandalonePhotonNode.RADIUS * 2 / interiorNode.width,
      center: center
    } );
  }
}

/**
 * A standalone beam splitter (doesn't need a model) for use in the screen icon.
 */
class StandaloneBeamSplitterNode extends Node {

  public static readonly LENGTH = 200;

  public constructor( center: Vector2 ) {
    const enclosure = new Rectangle( 0, 0, StandaloneBeamSplitterNode.LENGTH, StandaloneBeamSplitterNode.LENGTH, {
      fill: QuantumMeasurementColors.splitterEnclosureNodeFillColorProperty
    } );
    const splitterLine = new Line( 0, StandaloneBeamSplitterNode.LENGTH, StandaloneBeamSplitterNode.LENGTH, 0, {
      stroke: QuantumMeasurementColors.splitterLineNodeFillColorProperty,
      lineWidth: 10,
      lineCap: 'butt'
    } );
    super( {
      children: [ enclosure, splitterLine ],
      center: center,
      opacity: 0.75
    } );
  }
}

/**
 * Create the icons that will be used for the home screen and navigation bar.
 */
const createScreenIcon = (): ScreenIcon => {

  const size = MINIMUM_HOME_SCREEN_ICON_SIZE;

  const background = new Rectangle( {
      rectSize: size,
      fill: QuantumMeasurementColors.screenBackgroundColorProperty
    }
  );

  const iconNode = new Node( {
    children: [
      background,
      new StandaloneBeamSplitterNode( new Vector2( size.width / 2, size.height / 2 ) ),

      // Photons, positioned around the beam splitter based on the spec, see #88.
      new StandalonePhotonNode( new Vector2( size.width * 0.1, size.height / 2 ) ),
      new StandalonePhotonNode( new Vector2( size.width * 0.3, size.height / 2 ) ),
      new StandalonePhotonNode( new Vector2( size.width / 2, size.height * 0.3 ) ),
      new StandalonePhotonNode( new Vector2( size.width / 2, 0 ) ),
      new StandalonePhotonNode( new Vector2( size.width * 0.7, size.height / 2 ) ),
      new StandalonePhotonNode( new Vector2( size.width * 0.9, size.height / 2 ) )
    ],
    clipArea: Shape.bounds( background.bounds )
  } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 1,
    maxIconHeightProportion: 1,
    fill: QuantumMeasurementColors.screenBackgroundColorProperty
  } );
};

quantumMeasurement.register( 'PhotonsScreen', PhotonsScreen );