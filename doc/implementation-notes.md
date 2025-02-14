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

The "Coins" screen is a simple demonstration of the probabilistic nature of measuring systems with two possible
outcomes, as well as some of the differences between classical and quantum systems. The user can prepare both a single
and a set of coins to have either classical or quantum behavior, then make measurements to see the results.

#### Model

The most central class in the model is `CoinSet`, which represents a set of coins.  This class models both classical
and quantum coins, and tracks the state of the experiment as well as the measurements that have been made.  The
`CoinExperimentSceneModel` class interacts with the `CoinSet` to manage the state of the experiment and the user
interaction.  It has two "test boxes" that are used to hide and show the results of the measurements, one for a single
coin and one for the set of coins.  The model moves back and forth between preparation and measurement mode, starting in
preparation.

The random values used to decide the outcome of the measurements are generated using a `dotRandom` object that is seeded
with a value that is tracked in an axon Property.  This allows the state information to be conveyed for phet-io
purposes without having to send 10000+ pieces of data.

#### View

The view is responsible for animating the transitions between preparation and measurement, for hiding and showing the
results of the measurements, and for animating the re-preparation of experiments.  The `CoinExperimentSceneView` class
is the main view class for each of the two scenes, and it contains view representations for the coins and the coin sets.
The creation and animation of the coin nodes are handled by `SingleCoinViewManager`, `MultipleCoinViewManager`, and
`ManyCoinViewManager`.  Each of these creates nodes used to represent the coins and animates their movement, including
flipping the coins.  `ManyCoinViewManager` is used for the 10k coin set, and it uses canvas to represent each coin
essentially as a pixel.

### Photons Screen

The "Photons" screen demonstrates how photons with a given polarization angle behavior when passing through a beam
splitter.  The user can prepare a photon with a given polarization angle, then view the path that it travels towards
a detector.  The user can choose either classical or quantum behavior, and in the quantum case, the photon is in a
superposition of states until measured.

#### Model

The model for the "Photons" consists of a laser that produces polarized photons, a beam splitter that can change the
path of the photons, and two detectors that can measure the photons.  The `Photon` class represents a single photon, and
can be in a superposition of states.  The `PhotonExperimentSceneModel` class manages the state of the experiment and
the user interaction.  There is a control that allows the user to set the polarization angle of the photon or to have
them be unpolarized.  The model decides probabilistically the path that the photon will take.

#### View

The view has representations for the laser, the beam splitter, the detectors, and the photons. It also includes a
control that allows the user to set the polarization angle of the photon. There are also a number of nodes that are used
to represent the outcomes of the measurements, either as an individual count or as a moving average. There is an area
that displays information about the expectation value and measurement counts/rates.

### Spin Screen

#### Model

* SG measurement calculation
* particles path logic

#### View

### Bloch Sphere Screen

#### Model

* Change of basis

#### View
