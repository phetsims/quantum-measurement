// Copyright 2024, University of Colorado Boulder

/**
 * AveragingCounterNumberProperty is a simple class that extends NumberProperty and keeps track of a counter,
 * while also providing the ability to average the counter over a specified number of measurements.
 *
 * @author Agustín Vallejo (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
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

export default class AveragingCounterNumberProperty extends NumberProperty {

  private readonly totalAveragingPeriod: number;
  private readonly countSamplePeriod: number;

  // variables used in the detection rate calculation
  private currentDetectionCount = 0;
  private detectionSampleHistory: DetectionCountSample[] = [];
  private timeSinceLastCountSample = 0;

  // The rate at which photons are detected, in arrival events per second.
  public readonly detectionRateProperty: NumberProperty;

  public constructor( providedOptions: AveragingCounterNumberPropertyOptions ) {

    const options = optionize<AveragingCounterNumberPropertyOptions, SelfOptions, NumberPropertyOptions>()( {
      totalAveragingPeriod: 2,
      countSamplePeriod: 0.5
    }, providedOptions );

    assert && assert( options.totalAveragingPeriod > 0, 'totalAveragingPeriod must be greater than zero' );
    assert && assert( options.countSamplePeriod > 0, 'countSamplePeriod must be greater than zero' );
    assert && assert( options.totalAveragingPeriod >= options.countSamplePeriod, 'total period should be greater than sample period' );

    const initialValue = 0;
    super( initialValue, {
      tandem: options.tandem.createTandem( 'measuredValueProperty' )
    } );

    this.totalAveragingPeriod = options.totalAveragingPeriod;
    this.countSamplePeriod = options.countSamplePeriod;

    this.detectionRateProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'detectionRateProperty' )
    } );
  }

  public step( dt: number ): void {

    // See if it's time to record a sample of the detection count.
    this.timeSinceLastCountSample += dt;
    if ( this.timeSinceLastCountSample >= this.countSamplePeriod ) {

      // Record this sample.
      this.detectionSampleHistory.push( {
        duration: this.timeSinceLastCountSample,
        count: this.value
      } );

      // Count the number of samples needed to reach the averaging period and total the counts that they contain.  Since
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
        this.detectionRateProperty.value = Utils.roundSymmetric( accumulatedEventCount / accumulatedSampleTime );
      }
      else {
        this.detectionRateProperty.value = 0;
      }

      // Remove samples that have aged out.
      _.times( this.detectionSampleHistory.length - sampleCount, () => this.detectionSampleHistory.shift() );

      // Reset the counts.
      this.value = 0;
      this.timeSinceLastCountSample = 0;
    }
  }

  /**
   * Resets the model.
   */
  public override reset(): void {
    super.reset();
    this.value = 0;
    this.detectionSampleHistory.length = 0;
    this.timeSinceLastCountSample = 0;
  }
}

quantumMeasurement.register( 'AveragingCounterNumberProperty', AveragingCounterNumberProperty );