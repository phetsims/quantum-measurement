// Copyright 2024, University of Colorado Boulder

/**
 * CoinSetPixelRepresentation handles the creation and display of an NxN grid of coins,
 * each represented by a pixel.
 *
 * @author Agustín Vallejo
 *
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Image, Node } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

export default class CoinSetPixelRepresentation extends Node {

  public pixelImage: Image;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private stateBias: number;
  private scaleFactor: number;
  private readonly sideLength = 100;

  public constructor( stateBias: number ) {
    super();

    this.stateBias = stateBias;

    // TODO: Define the size based on the measurement area, see https://github.com/phetsims/quantum-measurement/issues/15
    this.scaleFactor = 1.75;

    // TODO: Look into extending CanvasNode, see https://github.com/phetsims/quantum-measurement/issues/15
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = this.sideLength * this.scaleFactor;
    this.canvas.height = this.sideLength * this.scaleFactor;
    this.context = this.canvas.getContext( '2d' )!;

    this.pixelImage = this.createPixelRatioImage();
    this.addChild( this.pixelImage );
  }

  private createPixelRatioImage(): Image {
    this.drawPixelsOnCanvas();
    return new Image( this.canvas );
  }

  private drawPixelsOnCanvas(): void {
    // Clear the canvas first
    const totalPixels = this.sideLength * this.sideLength;
    const fuchsiaPixels = Utils.roundSymmetric( totalPixels * this.stateBias );

    // Create an array of pixel colors (1 for fuchsia, 0 for black)
    const pixels: number[] = new Array( totalPixels ).fill( 0 ).map( ( _, i ) => i < fuchsiaPixels ? 0 : 1 );

    // Shuffle the array
    const shuffledPixels = dotRandom.shuffle( pixels );

    // TODO: Use measuredValues[ i ] to determine the color of the pixel, see https://github.com/phetsims/quantum-measurement/issues/15

    // Draw pixels on canvas
    for ( let i = 0; i < this.sideLength; i++ ) {
      for ( let j = 0; j < this.sideLength; j++ ) {
        const index = i * this.sideLength + j;
        this.context.fillStyle = shuffledPixels[ index ] === 1 ? 'fuchsia' : 'black';
        this.context.fillRect( j * this.scaleFactor, i * this.scaleFactor, this.scaleFactor, this.scaleFactor );
      }
    }
  }

  public refresh( newStateBias?: number ): void {
    if ( newStateBias !== undefined ) {
      this.stateBias = newStateBias;
    }
    this.drawPixelsOnCanvas();
    this.pixelImage.image = this.canvas;
  }

  public setScaleFactor( newScaleFactor: number ): void {
    this.scaleFactor = newScaleFactor;
    this.canvas.width = this.sideLength * this.scaleFactor;
    this.canvas.height = this.sideLength * this.scaleFactor;
    this.refresh();
  }
}

quantumMeasurement.register( 'CoinSetPixelRepresentation', CoinSetPixelRepresentation );