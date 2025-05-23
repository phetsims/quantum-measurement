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
  screenBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'screenBackgroundColor', {
    default: 'white'
  } ),

  // color for the vertical divider line that separates portions of the scenes, used on multiple screens in this sim
  dividerLineStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'dividerLineStroke', {
    default: '#000'
  } ),

  /**
   * COINS SCREEN COLORS --------------------------------------------------------
   */

  // colors for selector button
  selectorButtonSelectedColorProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonSelected', {
    default: 'rgb(255, 255, 255)'
  } ),
  selectorButtonDeselectedColorProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonDeselected', {
    default: '#aaa'
  } ),
  selectorButtonSelectedStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonSelectedStroke', {
    default: 'rgb(0, 148, 189)'
  } ),
  selectorButtonDeselectedStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'selectorButtonDeselectedStroke', {
    default: '#000'
  } ),

  // separate background colors for classical & quantum
  classicalSceneBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalSceneBackgroundColor', {
    default: 'rgb(255, 249, 240)' // Placeholder color
  } ),
  quantumSceneBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumSceneBackgroundColor', {
    default: 'rgb(245, 250, 254)' // Placeholder color
  } ),

  // text color for the quantum scene (for the currently blue text)
  classicalSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalSceneTextColor', {
    default: '#000'
  } ),
  quantumSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumSceneTextColor', {
    default: '#000'
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
  testBoxRectangleStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxRectangleStroke', {
    default: '#777'
  } ),
  testBoxLinearGradient1ColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxLinearGradient1Color', {
    default: '#EEE'
  } ),
  testBoxLinearGradient2ColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxLinearGradient2Color', {
    default: '#bae3e0'
  } ),

  // coin fills
  maskedFillProperty: new ProfileColorProperty( quantumMeasurement, 'maskedFill', {
    default: '#CCC'
  } ),
  headsFillProperty: new ProfileColorProperty( quantumMeasurement, 'headsFill', {
    default: 'rgb(240, 240, 240)'
  } ),
  tailsFillProperty: new ProfileColorProperty( quantumMeasurement, 'tailsFill', {
    default: 'rgb(240, 240, 240)'
  } ),
  upFillProperty: new ProfileColorProperty( quantumMeasurement, 'upFill', {
    default: '#0FF'
  } ),
  downFillProperty: new ProfileColorProperty( quantumMeasurement, 'downFill', {
    default: '#FF0'
  } ),

  // coin stroke color
  coinStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'coinStroke', {
    default: '#888'
  } ),

  // Start Measurement button
  startMeasurementButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'startMeasurementButtonColor', {
    default: 'rgb(114, 235, 151)'
  } ),

  // New Coin button
  newCoinButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'newCoinButtonColor', {
    default: 'rgb(114, 235, 151)'
  } ),

  // Experiment button sets
  experimentButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'experimentButtonColor', {
    default: 'rgb(153, 205, 255)'
  } ),

  // control panels
  controlPanelStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelStroke', {
    default: 'transparent'
  } ),
  controlPanelFillProperty: new ProfileColorProperty( quantumMeasurement, 'controlPanelFillColor', {
    default: 'rgb(240, 240, 240)'
  } ),

  // colors used in the test boxes on the Coins screen
  multiCoinFirstGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinFirstGradientColor', {
    default: '#EEE'
  } ),
  multiCoinSecondGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinSecondGradientColor', {
    default: '#cceae8'
  } ),
  testBoxBackgroundFillProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxBackgroundFill', {
    default: '#fff'
  } ),

  /**
   * PHOTON SCREEN COLORS --------------------------------------------------------
   */

  // Colors for the photon polarization
  horizontalPolarizationColorProperty: new ProfileColorProperty( quantumMeasurement, 'horizontalPolarizationColor', {
    default: '#C0C'
  } ),
  verticalPolarizationColorProperty: new ProfileColorProperty( quantumMeasurement, 'verticalPolarizationColor', {
    default: '#00F'
  } ),
  photonStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'photonStroke', {
    default: '#0A0'
  } ),
  polarizationArrowFillProperty: new ProfileColorProperty( quantumMeasurement, 'polarizationArrowFill', {
    default: '#0F0'
  } ),
  polarizationArrowStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'polarizationArrowStroke', {
    default: '#000'
  } ),

  // Also used in spin screen
  expectedPercentageFillProperty: new ProfileColorProperty( quantumMeasurement, 'expectedPercentageFill', {
    default: 'rgb(0, 170, 0)'
  } ),

  // colors for elements on the "Photons" screen
  photonDetectorBodyColorProperty: new ProfileColorProperty( quantumMeasurement, 'photonDetectorBodyColor', {
    default: '#D1E2FA'
  } ),

  photonDetectorNumberFillProperty: new ProfileColorProperty( quantumMeasurement, 'photonDetectorNumberFill', {
    default: 'rgba( 255, 255, 255, 1 )'
  } ),

  splitterEnclosureNodeFillProperty: new ProfileColorProperty( quantumMeasurement, 'splitterEnclosureNodeFill', {
    default: 'rgba( 163, 255, 255, 0.53 )'
  } ),
  splitterLineNodeFillProperty: new ProfileColorProperty( quantumMeasurement, 'splitterLineNodeFill', {
    default: '#50FFFF'
  } ),

  particleSourceGradient1ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient1Color', {
    default: 'rgb(191, 190, 190)'
  } ),
  particleSourceGradient2ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient2Color', {
    default: 'white'
  } ),
  particleSourceGradient3ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient3Color', {
    default: 'rgb(135, 135, 135)'
  } ),

  angleIndicatorUnitCircleFillProperty: new ProfileColorProperty( quantumMeasurement, 'angleIndicatorUnitCircleFill', {
    default: '#aaa'
  } ),

  /**
   * SPIN SCREEN COLORS --------------------------------------------------------
   */

  // color for particles on the "Spin" screen particles.
  particleColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleColor', {
    default: '#C0C'
  } ),

  // color for the arrows that depict that magnetic field and the elements that control it
  magneticFieldArrowFillProperty: new ProfileColorProperty( quantumMeasurement, 'magneticFieldArrowFill', {
    default: '#FF0'
  } ),
  magneticFieldArrowStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'magneticFieldArrowStroke', {
    default: '#000'
  } ),

  // idle camera color, used for the Measurement Device Node
  cameraIdleFillProperty: new ProfileColorProperty( quantumMeasurement, 'cameraIdleFill', {
    default: '#000'
  } ),

  magneticFieldThumbFillProperty: new ProfileColorProperty( quantumMeasurement, 'magneticFieldThumbFill', {
    default: '#EE0'
  } ),

  // background for the box that contains the atoms on the Bloch Sphere screen
  systemUnderTestBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'systemUnderTestBackgroundColor', {
    default: '#FFF'
  } ),

  sternGerlachCurveStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'sternGerlachCurveStroke', {
    default: '#aff'
  } ),

  /**
   * BLOCH SCREEN COLORS --------------------------------------------------------
   */

  // Bloch sphere colors
  blockSphereMainColorProperty: new ProfileColorProperty( quantumMeasurement, 'blockSphereMainColor', {
    default: '#0FF'
  } ),
  blockSphereHighlightColorProperty: new ProfileColorProperty( quantumMeasurement, 'blockSphereHighlightColor', {
    default: '#FFF'
  } ),
  measurementTimerFillProperty: new ProfileColorProperty( quantumMeasurement, 'measurementTimerFillColor', {
    default: 'rgb(204, 0, 204)'
  } ),
  measurementTimerIconStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'measurementTimerIconStroke', {
    default: '#fff'
  } ),

  blochSphereAngleIndicatorDashedLineStrokeProperty: new ProfileColorProperty( quantumMeasurement, 'blochSphereAngleIndicatorDashedLineStroke', {
    default: 'rgb( 0, 0, 0 )'
  } )

};

quantumMeasurement.register( 'QuantumMeasurementColors', QuantumMeasurementColors );
export default QuantumMeasurementColors;