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
    default: 'cyan'
  } ),
  selectorButtonDeselectedColorProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonDeselected', {
    default: '#aaa'
  } ),

  // Separate background colors for classical & quantum
  classicalBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalBackground', {
    default: '#e0e0e0' // Placeholder color
  } ),
  quantumBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumBackground', {
    default: '#e0e0e0' // Placeholder color
  } ),

  // Experiment Type radio button stroke (selected & deselected)
  experimentTypeRadioButtonStrokeSelectedProperty: new ProfileColorProperty( quantumMeasurement, 'experimentTypeRadioButtonStrokeSelected', {
    default: '#007ACC' // Placeholder color
  } ),
  experimentTypeRadioButtonStrokeDeselectedProperty: new ProfileColorProperty( quantumMeasurement, 'experimentTypeRadioButtonStrokeDeselected', {
    default: '#777' // Placeholder color
  } ),

  // Experiment Type radio button fill (selected & deselected)
  experimentTypeRadioButtonFillSelectedProperty: new ProfileColorProperty( quantumMeasurement, 'experimentTypeRadioButtonFillSelected', {
    default: '#3399FF' // Placeholder color
  } ),
  experimentTypeRadioButtonFillDeselectedProperty: new ProfileColorProperty( quantumMeasurement, 'experimentTypeRadioButtonFillDeselected', {
    default: '#CCC' // Placeholder color
  } ),

  // Text color for the quantum scene (for the currently blue text)
  classicalSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalSceneText', {
    default: '#000' // Placeholder color
  } ),
  quantumSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumSceneText', {
    default: '#0000FF' // Placeholder color
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
    default: '#87CEEB' // Placeholder color (skyblue)
  } ),

  // Initial Orientation/Basis States panel stroke
  basisStatesPanelStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelStroke', {
    default: 'transparent'
  } ),

  // Initial Orientation/Basis States panel fill
  basisStatesPanelFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelFill', {
    default: '#EEE'
  } )
};

quantumMeasurement.register( 'QuantumMeasurementColors', QuantumMeasurementColors );
export default QuantumMeasurementColors;