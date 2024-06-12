// Copyright 2024, University of Colorado Boulder


/**
 * ProbabilityEquationsNode shows the probability settings (aka the bias) for the physical and quantum coins.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { RichText } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

export default class ProbabilityEquationsNode extends RichText {

  public constructor() {

    super( 'P(<b>H</b>) = 0.50<br>P(<span style="color: magenta;"><b>T</b></span>) = <span style="color: magenta;">0.50</span>', {
      font: new PhetFont( 18 )
    } );
  }
}

quantumMeasurement.register( 'ProbabilityEquationsNode', ProbabilityEquationsNode );