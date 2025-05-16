// Copyright 2025, University of Colorado Boulder

/**
 * QuantumMeasurementPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences
 * dialog. These preferences are global, and can potentially affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule, so QuantumMeasurementPreferencesNode
 * must implement dispose, and all elements of QuantumMeasurementPreferencesNode that have tandems must be disposed.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import QuantumMeasurementPreferences from '../model/QuantumMeasurementPreferences.js';

type SelfOptions = {

  // Whether the sim includes coins, which controls whether a preference for showing classical coins is included.
  hasCoins?: boolean;

  // Whether the sim includes the Bloch Sphere numerical equation, which controls whether a preference for showing the
  // global phase is included.
  hasBlochSphereNumericalEquation?: boolean;
};
type QuantumMeasurementPreferencesNodeOptions = SelfOptions & PickRequired<VBoxOptions, 'tandem'>;

export default class QuantumMeasurementPreferencesNode extends VBox {
  public constructor( providedOptions: QuantumMeasurementPreferencesNodeOptions ) {

    const options = optionize<QuantumMeasurementPreferencesNodeOptions, SelfOptions, VBoxOptions>()( {
      hasCoins: true,
      hasBlochSphereNumericalEquation: true,
      spacing: 20
    }, providedOptions );

    super( options );

    if ( options.hasCoins ) {
      this.addChild( new ClassicalCoinsStartVisibleControl(
        options.tandem.createTandem( 'classicalCoinsStartHiddenControl' ) )
      );
    }

    if ( options.hasBlochSphereNumericalEquation ) {
      this.addChild( new ShowGlobalPhaseControl(
        options.tandem.createTandem( 'showGlobalPhaseControl' ) )
      );
    }
  }
}

class ClassicalCoinsStartVisibleControl extends PreferencesControl {

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      labelNode: new Text(
        QuantumMeasurementStrings.preferences.classicalCoinsStartHidden.titleStringProperty,
        PreferencesDialogConstants.CONTROL_LABEL_OPTIONS
      ),
      descriptionNode: new RichText(
        QuantumMeasurementStrings.preferences.classicalCoinsStartHidden.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: new ToggleSwitch(
        QuantumMeasurementPreferences.getInstance().classicalCoinsStartHiddenProperty,
        false,
        true,
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      ),
      tandem: tandem,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true,
        phetioReadOnly: false
      }
    } );

    this.addLinkedElement( QuantumMeasurementPreferences.getInstance().classicalCoinsStartHiddenProperty );
  }
}

class ShowGlobalPhaseControl extends PreferencesControl {

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      labelNode: new Text(
        QuantumMeasurementStrings.preferences.showGlobalPhase.titleStringProperty,
        PreferencesDialogConstants.CONTROL_LABEL_OPTIONS
      ),
      descriptionNode: new RichText(
        QuantumMeasurementStrings.preferences.showGlobalPhase.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: new ToggleSwitch(
        QuantumMeasurementPreferences.getInstance().showGlobalPhaseProperty,
        false,
        true,
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      ),
      tandem: tandem,
      phetioFeatured: true,
      visiblePropertyOptions: {
        phetioFeatured: true,
        phetioReadOnly: false
      }
    } );

    this.addLinkedElement( QuantumMeasurementPreferences.getInstance().showGlobalPhaseProperty );
  }
}

quantumMeasurement.register( 'QuantumMeasurementPreferencesNode', QuantumMeasurementPreferencesNode );