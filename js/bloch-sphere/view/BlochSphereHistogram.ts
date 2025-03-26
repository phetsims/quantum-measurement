// Copyright 2025, University of Colorado Boulder

/**
 * BlochSphereHistogram is a specialization of the QuantumMeasurementHistogram class with specific things needed for the
 * Bloch Sphere screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import QuantumMeasurementHistogram, { QuantumMeasurementHistogramOptions } from '../../common/view/QuantumMeasurementHistogram.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import { MeasurementAxis } from '../model/MeasurementAxis.js';

type SelfOptions = EmptySelfOptions;
type BlochSphereHistogramOptions = SelfOptions & WithRequired<QuantumMeasurementHistogramOptions, 'tandem'>;

// constants
const UP = QuantumMeasurementConstants.SPIN_UP_ARROW_CHARACTER;
const DOWN = QuantumMeasurementConstants.SPIN_DOWN_ARROW_CHARACTER;
const KET = QuantumMeasurementConstants.KET;

export default class BlochSphereHistogram extends QuantumMeasurementHistogram {

  public constructor( upCountProperty: NumberProperty,
                      downCountProperty: NumberProperty,
                      measurementAxisProperty: TReadOnlyProperty<MeasurementAxis>,
                      providedOptions: BlochSphereHistogramOptions ) {

    const options = optionize<BlochSphereHistogramOptions, SelfOptions, QuantumMeasurementHistogramOptions>()(
      {},
      providedOptions
    );

    // Create the labels for the X axis.  These will update as the measurement axis changes.
    const spinUpLabelStringProperty = new DerivedStringProperty(
      [ measurementAxisProperty ],
      measurementAxis => `|${UP}<sub>${measurementAxis.label}</sub> ${KET}`
    );
    const spinDownLabelStringProperty = new DerivedStringProperty(
      [ measurementAxisProperty ],
      measurementAxis => `|${DOWN}<sub>${measurementAxis.label}</sub> ${KET}`
    );

    super(
      upCountProperty,
      downCountProperty,
      [
        new RichText( spinUpLabelStringProperty ),
        new RichText( spinDownLabelStringProperty )
      ],
      options
    );

    this.addLinkedElement( upCountProperty );
    this.addLinkedElement( downCountProperty );
  }
}

quantumMeasurement.register( 'BlochSphereHistogram', BlochSphereHistogram );