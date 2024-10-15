// Copyright 2024, University of Colorado Boulder

/**
 * SpinStatePreparationArea is a composite UI component that allows users to prepare the spin state of a quantum system
 * between three options: Z+, X+, Z-. It also shows a Bloch Sphere that represents the quantum state of the system.
 *
 * @author Agustín Vallejo
 */

import Property from '../../../../axon/js/Property.js';
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
import { SpinValue } from '../model/SpinModel.js';

export default class SpinStatePreparationArea extends VBox {

  public constructor( spinStateProperty: Property<SpinValue>, blochSphere: SimpleBlochSphere, tandem: Tandem ) {

    const createRadioButtonGroupItem = ( spinValue: SpinValue ) => {
      return {
        createNode: () => new Text( spinValue.description, { font: new PhetFont( 15 ) } ),
        value: spinValue,
        tandemName: `${spinValue.tandemName}SpinValueRadioButton`
      };
    };

    const numberOfCoinsRadioButtonGroup = new RectangularRadioButtonGroup(
      spinStateProperty,
      SpinValue.enumeration.values.map( quantity => createRadioButtonGroupItem( quantity ) ),
      {
        spacing: 10,
        center: new Vector2( 100, 100 ),
        tandem: tandem.createTandem( 'numberOfCoinsRadioButtonGroup' ),
        radioButtonOptions: {
          baseColor: QuantumMeasurementColors.controlPanelFillColorProperty
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
        new Slider( blochSphereNode.xAxisOffsetAngleProperty, new Range( 0, 2 * Math.PI ), {
          tandem: Tandem.OPT_OUT
        } ),
        spinStatePanel
      ],
      spacing: 10,
      margin: 20
    } );
  }
}

quantumMeasurement.register( 'SpinStatePreparationArea', SpinStatePreparationArea );