// Copyright 2024, University of Colorado Boulder

/**
 * Interface for classes that can potentially interact with photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Photon from './Photon.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';

export type TPhotonInteraction = {
  testForPhotonInteraction( photon: Photon, dt: number ): PhotonInteractionTestResult;
};