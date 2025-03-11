// Copyright 2024-2025, University of Colorado Boulder

/**
 * A class that will display P(X) where X is a provided symbol. This is used to display the probability of a coin result.
 *
 * @author Agustín Vallejo
 */

import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import classicalCoinHeads_svg from '../../../images/classicalCoinHeads_svg.js';
import classicalCoinTails_svg from '../../../images/classicalCoinTails_svg.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { ClassicalCoinStates } from '../model/ClassicalCoinStates.js';

export default class ProbabilityOfSymbolBox extends HBox {

  public constructor( coinFace: ClassicalCoinStates ) {
    const headsImage = new Image( classicalCoinHeads_svg );
    const tailsImage = new Image( classicalCoinTails_svg );
    const shownImage = coinFace === 'heads' ? headsImage : tailsImage;

    const equationOptions = { font: QuantumMeasurementConstants.CONTROL_FONT };
    const equationProbability = new Text( QuantumMeasurementStrings.PStringProperty, equationOptions );
    const parenthesesStart = new Text( '(', equationOptions );
    const parenthesesEnd = new Text( ')', equationOptions );

    shownImage.setScaleMagnitude( parenthesesStart.height / shownImage.height );

    super( {
      children: [ equationProbability, parenthesesStart, shownImage, parenthesesEnd ]
    } );
  }
}

quantumMeasurement.register( 'ProbabilityOfSymbolBox', ProbabilityOfSymbolBox );