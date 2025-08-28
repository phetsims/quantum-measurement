// Copyright 2025, University of Colorado Boulder

/**
 * SystemUnderTestNode is a node that show a single atom or multiple atoms in a box where a magnetic field may or may
 * not be present. The node is used to represent the system under test in the quantum measurement simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Animation from '../../../../twixt/js/Animation.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import MeasurementSymbolNode from '../../common/view/MeasurementSymbolNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { SpinMeasurementState } from '../model/SpinMeasurementState.js';
import MagneticFieldNode from './MagneticFieldNode.js';

const ATOM_RADIUS = 18; // in view coordinates
export const ATOM_NODE_OPTIONS = {
  mainColor: Color.RED,
  highlightColor: Color.RED.colorUtilsBrighter( 0.7 )
};
const TITLE_FONT = QuantumMeasurementConstants.TITLE_FONT;

class SystemUnderTestNode extends Panel {

  /**
   * @param magneticFieldEnabledProperty - whether the magnetic field is enabled
   * @param magneticFieldStrengthProperty - the property that indicates the magnetic field strength
   * @param isSingleMeasurementModeProperty - whether the system is in single measurement mode
   * @param measurementStateProperty - the state of the spin measurement
   * @param providedOptions - options for the node, mostly used for positioning if at all
   */
  public constructor( magneticFieldEnabledProperty: TReadOnlyProperty<boolean>,
                      magneticFieldStrengthProperty: NumberProperty,
                      isSingleMeasurementModeProperty: TReadOnlyProperty<boolean>,
                      measurementStateProperty: Property<SpinMeasurementState>,
                      providedOptions?: PanelOptions ) {

    // Set up the title for this node.
    const titleStringProperty = new DerivedProperty(
      [
        isSingleMeasurementModeProperty,
        QuantumMeasurementStrings.atomStringProperty,
        QuantumMeasurementStrings.atomsStringProperty
      ],
      ( ( isSingleMode, atomString, atomsString ) => isSingleMode ? atomString : atomsString )
    );
    const titleNode = new Text( titleStringProperty, { font: TITLE_FONT, maxWidth: 100 } );

    // Create the magnetic field node, which is only visible when the magnetic field is enabled.
    const magneticFieldNode = new MagneticFieldNode( magneticFieldStrengthProperty, measurementStateProperty, {
      visibleProperty: magneticFieldEnabledProperty
    } );

    // Create the single atom node for the single measurement mode.
    const singleSphericalAtomNode = new ShadedSphereNode(
      ATOM_RADIUS,
      combineOptions<ShadedSphereNodeOptions>(
        {
          center: magneticFieldNode.center,
          visibleProperty: isSingleMeasurementModeProperty
        },
        ATOM_NODE_OPTIONS
      )
    );

    // Create the set of atom nodes for the multiple measurement mode. The layout used here is quite specific to the
    // desired number of atoms and will need to be adjusted if that number ever changes.
    const atomRowHBoxes: HBox[] = [];
    _.times( 4, i => {
      const atomNodes: ShadedSphereNode[] = [];
      _.times( 2, () => {
        atomNodes.push( new ShadedSphereNode( ATOM_RADIUS, ATOM_NODE_OPTIONS ) );
      } );
      if ( i % 2 === 0 ) {
        atomNodes.push( new ShadedSphereNode( ATOM_RADIUS, ATOM_NODE_OPTIONS ) );
      }
      atomRowHBoxes.push( new HBox( {
          children: atomNodes,
          spacing: 5
        } )
      );
    } );

    const multipleSphericalAtomNode = new VBox( {
      children: atomRowHBoxes,
      spacing: 10,
      center: magneticFieldNode.center,
      visibleProperty: DerivedProperty.valueEqualsConstant( isSingleMeasurementModeProperty, false )
    } );

    // Create a Node with the magnetic field in the background and the atoms in the foreground.
    const fieldAndAtomsNode = new Node( {
      children: [ magneticFieldNode, singleSphericalAtomNode, multipleSphericalAtomNode ]
    } );

    // Combine the title and the other elements into a single node for the content.
    const titledTestArea = new VBox( {
      children: [ titleNode, fieldAndAtomsNode ],
      spacing: 5,
      resize: false
    } );

    titleNode.localBoundsProperty.link( () => {
      titleNode.centerX = titledTestArea.centerX;
    } );

    // Create an icon that will be used to indicate that a measurement has been made.
    const measurementIconBackground = new Path(
      new Shape(
        QuantumMeasurementConstants.CAMERA_SOLID_SHAPE_SVG
      ).makeImmutable(),
      {
        fill: QuantumMeasurementColors.particleColorProperty,
        scale: 0.1,
        center: Vector2.ZERO
      }
    );
    const measurementSymbol = new MeasurementSymbolNode();
    const measurementIconNode = new Node( {
      children: [ measurementIconBackground, measurementSymbol ],
      scale: 0.5, // empirically determined
      right: titledTestArea.width - 3,
      bottom: titledTestArea.height - 3
    } );

    // Assemble the content node, which will have the title and the atoms on the back layer and the measurement icon
    // on the front layer.
    const content = new Node( {
      children: [ titledTestArea, measurementIconNode ]
    } );

    // Control the visibility of the measurement icon based on the state of the measurement. It will be shown briefly
    // when a measurement is made, then faded out.
    let iconFadeAnimation: Animation | null = null;
    measurementStateProperty.link( state => {
      measurementIconNode.visible = state === SpinMeasurementState.OBSERVED && !isSettingPhetioStateProperty.value;
      if ( state === SpinMeasurementState.OBSERVED ) {

        // Finish any existing animation.
        if ( iconFadeAnimation !== null ) {
          iconFadeAnimation.stop();
        }

        // Start an animation to fade out the icon (unless this state change is due to setting phet-io state).
        if ( !isSettingPhetioStateProperty.value ) {
          iconFadeAnimation = new Animation( {
            from: 1,
            to: 0,
            delay: 0.5,
            getValue: () => measurementIconNode.opacity,
            setValue: opacity => { measurementIconNode.opacity = opacity; },
            duration: 0.5
          } );
          measurementIconNode.opacity = 1;
          iconFadeAnimation.start();
          iconFadeAnimation.endedEmitter.addListener( () => { iconFadeAnimation = null; } );
        }
      }
      else if ( state === SpinMeasurementState.PREPARED ) {

        // If the state transitions to 'prepared' whilst an animation is in progress, that animation should be stopped.
        if ( iconFadeAnimation !== null ) {
          iconFadeAnimation.stop();
        }
      }
    } );

    const options = combineOptions<PanelOptions>(
      {},
      QuantumMeasurementConstants.PANEL_OPTIONS,
      {
        stroke: Color.BLACK,
        fill: QuantumMeasurementColors.systemUnderTestBackgroundColorProperty,
        resize: false
      },
      providedOptions
    );

    super( content, options );
  }
}

quantumMeasurement.register( 'SystemUnderTestNode', SystemUnderTestNode );

export default SystemUnderTestNode;