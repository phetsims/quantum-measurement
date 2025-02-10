# Quantum Measurement - Implementation Notes

## Terminology

Classical System - A system that behaves in a deterministic way, where the state of the system can be known with
certainty and is always in a specific state.
Quantum System - A system that behaves in a probabilistic way, where the state of the system can only be known after
measurement and is in a superposition of states until measured.

## General Design Elements

### Coins Screen

TODO - Notes made during the implementation of the "Coins" screen. These should eventually be rolled into a cohesive
narrative.

Terms:

classical coin - A coin the acts like what we typically think of as a "real" coin, where it is either in the heads or
tails state and is never in a superposed state.
quantum coin - A coin that behaves like a quantum particle in the sense that it is in a superposition of states until
it is measured.

Notes:

- Term to mention - "test box"
- The term "measure" is used in the code a lot for looking at the state of the coin(s).  The terms used in the UI are
  "reveal" for the classical coin and "observe" for the quantum coin, but "observe" carries its own meaning in the world
  of CS, and reveal is non-quantum, so "measure" seemed like a reasonable choice.
- The main model has two experiment types - classical and quantum.  There is a type called `SystemType` that is used
to parameterize the model and view in quite a number of places.  This idea of both classical and quantum systems being
present is a theme throughout the sim.
- Each of these experiments - i.e. the classical and quantum ones - moves back and forth between preparation and
measurement mode, starting in preparation.  The general idea is that the user prepares the system, then makes me
measurements on it.
- We should note the parallel between flipping the coin in the classical scene and re-preparing it in the quantum 
  scene.
- Describe how the "seed" is used in CoinSet to avoid having to send 10000 pieces of data.

### Photons Screen

### Spin Screen

### Bloch Sphere Screen
