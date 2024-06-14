// Copyright 2024, University of Colorado Boulder

/**
 * PhysicalCoinsExperimentSceneView is the parent node in which the "Physical Coin" scene is displayed.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, LinearGradient, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinsExperimentSceneView, { CoinsExperimentSceneViewOptions } from './CoinsExperimentSceneView.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = EmptySelfOptions;
type PhysicalCoinsExperimentSceneViewOptions = SelfOptions & CoinsExperimentSceneViewOptions;

export default class PhysicalCoinsExperimentSceneView extends CoinsExperimentSceneView {

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: PhysicalCoinsExperimentSceneViewOptions ) {

    const options = optionize<PhysicalCoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      { visibleProperty: sceneModel.activeProperty },
      providedOptions
    );

    super( sceneModel, options );

    // Add the top header for the measurement area.  It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    this.measurementArea.addChild( new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty
    ) );

    // Add the area where the single coin will be hidden and revealed.
    const singleCoinTestAreaSideLength = 150;
    const singleCoinMeasurementArea = new Rectangle( 0, 0, singleCoinTestAreaSideLength, singleCoinTestAreaSideLength, {
      fill: new LinearGradient( 0, 0, singleCoinTestAreaSideLength, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      opacity: 0.8,
      lineWidth: 10,
      stroke: new Color( '#666666' )
    } );
    this.measurementArea.addChild( singleCoinMeasurementArea );

    // Add the lower heading for the measurement area.
    this.measurementArea.addChild( new SceneSectionHeader(
      QuantumMeasurementStrings.multipleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty
    ) );

    // Add the area where the multiple coins will be hidden and revealed.
    const multipleCoinTestAreaSideLength = 200;
    const multipleCoinMeasurementArea = new Rectangle( 0, 0, multipleCoinTestAreaSideLength, multipleCoinTestAreaSideLength, {
      fill: new LinearGradient( 0, 0, multipleCoinTestAreaSideLength, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      lineWidth: 2,
      stroke: new Color( '#666666' )
    } );
    this.measurementArea.addChild( multipleCoinMeasurementArea );

    // Update the activity area positions now that they have some content.
    this.updateActivityAreaPositions();
  }
}

quantumMeasurement.register( 'PhysicalCoinsExperimentSceneView', PhysicalCoinsExperimentSceneView );