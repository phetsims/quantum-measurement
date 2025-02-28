// Copyright 2024-2025, University of Colorado Boulder

/**
 * AveragingCounterNumberProperty is a simple class that extends NumberProperty and keeps track of a counter,
 * while also providing the ability to average the counter over a specified number of measurements.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import optionize from '../../../../phet-core/js/optionize.js';
import quantumMeasurement from '../../quantumMeasurement.js';

type SelfOptions = {
  totalAveragingPeriod?: number;
  countSamplePeriod?: number;
};
type AveragingCounterNumberPropertyOptions = SelfOptions & NumberPropertyOptions;

type DetectionCountSample = {
  duration: number; // in seconds
  count: number;
};

class AveragingCounterNumberProperty extends NumberProperty {

  // Every countSamplePeriod we store a group of counts for that period
  // Then, groups within a totalAveragingPeriod are averaged to get the final value
  // So the displayed value updates every countSamplePeriod with the average of the last totalAveragingPeriod
  private readonly countSamplePeriod: number;
  private readonly totalAveragingPeriod: number;

  // variables used in the detection rate calculation
  private currentDetectionCount = 0;
  private detectionSampleHistory: DetectionCountSample[] = [];
  private timeSinceLastCountSample = 0;

  public constructor( providedOptions: AveragingCounterNumberPropertyOptions ) {

    const options = optionize<AveragingCounterNumberPropertyOptions, SelfOptions, NumberPropertyOptions>()( {
      totalAveragingPeriod: 2, // in seconds
      countSamplePeriod: 0.5 // in seconds
    }, providedOptions );

    assert && assert( options.totalAveragingPeriod > 0, 'totalAveragingPeriod must be greater than zero' );
    assert && assert( options.countSamplePeriod > 0, 'countSamplePeriod must be greater than zero' );
    assert && assert( options.totalAveragingPeriod >= options.countSamplePeriod, 'total period should be greater than sample period' );

    const initialValue = 0;
    super( initialValue, {
      tandem: options.tandem.createTandem( 'measuredValueProperty' ),
      phetioReadOnly: true
    } );

    this.totalAveragingPeriod = options.totalAveragingPeriod;
    this.countSamplePeriod = options.countSamplePeriod;
  }

  /**
   * Increments the detection count.
   */
  public countEvent(): void {
    this.currentDetectionCount++;
  }

  public step( dt: number ): void {

    // See if it's time to record a sample of the detection count.
    this.timeSinceLastCountSample += dt;
    if ( this.timeSinceLastCountSample >= this.countSamplePeriod ) {

      // Record this sample.
      this.detectionSampleHistory.push( {
        duration: this.timeSinceLastCountSample,
        count: this.currentDetectionCount
      } );

      // Count the number of samples needed to reach the averaging period and total the counts that they contain. Since
      // the new samples are added to the end of the array, we need to start at the end and work backwards.
      let accumulatedSampleTime = 0;
      let accumulatedEventCount = 0;
      let sampleCount = 0;
      for ( let i = this.detectionSampleHistory.length - 1; i >= 0; i-- ) {
        accumulatedSampleTime += this.detectionSampleHistory[ i ].duration;
        accumulatedEventCount += this.detectionSampleHistory[ i ].count;
        sampleCount++;
        if ( accumulatedSampleTime >= this.totalAveragingPeriod ) {
          break;
        }
      }

      // Update the detection rate.
      if ( accumulatedSampleTime > 0 ) {

        // Calculate the average value.  This is rounded to 12 decimal places to avoid floating point errors.
        this.value = toFixedNumber( accumulatedEventCount / accumulatedSampleTime, 12 );
      }
      else {
        this.value = 0;
      }

      // Remove samples that have aged out.
      _.times( this.detectionSampleHistory.length - sampleCount, () => this.detectionSampleHistory.shift() );

      // Reset the counts.
      this.currentDetectionCount = 0;
      this.timeSinceLastCountSample = 0;
    }
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.currentDetectionCount = 0;
    this.detectionSampleHistory.length = 0;
    this.timeSinceLastCountSample = 0;
  }
}

quantumMeasurement.register( 'AveragingCounterNumberProperty', AveragingCounterNumberProperty );

export default AveragingCounterNumberProperty;