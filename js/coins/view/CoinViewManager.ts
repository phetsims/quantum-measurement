// Copyright 2025, University of Colorado Boulder

/**
 *
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import CoinExperimentMeasurementArea from './CoinExperimentMeasurementArea.js';
import CoinsExperimentSceneView from './CoinsExperimentSceneView.js';

export default abstract class CoinViewManager {

  protected constructor( protected readonly measurementArea: CoinExperimentMeasurementArea ) {
  }

  /**
   * Get the scene view that contains the measurement area.  This is needed by the subclasses because they need to work
   * with the scene view to place the coin or coins that will be animated in their initial positions in the preparation
   * area.
   */
  protected getSceneView(): CoinsExperimentSceneView {

    // This code assumes that the parent of the measurement area is the scene view.  If that ever changes, adjustments
    // will be needed here.
    assert && assert(
      this.measurementArea.getParent() instanceof CoinsExperimentSceneView,
      'The parent of the measurement area is expected to be the scene view.'
    );

    return this.measurementArea.getParent() as CoinsExperimentSceneView;
  }

  /**
   * Get the x offset that is needed for the destination of the coins that are animating to the lower test box in the
   * measurement area.  This is needed by the subclasses because they sometimes need to animate to a moving target
   * depending on the state of the testing.  It's admittedly a bit tweaky, but there wasn't an obvious way to avoid it.
   */
  protected getLowerTestBoxXOffset( forReprepare: boolean ): number {
    return forReprepare ? 0 : -92; // empirically determined
  }

  /**
   * Start the animation of a coin or set of coins moving from the preparation area to a test box in the measurement
   * area.
   */
  public abstract startIngressAnimation( forReprepare: boolean ): void;

  /**
   * Abort the animation of a coin or set of coins moving from the preparation area to a test box in the measurement
   * area.
   */
  public abstract abortIngressAnimation(): void;
}

quantumMeasurement.register( 'CoinViewManager', CoinViewManager );