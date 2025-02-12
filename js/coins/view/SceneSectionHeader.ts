// Copyright 2024-2025, University of Colorado Boulder

/**
 * SceneSectionHeader is a composite Scenery Node that consists of a textual header and a line below it, where the line
 * is generally wider than text. It looks something like this:
 *
 *      Coin to Prepare
 *      ---------------
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import TPaint from '../../../../scenery/js/util/TPaint.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SceneSectionHeaderOptions = {
  textColor?: TPaint;
  maxWidth?: number;
};

export default class SceneSectionHeader extends VBox {

  public constructor( textProperty: TReadOnlyProperty<string>,
                      providedOptions?: SceneSectionHeaderOptions ) {

    const options = optionize<SceneSectionHeaderOptions>()( {
      textColor: QuantumMeasurementColors.classicalSceneTextColorProperty,
      maxWidth: 250
    }, providedOptions );

    const heading = new Text( textProperty, {
      fill: options.textColor,
      font: new PhetFont( 24 ),
      maxWidth: options.maxWidth
    } );
    const line = new Line( 0, 0, heading.width, 0, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineCap: 'round'
    } );

    heading.localBoundsProperty.link( bounds => {
      line.setPoint2( Math.min( bounds.width, options.maxWidth ), 0 );
    } );

    super( { children: [ heading, line ] } );
  }
}

quantumMeasurement.register( 'SceneSectionHeader', SceneSectionHeader );