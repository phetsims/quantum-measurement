// Copyright 2024, University of Colorado Boulder

/**
 * SternGerlachNode is the visual representation of a Stern Gerlach node in the UI.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, Path, RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import SternGerlachModel from '../model/SternGerlachModel.js';

// Constants
const STERN_GERLACH_WIDTH = 150;
const STERN_GERLACH_HEIGHT = 100;
const PARTICLE_HOLE_WIDTH = 5;
const PARTICLE_HOLE_HEIGHT = 20;

export default class SternGerlachNode extends Node {

  public readonly entranceGlobalPosition: Vector2;
  public readonly boxWidth = STERN_GERLACH_WIDTH;
  public readonly boxHeight = STERN_GERLACH_HEIGHT;

  public constructor( experimentModel: SternGerlachModel, tandem: Tandem ) {

    const createParticleHole = ( x: number, y: number ) => {
      return new Path( new Shape().rect( x, y, PARTICLE_HOLE_WIDTH, PARTICLE_HOLE_HEIGHT ),
        {
          fill: new LinearGradient( x, y, x, y + PARTICLE_HOLE_HEIGHT )
            .addColorStop( 0, 'grey' )
            .addColorStop( 1, 'black' )
        } );
    };

    const curveFunction = ( x: number ) => {
      return Math.pow( x, 2 );
    };

    const curveUpShape = new Shape().moveTo( 0, STERN_GERLACH_HEIGHT / 2 );
    const curveDownShape = new Shape().moveTo( 0, STERN_GERLACH_HEIGHT / 2 );

    for ( let i = 0; i < 1; i += 0.1 ) {
      curveUpShape.lineTo( i * STERN_GERLACH_WIDTH, curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 + STERN_GERLACH_HEIGHT / 2 );
      curveDownShape.lineTo( i * STERN_GERLACH_WIDTH, -curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 + STERN_GERLACH_HEIGHT / 2 );
    }

    super( {
      tandem: tandem,
      visibleProperty: experimentModel.isVisibleProperty,
      children: [

        // Main body of the SG apparatus
        new Path( new Shape().rect( 0, 0, STERN_GERLACH_WIDTH, STERN_GERLACH_HEIGHT ),
          { fill: 'black' } ),

        // Curved paths for the particle to follow
        new Path( curveUpShape, { stroke: '#aff', lineWidth: 4 } ),
        new Path( curveDownShape, { stroke: '#aff', lineWidth: 4 } ),

        // Particle entry point
        createParticleHole( -PARTICLE_HOLE_WIDTH, STERN_GERLACH_HEIGHT / 2 - PARTICLE_HOLE_HEIGHT / 2 ),

        // Particle exit points
        createParticleHole( STERN_GERLACH_WIDTH, STERN_GERLACH_HEIGHT / 4 - PARTICLE_HOLE_HEIGHT / 2 ),
        createParticleHole( STERN_GERLACH_WIDTH, 3 * STERN_GERLACH_HEIGHT / 4 - PARTICLE_HOLE_HEIGHT / 2 ),

        new RichText( new DerivedProperty(
            [ experimentModel.isZOrientedProperty ],
            ( isZOriented: boolean ) => isZOriented ? 'SG<sub>Z' : 'SG<sub>X' ),
          { font: new PhetFont( 16 ), fill: 'white', center: new Vector2( 25, 80 ) } )
      ]
    } );

    this.entranceGlobalPosition = this.localToGlobalPoint( new Vector2( 0, STERN_GERLACH_HEIGHT / 2 ) );
  }
}

quantumMeasurement.register( 'SternGerlachNode', SternGerlachNode );