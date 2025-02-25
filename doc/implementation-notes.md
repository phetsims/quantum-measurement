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
* [PhET-iO Serialization](#phet-io-serialization)

## Introduction

This document is a collection of notes that describe the implementation of the **Quantum Measurement** simulation. The
simulation is a collection of four screens that demonstrate some of the basic principles of quantum mechanics. The
screens are "Coins", "Photons", "Spin", and "Bloch Sphere".

This is not an exhaustive description of the implementation. The intention is to provide a concise high-level overview,
and to supplement the internal documentation (source code comments) and external documentation (design documents).

Before reading this document, please read:

* [model.md](https://github.com/phetsims/quantum-measurement/blob/main/doc/model.md), a high-level description of the
  simulation model.

You are also encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/main/doc/phet-software-design-patterns.md)
* [Quantum Measurement HTML5](https://docs.google.com/document/d/1RRVAM0oqUhmORINl2s9Uyp_7tE7FAxunmZ_qMx7cv5c/edit?usp=sharing) (
  Parts of this are likely to be stale.)

## General Considerations

### Common Terminology

There are a number of terms that are used throughout the simulation that are specific to quantum mechanics. Here are
some of the most important ones:

- **Measurement** - The act of observing a quantum system, which causes it to collapse into a single state. In some
  places in the code, the term "observe" is used instead of "measure".
- **Measurement Area** - Several of the screens have an area where the user can measure the state of the system. This is
  in contrast to the preparation area, where the user can prepare the system.
- **Preparation Area** - Several of the screens have an area where the user can prepare the state of the system. This is
  in contrast to the measurement area, where the user can measure the state of the system.
- **Quantum System** - A system that behaves in a probabilistic way, where the state of the system can only be known
  after measurement and is in a superposition of states until measured.
- **Superposition** - The state of a quantum system before it is measured. It is a combination of all possible states
  that the system can be in.
- **Bloch Sphere** - Named after the physicist Felix Bloch, the Bloch sphere is a geometrical representation of the pure
  state space of a two-level quantum mechanical system.

### Common Model and View Patterns

- **Preparation and Measurement Areas** - The general idea for all four screens is that the user prepares the system,
  then makes measurements on it. Most screens have a `PreparationArea.ts` and a `MeasurementArea.ts` which are usually
  Scenery nodes in charge of the layout and interaction of the preparation and measurement areas. The models have
  Properties that represent the state of the system in the preparation and measurement areas.
- **Histograms** - All screens have a variation of the measurement histogram, and also sometimes variation within the
  very same screen depending on mode selection (single vs. continuous for example). Thus, the class had to be furnished
  with all the possible options, and in fact, the biggest part of that file is code controlling the different ways to
  display a number (number, rate, fraction, percentage, etc).
- **Bloch Sphere** - Both the third and fourth screens (Spin and Bloch Sphere) display a SphereNode which is the visual
  representation of a Bloch Sphere. This view component appears multiple times across the two screens. However, since
  the fourth screen focuses specifically on explaining that same concept, you might find many files associated with that
  name. Here we list which ones are related to the view component (the blue sphere), and which are top level screen
  files:
  - Component related:
    - `AbstractBlochSphere`: abstract class which contains the fundamentals of a bloch sphere:
      azimuthal and polar angles, and the associated equation coefficients. The angles and the coefficients are related,
      but the specific link is done in the implementation of this abstract class.
    - `SimpleBlochSphere`: Implementation of the abstract class which links a spin state into spherical coordinates.
      Used in the Spin screen, where you only control the polar angle via sliders.
    - `ComplexBlochSphere`: Implementation of the abstract class which supports rotation around the Z axis, as well as
      measurement along a basis.
    - `BlochSphereNode`: Node which displays any implementation of the abstract base class. It's quite a big file
      because it has to support all the custom options and design quirks added to the sphere.
    - `BlochSphereWithProjectionNode`: Extension of BlochSphereNode with added projections of the state vector along the
      X and Z directions.
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

The most central class in the model is `CoinSet`, which represents a set of coins. This class models both classical and
quantum coins, and tracks the state of the experiment as well as the measurements that have been made. The
`CoinExperimentSceneModel` class interacts with the `CoinSet` to manage the state of the experiment and the user
interaction. It has two "test boxes" that are used to hide and show the results of the measurements, one for a single
coin and one for the set of coins. The model moves back and forth between preparation and measurement mode, starting in
preparation.

The random values used to decide the outcome of the measurements are generated using a `dotRandom` object that is seeded
with a value that is tracked in an axon Property. This allows the state information to be conveyed for phet-io purposes
without having to send 10000+ pieces of data.

#### View

The view is responsible for animating the transitions between preparation and measurement, for hiding and showing the
results of the measurements, and for animating the re-preparation of experiments. The `CoinExperimentSceneView` class is
the main view class for each of the two scenes, and it contains view representations for the coins and the coin sets.
The creation and animation of the coin nodes are handled by `SingleCoinViewManager`, `MultipleCoinViewManager`, and
`ManyCoinViewManager`. Each of these creates nodes used to represent the coins and animates their movement, including
flipping the coins. `ManyCoinViewManager` is used for the 10k coin set, and it uses canvas to represent each coin
essentially as a pixel.

### Photons Screen

The "Photons" screen demonstrates how photons with a given polarization angle behave when passing through a beam
splitter. The user can prepare a photon with a given polarization angle, then view the path that it travels towards a
detector. The user can choose either classical or quantum behavior, and in the quantum case, the photon is in a
superposition of states until measured.

#### Model

The model for the "Photons" consists of a laser that produces polarized photons, a beam splitter that can change the
path of the photons, and two detectors that can measure the photons. The `Photon` class represents a single photon, and
can be in a superposition of states. The `PhotonExperimentSceneModel` class manages the state of the experiment and the
user interaction. There is a control that allows the user to set the polarization angle of the photon or to have them be
unpolarized. The model decides probabilistically the path that the photon will take.

#### View

The view has representations for the laser, the beam splitter, the detectors, and the photons. It also includes a
control that allows the user to set the polarization angle of the photon. There are also a number of nodes that are used
to represent the outcomes of the measurements, either as an individual count or as a moving average. There is an area
that displays information about the expectation value and measurement counts/rates.

### Spin Screen

The "Spin" screen is the first one that displays the Bloch sphere. The user configures the spin of the particles that
emit from the source, and can select from a set of experiments that consist of potentially chained Stern-Gerlach
measurements, which have different outcomes depending on the measured spin of the particles. Particles can be emitted
one at a time or in a continuous stream.

#### Model

The main model class is `SpinModel`, it contains a set of Stern-Gerlach apparatuses which change the spin of particles,
as well as measurement devices that can be used to measure said spin. The model turns on and off the various measuring
devices based on the selected experiment. The model also contains a `BlochSphereModel` that is used to represent the
initial spin state of the particles.

The model also contains two particle collections - one for the one-particle-at-a-time mode and another for the particle
stream mode - that consist of `ParticleWithSpin` instances. These collections are created at startup but populated and
decimated during the sim, which helps with phet-io serialization.

The particles in this screen are simple: they go from a starting to an end position set by the `ParticleCollection`
class. On it, the function `decideParticleDestiny()` checks if the particle reached its current destination, and decides
if it has to be measured by a Stern-Gerlach apparatus, given a new starting and ending position, or has to be removed
from the collection. Particles also store information of their past measured states (spin up or down) and lifetime,
which helps with the serialization. Since the paths the particles can take are many, we use the spin information to
assign a position to the particle, based on the Stern-Gerlach's position information.

Since there's many concurring modes that could be selected in this screen (single/multiple particles, single/multiple SG
apparatuses, and custom mode) the following is a table of the experiment configuration on each combination of modes:

| Mode             | Single Particle              | Multi Particle                    |
|------------------|------------------------------|-----------------------------------|
| Single Apparatus | MD0, SG0, MD1                | SG0+H                             |
| Multi Apparatus  | MD0, SG0, MD1, SG1, SG2, MD2 | SG0+H (blockable), SG1+H*, SG2+H* |

- SG: Stern-Gerlach Apparatus: SG0 is the first one, SG1 is the second top, SG2 is the second bottom. They also can have
  a histogram (+H) in multi-particle mode.
- MD: Measurement Device (the camera with Bloch Sphere) in front of each SG phase.

Also, the experiment ocurrs in stages to better keep track of the state of the particles. The stages are:
- Stage 0: From particle source, across possibly MD0 and into SG0.
- Stage 1: From SG0, across possibly MD1 and possibly into SG1 or SG2.
- Stage 2: From SG1 or SG2, across possibly MD2 and shot into infinity.

"Possibly" meaning that it depends on the selected mode based on the table above. Each stage of the experiment is related to properties of the particles that are stored as 3-tuples for state handling: `spinVectors: Vector2[]`, `isSpinUp: boolean[]` and `stageCompleted: boolean[]`.

##### View

The `SpinScreenView` class is the main view class for the "Spin" screen, and it contains the `SpinStatePreparationArea`
and the `SpinMeasurementArea`. The `SpinStatePreparationArea` contains the Bloch sphere that represents the initially
prepared spin state and radio buttons to select the prepared state. The `SpinMeasurementArea` contains the particle
source, the Stern-Gerlach measuring devices, the Bloch spheres that represent the measured spin states, the histograms
that shows the results of the measurements, and particle nodes. The particles that are displayed in the continuous mode
are drawn using canvas in `ManyParticlesCanvasNode` for optimal performance.

### Bloch Sphere Screen

The "Bloch Sphere" screen allows users to prepare a spin state by manipulating a unit vector in a Bloch sphere by
changing the azimuthal and polar angles. The user can then measure the spin state along a given basis in the measurement
area by pressing the "Observe" button. The user can also enable a magnetic field that causes the spin state to precess
around the Z axis prior to measurement.

#### Model

The main model class - `BlochSphereModel` - contains a number of Bloch sphere models, one that represents the prepared
state and others for tracking the results of the measurements. It also contains a number of Properties that keep track
of that nature and state of the experiment, such as the prepared state, the measured state, the basis along which the
measurement is made, and the magnetic field strength. When the magnetic field is activated, measurements have to be
timed to better analyze the phase of the precession. That's why in the model there are some controls for the timing and
delay of the measurements.

The class `BlochSphereNumericalEquationNode` not only shows the numeric values of the state equation, but also handles
changes in the basis of the equation (X instead of Z for example). The entire derivation of the basis change
calculations are found in this [GitHub discussion](https://github.com/phetsims/quantum-measurement/issues/82).

#### View

The main view class - `BlochSphereScreenView` - is similar to the other screens in that it contains a preparation area
and a measurement area. The preparation area contains the Bloch sphere that represents the prepared state and the
controls for manipulating the state. The measurement area contains a system-under-test representation, controls for
changing the basis of the measurement, and a button to make the measurement. A single Bloch sphere is used to represent
the results of a measurement for a single atom, and a set of Bloch spheres is used to represent the results of a
measurement for a set of atoms. The visibility is controlled based on the selected mode.

## PhET-iO Serialization

For phet-io, screens 2 and 3 need their particles (`Photons` and `ParticleWithSpin` respectively) are serialized as
collections instead of individually. This uses a mixture of reference type serialization (which saves the particle
collection for the lifetime of the sim), and data type serialization (which saves and sets the simple values of particle
every time). That is, individual particle instances are not PhET-iO instrumented, but rather, passed around as data that
the collections handle, create, and destroy.