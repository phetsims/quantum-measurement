// Copyright 2024, University of Colorado Boulder

/**
 * CoinExperimentMeasurementArea is a composite UI component that presents two areas - one for a single coin and one for
 * multiple coins - where uses can flip and reveal coins.  Depending on how this is parameterized, the coins may either
 * be physical or "quantum coins".
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, LinearGradient, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CoinExperimentMeasurementArea extends VBox {

  public constructor( sceneModel: CoinsExperimentSceneModel, tandem: Tandem ) {

    const textColor = sceneModel.systemType === 'quantum' ? Color.BLUE : Color.BLACK;

    // Add the top header for the measurement area.  It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    const singleCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColor }
    );

    // Add the area where the single coin will be hidden and revealed.
    const singleCoinTestAreaSideWidth = 150;
    const singleCoinMeasurementArea = new Rectangle( 0, 0, singleCoinTestAreaSideWidth, 130, {
      fill: new LinearGradient( 0, 0, singleCoinTestAreaSideWidth, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      opacity: 0.8,
      lineWidth: 17,
      stroke: new Color( '#222222' )
    } );

    // Add the lower heading for the measurement area.
    const multiCoinSectionHeader = new SceneSectionHeader(
      QuantumMeasurementStrings.multipleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty,
      { textColor: textColor }
    );

    // Add the area where the multiple coins will be hidden and revealed.
    const multipleCoinTestAreaSideLength = 200;
    const multipleCoinMeasurementArea = new Rectangle( 0, 0, multipleCoinTestAreaSideLength, multipleCoinTestAreaSideLength, {
      fill: new LinearGradient( 0, 0, multipleCoinTestAreaSideLength, 0 )
        .addColorStop( 0, new Color( '#eeeeee' ) )
        .addColorStop( 1, new Color( '#cceae8' ) ),
      lineWidth: 2,
      stroke: new Color( '#666666' )
    } );

    super( {
      children: [
        singleCoinSectionHeader,
        singleCoinMeasurementArea,
        multiCoinSectionHeader,
        multipleCoinMeasurementArea
      ],
      spacing: 25
    } );
  }
}

quantumMeasurement.register( 'CoinExperimentMeasurementArea', CoinExperimentMeasurementArea );