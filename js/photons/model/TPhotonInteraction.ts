// Copyright 2024, University of Colorado Boulder

/**
 * Interface for classes that can potentially interact with photons.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import Photon from './Photon.js';
import { PhotonMotionState } from './PhotonMotionState.js';
import { PhotonInteractionTestResult } from './PhotonsModel.js';

export type TPhotonInteraction = {

  /**
   * Test for photon interactions with the object that implements this interface.  This returns a map of photon states
   * to interactions.  If a photon state is not in the map, no interaction is detected for that state.
   *
   * @param photon - The photon that is being tested for interaction.
   * @param dt - The time step for the test, in seconds.
   * @returns A map of motion states to the results of the interaction tests.
   */
  testForPhotonInteraction( photon: Photon, dt: number ): Map<PhotonMotionState, PhotonInteractionTestResult>;
};