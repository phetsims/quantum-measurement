// Copyright 2024-2025, University of Colorado Boulder

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

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import quantumMeasurement from '../quantumMeasurement.js';

const QuantumMeasurementColors = {

  // background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'background', {
    default: 'white'
  } ),

  /**
   * COINS SCREEN COLORS --------------------------------------------------------
   */

  // colors for selector button
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

  // separate background colors for classical & quantum
  classicalBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalBackground', {
    default: '#fff' // Placeholder color
  } ),
  quantumBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumBackground', {
    default: '#fff' // Placeholder color
  } ),

  // text color for the quantum scene (for the currently blue text)
  classicalSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalSceneText', {
    default: '#000'
  } ),
  quantumSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumSceneText', {
    default: '#0000FF'
  } ),

  // color representation of the possible states of the coins
  headsColorProperty: new ProfileColorProperty( quantumMeasurement, 'heads', {
    default: '#000'
  } ),
  tailsColorProperty: new ProfileColorProperty( quantumMeasurement, 'tails', {
    default: '#C0C'
  } ),
  upColorProperty: new ProfileColorProperty( quantumMeasurement, 'up', {
    default: '#000'
  } ),
  downColorProperty: new ProfileColorProperty( quantumMeasurement, 'down', {
    default: '#C0C'
  } ),

  // test boxes
  testBoxRectangleStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxRectangleFill', {
    default: '#777'
  } ),
  testBoxLinearGradient1ColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxLinearGradient1Color', {
    default: '#EEE'
  } ),
  testBoxLinearGradient2ColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxLinearGradient2Color', {
    default: '#bae3e0'
  } ),

  // coin fills
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

  // coin stroke color
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

  // control panels
  controlPanelStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelStroke', {
    default: 'transparent'
  } ),
  controlPanelFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelFill', {
    default: '#EEE'
  } ),

  // colors used in the test boxes on the Coins screen
  multiCoinFirstGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinFirstGradient', {
    default: '#EEE'
  } ),
  multiCoinSecondGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinSecondGradient', {
    default: '#cceae8'
  } ),
  testBoxContentsRevealedFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxContentsRevealedFill', {
    default: 'rgba( 255, 255, 255, 0 )'
  } ),

  /**
   * PHOTON SCREEN COLORS --------------------------------------------------------
   */

  // Colors for the photon polarization
  horizontalPolarizationColorProperty: new ProfileColorProperty( quantumMeasurement, 'horizontalPolarization', {
    default: '#C0C'
  } ),
  verticalPolarizationColorProperty: new ProfileColorProperty( quantumMeasurement, 'verticalPolarization', {
    default: '#00F'
  } ),
  photonBaseColorProperty: new ProfileColorProperty( quantumMeasurement, 'photonBaseColor', {
    default: '#0F0'
  } ),

  // colors for elements on the "Photons" screen
  photonDetectorBodyColorProperty: new ProfileColorProperty( quantumMeasurement, 'photonDetectorBody', {
    default: '#D1E2FA'
  } ),

  splitterEnclosureNodeFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'splitterEnclosureNodeFill', {
    default: '#A3FFFF'
  } ),
  splitterLineNodeFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'splitterLineNodeFill', {
    default: '#50FFFF'
  } ),

  particleSourceGradient1ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient1', {
    default: '#88f'
  } ),
  particleSourceGradient2ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient2', {
    default: 'white'
  } ),
  particleSourceGradient3ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient3', {
    default: 'blue'
  } ),

  /**
   * SPIN SCREEN COLORS --------------------------------------------------------
   */

  // color for particles on the "Spin" screen particles.
  particleColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleColor', {
    default: '#C0C'
  } ),

  // color for the arrows that depict that magnetic field and the elements that control it
  magneticFieldColorProperty: new ProfileColorProperty( quantumMeasurement, 'magneticFieldColor', {
    default: '#FF0'
  } ),

  magneticFieldThumbFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'magneticFieldThumbFill', {
    default: '#EE0'
  } ),

  // background for the box that contains the atoms on the Bloch Sphere screen
  systemUnderTestBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'systemUnderTestBackground', {
    default: '#FFF'
  } ),

  expectedPercentageFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'expectedPercentageFill', {
    default: '#0a0'
  } ),

  sternGerlachCurveColorProperty: new ProfileColorProperty( quantumMeasurement, 'sternGerlachCurve', {
    default: '#aff'
  } ),

  /**
   * BLOCH SCREEN COLORS --------------------------------------------------------
   */

  // Bloch sphere colors
  blockSphereMainColorProperty: new ProfileColorProperty( quantumMeasurement, 'blockSphereMain', {
    default: '#0FF'
  } ),
  blockSphereHighlightColorProperty: new ProfileColorProperty( quantumMeasurement, 'blockSphereHighlight', {
    default: '#FFF'
  } ),
  measurementTimerFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'measurementTimerFill', {
    default: '#f0f'
  } )

};

quantumMeasurement.register( 'QuantumMeasurementColors', QuantumMeasurementColors );
export default QuantumMeasurementColors;