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
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { SourceMode } from '../model/SourceMode.js';
import SpinExperiment from '../model/SpinExperiment.js';
import SpinModel from '../model/SpinModel.js';
import SternGerlach from '../model/SternGerlach.js';
import MeasurementLineNode from './MeasurementLineNode.js';
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

      // TODO: Translatable! https://github.com/phetsims/quantum-measurement/issues/53
      const spinUpLabelStringProperty = new DerivedStringProperty(
        [ sternGerlach.isZOrientedProperty ], isZOriented => isZOriented ?
                                                             'S<sub>z</sub>' + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER :
                                                             'S<sub>x</sub>' + QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER
      );
      const spinDownLabelStringProperty = new DerivedStringProperty(
        [ sternGerlach.isZOrientedProperty ], isZOriented => isZOriented ?
                                                             'S<sub>z</sub>' + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER :
                                                             'S<sub>x</sub>' + QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER
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

    const experimentAreaNode = new Node( {
      children: [
        particleSourceNode,
        ...sternGerlachNodes,
        ...measurementLines,
        ...histograms
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