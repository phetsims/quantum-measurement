// Copyright 2024, University of Colorado Boulder

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
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Color, HBox, LinearGradient, Node, NodeOptions, RadialGradient, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import PhotonDetector, { DetectionDirection } from '../model/PhotonDetector.js';

type SelfOptions = EmptySelfOptions;
type PhotonDetectorNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// The size of the detector body.  The width is for the dimension perpendicular to the detection direction, and the
// height (which is really more like the depth) is for the dimension parallel to the detection direction.
const DETECTOR_BODY_SIZE = new Dimension2( 85, 100 );

const DISPLAY_FONT = new PhetFont( { size: 20, weight: 'bold' } );

export default class PhotonDetectorNode extends Node {

  public constructor( model: PhotonDetector,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PhotonDetectorNodeOptions ) {

    // Create the detection aperture.  This is essentially the anchor point for reset of the layout, meaning that the
    // other nodes are positioned relative to this.
    const apertureDiameterInView = -modelViewTransform.modelToViewDeltaY( model.apertureDiameter );
    const aperture = new Rectangle( 0, 0, apertureDiameterInView, 8, {
      fill: new LinearGradient( 0, 0, apertureDiameterInView, 0 )
        .addColorStop( 0, new Color( '#FFDDEE' ) )
        .addColorStop( 1, Color.DARK_GRAY ),
      center: modelViewTransform.modelToViewPosition( model.position )
    } );

    // detector body
    const bodyRectangle = new Rectangle( 0, 0, DETECTOR_BODY_SIZE.width, DETECTOR_BODY_SIZE.height, {
      cornerRadius: 10,
      fill: QuantumMeasurementColors.photonDetectorBodyColor,
      centerX: aperture.centerX
    } );

    // Declare the label.  Its value and position will be set later.
    let label: RichText;

    // Position the detector body and aperture based on the detection direction.
    if ( model.detectionDirection === 'up' ) {

      // Position the body above the aperture.
      bodyRectangle.bottom = aperture.top;

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
        centerX: bodyRectangle.centerX,
        bottom: bodyRectangle.top - 5
      } );
    }
    else if ( model.detectionDirection === 'down' ) {

      // Position the body below the aperture.
      bodyRectangle.top = aperture.bottom;

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
        centerX: bodyRectangle.centerX,
        top: bodyRectangle.bottom + 5
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
                           bodyRectangle.center
                         ) :
                         new PhotonRateDisplay(
                           model.detectionRateProperty,
                           model.detectionDirection,
                           DETECTOR_BODY_SIZE.width,
                           bodyRectangle.center
                         );

    const options = optionize<PhotonDetectorNodeOptions, SelfOptions, NodeOptions>()(
      {
        children: [ aperture, bodyRectangle, countReadout, label ]
      },
      providedOptions
    );

    super( options );
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
      if ( blinkTimeoutListener ) {
        stepTimer.clearTimeout( blinkTimeoutListener );
      }
      if ( count > 0 ) {
        indicator.fill = PhotonCountDisplay.ACTIVE_INDICATOR_FILL;
        blinkTimeoutListener = stepTimer.setTimeout( () => {
          indicator.fill = PhotonCountDisplay.INACTIVE_INDICATOR_FILL;
          blinkTimeoutListener = null;
        }, 200 );
      }
      else {
        indicator.fill = PhotonCountDisplay.INACTIVE_INDICATOR_FILL;
      }
    } );

    // Create a NumberDisplay that will show the count.
    const numberDisplay = new NumberDisplay( photonCountProperty, new Range( 0, 999 ), {
      align: 'center',
      backgroundFill: QuantumMeasurementColors.photonDetectorBodyColor,
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
  ).addColorStop( 0, new Color( '#aaffaa' ) ).addColorStop( 0.7, Color.GREEN );
}

/**
 * PhotonRateDisplay shows the rate of photons detected by a detector.
 */
class PhotonRateDisplay extends NumberDisplay {
  public constructor( photonRateProperty: TReadOnlyProperty<number>,
                      detectionDirection: DetectionDirection,
                      maxWidth: number,
                      center: Vector2 ) {

    super( photonRateProperty, new Range( 0, 999 ), {
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