// Copyright 2024, University of Colorado Boulder

/**
 * QuantumCoinsExperimentSceneView is the parent node in which the "Quantum Coin" scene is displayed.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinsExperimentSceneView, { CoinsExperimentSceneViewOptions } from './CoinsExperimentSceneView.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

type SelfOptions = EmptySelfOptions;
type QuantumCoinsExperimentSceneViewOptions = SelfOptions & CoinsExperimentSceneViewOptions;

export default class QuantumCoinsExperimentSceneView extends CoinsExperimentSceneView {

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: QuantumCoinsExperimentSceneViewOptions ) {

    const options = optionize<QuantumCoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      { visibleProperty: sceneModel.activeProperty },
      providedOptions
    );

    super( sceneModel, options );

    // Set up the header for the preparation area.
    const prepAreaHeadingTextProperty: TReadOnlyProperty<string> = new DerivedProperty(
      [
        QuantumMeasurementStrings.coinStringProperty,
        QuantumMeasurementStrings.quantumCoinQuotedStringProperty,
        QuantumMeasurementStrings.itemToPreparePatternStringProperty,
        sceneModel.preparingExperimentProperty
      ],
      ( coinString, quantumCoinString, itemToPreparePattern, preparingExperiment ) => {
        let returnText;
        if ( preparingExperiment ) {
          returnText = StringUtils.fillIn( itemToPreparePattern, { item: quantumCoinString } );
        }
        else {
          returnText = coinString;
        }
        return returnText;
      }
    );
    const prepAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 250 : 100
    );
    const preparationAreaHeader = new SceneSectionHeader(
      prepAreaHeadingTextProperty,
      prepAreaHeaderLineWidthProperty,
      { textColor: Color.BLUE }
    );
    this.preparationArea.addChild( preparationAreaHeader );

    // Set up the top header for the measurement area.  It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    const singleCoinMeasurementsHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: Color.BLUE }
    );
    this.measurementArea.addChild( singleCoinMeasurementsHeader );

    // Update the activity area positions now that they have some content.
    this.updateActivityAreaPositions();
  }
}

quantumMeasurement.register( 'QuantumCoinsExperimentSceneView', QuantumCoinsExperimentSceneView );