# Model.md

@author Agustín Vallejo
This document provides a high-level description of the models used in PhET’s Quantum Measurement simulation. It assumes
the reader has a basic understanding of quantum mechanics, including key concepts such as quantum state superposition (
e.g., Schrödinger’s cat being alive AND dead), polarization, spin, and the Bloch Sphere.

## Quantum State and Superposition

A fundamental concept in quantum mechanics is the state of a system. This simulation represents the state of a 2-level
system in multiple ways., which this simulation represents in multiple ways.
Quantum systems can exist in multiple possible states simultaneously, a phenomenon known as superposition. You may have
heard of Schrödinger’s cat, a thought experiment where the cat is both alive AND dead until a measurement is made by
opening the box. Measurement collapses the quantum state into one of the possible outcomes. In this simulation, we
illustrate this behavior in various ways, depending on the screen and the intended scaffolding.

### Coins Screen

In this screen, we introduce the idea of a quantum coin representation. This representation is meant to demonstrate a
familiar 2-level system, but now with quantum properties. These quantum coins do not necessarily need to exist in a
definite "heads" or "tails" state like in classical physics, but can consist of a superposition of both possibilities
simultaneously. We have chosen to represent this superposition visually by displaying both the "up" and "down" state of
the coin simultaneously and varying the transparency levels of these states corresponding to their probabilities. The
quantum coins are considered to be in an unobserved state during preparation and their injection into the measurement
area.

### Photons Screen

This screen features a polarizing beam splitter, a device that redirects a photon’s trajectory based on its
polarization. Depending on which underlying physical model we're considering, photon behavior through this device can be
interpreted in a couple of ways. Particularly, the sim has a "Behavior" selector:
When it is chosen as Classical, the photons will individually reflect or transmit through the beam splitter.
When the Behavior selection is chosen as Quantum, the individual photons will transform to a representation of the
photon taking both optical paths after the beam splitter with the opacity of the representation correlating to the
probability of taking a particular path. During the Quantum behavior the photon will be considered to
be measured until it enters the cylindrical portion in front of each detector. Note that the path lengths of each arm of
the experiment have been equalized so that once in the measurement has taken place, only a single full opacity photon
will be seen entering any detector at a given time.

## Equation Representation

Beyond a transparency-based visualization, any quantum state Ψ can be mathematically represented as |Ψ>, known as "ket"
notation (derived from the word bracket).
Since a superposition is the combination of two or more states, we express the global state Ψ as: |Ψ> = a|A> + b|B>
where a and b are complex coefficients. If you are familiar with linear algebra, this represents a linear combination,
analogous to vector decomposition in vector algebra.
These coefficients are crucial because when a measurement is performed, the probabilities of obtaining states A or B are
determined by: P(A) = |a|^2, P(B) = |b|^2 Since the total probability must be 1, it follows that: |a|^2 + |b|^2 = 1
Thus, adjusting one probability directly affects the other.
In the last two screens, this concept applies to the spin state of test particles, which are in a superposition of UP
and DOWN states: |Ψ> = a|up> + b|down>

## Bloch Sphere Representation

Named after Nobel laureate Felix Bloch, the Bloch Sphere is a geometric representation of quantum states, useful in
contexts such as quantum computing and spin systems in magnetic fields.
In this model, the state |Ψ> is represented as a unit vector on a sphere. Since we focus on spin states, we position the
UP and DOWN states along the +Z and -Z axes, respectively. The relative probabilities of each state are reflected in the
vector’s position on the sphere.

### Spin Screen

This screen displays particles being measured using an array of Stern-Gerlach (SG) apparatuses. The preparation area
includes a Bloch Sphere to illustrate how a particle's spin state can be visualized and how projections onto different
axes correspond to the equation's coefficients.

### Bloch Sphere Screen

Here, we show how spin states evolve under a magnetic field. If the field is aligned with the Z-axis, any quantum spin
state undergoes rotation around that axis, leading to effects such as the Zeeman effect. The Bloch Sphere helps
visualize this as a change in the azimuthal angle.

## Visualizing the Invisible

In this simulation, we sometimes depict phenomena that are not directly observable. For example, a superposed state is
typically unobservable in reality because measurement collapses it into a definite state. However, in this sim, we
represent superposition using transparency to help illustrate the concept, while ensuring that the wave function
collapse only occurs when the user initiates an observation or a particle enters a detector.
Similarly, in the second screen, we "see" individual photons traveling from the source and into the detector, but the
very act of "seeing" a photon would mean that the photon actually arrived to your retina, not to the detector.
Finally, it's worth pointing out that magnetic fields are invisible and definitely do not look like yellow arrows in
space.

## Changing the Basis of the Equation

In the Bloch Sphere Screen, a panel allows users to change the basis of the quantum state equation. For instance,
instead of using the standard UP_Z and DOWN_Z basis, it can be rewritten in terms of UP_X and DOWN_X. The mathematical
details behind this transformation can be found
at [GitHub Issue #82](https://github.com/phetsims/quantum-measurement/issues/82).
A key implication of changing the basis is that the equation’s coefficients no longer correspond to the usual polar and
azimuthal angles. Instead, the coordinate system is redefined so that azimuth is measured in a different plane (e.g., ZY
instead of XY). While these angle transformations are not explicitly visualized in the simulation, they influence how
probabilities are interpreted.
Another subtle consequence is the introduction of a global phase factor when switching bases. Although the relative
phase between basis states is physically meaningful (as it relates to an azimuthal angle), the global phase has no
impact on measurements. Since this goes beyond the scope of the simulation, the global phase is ignored by default but
can be toggled on via the preferences panel.
