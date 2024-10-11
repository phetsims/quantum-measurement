// Copyright 2024, University of Colorado Boulder

/**
 * SpinMeasurementArea is a composite UI component that allows users to configure a Stern-Gerlach experiment.
 * A comboBox allows to choose between a number of experimental configurations.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Path, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SpinExperiments from '../model/SpinExperiments.js';
import SpinModel from '../model/SpinModel.js';

export default class SpinMeasurementArea extends VBox {

  public constructor( model: SpinModel, parentNode: Node, tandem: Tandem ) {

    const items: ComboBoxItem<SpinExperiments>[] = SpinExperiments.enumeration.values.map( experiment => {
      return {
        value: experiment,
        createNode: () => new Text( experiment.experimentName, { font: new PhetFont( 16 ) } )
      };
    } );

    const experimentComboBox = new ComboBox( model.currentExperimentProperty, items, parentNode, {} );

    super( {
      children: [
        experimentComboBox,
        new Text( 'Stern-Gerlach (SG) Measurements', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),

        // TODO: Really really rough sketch of the behavior of the SG experiments, see https://github.com/phetsims/quantum-measurement/issues/53
        new HBox( {
          spacing: 50,
          children: [
            new Path( new Shape().rect( 0, 0, 100, 100 ),
              { fill: 'black' } ),
            new Node( {
              children: [
                new Path( new Shape().rect( 0, 0, 100, 100 ),
                  { fill: 'red', visibleProperty: model.firstSternGerlachModel.isVisibleProperty } ),
                new Text( new DerivedProperty(
                  [ model.firstSternGerlachModel.isZOrientedProperty ],
                  ( isZOriented: boolean ) => isZOriented ? 'Z' : 'X' ),
                  { font: new PhetFont( 16 ), fill: 'white', center: new Vector2( 50, 50 ) } )
              ]
            } ),
            new VBox( {
              spacing: 20,
              children: [
                new Node( {
                  children: [
                    new Path( new Shape().rect( 0, 0, 100, 100 ),
                      { fill: 'green', visibleProperty: model.secondSternGerlachModel.isVisibleProperty } ),
                    new Text( new DerivedProperty(
                      [ model.secondSternGerlachModel.isZOrientedProperty ],
                      ( isZOriented: boolean ) => isZOriented ? 'Z' : 'X' ),
                      { font: new PhetFont( 16 ), fill: 'white', center: new Vector2( 50, 50 ) } )
                  ]
                } ),
                new Node( {
                  children: [
                    new Path( new Shape().rect( 0, 0, 100, 100 ),
                      { fill: 'blue', visibleProperty: model.secondSternGerlachModel.isVisibleProperty } ),
                    new Text( new DerivedProperty(
                      [ model.secondSternGerlachModel.isZOrientedProperty ],
                      ( isZOriented: boolean ) => isZOriented ? 'Z' : 'X' ),
                      { font: new PhetFont( 16 ), fill: 'white', center: new Vector2( 50, 50 ) } )
                  ]
                } )
              ]
            } )
          ]
        } )

      ],
      spacing: 20,
      margin: 20
    } );
  }
}

quantumMeasurement.register( 'SpinMeasurementArea', SpinMeasurementArea );