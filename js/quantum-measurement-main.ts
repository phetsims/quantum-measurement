// Copyright 2024, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CoinsScreen from './coins/CoinsScreen.js';
import QuantumMeasurementStrings from './QuantumMeasurementStrings.js';
import './common/QuantumMeasurementQueryParameters.js';
import PhotonsScreen from './photons/PhotonsScreen.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = QuantumMeasurementStrings[ 'quantum-measurement' ].titleStringProperty;

  const screens = [
    new CoinsScreen( { tandem: Tandem.ROOT.createTandem( 'coinsScreen' ) } ),
    new PhotonsScreen( { tandem: Tandem.ROOT.createTandem( 'photonsScreen' ) } )
  ];

  const options: SimOptions = {

    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      contributors: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );