// Copyright 2024, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import quantumMeasurement from '../quantumMeasurement.js';

const QuantumMeasurementColors = {

  // Background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'background', {
    default: 'white'
  } ),

  selectorButtonSelectedColorProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonSelected', {
    default: '#0FF'
  } ),
  selectorButtonDeselectedColorProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonDeselected', {
    default: '#aaa'
  } ),
  selectorButtonSelectedStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonSelectedStroke', {
    default: '#000'
  } ),
  selectorButtonDeselectedStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonDeselectedStroke', {
    default: '#000'
  } ),

  // Separate background colors for classical & quantum
  classicalBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalBackground', {
    default: '#fff' // Placeholder color
  } ),
  quantumBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumBackground', {
    default: '#fff' // Placeholder color
  } ),

  // Text color for the quantum scene (for the currently blue text)
  classicalSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalSceneText', {
    default: '#000'
  } ),
  quantumSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumSceneText', {
    default: '#0000FF'
  } ),

  // Color representation of the possible states of the coins
  headsColorProperty: new ProfileColorProperty( quantumMeasurement, 'heads', {
    default: '#000'
  } ),
  tailsColorProperty: new ProfileColorProperty( quantumMeasurement, 'tails', {
    default: '#F0F'
  } ),
  upColorProperty: new ProfileColorProperty( quantumMeasurement, 'up', {
    default: '#000'
  } ),
  downColorProperty: new ProfileColorProperty( quantumMeasurement, 'down', {
    default: '#F0F'
  } ),

  // Coin fills
  maskedFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'maskedFill', {
    default: '#CCC'
  } ),
  headsFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'headsFill', {
    default: '#EFE4B0'
  } ),
  tailsFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'tailsFill', {
    default: '#EFE4B0'
  } ),
  upFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'upFill', {
    default: '#0FF'
  } ),
  downFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'downFill', {
    default: '#FF0'
  } ),

  // Coin stroke color
  coinStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'coinStroke', {
    default: '#888'
  } ),

  // Start Measurement button
  startMeasurementButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'startMeasurementButton', {
    default: '#0F0'
  } ),

  // New Coin button
  newCoinButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'newCoinButton', {
    default: '#0F0'
  } ),

  // Experiment button sets
  experimentButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'experimentButton', {
    default: '#0ffdfd'
  } ),

  // control panel stroke
  controlPanelStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelStroke', {
    default: 'transparent'
  } ),

  // control panel fill
  controlPanelFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelFill', {
    default: '#EEE'
  } ),

  multiCoinFirstGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinFirstGradient', {
    default: '#EEE'
  } ),
  multiCoinSecondGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinSecondGradient', {
    default: '#cceae8'
  } ),
  testBoxContentsRevealedFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxContentsRevealedFill', {
    default: 'rgba( 255, 255, 255, 0 )'
  } ),
  landingZoneFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'landingZoneFill', {
    default: 'rgba( 255, 192, 203, 0.5 )'
  } ),

  // Colors for the photon polarization
  horizontalPolarizationColorProperty: new ProfileColorProperty( quantumMeasurement, 'horizontalPolarization', {
    default: '#F0F'
  } ),
  verticalPolarizationColorProperty: new ProfileColorProperty( quantumMeasurement, 'verticalPolarization', {
    default: '#00F'
  } ),

  // Colors for elements on the "Photons" screen
  photonDetectorBodyColor: new ProfileColorProperty( quantumMeasurement, 'photonDetectorBody', {
    default: '#D1E2FA'
  } ),

  // Color for particles on the "Spin" screen particles.
  particleColor: new ProfileColorProperty( quantumMeasurement, 'particleColor', {
    default: '#F0F'
  } )
};

quantumMeasurement.register( 'QuantumMeasurementColors', QuantumMeasurementColors );
export default QuantumMeasurementColors;