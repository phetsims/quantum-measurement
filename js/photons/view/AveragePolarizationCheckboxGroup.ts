// Copyright 2025, University of Colorado Boulder

/**
 * AveragePolarizationCheckboxGroup is a group of checkboxes that have strings to define their labels and an optional
 * decoration node that can be added to the right of the checkbox.  This encapsulates the logic for creating the
 * checkbox group needed for the average polarization view.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { GatedVisibleProperty } from '../../../../axon/js/GatedBooleanProperty.js';
import type PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import quantumMeasurement from '../../quantumMeasurement.js';

// types
type SelfOptions = EmptySelfOptions;
type AveragePolarizationCheckboxGroupOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;
export type AveragePolarizationCheckboxGroupItem = {
  property: PhetioProperty<boolean>; // Property associated with the checkbox
  labelStringProperty: LocalizedStringProperty; // Property that defines the label for the checkbox
  tandemControlName: string; // tandem name for the control containing the checkbox
  decorationNode?: Node; // optional node that can be added to the right of the checkbox
  visibleProperty?: TReadOnlyProperty<boolean>; // optional property that can be used to control the visibility of the checkbox
};

// constants
const CHECKBOX_GROUP_SPACING = 8;
const CHECKBOX_GROUP_POINTER_DILATION = CHECKBOX_GROUP_SPACING / 2;
const COMMON_CHECKBOX_OPTIONS = {
  phetioVisiblePropertyInstrumented: false, // The enclosing control should be removed if the checkbox isn't desired.
  mouseAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
  mouseAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION,
  touchAreaXDilation: CHECKBOX_GROUP_POINTER_DILATION,
  touchAreaYDilation: CHECKBOX_GROUP_POINTER_DILATION
};
const CHECKBOX_LABEL_OPTIONS = {
  font: new PhetFont( 14 ),
  maxWidth: 200
};
const ALWAYS_TRUE_PROPERTY = new BooleanProperty( true );

class AveragePolarizationCheckboxGroup extends VBox {

  public constructor( checkboxGroupItems: AveragePolarizationCheckboxGroupItem[],
                      providedOptions: AveragePolarizationCheckboxGroupOptions ) {

    const checkboxes: Checkbox[] = [];

    // Go through the list of checkbox group items and create a checkbox for each one.
    checkboxGroupItems.forEach( checkboxGroupItem => {

      // Create the checkbox label.
      const checkboxLabel = new Text( checkboxGroupItem.labelStringProperty, CHECKBOX_LABEL_OPTIONS );

      // If a decoration node was provided, create an HBox that contains the label and the decoration node.
      let checkboxContent: Node;
      if ( checkboxGroupItem.decorationNode ) {
        checkboxContent = new HBox( {
          children: [ checkboxLabel, checkboxGroupItem.decorationNode ],
          spacing: 8
        } );
      }
      else {
        checkboxContent = checkboxLabel;
      }

      // Create the checkbox.
      const checkboxTandem = providedOptions.tandem.createTandem( `${checkboxGroupItem.tandemControlName}Checkbox` );
      const checkbox = new Checkbox(
        checkboxGroupItem.property,
        checkboxContent,
        combineOptions<CheckboxOptions>(
          {
            boxWidth: 16,
            visibleProperty: checkboxGroupItem.visibleProperty ?
                             new GatedVisibleProperty( checkboxGroupItem.visibleProperty, checkboxTandem ) :
                             ALWAYS_TRUE_PROPERTY,
            tandem: checkboxTandem,
            containerTagName: 'li'
          },
          COMMON_CHECKBOX_OPTIONS
        )
      );

      // Add this checkbox control to the list.
      checkboxes.push( checkbox );
    } );

    const options = optionize<VBoxOptions, SelfOptions, AveragePolarizationCheckboxGroupOptions>()( {
      children: checkboxes,
      align: 'left',
      spacing: CHECKBOX_GROUP_SPACING,
      tandem: providedOptions.tandem,
      tagName: 'ul'
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'AveragePolarizationCheckboxGroup', AveragePolarizationCheckboxGroup );
export default AveragePolarizationCheckboxGroup;