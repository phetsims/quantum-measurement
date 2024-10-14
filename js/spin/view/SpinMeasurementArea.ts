// Copyright 2024, University of Colorado Boulder

/**
 * SpinMeasurementArea is a composite UI component that allows users to configure a Stern-Gerlach experiment.
 * A comboBox allows to choose between a number of experimental configurations.
 *
 * @author Agustín Vallejo
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SpinExperiment from '../model/SpinExperiment.js';
import SpinModel from '../model/SpinModel.js';
import ParticleSourceNode from './ParticleSourceNode.js';
import SternGerlachNode from './SternGerlachNode.js';

export default class SpinMeasurementArea extends VBox {

  public constructor( model: SpinModel, parentNode: Node, tandem: Tandem ) {

    const items: ComboBoxItem<SpinExperiment>[] = SpinExperiment.enumeration.values.map( experiment => {
      return {
        value: experiment,
        createNode: () => new Text( experiment.experimentName, { font: new PhetFont( 16 ) } )
      };
    } );

    const experimentComboBox = new ComboBox( model.currentExperimentProperty, items, parentNode, {
      tandem: tandem.createTandem( 'experimentComboBox' )
    } );

    super( {
      children: [
        experimentComboBox,
        new Text( 'Stern-Gerlach (SG) Measurements', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),

        // TODO: Really really rough sketch of the behavior of the SG experiments, see https://github.com/phetsims/quantum-measurement/issues/53
        new HBox( {
          spacing: 50,
          children: [
            new ParticleSourceNode( model.sourceModeProperty, tandem ),
            new SternGerlachNode( model.firstSternGerlachModel, tandem.createTandem( 'firstSternGerlachNode' ) ),
            new VBox( {
              spacing: 20,
              children: [
                new SternGerlachNode( model.secondSternGerlachModel, tandem.createTandem( 'secondSternGerlachNode' ) ),
                new SternGerlachNode( model.secondSternGerlachModel, tandem.createTandem( 'thirdSternGerlachNode' ) )
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