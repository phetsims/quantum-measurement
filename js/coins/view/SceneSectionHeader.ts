// Copyright 2024, University of Colorado Boulder

/**
 * SceneSectionHeader is a composite Scenery Node that consists of a textual header and a line below it, where the line
 * is generally wider than text. It looks something like this:
 *
 *          Coin to Prepare
 *      -------------------------
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Line, Text, TPaint, VBox } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SceneSectionHeaderOptions = {
  textColor?: TPaint;
};

export default class SceneSectionHeader extends VBox {

  public constructor( textProperty: TReadOnlyProperty<string>,
                      lineWidthProperty: TReadOnlyProperty<number>,
                      providedOptions?: SceneSectionHeaderOptions ) {

    const options = optionize<SceneSectionHeaderOptions>()( {
      textColor: Color.BLACK
    }, providedOptions );

    const heading = new Text( textProperty, {
      fill: options.textColor,
      font: new PhetFont( 24 )
    } );
    const line = new Line( 0, 0, lineWidthProperty.value, 0, {
      stroke: Color.LIGHT_GRAY,
      lineWidth: 2,
      lineCap: 'round'
    } );

    // Update the line and the max width of the text as the width changes.
    lineWidthProperty.link( lineWidth => {
      line.setPoint2( lineWidth, 0 );
      heading.maxWidth = lineWidth;
    } );

    super( { children: [ heading, line ] } );
  }
}

quantumMeasurement.register( 'SceneSectionHeader', SceneSectionHeader );