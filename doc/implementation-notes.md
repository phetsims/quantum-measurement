# Quantum Measurement - Implementation Notes

@author Agustin Vallejo (PhET Interactive Simulations)
@author John Blanco (PhET Interactive Simulations)

## Table of Contents

TODO - Add a table of contents when doc is complete.

## Introduction

This document is a collection of notes that describe the implementation of the **Quantum Measurement** simulation.  The
simulation is a collection of four screens that demonstrate some of the basic principles of quantum mechanics.  The
screens are "Coins", "Photons", "Spin", and "Bloch Sphere".

This is not an exhaustive description of the implementation. The intention is to provide a concise high-level overview,
and to supplement the internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

* [model.md](https://github.com/phetsims/quantum-measurement/blob/main/doc/model.md), a high-level description of the
simulation model.

You are also encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md)
* [Models of the Hydrogen Atom HTML5](https://docs.google.com/document/d/1fZT_vDD8sX8nkSpTxHOyoP6-XrAIJYo44dacLIbZO14/edit?pli=1&tab=t.0) (Parts of this are likely to be stale.)

## Common Terminology

There are a number of terms that are used throughout the simulation that are specific to quantum mechanics.  Here are
some of the most important ones:

- **Classical System** - A system that behaves in a deterministic way, where the state of the system can be known with
  certainty and is always in a specific state.
- **Measurement** - The act of observing a quantum system, which causes it to collapse into a single state. In some
  places in the code, the term "observe" is used instead of "measure".
- **Measurement Area** - Several of the screens have an area where the user can measure the state of the system. This is
  in contrast to the preparation area, where the user can prepare the system.
- **Preparation Area** - Several of the screens have an area where the user can prepare the state of the system. This is
  in contrast to the measurement area, where the user can measure the state of the system.
- **Quantum System** - - A system that behaves in a probabilistic way, where the state of the system can only be known
  after measurement and is in a superposition of states until measured.
- **Superposition** - The state of a quantum system before it is measured. It is a combination of all possible states
  that the system can be in.

## General Considerations

### Common Model and View Patterns

- **Preparation and Measurement Areas** - The general idea for all four screens is that the user prepares the system,
  then makes measurements on it. Most screens have a `PreparationArea.ts` and a `MeasurementArea.ts` which are usually
  Scenery nodes in charge of the layout and interaction of the preparation and measurement areas.  The models have
  Properties that represent the state of the system in the preparation and measurement areas.
- **Histograms** - All screens have a variation of the measurement histogram, and also sometimes variation within the
  very same screen depending on mode selection (single vs. continuous for example). So the class had to be furnished
  with all the possible options, and in fact, the biggest part of that file is code controlling the different ways to
  display a number (number, rate, fraction, percentage, etc).
- **Bloch Sphere** - Since we have a screen with that name, and it's also a component used in two screens, here are the
  different flavors of Bloch spheres:
  - Component related:
    - AbstractBlochSphere: abstract class which contains the very fundamentals of a bloch sphere state representation:
      azimuthal and polar angles, and the equation coefficients. They are related but will be linked in the
      implementations.
    - SimpleBlochSphere: Implementation of the abstract class which links a spin state into spherical coordinates.
    - ComplexBlochSphere: Implementation of the abstract class which supports rotation around the Z axis, as well as
      measurement along a basis.
    - BlochSphereNode: Node which displays any implementation of the abstract base class. It's quite a big file because
      it has to support all the custom options and design quirks added to the sphere.
    - BlochSphereWithProjectionNode: Same as above but supports extra projection vectors on Z and X axis.
  - Screen related:
    - BlochSphereModel: This is the actual TModel for the Bloch Sphere Screen, with all the properties and main
      functionality of that screen.
    - BlochSphere*: All remaining files with the BlochSphere prefix are simply alluding to the screen with that name.

### Memory Management

**Instantiation:** Most objects in this sim are instantiated at startup, and exist for the lifetime of the simulation.
This works better for phet-io.

**Listeners**: Unless otherwise noted in the code, uses of `link`, `addListener`, etc. do not require a corresponding
`unlink`, `removeListener`, etc. because most objects exist for the lifetime of the simulation.

## Screens

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

* Classical vs Quantum photon behavior
* Sprites

### Spin Screen

* SG measurement calculation
* particles path logic

### Bloch Sphere Screen

* Change of basis