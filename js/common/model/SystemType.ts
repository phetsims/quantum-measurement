// Copyright 2024, University of Colorado Boulder

/**
 * SystemType is used to distinguish between the two types of systems that are modeled in the sim: physical systems,
 * meaning something that is at the scale of typical human experience (e.g. a coin), and quantum systems, meaning
 * something that is very small and exhibits characteristics such as transpositions of internal state.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

type SystemType = 'physical' | 'quantum';

export default SystemType;