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
  classicalBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalBackground', {
    default: 'rgb(255, 249, 240)' // Placeholder color
  } ),
  quantumBackgroundColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumBackground', {
    default: 'rgb(245, 250, 254)' // Placeholder color
  } ),

  // text color for the quantum scene (for the currently blue text)
  classicalSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'classicalSceneText', {
    default: '#000'
  } ),
  quantumSceneTextColorProperty: new ProfileColorProperty( quantumMeasurement, 'quantumSceneText', {
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
    default: 'rgb(240, 240, 240)'
  } ),
  tailsFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'tailsFill', {
    default: 'rgb(240, 240, 240)'
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
    default: 'rgb(114, 235, 151)'
  } ),

  // New Coin button
  newCoinButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'newCoinButton', {
    default: 'rgb(114, 235, 151)'
  } ),

  // Experiment button sets
  experimentButtonColorProperty: new ProfileColorProperty( quantumMeasurement, 'experimentButton', {
    default: 'rgb(153, 205, 255)'
  } ),

  // control panels
  controlPanelStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'basisStatesPanelStroke', {
    default: 'transparent'
  } ),
  controlPanelFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'controlPanelFillColor', {
    default: 'rgb(240, 240, 240)'
  } ),

  // colors used in the test boxes on the Coins screen
  multiCoinFirstGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinFirstGradient', {
    default: '#EEE'
  } ),
  multiCoinSecondGradientColorProperty: new ProfileColorProperty( quantumMeasurement, 'multiCoinSecondGradient', {
    default: '#cceae8'
  } ),
  testBoxInteriorColorProperty: new ProfileColorProperty( quantumMeasurement, 'testBoxInteriorColorProperty', {
    default: '#fff'
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
    default: '#0A0'
  } ),
  polarizationArrowColorProperty: new ProfileColorProperty( quantumMeasurement, 'polarizationArrowColor', {
    default: '#0F0'
  } ),
  polarizationArrowStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'polarizationArrowStrokeColor', {
    default: '#000'
  } ),

  // Also used in spin screen
  expectedPercentageFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'expectedPercentageFill', {
    default: 'rgb(0, 170, 0)'
  } ),

  // colors for elements on the "Photons" screen
  photonDetectorBodyColorProperty: new ProfileColorProperty( quantumMeasurement, 'photonDetectorBody', {
    default: '#D1E2FA'
  } ),

  photonDetectorNumberFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'photonDetectorNumberFill', {
    default: 'rgba( 255, 255, 255, 1 )'
  } ),

  splitterEnclosureNodeFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'splitterEnclosureNodeFill', {
    default: 'rgba( 163, 255, 255, 0.53 )'
  } ),
  splitterLineNodeFillColorProperty: new ProfileColorProperty( quantumMeasurement, 'splitterLineNodeFill', {
    default: '#50FFFF'
  } ),

  particleSourceGradient1ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient1', {
    default: 'rgb(191, 190, 190)'
  } ),
  particleSourceGradient2ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient2', {
    default: 'white'
  } ),
  particleSourceGradient3ColorProperty: new ProfileColorProperty( quantumMeasurement, 'particleSourceGradient3', {
    default: 'rgb(135, 135, 135)'
  } ),

  angleIndicatorUnitCircleColorProperty: new ProfileColorProperty( quantumMeasurement, 'angleIndicatorUnitCircle', {
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
    default: 'rgb(204, 0, 204)'
  } ),
  measurementTimerIconStrokeColorProperty: new ProfileColorProperty( quantumMeasurement, 'measurementTimerIconStroke', {
    default: '#fff'
  } ),

  blochSphereAngleIndicatorDashedLineColorProperty: new ProfileColorProperty( quantumMeasurement, 'blochSphereAngleIndicatorDashedLine', {
    default: 'rgb( 0, 0, 0 )'
  } )

};

quantumMeasurement.register( 'QuantumMeasurementColors', QuantumMeasurementColors );
export default QuantumMeasurementColors;