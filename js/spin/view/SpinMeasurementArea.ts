// Copyright 2024, University of Colorado Boulder

/**
 * SpinMeasurementArea is a composite UI component that allows users to configure a Stern-Gerlach experiment.
 * A comboBox allows to choose between a number of experimental configurations.
 *
 * @author Agustín Vallejo
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SpinExperiment from '../model/SpinExperiment.js';
import SpinModel from '../model/SpinModel.js';
import ParticleRayPath from './ParticleRayPath.js';
import ParticleSourceNode from './ParticleSourceNode.js';
import SternGerlachNode from './SternGerlachNode.js';

export default class SpinMeasurementArea extends VBox {

  public constructor( model: SpinModel, parentNode: Node, layoutBounds: Bounds2, tandem: Tandem ) {

    const items: ComboBoxItem<SpinExperiment>[] = SpinExperiment.enumeration.values.map( experiment => {
      return {
        value: experiment,
        createNode: () => new Text( experiment.experimentName, { font: new PhetFont( 16 ) } )
      };
    } );

    const experimentComboBox = new ComboBox( model.currentExperimentProperty, items, parentNode, {
      tandem: tandem.createTandem( 'experimentComboBox' )
    } );

    const particleSourceNode = new ParticleSourceNode( model, tandem.createTandem( 'particleSourceNode' ) );

    const firstSternGerlachNode = new SternGerlachNode( model.firstSternGerlachModel, tandem.createTandem( 'firstSternGerlachNode' ) );
    const secondSternGerlachNode = new SternGerlachNode( model.secondSternGerlachModel, tandem.createTandem( 'secondSternGerlachNode' ) );
    const thirdSternGerlachNode = new SternGerlachNode( model.thirdSternGerlachModel, tandem.createTandem( 'thirdSternGerlachNode' ) );

    const particleRayPath = new ParticleRayPath(
      model.particleAmmountProperty,
      tandem.createTandem( 'particleRayPath' )
    );

    parentNode.addChild( particleRayPath );

    super( {
      children: [
        experimentComboBox,
        new Text( 'Stern-Gerlach (SG) Measurements', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),

        // TODO: Really really rough sketch of the behavior of the SG experiments, see https://github.com/phetsims/quantum-measurement/issues/53
        new HBox( {
          spacing: 50,
          children: [
            particleSourceNode,
            firstSternGerlachNode,
            new VBox( {
              spacing: 20,
              children: [
                secondSternGerlachNode,
                thirdSternGerlachNode
              ]
            } )
          ]
        } )

      ],
      spacing: 20,
      margin: 20
    } );

    model.currentExperimentProperty.link( experiment => {

      // Adjust the global positions of the nodes
      particleSourceNode.updateGlobalPositions();
      firstSternGerlachNode.updateGlobalPositions();
      secondSternGerlachNode.updateGlobalPositions();
      thirdSternGerlachNode.updateGlobalPositions();

      // Update the paths of the particle rays according to the current experiment (if 2nd and 3rd SG are not visible, the rays keep going on)
      const primaryRayPoints = [ particleSourceNode.particleExitGlobalPosition, firstSternGerlachNode.entranceGlobalPosition ];

      const endOfRays = layoutBounds.maxX * 5;

      if ( experiment.experimentSettings.length === 1 ) {
        particleRayPath.updatePaths( [
          primaryRayPoints,
          [ firstSternGerlachNode.topExitGlobalPosition, new Vector2( endOfRays, firstSternGerlachNode.topExitGlobalPosition.y ) ],
          [ firstSternGerlachNode.bottomExitGlobalPosition, new Vector2( endOfRays, firstSternGerlachNode.bottomExitGlobalPosition.y ) ]
          ] );
      }
      else {
        particleRayPath.updatePaths( [
          primaryRayPoints,
          [ firstSternGerlachNode.topExitGlobalPosition, secondSternGerlachNode.entranceGlobalPosition ],
          [ firstSternGerlachNode.bottomExitGlobalPosition, thirdSternGerlachNode.entranceGlobalPosition ],
          [ secondSternGerlachNode.topExitGlobalPosition, new Vector2( endOfRays, secondSternGerlachNode.topExitGlobalPosition.y ) ],
          [ secondSternGerlachNode.bottomExitGlobalPosition, new Vector2( endOfRays, secondSternGerlachNode.bottomExitGlobalPosition.y ) ],
          [ thirdSternGerlachNode.topExitGlobalPosition, new Vector2( endOfRays, thirdSternGerlachNode.topExitGlobalPosition.y ) ],
          [ thirdSternGerlachNode.bottomExitGlobalPosition, new Vector2( endOfRays, thirdSternGerlachNode.bottomExitGlobalPosition.y ) ]
          ] );
      }
    } );
  }
}

quantumMeasurement.register( 'SpinMeasurementArea', SpinMeasurementArea );