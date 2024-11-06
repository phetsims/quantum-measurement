// Copyright 2024, University of Colorado Boulder

/**
 * SpinMeasurementArea is a composite UI component that allows users to configure a Stern-Gerlach experiment.
 * A comboBox allows to choose between a number of experimental configurations.
 *
 * @author Agustín Vallejo
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { HBox, Node, Path, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { SourceMode } from '../model/SourceMode.js';
import SpinExperiment from '../model/SpinExperiment.js';
import SpinModel from '../model/SpinModel.js';
import SternGerlach from '../model/SternGerlach.js';
import ManyParticlesCanvasNode from './ManyParticlesCanvasNode.js';
import MeasurementLineNode from './MeasurementLineNode.js';
import ParticleSourceNode from './ParticleSourceNode.js';
import SternGerlachNode from './SternGerlachNode.js';

export default class SpinMeasurementArea extends VBox {

  private manyParticlesCanvasNode: ManyParticlesCanvasNode;

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
      new Vector2( 0, 0 ),
      180 // empirically determined
    );

    const particleSourceNode = new ParticleSourceNode( model.particleSourceModel, modelViewTransform, tandem.createTandem( 'particleSourceNode' ) );

    const sternGerlachNodes = [
      new SternGerlachNode( model.sternGerlachs[ 0 ], modelViewTransform, tandem.createTandem( 'firstSternGerlachNode' ) ),
      new SternGerlachNode( model.sternGerlachs[ 1 ], modelViewTransform, tandem.createTandem( 'secondSternGerlachNode' ) ),
      new SternGerlachNode( model.sternGerlachs[ 2 ], modelViewTransform, tandem.createTandem( 'thirdSternGerlachNode' ) )
    ];

    const measurementLines = [
      new MeasurementLineNode( model.measurementLines[ 0 ], modelViewTransform, { tandem: tandem.createTandem( 'firstMeasurementLine' ) } ),
      new MeasurementLineNode( model.measurementLines[ 1 ], modelViewTransform, { tandem: tandem.createTandem( 'secondMeasurementLine' ) } ),
      new MeasurementLineNode( model.measurementLines[ 2 ], modelViewTransform, { tandem: tandem.createTandem( 'thirdMeasurementLine' ) } )
    ];

    const createPercentageHistogram = ( sternGerlach: SternGerlach, visibleProperty: TReadOnlyProperty<boolean> ) => {

      const spinUpLabelStringProperty = new DerivedStringProperty(
        [
          sternGerlach.isZOrientedProperty,
          QuantumMeasurementStrings.SGSubZStringProperty,
          QuantumMeasurementStrings.SGSubXStringProperty
        ], ( isZOriented, SGSubZ, SGSubX ) => isZOriented ?
                                                             SGSubZ + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER :
                                                             SGSubX + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER
      );
      const spinDownLabelStringProperty = new DerivedStringProperty(
        [
          sternGerlach.isZOrientedProperty,
          QuantumMeasurementStrings.SGSubZStringProperty,
          QuantumMeasurementStrings.SGSubXStringProperty
        ], ( isZOriented, SGSubZ, SGSubX ) => isZOriented ?
                                                             SGSubZ + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER :
                                                             SGSubX + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER
      );

      return new QuantumMeasurementHistogram( sternGerlach.upProbabilityProperty, sternGerlach.downProbabilityProperty, new BooleanProperty( true ),
        [
          new RichText( spinUpLabelStringProperty, { font: new PhetFont( { size: 17, weight: 'bold' } ) } ),
          new RichText( spinDownLabelStringProperty, { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
        ],
        {
          center: modelViewTransform.modelToViewPosition( new Vector2( sternGerlach.positionProperty.value.x, 1 ) ),
          displayMode: 'percent',
          scale: 0.8,
          leftFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
          visibleProperty: visibleProperty,
          tandem: Tandem.OPT_OUT,
          numberDisplayOptions: {
            textOptions: {
              font: new PhetFont( 17 )
            }
          }
        } );
    };

    const histograms = [
      createPercentageHistogram(
        model.sternGerlachs[ 0 ],
        new DerivedProperty( [ model.particleSourceModel.sourceModeProperty ],
          sourceMode => sourceMode === SourceMode.CONTINUOUS ) ),

      createPercentageHistogram(
        model.sternGerlachs[ 1 ],
        new DerivedProperty(
          [
            model.particleSourceModel.sourceModeProperty,
            model.currentExperimentProperty
          ],
          ( sourceMode, experiment ) => {
            return sourceMode === SourceMode.CONTINUOUS && !experiment.isShortExperiment;
          } ) )
    ];

    const singleParticleNodes = model.singleParticles.map( particle => {
      const particleNode = new ShadedSphereNode( 15, {
        mainColor: 'magenta',
        highlightColor: 'white',
        visibleProperty: particle.activeProperty
      } );

      particle.positionProperty.link( position => {
        particleNode.translation = modelViewTransform.modelToViewPosition( position );
      } );

      return particleNode;
    } );

    const manyParticlesCanvasNode = new ManyParticlesCanvasNode(
      model.multipleParticles,
      modelViewTransform,
      layoutBounds,
      { tandem: tandem.createTandem( 'manyParticlesCanvasNode' ) }
    );

    const expectedPercentageCheckbox = new Checkbox(
      model.expectedPercentageVisibleProperty,
      new HBox( {
      children: [
        new Text( 'Expected percentage', { font: new PhetFont( 16 ) } ),
        new Path( new Shape().moveTo( 0, 0 ).lineTo( 20, 0 ),
          QuantumMeasurementConstants.expectedPercentagePathOptions
        )
      ],
      spacing: 5
    } ),
      {
      scale: 0.9,
      left: particleSourceNode.left,
      top: particleSourceNode.bottom + 30,
      visibleProperty: new DerivedProperty(
        [ model.particleSourceModel.sourceModeProperty ],
        sourceMode => sourceMode === SourceMode.CONTINUOUS
      ),
      tandem: tandem.createTandem( 'expectedPercentageCheckbox' )
    } );

    const experimentAreaNode = new Node( {
      children: [
        manyParticlesCanvasNode,
        ...singleParticleNodes,
        particleSourceNode,
        ...sternGerlachNodes,
        ...measurementLines,
        ...histograms,
        expectedPercentageCheckbox
      ]
    } );

    // experimentAreaNode.clipArea = Shape.bounds( experimentAreaNode.localBounds );

    super( {
      children: [
        experimentComboBox,
        new Text( QuantumMeasurementStrings.SternGerlachMeasurementsStringProperty, { font: new PhetFont( { size: 20, weight: 'bolder' } ) } ),
        experimentAreaNode
      ],
      align: 'left',
      spacing: 10,
      xMargin: 30,
      yMargin: 10
    } );

    this.manyParticlesCanvasNode = manyParticlesCanvasNode;
  }

  public step( dt: number ): void {
    this.manyParticlesCanvasNode.step();
  }
}

quantumMeasurement.register( 'SpinMeasurementArea', SpinMeasurementArea );