// Copyright 2024, University of Colorado Boulder

/**
 * MagneticFieldControl is the node that contains the UI elements for controlling the magnetic field in the Bloch Sphere
 * screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import MagneticFieldArrowNode from './MagneticFieldArrowNode.js';

type SelfOptions = EmptySelfOptions;
export type MagneticFieldControlOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

export default class MagneticFieldControl extends Panel {

  public constructor( magneticFieldStrengthProperty: NumberProperty,
                      providedOptions: MagneticFieldControlOptions ) {

    const options = optionize<MagneticFieldControlOptions, SelfOptions, PanelOptions>()( {
      fill: QuantumMeasurementColors.controlPanelFillColorProperty,
      stroke: null,
      xMargin: 10,
      yMargin: 10
    }, providedOptions );

    const indicatorAndSlider = new HBox( {
      children: [
        new Node( {
          centerX: 0,
          centerY: 0,
          children: [
            new Path( new Shape().moveTo( 0, -50 ).lineTo( 0, 50 ), {
              stroke: 'grey',
              lineWidth: 1,
              lineDash: [ 5, 5 ]
            } ),
            new MagneticFieldArrowNode( magneticFieldStrengthProperty )
          ]
        } ),
        new Slider( magneticFieldStrengthProperty, magneticFieldStrengthProperty.range, {
          tandem: providedOptions.tandem.createTandem( 'magneticFieldStrengthSlider' ),
          thumbFill: '#ff0',
          orientation: Orientation.VERTICAL,
          centerX: 50,
          centerY: 0
        } )
      ],
      spacing: 10
    } );

    const panelTitle = new Text( QuantumMeasurementStrings.magneticFieldStringProperty, {
      font: new PhetFont( 18 )
    } );

    super(
      new VBox( {
        children: [ panelTitle, indicatorAndSlider ],
        spacing: 20
      } ),
      options
    );

  }
}

quantumMeasurement.register( 'MagneticFieldControl', MagneticFieldControl );