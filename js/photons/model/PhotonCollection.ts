// Copyright 2024, University of Colorado Boulder

/**
 * PhotonCollection is a model element that represents a collection of photons.  It is used to manage the pool of photons
 * and serialize the individual photons.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceArrayIO from '../../../../tandem/js/types/ReferenceArrayIO.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import Photon from './Photon.js';

export class PhotonCollection extends PhetioObject {

  public readonly photons: Photon[] = [];

  public constructor( tandem: Tandem ) {
    super( {
      tandem: tandem,
      phetioType: PhotonCollection.PhotonCollectionIO
    } );
  }

  public addPhoton( photon: Photon ): void {
    this.photons.push( photon );
  }

  public removePhoton( photon: Photon ): void {
    _.pull( this.photons, photon );
  }

  public clear(): void {
    this.photons.length = 0;
  }

  /**
   * For serialization, the PhotonCollectionIO uses reference type serialization. That is, each PhotonCollection exists for the life of the
   * simulation, and when we save the state of the simulation, we save the current state of the PhotonCollection.
   *
   * The PhotonCollection serves as a composite container of PhotonIO instances. The Photons are serialized using data-type serialization.
   * For deserialization, the Photons are deserialized (again, using data-type serialization) and applied to the
   * PhotonCollection in its applyState method.
   *
   * Please see https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   * for more information on the different serialization types.
   */
  public static readonly PhotonCollectionIO = new IOType<PhotonCollection>( 'PhotonCollectionIO', {
    valueType: PhotonCollection,
    documentation: 'The PhotonCollection is a model element that represents a collection of photons.',
    stateSchema: {
      photons: ReferenceArrayIO( Photon.PhotonIO )
    }
  } );
}

quantumMeasurement.register( 'PhotonCollection', PhotonCollection );