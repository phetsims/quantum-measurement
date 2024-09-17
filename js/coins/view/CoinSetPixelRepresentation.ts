// Copyright 2024, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation handles the creation and display of an NxN grid of coins,
 * each represented by a pixel.
 *
 * @author Agustín Vallejo
 *
 */

import { Image, Node } from '../../../../scenery/js/imports.js';
import quantumMeasurement from '../../quantumMeasurement.js';

export default class CoinSetPixelRepresentation extends Node {

  public pixelImage: Image;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private scaleFactor: number;
  private readonly sideLength = 100;

  public constructor( private readonly systemType: 'classical' | 'quantum' ) {
    super();

    // TODO: Define the size based on the measurement area, see https://github.com/phetsims/quantum-measurement/issues/15
    this.scaleFactor = 2;

    // TODO: Look into extending CanvasNode, see https://github.com/phetsims/quantum-measurement/issues/15
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = this.sideLength * this.scaleFactor;
    this.canvas.height = this.sideLength * this.scaleFactor;
    this.context = this.canvas.getContext( '2d' )!;

    this.pixelImage = new Image( this.canvas );
    this.addChild( this.pixelImage );
  }

  public redraw( measuredValues: Array<string | null> ): void {

    const comparisonValue = this.systemType === 'classical' ? 'heads' : 'up';
    // Create an array of pixel colors (1 for fuchsia, 0 for black)
    const pixels: number[] = measuredValues.map( value => value === comparisonValue ? 1 : 0 );

    // Draw pixels on canvas
    for ( let i = 0; i < this.sideLength; i++ ) {
      for ( let j = 0; j < this.sideLength; j++ ) {
        const index = i * this.sideLength + j;
        this.context.fillStyle = pixels[ index ] === 1 ? 'black' : 'fuchsia';
        this.context.fillRect( j * this.scaleFactor, i * this.scaleFactor, this.scaleFactor, this.scaleFactor );
      }
    }

    this.pixelImage.image = this.canvas;
  }
}

quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );