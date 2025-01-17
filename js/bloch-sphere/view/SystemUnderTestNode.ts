// Copyright 2025, University of Colorado Boulder

/**
 * SystemUnderTestNode is a node that show a single atom or multiple atoms in a box where a magnetic field may or may
 * not be present.  The node is used to represent the system under test in the quantum measurement simulation.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Color, HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SpinMeasurementState } from '../model/SpinMeasurementState.js';
import MagneticFieldNode from './MagneticFieldNode.js';

const ATOM_RADIUS = 18; // in view coordinates
export const ATOM_NODE_OPTIONS = {
  mainColor: Color.RED,
  highlightColor: Color.RED.colorUtilsBrighter( 0.7 )
};
const LABEL_FONT = new PhetFont( 18 );

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

    // TODO: See https://github.com/phetsims/quantum-measurement/issues/80.  Make the title strings translatable once
    //       this class is essentially approved by the design team.
    const titleStringProperty = new DerivedProperty( [ isSingleMeasurementModeProperty ], isSingleMode => {
      return isSingleMode ? 'Atom' : 'Atoms';
    } );
    const titleNode = new Text( titleStringProperty, { font: LABEL_FONT } );

    const magneticFieldNode = new MagneticFieldNode( magneticFieldStrengthProperty, measurementStateProperty, {
      visibleProperty: magneticFieldEnabledProperty
    } );

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

    // Create the set of atom nodes for the multiple measurement mode.  The layout used here is quite specific to the
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

    // Create a node with the magnetic field in the background and the atoms in the foreground.
    const fieldAndAtomsNode = new Node( {
      children: [ magneticFieldNode, singleSphericalAtomNode, multipleSphericalAtomNode ]
    } );

    // Combine the title and the field and atoms node into a single node for the content.
    const content = new VBox( {
      children: [ titleNode, fieldAndAtomsNode ],
      spacing: 5,
      resize: false
    } );

    const options = combineOptions<PanelOptions>( {
      stroke: Color.BLACK,
      fill: new Color( 235, 255, 235 ),
      cornerRadius: 8,
      resize: false
    }, providedOptions );

    super( content, options );
  }
}

quantumMeasurement.register( 'SystemUnderTestNode', SystemUnderTestNode );

export default SystemUnderTestNode;