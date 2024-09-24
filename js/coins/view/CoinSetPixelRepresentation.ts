// Copyright 2024, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation handles the creation and display of an NxN grid of coins,
 * each represented by a pixel.
 *
 * @author Agustín Vallejo
 *
 */

import { CanvasNode, CanvasNodeOptions } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class CoinSetPixelRepresentation extends CanvasNode {
  private readonly sideLength = 100;
  private pixels: number[] = [];
  private pixelScale = 1;

  public constructor( private readonly systemType: 'classical' | 'quantum', providedOptions?: CanvasNodeOptions ) {
    super( providedOptions );
  }

  public redraw( measuredValues: Array<string | null> ): void {

    const comparisonValue = this.systemType === 'classical' ? 'heads' : 'up';
    // Create an array of pixel colors (1 for fuchsia, 0 for black)
    this.pixels = measuredValues.map( value => value === comparisonValue ? 1 : 0 );

    this.invalidatePaint();
  }

  /**
   * Sets the scale of the grid.
   */
  public setPixelScale( scale: number ): void {
    this.pixelScale = scale;
  }

  /**
   * Paints the grid lines on the canvas node.
   */
  public paintCanvas( context: CanvasRenderingContext2D ): void {

    context.save();
    // Draw pixels on canvas
    for ( let i = 0; i < this.sideLength; i++ ) {
      for ( let j = 0; j < this.sideLength; j++ ) {
        const index = i * this.sideLength + j;
        context.fillStyle = this.pixels[ index ] === 1 ? 'black' : 'fuchsia';
        context.fillRect( j * this.pixelScale, i * this.pixelScale, this.pixelScale, this.pixelScale );
      }
    }

    context.restore();
  }
}

quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );