// Copyright 2024, University of Colorado Boulder

/**
 * ParticleSourceNode is the visual representation of a Stern Gerlach node in the UI.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Path, Text, VBox } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SourceModeTypes } from '../model/SpinModel.js';

export default class ParticleSourceNode extends VBox {

  public constructor( sourceModeProperty: Property<SourceModeTypes>, tandem: Tandem ) {
    super( {
      tandem: tandem.createTandem( 'particleSourceNode' ),
      children: [
        new Path( new Shape().roundRect( 0, 0, 100, 100, 10, 10 ),
          { fill: 'blue' } ),
        new AquaRadioButton( sourceModeProperty, sourceModeProperty.value, new Text( 'Source Mode' ),
          {
          tandem: tandem.createTandem( 'sourceModeRadioButton' )
        } )
      ]
    } );
  }
}

quantumMeasurement.register( 'ParticleSourceNode', ParticleSourceNode );