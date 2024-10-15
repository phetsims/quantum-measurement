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
import ParticleSourceNode, { PARTICLE_SOURCE_HEIGHT, PARTICLE_SOURCE_WIDTH } from './ParticleSourceNode.js';
import SternGerlachNode, { PARTICLE_HOLE_WIDTH, STERN_GERLACH_HEIGHT, STERN_GERLACH_WIDTH } from './SternGerlachNode.js';

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
      particleSourceNode.particleExitGlobalPosition = particleSourceNode.localToGlobalPoint( new Vector2( PARTICLE_SOURCE_WIDTH, PARTICLE_SOURCE_HEIGHT ) );

      firstSternGerlachNode.entranceGlobalPosition = firstSternGerlachNode.localToGlobalPoint( new Vector2( 0, STERN_GERLACH_HEIGHT / 2 ) );
      firstSternGerlachNode.topExitGlobalPosition = firstSternGerlachNode.localToGlobalPoint( new Vector2( STERN_GERLACH_WIDTH + PARTICLE_HOLE_WIDTH, STERN_GERLACH_HEIGHT / 4 ) );
      firstSternGerlachNode.bottomExitGlobalPosition = firstSternGerlachNode.localToGlobalPoint( new Vector2( STERN_GERLACH_WIDTH + PARTICLE_HOLE_WIDTH, 3 * STERN_GERLACH_HEIGHT / 4 ) );

      secondSternGerlachNode.entranceGlobalPosition = secondSternGerlachNode.localToGlobalPoint( new Vector2( -PARTICLE_HOLE_WIDTH, STERN_GERLACH_HEIGHT / 2 ) );

      thirdSternGerlachNode.entranceGlobalPosition = thirdSternGerlachNode.localToGlobalPoint( new Vector2( -PARTICLE_HOLE_WIDTH, STERN_GERLACH_HEIGHT / 2 ) );

      // Update the paths of the particle rays according to the current experiment (if 2nd and 3rd SG are not visible, the rays keep going on)
      const primaryRayPoints = [ particleSourceNode.particleExitGlobalPosition, firstSternGerlachNode.entranceGlobalPosition ];

      console.log( 'jiji', firstSternGerlachNode.topExitGlobalPosition );

      if ( experiment.experimentSettings.length === 1 ) {
        particleRayPath.updatePaths(
          primaryRayPoints,
          [ firstSternGerlachNode.topExitGlobalPosition, new Vector2( layoutBounds.maxX * 5, firstSternGerlachNode.topExitGlobalPosition.y ) ],
          [ firstSternGerlachNode.bottomExitGlobalPosition, new Vector2( layoutBounds.maxX * 5, firstSternGerlachNode.bottomExitGlobalPosition.y ) ]
        );
      }
      else {
        particleRayPath.updatePaths(
          primaryRayPoints,
          [ firstSternGerlachNode.topExitGlobalPosition, secondSternGerlachNode.entranceGlobalPosition ],
          [ firstSternGerlachNode.bottomExitGlobalPosition, thirdSternGerlachNode.entranceGlobalPosition ]
        );
      }
    } );
  }
}

quantumMeasurement.register( 'SpinMeasurementArea', SpinMeasurementArea );