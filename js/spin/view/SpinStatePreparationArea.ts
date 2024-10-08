// Copyright 2024, University of Colorado Boulder

/**
 * SpinStatePreparationArea is a composite UI component that allows users to configure a two-state classical or
 * quantum system - basically a classical or quantum coin - for a set of experiments where the user can flip and reveal
 * the coins. This is implemented as a VBox that acts as a column in the UI.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from '../model/SimpleBlochSphere.js';
import { SpinTypes, SpinValues } from '../model/SpinModel.js';

export default class SpinStatePreparationArea extends VBox {

  public constructor( blochSphere: SimpleBlochSphere, tandem: Tandem ) {

    // TODO: This in the strings file https://github.com/phetsims/quantum-measurement/issues/53
    const spinLabelsMap = new Map<SpinTypes, string>( [
      [ 'Z_PLUS', '"+Z"    ⟨Sz⟩ = +ħ/2' ],
      [ 'Z_MINUS', '"-Z"    ⟨Sz⟩ = -ħ/2' ],
      [ 'X_PLUS', '"+X"    ⟨Sz⟩ = 0' ]
      ] );

    const createRadioButtonGroupItem = ( value: SpinTypes ) => {
      const valueText = spinLabelsMap.get( value ) || value; // Map the value to the formatted string
      return {
        createNode: () => new Text( valueText, { font: new PhetFont( 15 ) } ),
        value: value
      };
    };

    const numberOfCoinsRadioButtonGroup = new RectangularRadioButtonGroup(
      blochSphere.spinStateProperty,
      SpinValues.map( quantity => createRadioButtonGroupItem( quantity ) ),
      {
        spacing: 10,
        center: new Vector2( 100, 100 ),
        tandem: tandem.createTandem( 'numberOfCoinsRadioButtonGroup' ),
        radioButtonOptions: {
          baseColor: QuantumMeasurementColors.basisStatesPanelFillColorProperty
        }
      }
    );

    const spinStatePanel = new VBox( {
      children: [
        numberOfCoinsRadioButtonGroup
      ]
    } );

    const blochSphereNode = new BlochSphereNode(
      blochSphere, {
        tandem: tandem.createTandem( 'blochSphereNode' ),
        scale: 2
      } );

    super( {
      children: [
        new Text( 'State to Prepare', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),
        blochSphereNode,
        new Slider( blochSphereNode.xAxisOffsetAngleProperty, new Range( 0, 2 * Math.PI ) ),
        spinStatePanel
      ],
      spacing: 20,
      margin: 20
    } );
  }
}

quantumMeasurement.register( 'SpinStatePreparationArea', SpinStatePreparationArea );