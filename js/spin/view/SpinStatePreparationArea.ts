// Copyright 2024, University of Colorado Boulder

/**
 * SpinStatePreparationArea is a composite UI component that allows users to prepare the spin state of a quantum system
 * between three options: Z+, X+, Z-. It also shows a Bloch Sphere that represents the quantum state of the system.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import BlochSphereNode from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import SimpleBlochSphere from '../model/SimpleBlochSphere.js';
import { SpinDirection } from '../model/SpinDirection.js';

const ALPHA = QuantumMeasurementConstants.ALPHA;
const BETA = QuantumMeasurementConstants.BETA;
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class SpinStatePreparationArea extends VBox {

  public constructor( spinStateProperty: Property<SpinDirection>, blochSphere: SimpleBlochSphere, tandem: Tandem ) {

    const createRadioButtonGroupItem = ( SpinDirection: SpinDirection ) => {
      return {
        createNode: () => new Text( SpinDirection.description, { font: new PhetFont( 15 ) } ),
        value: SpinDirection,
        tandemName: `${SpinDirection.tandemName}SpinDirectionRadioButton`
      };
    };

    const numberOfCoinsRadioButtonGroup = new RectangularRadioButtonGroup(
      spinStateProperty,
      SpinDirection.enumeration.values.map( quantity => createRadioButtonGroupItem( quantity ) ),
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

    const title = new RichText( QuantumMeasurementStrings.stateToPrepareStringProperty, { font: new PhetFont( { size: 20, weight: 'bolder' } ) } );
    const subtitle = new RichText( `( ${ALPHA}|${UP}${KET} + ${BETA}|${DOWN}${KET} )`, { font: new PhetFont( 18 ) } );

    const stateReadoutStringProperty = new DerivedProperty(
      [
        spinStateProperty
      ],
      spinState => {

        const upProbability = spinState === SpinDirection.Z_PLUS ? 1 :
                              spinState === SpinDirection.X_PLUS ? 0.5 : 0;
        // const upProbability = spinState === SpinDirection.Z_MINUS ? 0 : 1;
        const alphaValue = Utils.toFixed( upProbability, 3 );
        const betaValue = Utils.toFixed( 1 - upProbability, 3 );
        return `${alphaValue}|${UP}${KET} + ${betaValue}|${DOWN}${KET}`;
      } );

    const stateReadout = new RichText( stateReadoutStringProperty, { font: new PhetFont( 18 ) } );


    super( {
      children: [
        new VBox( {
          spacing: 3,
          children: [ title, subtitle ]
        } ),
        blochSphereNode,
        new Slider( blochSphereNode.xAxisOffsetAngleProperty, new Range( 0, 2 * Math.PI ), {
          tandem: Tandem.OPT_OUT
        } ),
        stateReadout,
        spinStatePanel
      ],
      spacing: 30
    } );
  }
}

quantumMeasurement.register( 'SpinStatePreparationArea', SpinStatePreparationArea );