// Copyright 2024, University of Colorado Boulder

/**
 *
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Color, GridBox, Node, NodeOptions, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
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
   * @param providedOptions - options for the node, mostly used for positioning if at all
   */
  public constructor( size: Dimension2,
                      magneticFieldEnabledProperty: TReadOnlyProperty<boolean>,
                      magneticFieldStrengthProperty: NumberProperty,
                      isSingleMeasurementModeProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: NodeOptions ) {

    const rect = new Rectangle( 0, 0, size.width, size.height, {
      stroke: Color.BLACK,
      fill: new Color( 235, 255, 235 ),
      cornerRadius: 8
    } );

    const magneticFieldNode = new MagneticFieldNode( magneticFieldStrengthProperty, {
      center: rect.center,
      opacity: 0.25,
      visibleProperty: magneticFieldEnabledProperty
    } );

    const singleSphericalAtomNode = new ShadedSphereNode( ATOM_RADIUS, ATOM_NODE_OPTIONS );

    const labeledSingleAtomNode = new VBox( {
      children: [
        singleSphericalAtomNode,
        new Text( 'Atom', { font: LABEL_FONT } )
      ],
      center: rect.center,
      visibleProperty: isSingleMeasurementModeProperty
    } );

    // Create the set of atoms for the multiple measurement mode.  The layout here is quite specific and will need to
    // be adjusted if the number of atoms changes.
    const atomNodesForMultipleMode: Array<Array<Node | null>> = [];
    const numColumns = 3;
    const numRows = 4;
    for ( let row = 0; row < numRows; row++ ) {
      for ( let column = 0; column < numColumns; column++ ) {
        if ( !atomNodesForMultipleMode[ row ] ) {
          atomNodesForMultipleMode[ row ] = [];
        }
        if ( row <= 2 || column === 1 ) {
          atomNodesForMultipleMode[ row ][ column ] = new ShadedSphereNode( ATOM_RADIUS, ATOM_NODE_OPTIONS );
        }
        else {
          atomNodesForMultipleMode[ row ][ column ] = null;
        }
      }
    }
    const multipleSphericalAtomNode = new GridBox( {
      rows: atomNodesForMultipleMode,
      spacing: 10,
      center: rect.center
    } );

    const labeledMultiAtomNode = new VBox( {
      children: [
        multipleSphericalAtomNode,
        new Text( 'Atoms', { font: LABEL_FONT } )
      ],
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