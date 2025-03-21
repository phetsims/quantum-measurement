// Copyright 2025, University of Colorado Boulder

/**
 * SingleCoinMeasurementArea combines the test box and button set into a single Node.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinExperimentButtonSet from './CoinExperimentButtonSet.js';
import SingleCoinTestBox from './SingleCoinTestBox.js';

class SingleCoinMeasurementArea extends HBox {

  private readonly testBox: SingleCoinTestBox;

  public constructor( sceneModel: CoinsExperimentSceneModel,
                      singleCoinInTestBoxProperty: TProperty<boolean>,
                      tandem: Tandem ) {

    // Create the box where the single coin will be placed while it is experimented with.
    const testBox = new SingleCoinTestBox( sceneModel.singleCoin.measurementStateProperty );

    // Create the buttons that will be used to control the single-coin test box.
    const coinExperimentButtonSet = new CoinExperimentButtonSet(
      sceneModel.singleCoin,
      singleCoinInTestBoxProperty,
      {
        tandem: tandem.createTandem( 'coinExperimentButtonSet' ),
        visibleProperty: DerivedProperty.not( sceneModel.preparingExperimentProperty ),
        singleCoin: true
      }
    );

    sceneModel.preparingExperimentProperty.lazyLink( preparingExperiment => {
      if ( !preparingExperiment ) {

        // Because the button that triggers this state change is later in the PDOM order than the experiment buttons,
        // manually focus on the first button of this group when the model transitions out of the experiment preparation
        // phase. See https://github.com/phetsims/quantum-measurement/issues/89.
        coinExperimentButtonSet.focusOnRevealButton();
      }
    } );

    super( {
      children: [ testBox, coinExperimentButtonSet ],
      spacing: 30,
      tandem: tandem
    } );

    // Make some properties available externally.
    this.testBox = testBox;
  }

  public clearCoinsFromTestBox(): void {
    this.testBox.clearCoins();
  }

  public addCoinNodeToTestBox( coinNode: Node ): void {
    this.testBox.addCoinNode( coinNode );
  }

  public addCoinMaskNodeToTestBox( coinNodeMask: Node ): void {
    this.testBox.addCoinMaskNode( coinNodeMask );
  }
}

quantumMeasurement.register( 'SingleCoinMeasurementArea', SingleCoinMeasurementArea );

export default SingleCoinMeasurementArea;