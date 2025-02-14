# Quantum Measurement - Implementation Notes

@author Agustin Vallejo (PhET Interactive Simulations)

@author John Blanco (PhET Interactive Simulations)

## Table of Contents

* [Introduction](#introduction)
* [General Considerations](#general-considerations)
  * [Common Terminology](#common-terminology)
  * [Common Model and View Patterns](#common-model-and-view-patterns)
  * [Memory Management](#memory-management)
* [Screens](#screens)
  * [Coins Screen](#coins-screen)
    + [Model](#model)
    + [View](#view)
  * [Photons Screen](#photons-screen)
    + [Model](#model-1)
    + [View](#view-1)
  * [Spin Screen](#spin-screen)
    + [Model](#model-2)
    + [View](#view-2)
  * [Bloch Sphere Screen](#bloch-sphere-screen)
    + [Model](#model-3)
    + [View](#view-3)

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
* [Quantum Measurement HTML5](https://docs.google.com/document/d/1RRVAM0oqUhmORINl2s9Uyp_7tE7FAxunmZ_qMx7cv5c/edit?usp=sharing) (Parts of this are likely to be stale.)

## General Considerations

### Common Terminology

There are a number of terms that are used throughout the simulation that are specific to quantum mechanics.  Here are
some of the most important ones:

- **Bloch Sphere** -Named after the physicist Felix Bloch, the Bloch sphere is a geometrical representation of the pure
  state space of a two-level quantum mechanical system.
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

### Common Model and View Patterns

- **Preparation and Measurement Areas** - The general idea for all four screens is that the user prepares the system,
  then makes measurements on it. Most screens have a `PreparationArea.ts` and a `MeasurementArea.ts` which are usually
  Scenery nodes in charge of the layout and interaction of the preparation and measurement areas.  The models have
  Properties that represent the state of the system in the preparation and measurement areas.
- **Histograms** - All screens have a variation of the measurement histogram, and also sometimes variation within the
  very same screen depending on mode selection (single vs. continuous for example). Thus, the class had to be furnished
  with all the possible options, and in fact, the biggest part of that file is code controlling the different ways to
  display a number (number, rate, fraction, percentage, etc).
- **Bloch Sphere** - Since we have a screen with that name, and it's also a component used in two screens, here are the
  different flavors of Bloch spheres:
  - Component related:
    - `AbstractBlochSphere`: abstract class which contains the very fundamentals of a bloch sphere state representation:
      azimuthal and polar angles, and the equation coefficients. They are related but will be linked in the
      implementations.
    - `SimpleBlochSphere`: Implementation of the abstract class which links a spin state into spherical coordinates.
    - `ComplexBlochSphere`: Implementation of the abstract class which supports rotation around the Z axis, as well as
      measurement along a basis.
    - `BlochSphereNode`: Node which displays any implementation of the abstract base class. It's quite a big file because
      it has to support all the custom options and design quirks added to the sphere.
    - `BlochSphereWithProjectionNode`: Same as above but supports extra projection vectors on Z and X axis.
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

The "Spin" screen is the first one that displays the Bloch sphere.  The user configures the spin of the particles that
emit from the source, and can select from a set of experiments that consist of potentially chained Stern-Gerlach
measurements, which have different outcomes depending on the measured spin of the particles.  Particles can be
emitted one at a time or in a continuous stream.

#### Model

The main model class is `SpinModel`. and it contains two particle collections - one for the one-particle-at-a-time mode
and another for the particle stream mode - that consist of `ParticleWithSpin` instances.  These collections are fully
populated at startup because this works better for phet-io.  The model also contains a set of Stern-Gerlach measuring
devices that can be used to measure the spin of the particles.  The model turns on and off the various measuring devices
based on the selected experiment.  The model also contains a `BlochSphereModel` that is used to represent the initial
spin state of the particles.

For phet-io, the particles are serialized as a collection instead of individually.

<!-- Agustin - please add information about the particle path logic and SG measurement calculations -->

#### View

The `SpinScreenView` class is the main view class for the "Spin" screen, and it contains the `SpinStatePreparationArea`
and the `SpinMeasurementArea`.  The `SpinStatePreparationArea` contains the Bloch sphere that represents the
initially prepared spin state and radio buttons to select the prepared state.  The `SpinMeasurementArea` contains the
particle source, the Stern-Gerlach measuring devices, the Bloch spheres that represent the measured spin states, the
histograms that shows the results of the measurements, and particle nodes.  The particles that are displayed in the
continuous mode are drawn using canvas in `ManyParticlesCanvasNode` for optimal performance.

### Bloch Sphere Screen

The "Bloch Sphere" screen allows users to prepare a spin state by manipulating a unit vector in a Bloch sphere by
changing the azimuthal and polar angles.  The user can then measure the spin state along a given basis in the
measurement area by pressing the "Observe" button.  The user can also enable a magnetic field that causes the spin state
to precess around the Z axis prior to measurement.

#### Model

The main model class - `BlochSphereModel` - contains a number of Bloch sphere models, one that represents the prepared
state and others for tracking the results of the measurements.  It also contains a number of Properties that keep track
of that nature and state of the experiment, such as the prepared state, the measured state, the basis along which the
measurement is made, and the magnetic field strength.

<!-- Agustin - please add information about the change of basis -->

#### View

The main view class - `BlochSphereScreenView` - is similar to the other screens in that it contains a preparation area
and a measurement area.  The preparation area contains the Bloch sphere that represents the prepared state and the
controls for manipulating the state.  The measurement area contains a system-under-test representation, controls for
changing the basis of the measurement, and a button to make the measurement.  A single Bloch sphere is used to represent
the results of a measurement for a single atom, and a set of Bloch spheres is used to represent the results of a
measurement for a set of atoms.  The visibility is controlled based on the selected mode.