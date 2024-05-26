// Copyright 2024, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.  See see https://github.com/phetsims/quantum-measurement/issues/1.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import SpinModel from '../model/SpinModel.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Image } from '../../../../scenery/js/imports.js';
import spinScreenMockup_png from '../../../images/spinScreenMockup_png.js';
import MockupOpacitySlider from '../../common/MockupOpacitySlider.js';
import mockupOpacityProperty from '../../common/mockupOpacityProperty.js';

type SelfOptions = {
 //TODO add options that are specific to QuantumMeasurementScreenView here, see https://github.com/phetsims/quantum-measurement/issues/1
};

type QuantumMeasurementScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class SpinScreenView extends ScreenView {

  public constructor( model: SpinModel, providedOptions: QuantumMeasurementScreenViewOptions ) {

    const options = optionize<QuantumMeasurementScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here, see https://github.com/phetsims/quantum-measurement/issues/1

      //TODO add default values for optional ScreenViewOptions here, see https://github.com/phetsims/quantum-measurement/issues/1
    }, providedOptions );

    super( options );

    // Add a screen mockup.  TODO: Remove this eventually, see https://github.com/phetsims/quantum-measurement/issues/3.
    console.log( `this.layoutBounds.width = ${this.layoutBounds.width}` );
    const mockup = new Image( spinScreenMockup_png, {
      scale: this.layoutBounds.width / spinScreenMockup_png.width
    } );
    this.addChild( mockup );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - QuantumMeasurementConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - QuantumMeasurementConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // Add slider that controls mockup opacity.
    this.addChild( new MockupOpacitySlider( resetAllButton.bounds ) );

    // Update the mockup opacity.
    mockupOpacityProperty.link( opacity => {
      mockup.opacity = opacity;
    } );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    // TODO, see https://github.com/phetsims/quantum-measurement/issues/1
  }
}

quantumMeasurement.register( 'SpinScreenView', SpinScreenView );