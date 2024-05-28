// Copyright 2024, University of Colorado Boulder

/**
 * Base class for all screen views in the Quantum Measurement sim.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MockupOpacitySlider from '../../common/MockupOpacitySlider.js';
import { Image } from '../../../../scenery/js/imports.js';

type SelfOptions = {

  // image source for a mockup that will be added to the background if provided
  mockupImage?: Image | null;
};

type QuantumMeasurementScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class QuantumMeasurementScreenView extends ScreenView {

  public constructor( providedOptions: QuantumMeasurementScreenViewOptions ) {

    const options = optionize<QuantumMeasurementScreenViewOptions, SelfOptions, ScreenViewOptions>()( {
      mockupImage: null
    }, providedOptions );

    super( options );

    // Add a screen mockup if one has been provided.
    // TODO: This is for early prototyping and should be removed eventually, see https://github.com/phetsims/quantum-measurement/issues/3.
    if ( options.mockupImage !== null ) {

      this.addChild( options.mockupImage );

      // Add a slider that can be used to control the mockup opacity.
      this.addChild( new MockupOpacitySlider( options.mockupImage ) );
    }

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        this.reset();
      },
      right: this.layoutBounds.maxX - QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
  }

  /**
   * Resets the view.  Override as needed in subclasses.
   */
  public reset(): void {
    // Does nothing in base class.
  }
}

quantumMeasurement.register( 'QuantumMeasurementScreenView', QuantumMeasurementScreenView );