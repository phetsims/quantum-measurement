// Copyright 2024-2025, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import BlochSphereScreen from './bloch-sphere/BlochSphereScreen.js';
import CoinsScreen from './coins/CoinsScreen.js';
import QuantumMeasurementPreferencesNode from './common/view/QuantumMeasurementPreferencesNode.js';
import PhotonsScreen from './photons/PhotonsScreen.js';
import QuantumMeasurementStrings from './QuantumMeasurementStrings.js';
import './common/QuantumMeasurementQueryParameters.js';
import SpinScreen from './spin/SpinScreen.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds until the
// images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461.
simLauncher.launch( () => {

  const titleStringProperty = QuantumMeasurementStrings[ 'quantum-measurement' ].titleStringProperty;

  const screens = [
    new CoinsScreen( Tandem.ROOT.createTandem( 'coinsScreen' ) ),
    new PhotonsScreen( Tandem.ROOT.createTandem( 'photonsScreen' ) ),
    new SpinScreen( Tandem.ROOT.createTandem( 'spinScreen' ) ),
    new BlochSphereScreen( Tandem.ROOT.createTandem( 'blochSphereScreen' ) )
  ];

  const options: SimOptions = {

    credits: {
      leadDesign: 'Ariel Paul, Amy Rouinfar',
      softwareDevelopment: 'John Blanco, Agust\u00edn Vallejo',
      team: 'Mike Bennet, Josh Combes, Aiko Kyle, Phil Makotyn, Kathy Perkins, Ana Maria Rey, Martin Veillette',
      contributors: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    },

    preferencesModel: new PreferencesModel( {
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new QuantumMeasurementPreferencesNode( tandem.createTandem( 'simPreferences' ) )
        } ]
      }
    } )
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );