// Copyright 2024, University of Colorado Boulder

/**
 * PhysicalCoinsExperimentSceneView is the parent node in which the "Physical Coin" scene is displayed.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinsExperimentSceneView, { CoinsExperimentSceneViewOptions } from './CoinsExperimentSceneView.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;
type PhysicalCoinsExperimentSceneViewOptions = SelfOptions & CoinsExperimentSceneViewOptions;

export default class PhysicalCoinsExperimentSceneView extends CoinsExperimentSceneView {

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: PhysicalCoinsExperimentSceneViewOptions ) {

    const options = optionize<PhysicalCoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      { visibleProperty: sceneModel.activeProperty },
      providedOptions
    );

    super( sceneModel, options );

    // Set up the header for the preparation area.
    const prepAreaHeadingTextProperty: TReadOnlyProperty<string> = new DerivedProperty(
      [
        QuantumMeasurementStrings.coinStringProperty,
        QuantumMeasurementStrings.itemToPreparePatternStringProperty,
        sceneModel.preparingExperimentProperty
      ],
      ( coinString, itemToPreparePattern, preparingExperiment ) => preparingExperiment ?
                                                                   StringUtils.fillIn( itemToPreparePattern, { item: coinString } ) :
                                                                   coinString
    );
    const prepAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 250 : 100
    );
    this.preparationArea.addChild( new SceneSectionHeader( prepAreaHeadingTextProperty, prepAreaHeaderLineWidthProperty ) );

    // Set up the top header for the measurement area.  It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    this.measurementArea.addChild( new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty
    ) );
  }
}

quantumMeasurement.register( 'PhysicalCoinsExperimentSceneView', PhysicalCoinsExperimentSceneView );