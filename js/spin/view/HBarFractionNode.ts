// Copyright 2024, University of Colorado Boulder

/**
 * HBarFractionNode is a simple node displaying ℏ/2 in fraction form
 *
 * @author Agustín Vallejo
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import FractionNode from '../../common/view/FractionNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class HBarFractionNode extends FractionNode {

  public constructor( fontSize = 17 ) {
    const textNodesOptions = {
      font: new PhetFont( { size: fontSize, style: 'italic', family: 'serif' } )
    };
    const hbarTextNode = new RichText( QuantumMeasurementConstants.HBAR, textNodesOptions );
    const twoTextNode = new RichText( '2', textNodesOptions );

    super( hbarTextNode, twoTextNode, {
      fractionLineMargin: 1
    } );
  }
}

quantumMeasurement.register( 'HBarFractionNode', HBarFractionNode );