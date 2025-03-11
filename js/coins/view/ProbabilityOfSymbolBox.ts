// Copyright 2025, University of Colorado Boulder

/**
 * A class that will display P(X) where X is a provided symbol. This is used to display the probability of a coin result.
 *
 * @author Agustín Vallejo
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import classicalCoinHeads_svg from '../../../images/classicalCoinHeads_svg.js';
import classicalCoinTails_svg from '../../../images/classicalCoinTails_svg.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { CoinStates } from '../model/CoinStates.js';

type validFaces = Exclude<CoinStates, 'superposition'>;

export default class ProbabilityOfSymbolBox extends HBox {

  public constructor( coinFace: validFaces, font = QuantumMeasurementConstants.CONTROL_FONT ) {
    const equationOptions = { font: font };
    const equationProbability = new RichText( QuantumMeasurementStrings.PStringProperty, equationOptions );
    const parenthesesStart = new RichText( '(', equationOptions );
    const parenthesesEnd = new RichText( ')', equationOptions );

    const shownNode = ProbabilityOfSymbolBox.getFaceSymbol( coinFace, font );

    super( {
      children: [ equationProbability, parenthesesStart, shownNode, parenthesesEnd ]
    } );
  }

  public static getFaceSymbol( coinFace: validFaces, font: PhetFont ): Node {
    const referenceText = new RichText( 'I <3 PhET', { font: font } );

    let shownNode: Node;
    if ( coinFace === 'heads' ) {
      shownNode = new Image( classicalCoinHeads_svg );
      shownNode.setScaleMagnitude( referenceText.height / shownNode.height );
    }
    else if ( coinFace === 'tails' ) {
      shownNode = new Image( classicalCoinTails_svg );
      shownNode.setScaleMagnitude( referenceText.height / shownNode.height );
    }
    else if ( coinFace === 'up' ) {
      shownNode = new RichText( QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER, {
        font: font
      } );
    }
    else { // 'down' case
      shownNode = new RichText( QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER, {
        font: font,
        fill: QuantumMeasurementColors.downColorProperty
      } );
    }
    return shownNode;
  }
}

quantumMeasurement.register( 'ProbabilityOfSymbolBox', ProbabilityOfSymbolBox );