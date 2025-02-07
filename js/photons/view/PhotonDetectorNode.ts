// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonDetectorNode represents the photon detector in the view.  It appears to absorb photons and presents either a
 * total count or a rate of detection.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhotonDetector, { COUNT_RANGE, DetectionDirection, RATE_RANGE } from '../model/PhotonDetector.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// The size of the detector body.  The width is for the dimension perpendicular to the detection direction, and the
// height (which is really more like the depth) is for the dimension parallel to the detection direction.
const DETECTOR_BODY_SIZE = new Dimension2( 85, 50 );

const DISPLAY_FONT = new PhetFont( { size: 20, weight: 'bold' } );

export default class PhotonDetectorNode extends Node {

  public constructor( model: PhotonDetector,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PhotonDetectorNodeOptions ) {

    // Create the detection aperture.  This is essentially the anchor point for reset of the layout, meaning that the
    // other nodes are positioned relative to this.
    const apertureHeightInView = -modelViewTransform.modelToViewDeltaY( model.apertureHeight );
    const apertureWidthInView = modelViewTransform.modelToViewDeltaX( model.apertureDiameter );
    const apertureCenterY = model.detectionDirection === 'up' ?
                            modelViewTransform.modelToViewY( model.position.y + model.apertureHeight / 2 ) :
                            modelViewTransform.modelToViewY( model.position.y - model.apertureHeight / 2 );
    const aperture = new Rectangle( 0, 0, apertureWidthInView, apertureHeightInView, {
      fill: new LinearGradient( 0, 0, apertureWidthInView, 0 )
        .addColorStop( 0, new Color( '#FFDDEE' ) )
        .addColorStop( 1, Color.DARK_GRAY ),
      stroke: Color.DARK_GRAY,
      lineWidth: 1,
      centerX: modelViewTransform.modelToViewX( model.position.x ),
      centerY: apertureCenterY,
      opacity: 0.3
    } );

    // detector body
    const body = new Rectangle( 0, 0, DETECTOR_BODY_SIZE.width, DETECTOR_BODY_SIZE.height, {
      cornerRadius: 10,
      fill: new LinearGradient( 0, 0, 0, DETECTOR_BODY_SIZE.height )
        .addColorStop( 0, QuantumMeasurementColors.photonDetectorBodyColorProperty.value )
        .addColorStop( 0.1, QuantumMeasurementColors.photonDetectorBodyColorProperty.value.colorUtilsBrighter( 0.7 ) )
        .addColorStop( 0.3, QuantumMeasurementColors.photonDetectorBodyColorProperty.value )
        .addColorStop( 0.8, QuantumMeasurementColors.photonDetectorBodyColorProperty.value )
        .addColorStop( 1, QuantumMeasurementColors.photonDetectorBodyColorProperty.value.colorUtilsDarker( 0.2 ) ),
      stroke: QuantumMeasurementColors.photonDetectorBodyColorProperty.value.colorUtilsDarker( 0.5 ),
      lineWidth: 0.5,
      centerX: aperture.centerX
    } );

    // Declare the label.  Its value and position will be set later.
    let label: RichText;

    // Position the detector body and aperture based on the detection direction.
    if ( model.detectionDirection === 'up' ) {

      // Position the body above the aperture.
      body.bottom = aperture.top;

      // Create a derived property for the label.
      const labelStringProperty = new DerivedProperty(
        [
          QuantumMeasurementStrings.polarizationDetectorLabelPatternStringProperty,
          QuantumMeasurementStrings.verticalStringProperty,
          QuantumMeasurementColors.verticalPolarizationColorProperty
        ],
        ( labelStringPattern, orientationString, highlightColor ) => StringUtils.fillIn( labelStringPattern, {
          orientation: getBoldColoredString( orientationString, highlightColor )
        } )
      );

      // Create the label and position it above the detector body.
      label = new RichText( labelStringProperty, {
        font: new PhetFont( 12 ),
        align: 'center',
        centerX: body.centerX,
        bottom: body.top - 5,
        maxWidth: 200,
        maxHeight: 40
      } );

      // Make sure the label stays centered over the body.
      labelStringProperty.link( () => {
        label.centerX = body.centerX;
        label.bottom = body.top - 5;
      } );
    }
    else if ( model.detectionDirection === 'down' ) {

      // Position the body below the aperture.
      body.top = aperture.bottom;

      // Create a derived property for the label.
      const labelStringProperty = new DerivedProperty(
        [
          QuantumMeasurementStrings.polarizationDetectorLabelPatternStringProperty,
          QuantumMeasurementStrings.horizontalStringProperty,
          QuantumMeasurementColors.horizontalPolarizationColorProperty
        ],
        ( labelStringPattern, orientationString, highlightColor ) => StringUtils.fillIn( labelStringPattern, {
          orientation: getBoldColoredString( orientationString, highlightColor )
        } )
      );

      // Create the label and position it below the detector body.
      label = new RichText( labelStringProperty, {
        font: new PhetFont( 12 ),
        align: 'center',
        centerX: body.centerX,
        top: body.bottom + 5,
        maxWidth: 200,
        maxHeight: 40
      } );

      // Make sure the label stays centered over the body.
      labelStringProperty.link( () => {
        label.centerX = body.centerX;
        label.top = body.bottom + 5;
      } );
    }
    else {
      assert && assert( false, `unsupported detection direction: ${model.detectionDirection}` );
      label = new RichText( '' );
    }

    // Add a readout of either the detection rate or the detection count.
    const countReadout = model.displayMode === 'count' ?
                         new PhotonCountDisplay(
                           model.detectionCountProperty,
                           model.detectionDirection,
                           body.center
                         ) :
                         new PhotonRateDisplay(
                           model.detectionRateProperty,
                           model.detectionDirection,
                           DETECTOR_BODY_SIZE.width,
                           body.center
                         );

    const options = optionize<PhotonDetectorNodeOptions, SelfOptions, NodeOptions>()(
      {
        children: [ aperture, body, countReadout, label ],
        phetioVisiblePropertyInstrumented: false
      },
      providedOptions
    );

    super( options );

    this.addLinkedElement( model );
  }
}

const getBoldColoredString = ( text: string, color: Color ): string => {
  return `<span style="font-weight: bold; color: ${color.toCSS()};">${text}</span>`;
};

/**
 * PhotonCountDisplay shows the count of photons detected by a detector.
 */
class PhotonCountDisplay extends HBox {

  public constructor( photonCountProperty: TReadOnlyProperty<number>,
                      detectionDirection: DetectionDirection,
                      center: Vector2 ) {

    // Create a circular indicator that will blink when a photon is detected.
    const indicator = new Circle( PhotonCountDisplay.INDICATOR_RADIUS, {
      stroke: Color.BLACK,
      fill: PhotonCountDisplay.INACTIVE_INDICATOR_FILL
    } );

    // Blink the indicator when a photon is detected.
    let blinkTimeoutListener: TimerListener | null = null;
    photonCountProperty.lazyLink( count => {

      // If there is a timer running from a previous change, clear it.
      if ( blinkTimeoutListener ) {
        stepTimer.clearTimeout( blinkTimeoutListener );
      }

      if ( count > 0 && !isSettingPhetioStateProperty.value ) {

        // Turn on the indicator.
        indicator.fill = PhotonCountDisplay.ACTIVE_INDICATOR_FILL;

        // Set a timer to turn the indicator off.
        blinkTimeoutListener = stepTimer.setTimeout(
          () => {
            indicator.fill = PhotonCountDisplay.INACTIVE_INDICATOR_FILL;
            blinkTimeoutListener = null;
          },
          200
        );
      }
      else {

        // The count has gone to zero, which happens on a reset, so turn off the indicator.
        indicator.fill = PhotonCountDisplay.INACTIVE_INDICATOR_FILL;
      }
    } );

    // Create a NumberDisplay that will show the count.
    const numberDisplay = new NumberDisplay( photonCountProperty, COUNT_RANGE, {
      align: 'center',
      backgroundFill: QuantumMeasurementColors.photonDetectorBodyColorProperty.value.withAlpha( 0.1 ),
      backgroundStroke: null,
      xMargin: 0,
      textOptions: {
        font: DISPLAY_FONT,
        fill: detectionDirection === 'up' ?
              QuantumMeasurementColors.verticalPolarizationColorProperty :
              QuantumMeasurementColors.horizontalPolarizationColorProperty
      }
    } );

    super( {
      children: [ indicator, numberDisplay ],
      spacing: 5,
      center: center
    } );
  }

  private static readonly INDICATOR_RADIUS = 10;
  private static readonly INACTIVE_INDICATOR_FILL = new RadialGradient(
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    0,
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    PhotonCountDisplay.INDICATOR_RADIUS
  ).addColorStop( 0, Color.LIGHT_GRAY ).addColorStop( 0.7, Color.GRAY );
  private static readonly ACTIVE_INDICATOR_FILL = new RadialGradient(
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    0,
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    -PhotonCountDisplay.INDICATOR_RADIUS * 0.2,
    PhotonCountDisplay.INDICATOR_RADIUS
  ).addColorStop( 0, new Color( '#aaffaa' ) ).addColorStop( 0.7, QuantumMeasurementColors.photonBaseColorProperty.value );
}

/**
 * PhotonRateDisplay shows the rate of photons detected by a detector.
 */
class PhotonRateDisplay extends NumberDisplay {
  public constructor( photonRateProperty: TReadOnlyProperty<number>,
                      detectionDirection: DetectionDirection,
                      maxWidth: number,
                      center: Vector2 ) {

    super( photonRateProperty, RATE_RANGE, {
      valuePattern: QuantumMeasurementStrings.eventsPerSecondPatternStringProperty,
      align: 'center',
      center: center,
      maxWidth: maxWidth,
      textOptions: {
        font: DISPLAY_FONT,
        fill: detectionDirection === 'up' ?
              QuantumMeasurementColors.verticalPolarizationColorProperty :
              QuantumMeasurementColors.horizontalPolarizationColorProperty
      }
    } );
  }
}

quantumMeasurement.register( 'PhotonDetectorNode', PhotonDetectorNode );