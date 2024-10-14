// Copyright 2024, University of Colorado Boulder

/**
 * ParticleSourceNode is the visual representation of a Stern Gerlach node in the UI.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Path, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButtonGroup from '../../../../sun/js/AquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SourceMode } from '../model/SpinModel.js';

export default class ParticleSourceNode extends VBox {

  public constructor( sourceModeProperty: Property<SourceMode>, tandem: Tandem ) {
    super( {
      tandem: tandem.createTandem( 'particleSourceNode' ),
      spacing: 20,
      children: [
        new RichText( 'Spin ℏ/2 Source', { font: new PhetFont( 20 ) } ),
        new Path( new Shape().roundRect( 0, 0, 100, 100, 10, 10 ),
          { fill: 'blue' } ),
        new RichText( 'Source Mode', { font: new PhetFont( { size: 20, weight: 'bold' } ) } ),
        new AquaRadioButtonGroup( sourceModeProperty, SourceMode.enumeration.values.map( sourceMode => {
          return {
            value: sourceMode,
            labelContent: sourceMode.sourceName,
            createNode: () => new Text( sourceMode.sourceName, { font: new PhetFont( 15 ) } ),
            tandemName: `${sourceMode.tandemName}RadioButton`
          };
        } ), {
          spacing: 10
        } )
      ]
    } );
  }
}

quantumMeasurement.register( 'ParticleSourceNode', ParticleSourceNode );