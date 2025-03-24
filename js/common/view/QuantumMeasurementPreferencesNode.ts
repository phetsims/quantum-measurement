// Copyright 2025, University of Colorado Boulder

/**
 * QuantumMeasurementPreferencesNode is the user interface for sim-specific preferences, accessed via the Preferences
 * dialog. These preferences are global, and can potentially affect all screens.
 *
 * The Preferences dialog is created on demand by joist, using a PhetioCapsule. So QuantumMeasurementPreferencesNode
 * must implement dispose, and all elements of QuantumMeasurementPreferencesNode that have tandems must be disposed.
 *
 * @author Agustín Vallejo
 */

import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import QuantumMeasurementPreferences from '../model/QuantumMeasurementPreferences.js';

export default class QuantumMeasurementPreferencesNode extends VBox {
  public constructor( tandem: Tandem ) {

    const showGlobalPhaseControl = new ShowGlobalPhase( tandem.createTandem( 'showGlobalPhaseControl' ) );

    const classicalCoinsStartVisibleControl = new ClassicalCoinsStartVisible(
      tandem.createTandem( 'classicalCoinsStartVisibleControl' )
    );

    super( {
      children: [ classicalCoinsStartVisibleControl, showGlobalPhaseControl ],
      spacing: 20,
      tandem: tandem
    } );
  }
}

class ClassicalCoinsStartVisible extends PreferencesControl {

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      labelNode: new Text(
        QuantumMeasurementStrings.preferences.classicalCoinsStartVisible.titleStringProperty,
        PreferencesDialogConstants.CONTROL_LABEL_OPTIONS
      ),
      descriptionNode: new RichText(
        QuantumMeasurementStrings.preferences.classicalCoinsStartVisible.descriptionStringProperty,
        PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS
      ),
      controlNode: new ToggleSwitch(
        QuantumMeasurementPreferences.classicalCoinsStartVisibleProperty,
        false,
        true,
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      ),
      tandem: tandem
    } );

    this.addLinkedElement( QuantumMeasurementPreferences.classicalCoinsStartVisibleProperty );
  }
}

class ShowGlobalPhase extends PreferencesControl {

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
        QuantumMeasurementPreferences.showGlobalPhaseProperty,
        false,
        true,
        PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS
      ),
      tandem: tandem
    } );

    this.addLinkedElement( QuantumMeasurementPreferences.showGlobalPhaseProperty );
  }
}

quantumMeasurement.register( 'QuantumMeasurementPreferencesNode', QuantumMeasurementPreferencesNode );