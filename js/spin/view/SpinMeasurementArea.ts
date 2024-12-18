// Copyright 2024, University of Colorado Boulder

/**
 * SpinMeasurementArea is a composite UI component that allows users to configure a Stern-Gerlach experiment.
 * A comboBox allows to choose between a number of experimental configurations.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { HBox, Node, Path, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import { BlockingMode } from '../model/BlockingMode.js';
import { SourceMode } from '../model/SourceMode.js';
import SpinExperiment from '../model/SpinExperiment.js';
import SpinModel from '../model/SpinModel.js';
import SternGerlach from '../model/SternGerlach.js';
import HistogramWithExpectedValue from './HistogramWithExpectedValue.js';
import ManyParticlesCanvasNode from './ManyParticlesCanvasNode.js';
import MeasurementDeviceNode from './MeasurementDeviceNode.js';
import ParticleSourceNode from './ParticleSourceNode.js';
import SternGerlachNode from './SternGerlachNode.js';
import ParticleSprites from './ParticleSprites.js';

export default class SpinMeasurementArea extends VBox {

  private manyParticlesCanvasNode: ManyParticlesCanvasNode;

  private readonly measurementLines: MeasurementDeviceNode[];

  private readonly particleSprites: ParticleSprites;

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

    const particleSourceNode = new ParticleSourceNode(
      model.particleSourceModel,
      model.singleParticlesCollection,
      modelViewTransform,
      tandem.createTandem( 'particleSourceNode' )
    );

    const sternGerlachNodes = [
      new SternGerlachNode(
        model.sternGerlachs[ 0 ],
        modelViewTransform,
        { tandem: tandem.createTandem( 'firstSternGerlachNode' ), isBlockable: true } ),
      new SternGerlachNode(
        model.sternGerlachs[ 1 ],
        modelViewTransform,
        { tandem: tandem.createTandem( 'secondSternGerlachNode' ) } ),
      new SternGerlachNode(
        model.sternGerlachs[ 2 ],
        modelViewTransform,
        { tandem: tandem.createTandem( 'thirdSternGerlachNode' ) } )
    ];

    const measurementLines = [
      new MeasurementDeviceNode( model.measurementLines[ 0 ], modelViewTransform, { tandem: tandem.createTandem( 'firstMeasurementDevice' ) } ),
      new MeasurementDeviceNode( model.measurementLines[ 1 ], modelViewTransform, { tandem: tandem.createTandem( 'secondMeasurementDevice' ) } ),
      new MeasurementDeviceNode( model.measurementLines[ 2 ], modelViewTransform, { tandem: tandem.createTandem( 'thirdMeasurementDevice' ) } )
    ];

    let histogramCounter = 1;
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

      const tandemName = `histogram${histogramCounter++}`;

      return new HistogramWithExpectedValue(
        sternGerlach.upCounterProperty,
        sternGerlach.downCounterProperty,
        sternGerlach.upProbabilityProperty,
        model.expectedPercentageVisibleProperty,
        [
          new RichText( spinUpLabelStringProperty, { font: new PhetFont( { size: 17, weight: 'bold' } ) } ),
          new RichText( spinDownLabelStringProperty, { font: new PhetFont( { size: 17, weight: 'bold' } ) } )
        ],
        {
          center: modelViewTransform.modelToViewPosition( new Vector2( sternGerlach.positionProperty.value.x, 1.1 ) ),
          displayMode: 'percent',
          scale: 0.8,
          leftFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
          visibleProperty: visibleProperty,
          tandem: tandem.createTandem( tandemName ),
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
        model.particleSourceModel.isContinuousModeProperty
      ),

      createPercentageHistogram(
        model.sternGerlachs[ 1 ],
        new DerivedProperty(
          [
            model.particleSourceModel.sourceModeProperty,
            model.currentExperimentProperty,
            model.sternGerlachs[ 0 ].blockingModeProperty
          ],
          ( sourceMode, experiment, blockingMode ) => {
            return sourceMode === SourceMode.CONTINUOUS && !experiment.usingSingleApparatus && blockingMode === BlockingMode.BLOCK_DOWN;
          } ) ),

      createPercentageHistogram(
        model.sternGerlachs[ 2 ],
        new DerivedProperty(
          [
            model.particleSourceModel.sourceModeProperty,
            model.currentExperimentProperty,
            model.sternGerlachs[ 0 ].blockingModeProperty
          ],
          ( sourceMode, experiment, blockingMode ) => {
            return sourceMode === SourceMode.CONTINUOUS && !experiment.usingSingleApparatus && blockingMode === BlockingMode.BLOCK_UP;
          } ) )
    ];

    const singleParticleNodes: ShadedSphereNode[] = [];

    const manyParticlesCanvasNode = new ManyParticlesCanvasNode(
      model.multipleParticlesCollection.particles,
      modelViewTransform,
      layoutBounds,
      {
        visibleProperty: model.particleSourceModel.isContinuousModeProperty
      }
    );

    const exectedPercentageCheckboxTandem = tandem.createTandem( 'expectedPercentageCheckbox' );
    const expectedPercentageCheckbox = new Checkbox(
      model.expectedPercentageVisibleProperty,
      new HBox( {
        children: [
          new Text( QuantumMeasurementStrings.expectedPercentageStringProperty, { font: new PhetFont( 16 ) } ),
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
        visibleProperty: new GatedVisibleProperty( new DerivedProperty(
          [ model.particleSourceModel.sourceModeProperty ],
          sourceMode => sourceMode === SourceMode.CONTINUOUS
        ), exectedPercentageCheckboxTandem ),
        tandem: exectedPercentageCheckboxTandem
      } );

    const exitBlockerNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, 35 ), {
      stroke: 'black',
      lineWidth: 5
    } );

    model.exitBlockerPositionProperty.link( position => {
      if ( position !== null ) {
        exitBlockerNode.visible = true;
        exitBlockerNode.rotation = model.sternGerlachs[ 0 ].blockingModeProperty.value === BlockingMode.BLOCK_UP ?
                                   Utils.toRadians( -10 ) :
                                   Utils.toRadians( 10 );
        exitBlockerNode.center = modelViewTransform.modelToViewPosition( position );
      }
      else {
        exitBlockerNode.visible = false;
      }
    } );

    const experimentAreaNode = new Node( {
      children: [
        manyParticlesCanvasNode,
        ...singleParticleNodes,
        particleSourceNode,
        ...sternGerlachNodes,
        ...measurementLines,
        ...histograms,
        expectedPercentageCheckbox,
        exitBlockerNode
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

    // Add the sprites for the photons after calling the super constructor so that we can use the bounds to set the
    // canvas size.
    this.particleSprites = new ParticleSprites(
      model.singleParticlesCollection.particles,
      modelViewTransform,
      experimentAreaNode.localBounds.copy()
    );
    this.particleSprites.visibleProperty = DerivedProperty.not( model.particleSourceModel.isContinuousModeProperty );
    experimentAreaNode.addChild( this.particleSprites );
    this.particleSprites.moveToBack();

    this.measurementLines = measurementLines;
    this.manyParticlesCanvasNode = manyParticlesCanvasNode;


  }

  public step( dt: number ): void {
    this.manyParticlesCanvasNode.step();
    this.particleSprites.update();
  }

  public reset(): void {
    this.measurementLines.forEach( line => line.reset() );
  }
}

quantumMeasurement.register( 'SpinMeasurementArea', SpinMeasurementArea );