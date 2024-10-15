// Copyright 2024, University of Colorado Boulder

/**
 * ParticleRayPath is the visual representation of a particle ray path in the UI.
 * Coordinates for the three possible rays are provided, and the paths are drawn accordingly.
 *
 * @author Agustín Vallejo
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path, PathOptions } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import quantumMeasurement from '../../quantumMeasurement.js';

// Constants

export default class ParticleRayPath extends Node {

  public readonly updatePaths: (
    primaryRayPoints: Vector2[],
    secondaryRayPoints: Vector2[],
    tertiaryRayPoints: Vector2[]
  ) => void;

  public constructor(
    particleAmmountProperty: TReadOnlyProperty<number>,
    tandem: Tandem ) {

    const rayPathOptions: PathOptions = {
      lineWidth: 10,
      stroke: QuantumMeasurementColors.downColorProperty,
      lineCap: 'round'
    };

    const primaryRayPath = new Path( null, rayPathOptions );
    const secondaryRayPath = new Path( null, rayPathOptions );
    const tertiaryRayPath = new Path( null, rayPathOptions );

    // TODO: Multilink for when we have another value in the model for the opacity of secondary and tertiary rays https://github.com/phetsims/quantum-measurement/issues/53
    Multilink.multilink(
      [ particleAmmountProperty ],
      particleAmmount => {
        primaryRayPath.opacity = particleAmmount;
        secondaryRayPath.opacity = particleAmmount;
        tertiaryRayPath.opacity = particleAmmount;
      }
    );

    super( {
      tandem: tandem,
      localBounds: null,
      children: [
        primaryRayPath,
        secondaryRayPath,
        tertiaryRayPath
      ]
    } );

    this.updatePaths = (
      primaryRayPoints: Vector2[],
      secondaryRayPoints: Vector2[],
      tertiaryRayPoints: Vector2[]
    ) => {
      const mappedPrimaryRayPoints = primaryRayPoints.map( point => this.globalToLocalPoint( point ) );
      const mappedSecondaryRayPoints = secondaryRayPoints.map( point => this.globalToLocalPoint( point ) );
      const mappedTertiaryRayPoints = tertiaryRayPoints.map( point => this.globalToLocalPoint( point ) );

      primaryRayPath.shape = new Shape().moveTo( mappedPrimaryRayPoints[ 0 ].x, mappedPrimaryRayPoints[ 0 ].y )
        .lineTo( mappedPrimaryRayPoints[ 1 ].x, mappedPrimaryRayPoints[ 1 ].y );
      secondaryRayPath.shape = new Shape().moveTo( mappedSecondaryRayPoints[ 0 ].x, mappedSecondaryRayPoints[ 0 ].y )
        .lineTo( mappedSecondaryRayPoints[ 1 ].x, mappedSecondaryRayPoints[ 1 ].y );
      tertiaryRayPath.shape = new Shape().moveTo( mappedTertiaryRayPoints[ 0 ].x, mappedTertiaryRayPoints[ 0 ].y )
        .lineTo( mappedTertiaryRayPoints[ 1 ].x, mappedTertiaryRayPoints[ 1 ].y );
    };

  }
}

quantumMeasurement.register( 'ParticleRayPath', ParticleRayPath );