// Copyright 2024-2025, University of Colorado Boulder

/**
 * SpinMeasurementArea is a composite UI component that allows users to configure a Stern-Gerlach experiment.
 * A comboBox allows to choose between a number of experimental configurations.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import GatedVisibleProperty from '../../../../axon/js/GatedVisibleProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
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
import ParticleSprites from './ParticleSprites.js';
import SternGerlachNode from './SternGerlachNode.js';

const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class SpinMeasurementArea extends VBox {

  private manyParticlesCanvasNode: ManyParticlesCanvasNode;

  private readonly measurementDevices: MeasurementDeviceNode[];

  private readonly particleSprites: ParticleSprites;

  public constructor( model: SpinModel, parentNode: Node, layoutBounds: Bounds2, tandem: Tandem ) {

    const items: ComboBoxItem<SpinExperiment>[] = SpinExperiment.enumeration.values.map( experiment => {
      return {
        value: experiment,
        createNode: () => new Text( experiment.experimentName, { font: QuantumMeasurementConstants.TITLE_FONT, maxWidth: 300 } ),
        tandemName: `${experiment.experimentTandemName}Item`
      };
    } );

    const experimentComboBox = new ComboBox( model.experimentProperty, items, parentNode, {
      tandem: tandem.createTandem( 'experimentComboBox' )
    } );

    // Model View Transform to translate from model coordinates to view coordinates
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

    const sternGerlachNodesParentTandem = tandem.createTandem( 'sternGerlachs' );

    const sternGerlachNodes = [
      new SternGerlachNode(
        model.sternGerlachs[ 0 ],
        modelViewTransform,
        { tandem: sternGerlachNodesParentTandem.createTandem( 'firstSternGerlachNode' ), isBlockable: true } ),
      new SternGerlachNode(
        model.sternGerlachs[ 1 ],
        modelViewTransform,
        { tandem: sternGerlachNodesParentTandem.createTandem( 'secondSternGerlachNode' ) } ),
      new SternGerlachNode(
        model.sternGerlachs[ 2 ],
        modelViewTransform,
        { tandem: sternGerlachNodesParentTandem.createTandem( 'thirdSternGerlachNode' ) } )
    ];

    const measurementDevicesTandem = tandem.createTandem( 'measurementDevices' );

    const measurementDevices = [
      new MeasurementDeviceNode(
        model.measurementDevices[ 0 ],
        modelViewTransform,
        { tandem: measurementDevicesTandem.createTandem( 'firstMeasurementDeviceNode' ) }
      ),
      new MeasurementDeviceNode(
        model.measurementDevices[ 1 ],
        modelViewTransform,
        { tandem: measurementDevicesTandem.createTandem( 'secondMeasurementDeviceNode' ) }
      ),
      new MeasurementDeviceNode(
        model.measurementDevices[ 2 ],
        modelViewTransform,
        { tandem: measurementDevicesTandem.createTandem( 'thirdMeasurementDeviceNode' ) }
      )
    ];

    const histogramParentTandem = tandem.createTandem( 'histograms' );
    let histogramCounter = 1;
    const createPercentageHistogram = ( sternGerlach: SternGerlach, visibleProperty: TReadOnlyProperty<boolean> ) => {

      const spinUpLabelStringProperty = new DerivedStringProperty(
        [ sternGerlach.isZOrientedProperty ],
        isZOriented => isZOriented ? `|${UP}<sub>Z</sub> ${KET}` : `|${UP}<sub>X</sub> ${KET}`
      );
      const spinDownLabelStringProperty = new DerivedStringProperty(
        [ sternGerlach.isZOrientedProperty ],
        isZOriented => isZOriented ? `|${DOWN}<sub>Z</sub> ${KET}` : `|${DOWN}<sub>X</sub> ${KET}`
      );

      const tandemName = `histogramNode${histogramCounter++}`;

      return new HistogramWithExpectedValue(
        sternGerlach.upCounterProperty,
        sternGerlach.downCounterProperty,
        sternGerlach.upProbabilityProperty,
        DerivedProperty.and( [ model.expectedPercentageVisibleProperty, sternGerlach.arePhotonsArrivingProperty ] ),
        [
          new RichText( spinUpLabelStringProperty, { font: QuantumMeasurementConstants.BOLD_HEADER_FONT } ),
          new RichText( spinDownLabelStringProperty, { font: QuantumMeasurementConstants.BOLD_HEADER_FONT } )
        ],
        {
          center: modelViewTransform.modelToViewPosition( new Vector2( sternGerlach.positionProperty.value.x, 1.1 ) ),
          displayMode: 'percent',
          scale: 0.8,
          leftFillColorProperty: QuantumMeasurementColors.tailsColorProperty,
          visibleProperty: visibleProperty,
          tandem: histogramParentTandem.createTandem( tandemName ),
          numberDisplayOptions: {
            textOptions: {
              font: QuantumMeasurementConstants.TITLE_FONT
            }
          }
        }
      );
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
            model.experimentProperty,
            model.sternGerlachs[ 0 ].blockingModeProperty
          ],
          ( sourceMode, experiment, blockingMode ) => {
            return sourceMode === SourceMode.CONTINUOUS && !experiment.usingSingleApparatus && blockingMode === BlockingMode.BLOCK_DOWN;
          }
        )
      ),

      createPercentageHistogram(
        model.sternGerlachs[ 2 ],
        new DerivedProperty(
          [
            model.particleSourceModel.sourceModeProperty,
            model.experimentProperty,
            model.sternGerlachs[ 0 ].blockingModeProperty
          ],
          ( sourceMode, experiment, blockingMode ) => {
            return sourceMode === SourceMode.CONTINUOUS && !experiment.usingSingleApparatus && blockingMode === BlockingMode.BLOCK_UP;
          }
        )
      )
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

    const expectedPercentageCheckboxTandem = tandem.createTandem( 'expectedPercentageCheckbox' );
    const expectedPercentageCheckbox = new Checkbox(
      model.expectedPercentageVisibleProperty,
      new HBox( {
        children: [
          new Text( QuantumMeasurementStrings.expectedPercentageStringProperty, {
            font: QuantumMeasurementConstants.CONTROL_FONT,
            maxWidth: 200
          } ),
          new Path( new Shape().moveTo( 0, 0 ).lineTo( 20, 0 ),
            QuantumMeasurementConstants.EXPECTED_PERCENTAGE_PATH_OPTIONS
          )
        ],
        spacing: 5
      } ),
      {
        boxWidth: QuantumMeasurementConstants.CHECKBOX_BOX_WIDTH,
        left: particleSourceNode.left,
        top: particleSourceNode.bottom + 30,
        visibleProperty: new GatedVisibleProperty( new DerivedProperty(
          [ model.particleSourceModel.sourceModeProperty ],
          sourceMode => sourceMode === SourceMode.CONTINUOUS
        ), expectedPercentageCheckboxTandem ),
        tandem: expectedPercentageCheckboxTandem
      }
    );

    const exitBlockerNode = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, 35 ), {
      stroke: 'black',
      lineWidth: 5
    } );

    model.exitBlockerPositionProperty.link( position => {
      if ( position !== null ) {
        exitBlockerNode.visible = true;
        exitBlockerNode.rotation = model.sternGerlachs[ 0 ].blockingModeProperty.value === BlockingMode.BLOCK_UP ?
                                   toRadians( -10 ) :
                                   toRadians( 10 );
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
        ...measurementDevices,
        ...histograms,
        expectedPercentageCheckbox,
        exitBlockerNode
      ]
    } );

    experimentAreaNode.pdomOrder = [
      particleSourceNode,
      expectedPercentageCheckbox,
      ...sternGerlachNodes,
      ...measurementDevices,
      ...histograms
    ];

    super( {
      children: [
        experimentComboBox,
        new Text( QuantumMeasurementStrings.SternGerlachMeasurementsStringProperty, {
          font: QuantumMeasurementConstants.BOLD_HEADER_FONT,
          maxWidth: 400
        } ),
        experimentAreaNode
      ],
      align: 'left',
      spacing: 10,
      xMargin: 30,
      yMargin: 10
    } );

    // Add the sprites for the particles after calling the super constructor so that we can use the bounds to set the
    // canvas size.
    this.particleSprites = new ParticleSprites(
      model.singleParticlesCollection.particles,
      modelViewTransform,
      experimentAreaNode.localBounds.copy()
    );
    this.particleSprites.visibleProperty = DerivedProperty.not( model.particleSourceModel.isContinuousModeProperty );
    experimentAreaNode.addChild( this.particleSprites );
    this.particleSprites.moveToBack();

    this.measurementDevices = measurementDevices;
    this.manyParticlesCanvasNode = manyParticlesCanvasNode;

    this.pdomOrder = [
      experimentAreaNode,
      experimentComboBox
    ];
  }

  public step( dt: number ): void {
    this.manyParticlesCanvasNode.step();
    this.particleSprites.update();
  }

  public reset(): void {
    this.measurementDevices.forEach( device => device.reset() );
  }
}

quantumMeasurement.register( 'SpinMeasurementArea', SpinMeasurementArea );