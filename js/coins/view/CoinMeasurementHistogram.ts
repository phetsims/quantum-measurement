// Copyright 2024-2025, University of Colorado Boulder

/**
 * CoinMeasurementHistogram displays a histogram with two bars, one for the quantity of each of the two possible
 * outcomes for an experiment where multiple classical or quantum coins are flipped.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import { SystemType } from '../../common/model/SystemType.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram, { QuantumMeasurementHistogramOptions } from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import CoinSet from '../model/CoinSet.js';

type SelfOptions = EmptySelfOptions;
export type CoinMeasurementHistogramOptions = SelfOptions & WithRequired<QuantumMeasurementHistogramOptions, 'tandem'>;

const LABEL_FONT = new PhetFont( { size: 20, weight: 'bold' } );
const SIZE = new Dimension2( 200, 120 );

export default class CoinMeasurementHistogram extends QuantumMeasurementHistogram {

  public constructor( coinSet: CoinSet,
                      systemType: SystemType,
                      providedOptions: CoinMeasurementHistogramOptions ) {

    const options = optionize<CoinMeasurementHistogramOptions, SelfOptions, QuantumMeasurementHistogramOptions>()( {
      size: SIZE
    }, providedOptions );

    // Create the labels for the X axis.
    const xAxisLabels = [
      new RichText(
        systemType === SystemType.CLASSICAL ?
        QuantumMeasurementConstants.CLASSICAL_UP_SYMBOL :
        QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER,
        {
          font: LABEL_FONT,
          fill: systemType === SystemType.CLASSICAL ?
                QuantumMeasurementColors.headsColorProperty :
                QuantumMeasurementColors.upColorProperty
        }
      ),
      new RichText(
        systemType === SystemType.CLASSICAL ?
        QuantumMeasurementConstants.CLASSICAL_DOWN_SYMBOL :
        QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER,
        {
          font: LABEL_FONT,
          fill: systemType === SystemType.CLASSICAL ?
                QuantumMeasurementColors.tailsColorProperty :
                QuantumMeasurementColors.downColorProperty
        }
      )
    ];

    // Create the number Properties for the left and right histogram bars.
    const leftNumberProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'leftNumberProperty' )
    } );
    const rightNumberProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'rightNumberProperty' )
    } );

    // Define a function to update the left and right number Properties.
    const updateNumberProperties = () => {

      const leftTestValue = systemType === SystemType.CLASSICAL ? 'heads' : 'up';
      const rightTestValue = systemType === SystemType.CLASSICAL ? 'tails' : 'down';
      let leftTotal = 0;
      let rightTotal = 0;

      if ( coinSet.measurementStateProperty.value === 'revealed' ) {
        _.times( coinSet.numberOfActiveCoinsProperty.value, i => {
          if ( coinSet.measuredValues[ i ] === leftTestValue ) {
            leftTotal++;
          }
          else if ( coinSet.measuredValues[ i ] === rightTestValue ) {
            rightTotal++;
          }
        } );
      }
      leftNumberProperty.value = leftTotal;
      rightNumberProperty.value = rightTotal;
    };

    // Update the number Properties when the number of coins changes or when the measured data changes.
    Multilink.multilink(
      [ coinSet.numberOfActiveCoinsProperty, coinSet.measurementStateProperty ],
      updateNumberProperties
    );
    coinSet.measuredDataChangedEmitter.addListener( updateNumberProperties );

    super(
      leftNumberProperty,
      rightNumberProperty,
      xAxisLabels as [ RichText, RichText ],
      options
    );

    const numberOfCoinsStringProperty = new PatternStringProperty(
      QuantumMeasurementStrings.numberOfCoinsPatternStringProperty,
      { number: coinSet.numberOfActiveCoinsProperty }
    );

    const numberOfSystemsText = new Text( numberOfCoinsStringProperty, {
      font: new PhetFont( 16 ),
      centerX: 0,
      centerY: this.yAxis.top - 40,
      maxWidth: 200 // empirically determined to work well with layout
    } );
    numberOfCoinsStringProperty.link( () => {
      numberOfSystemsText.centerX = 0;
    } );

    this.addChild( numberOfSystemsText );
  }
}

quantumMeasurement.register( 'CoinMeasurementHistogram', CoinMeasurementHistogram );