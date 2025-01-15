// Copyright 2025, University of Colorado Boulder
/**
 * Array of Magnetic Field Arrow Nodes that represent the bulk of the magnetic field.
 *
 * @author Agustín Vallejo
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SpinMeasurementState } from '../model/SpinMeasurementState.js';
import MagneticFieldArrowNode from './MagneticFieldArrowNode.js';

const SIZE = new Dimension2( 150, 170 );

export default class MagneticFieldNode extends Node {

  public constructor( magneticFieldStrength: NumberProperty,
                      measurementStateProperty: Property<SpinMeasurementState>,
                      providedOptions?: NodeOptions ) {

    const columns = 5;
    const rows = 5;
    const separationX = SIZE.width / columns;
    const separationY = SIZE.height / rows;
    const arrowNodes: MagneticFieldArrowNode[] = [];

    for ( let i = 0; i < columns; i++ ) {
      for ( let j = 0; j < rows; j++ ) {
        const magneticFieldArrowNode = new MagneticFieldArrowNode( magneticFieldStrength, 20 );
        magneticFieldStrength.link( () => {
          magneticFieldArrowNode.centerX = i * separationX;
          magneticFieldArrowNode.centerY = j * separationY;
        } );

        arrowNodes.push( magneticFieldArrowNode );
      }
    }

    const options = combineOptions<NodeOptions>( { children: arrowNodes }, providedOptions );

    super( options );

    measurementStateProperty.link( ( measurementState: SpinMeasurementState ) => {
      this.opacity = measurementState === 'timingObservation' ? 1 : 0.25;
    } );
  }
}

quantumMeasurement.register( 'MagneticFieldNode', MagneticFieldNode );