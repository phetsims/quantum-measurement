// Copyright 2024, University of Colorado Boulder

/**
 * SpinMeasurementArea is a composite UI component that allows users to configure a Stern-Gerlach experiment.
 * A comboBox allows to choose between a number of experimental configurations.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BlochSphereNode, { BlochSphereNodeOptions } from '../../common/view/BlochSphereNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SimpleBlochSphere from '../model/SimpleBlochSphere.js';
import { SourceMode } from '../model/SourceMode.js';
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

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 100, 100 ),
      200 // empirically determined
    );

    const particleRayPath = new ParticleRayPath(
      model.particleRays,
      modelViewTransform,
      model.particleSourceModel.sourceModeProperty,
      model.singleParticles,
      tandem.createTandem( 'particleRayPath' )
    );

    const particleSourceNode = new ParticleSourceNode( model.particleSourceModel, modelViewTransform, tandem.createTandem( 'particleSourceNode' ) );

    const firstSternGerlachNode = new SternGerlachNode( model.firstSternGerlach, modelViewTransform, tandem.createTandem( 'firstSternGerlachNode' ) );
    const secondSternGerlachNode = new SternGerlachNode( model.secondSternGerlach, modelViewTransform, tandem.createTandem( 'secondSternGerlachNode' ) );
    const thirdSternGerlachNode = new SternGerlachNode( model.thirdSternGerlach, modelViewTransform, tandem.createTandem( 'thirdSternGerlachNode' ) );

    const smallBlochSphereOptions = ( positionA: Vector2, positionB: Vector2 ): BlochSphereNodeOptions => {
      return {
        center: modelViewTransform.modelToViewPosition( new Vector2( ( positionA.x + positionB.x ) / 2, 0.8 ) ),
        scale: 0.8,
        visibleProperty: new DerivedProperty( [ model.particleSourceModel.sourceModeProperty ], sourceMode => sourceMode === SourceMode.SINGLE ),
        tandem: Tandem.OPT_OUT
      };
    };

    // TODO: Proper tandems! https://github.com/phetsims/quantum-measurement/issues/53
    const tandems = { tandem: Tandem.OPT_OUT };
    const firstSimpleBlochSphere = new BlochSphereNode( new SimpleBlochSphere( model.particleSourceModel.spinStateProperty, tandems ),
      smallBlochSphereOptions(
        model.particleSourceModel.exitPosition.plus( model.particleSourceModel.positionProperty.value ),
        model.firstSternGerlach.entrancePosition.plus( model.firstSternGerlach.positionProperty.value )
      ) );
    const secondSimpleBlochSphere = new BlochSphereNode( new SimpleBlochSphere( model.particleSourceModel.spinStateProperty, tandems ),
      smallBlochSphereOptions(
        model.firstSternGerlach.topExitPosition.plus( model.firstSternGerlach.positionProperty.value ),
        model.secondSternGerlach.entrancePosition.plus( model.secondSternGerlach.positionProperty.value )
      ) );
    const thirdSimpleBlochSphere = new BlochSphereNode( new SimpleBlochSphere( model.particleSourceModel.spinStateProperty, tandems ),
      smallBlochSphereOptions(
        model.secondSternGerlach.topExitPosition.plus( model.secondSternGerlach.positionProperty.value ),
        model.secondSternGerlach.topExitPosition.plus( model.secondSternGerlach.positionProperty.value ).plusXY( 1, 0 )
      ) );
    thirdSimpleBlochSphere.visibleProperty = new DerivedProperty(
      [
        model.particleSourceModel.sourceModeProperty,
        model.currentExperimentProperty
      ],
      ( sourceMode, currentExperiment ) => sourceMode === SourceMode.SINGLE && !currentExperiment.isShortExperiment
    );

    const experimentAreaNode = new Node( {
      children: [
        particleSourceNode,
        firstSternGerlachNode,
        secondSternGerlachNode,
        thirdSternGerlachNode,

        // Mid experiment measurement Bloch Spheres
        firstSimpleBlochSphere,
        secondSimpleBlochSphere,
        thirdSimpleBlochSphere
      ]
    } );

    // experimentAreaNode.clipArea = Shape.bounds( experimentAreaNode.localBounds );

    experimentAreaNode.insertChild( 0, particleRayPath );

    super( {
      children: [
        experimentComboBox,

        // TODO: Translatable! https://github.com/phetsims/quantum-measurement/issues/53
        new Text( 'Stern-Gerlach (SG) Measurements', { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),

        experimentAreaNode

      ],
      spacing: 20,
      xMargin: 30,
      yMargin: 10
    } );

  }
}

quantumMeasurement.register( 'SpinMeasurementArea', SpinMeasurementArea );