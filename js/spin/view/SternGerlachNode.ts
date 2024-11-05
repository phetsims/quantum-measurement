// Copyright 2024, University of Colorado Boulder

/**
 * SternGerlachNode is the visual representation of a Stern Gerlach node in the UI.
 *
 * @author Agustín Vallejo
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { LinearGradient, Node, Path, RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import SternGerlach from '../model/SternGerlach.js';

export default class SternGerlachNode extends Node {

  public constructor(
    experimentModel: SternGerlach,
    modelViewTransform: ModelViewTransform2,
    tandem: Tandem ) {

    // Transformed constants
    const STERN_GERLACH_WIDTH = modelViewTransform.modelToViewDeltaX( experimentModel.STERN_GERLACH_WIDTH );
    const STERN_GERLACH_HEIGHT = modelViewTransform.modelToViewDeltaY( -experimentModel.STERN_GERLACH_HEIGHT ); // Minus because of inverted Y
    const PARTICLE_HOLE_WIDTH = modelViewTransform.modelToViewDeltaX( experimentModel.PARTICLE_HOLE_WIDTH );
    const PARTICLE_HOLE_HEIGHT = modelViewTransform.modelToViewDeltaY( -experimentModel.PARTICLE_HOLE_HEIGHT ); // Minus because of inverted Y

    // Component for the entry and exit points of the SG apparatus
    const createParticleHole = ( center: Vector2 ) => {
      const path = new Path( new Shape().rect( 0, 0, PARTICLE_HOLE_WIDTH, PARTICLE_HOLE_HEIGHT ),
        {
          fill: new LinearGradient( 0, 0, 0, PARTICLE_HOLE_HEIGHT )
            .addColorStop( 0, 'grey' )
            .addColorStop( 1, 'black' )
        } );
      path.center = modelViewTransform.modelToViewDelta( center );
      return path;
    };

    const curveFunction = ( x: number ) => {
      return Math.pow( x, 2 );
    };

    // Decoration curves that go in the front of the main rectangle
    const curveUpShape = new Shape().moveTo( -STERN_GERLACH_WIDTH / 2, 0 );
    const curveDownShape = new Shape().moveTo( -STERN_GERLACH_WIDTH / 2, 0 );

    for ( let i = 0; i < 1; i += 0.1 ) {
      curveUpShape.lineTo( -STERN_GERLACH_WIDTH / 2 + i * STERN_GERLACH_WIDTH, curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 );
      curveDownShape.lineTo( -STERN_GERLACH_WIDTH / 2 + i * STERN_GERLACH_WIDTH, -curveFunction( i ) * STERN_GERLACH_HEIGHT / 4 );
    }

    const particleEntrance = createParticleHole( experimentModel.entranceLocalPosition );
    const topParticleExit = createParticleHole( experimentModel.topExitLocalPosition );
    const bottomParticleExit = createParticleHole( experimentModel.bottomExitLocalPosition );

    const mainRect = new Path( new Shape().rect( -STERN_GERLACH_WIDTH / 2, -STERN_GERLACH_HEIGHT / 2, STERN_GERLACH_WIDTH, STERN_GERLACH_HEIGHT ),
        { fill: 'black' } );

    super( {
      tandem: tandem,
      visibleProperty: experimentModel.isVisibleProperty,
      children: [

        // Main body of the SG apparatus
        mainRect,

        // Curved paths for the particle to follow
        new Path( curveUpShape, { stroke: '#aff', lineWidth: 4 } ),
        new Path( curveDownShape, { stroke: '#aff', lineWidth: 4 } ),

        // Particle entry point
        particleEntrance,

        // Particle exit points
        topParticleExit,
        bottomParticleExit,

        new RichText( new DerivedProperty(
            [
              experimentModel.isZOrientedProperty,
              QuantumMeasurementStrings.SGSubZStringProperty,
              QuantumMeasurementStrings.SGSubXStringProperty
            ],
            ( isZOriented, SGSubZ, SGSubX ) => isZOriented ? SGSubZ : SGSubX ),
          { font: new PhetFont( 18 ), fill: 'white', center: new Vector2( -STERN_GERLACH_WIDTH / 2 + 25, -STERN_GERLACH_HEIGHT / 2 + 70 ) } )
      ]
    } );

    experimentModel.positionProperty.link( position => {
      this.center = modelViewTransform.modelToViewPosition( position );
    } );
  }
}

quantumMeasurement.register( 'SternGerlachNode', SternGerlachNode );