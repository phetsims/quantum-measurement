// Copyright 2024, University of Colorado Boulder

/**
 * Base class for all screen views in the Quantum Measurement sim.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = EmptySelfOptions;
type QuantumMeasurementScreenViewOptions = SelfOptions & WithRequired<ScreenViewOptions, 'tandem'>;

export default class QuantumMeasurementScreenView extends ScreenView {

  public constructor( providedOptions: QuantumMeasurementScreenViewOptions ) {

    super( providedOptions );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        this.reset();
      },
      right: this.layoutBounds.maxX - QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: providedOptions.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view. Override as needed in subclasses.
   */
  public reset(): void {
    // Does nothing in base class.
  }
}

quantumMeasurement.register( 'QuantumMeasurementScreenView', QuantumMeasurementScreenView );