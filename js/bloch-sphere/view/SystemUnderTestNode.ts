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
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Color, HBox, Node, NodeOptions, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SpinMeasurementState } from '../model/SpinMeasurementState.js';
import MagneticFieldNode from './MagneticFieldNode.js';

const ATOM_RADIUS = 18; // in view coordinates
const ATOM_NODE_OPTIONS = {
  mainColor: Color.RED,
  highlightColor: Color.RED.colorUtilsBrighter( 0.7 )
};
const LABEL_FONT = new PhetFont( 18 );

class SystemUnderTestNode extends Node {

  /**
   * @param size - the size of the node in view coordinates
   * @param magneticFieldEnabledProperty - whether the magnetic field is enabled
   * @param magneticFieldStrengthProperty - the property that indicates the magnetic field strength
   * @param isSingleMeasurementModeProperty - whether the system is in single measurement mode
   * @param measurementStateProperty - the state of the spin measurement
   * @param providedOptions - options for the node, mostly used for positioning if at all
   */
  public constructor( size: Dimension2,
                      magneticFieldEnabledProperty: TReadOnlyProperty<boolean>,
                      magneticFieldStrengthProperty: NumberProperty,
                      isSingleMeasurementModeProperty: TReadOnlyProperty<boolean>,
                      measurementStateProperty: Property<SpinMeasurementState>,
                      providedOptions?: NodeOptions ) {

    const rect = new Rectangle( 0, 0, size.width, size.height, {
      stroke: Color.BLACK,
      fill: new Color( 235, 255, 235 ),
      cornerRadius: 8
    } );

    const magneticFieldNode = new MagneticFieldNode( magneticFieldStrengthProperty, measurementStateProperty, {
      center: rect.center,
      visibleProperty: magneticFieldEnabledProperty
    } );

    const singleSphericalAtomNode = new ShadedSphereNode( ATOM_RADIUS, ATOM_NODE_OPTIONS );

    const labeledSingleAtomNode = new VBox( {
      children: [
        singleSphericalAtomNode,
        new Text( 'Atom', { font: LABEL_FONT } )
      ],
      center: rect.center,
      spacing: 10,
      visibleProperty: isSingleMeasurementModeProperty
    } );

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
      center: rect.center
    } );

    const labeledMultiAtomNode = new VBox( {
      children: [
        multipleSphericalAtomNode,
        new Text( 'Atoms', { font: LABEL_FONT } )
      ],
      spacing: 10,
      center: rect.center,
      visibleProperty: DerivedProperty.valueEqualsConstant( isSingleMeasurementModeProperty, false )
    } );

    const options = combineOptions<NodeOptions>( {
      children: [ rect, magneticFieldNode, labeledSingleAtomNode, labeledMultiAtomNode ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'SystemUnderTestNode', SystemUnderTestNode );

export default SystemUnderTestNode;