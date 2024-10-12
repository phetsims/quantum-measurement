// Copyright 2024, University of Colorado Boulder

/**
 * PhotonsExperimentSceneView is the view for the scenes depicted on the "Photons" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { Color, HBox, HBoxOptions, Rectangle } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import PhotonsExperimentSceneModel from '../model/PhotonsExperimentSceneModel.js';
// import PhotonPolarizationAngleControl from './PhotonPolarizationAngleControl.js';

type SelfOptions = EmptySelfOptions;
type PhotonsExperimentSceneViewOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class PhotonsExperimentSceneView extends HBox {

  public constructor( model: PhotonsExperimentSceneModel, providedOptions: PhotonsExperimentSceneViewOptions ) {

    // TODO: This set of rectangles is a placeholder for working on layout, see https://github.com/phetsims/quantum-measurement/issues/52
    const testRectHeight = 510;
    const testRect2 = new Rectangle( 0, 0, 370, testRectHeight, {
      fill: new Color( '#947A0C' ),
      stroke: new Color( '#947A0C' ).darkerColor( 0.5 ),
      lineWidth: 2
    } );
    const testRect3 = new Rectangle( 0, 0, 180, testRectHeight, {
      fill: new Color( '#44673A' ),
      stroke: new Color( '#44673A' ).darkerColor( 0.5 ),
      lineWidth: 2
    } );
    const testRect4 = new Rectangle( 0, 0, 210, testRectHeight, {
      fill: new Color( '#E8AA93' ),
      stroke: new Color( '#E8AA93' ).darkerColor( 0.5 ),
      lineWidth: 2
    } );

    // const photonPolarizationAngleControl = new PhotonPolarizationAngleControl(
    //   model.polarizingBeamSplitter.presetPolarizationDirectionProperty,
    //   model.polarizingBeamSplitter.customPolarizationAngleProperty,
    //   {
    //     tandem: providedOptions.tandem.createTandem( 'photonPolarizationAngleControl' )
    //   }
    // );

    const options = optionize<PhotonsExperimentSceneViewOptions, SelfOptions, HBoxOptions>()( {
      children: [
        // photonPolarizationAngleControl,

        testRect2, testRect3, testRect4 ],
      spacing: 3,
      align: 'bottom'
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonsExperimentSceneView', PhotonsExperimentSceneView );