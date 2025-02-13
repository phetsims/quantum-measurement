// Copyright 2024-2025, University of Colorado Boulder

/**
 * PhotonsEquationNode displays the equation that is used to calculate the expected value of polarization.
 *
 * @author Agustín Vallejo
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';
import QuantumMeasurementConstants from '../../common/QuantumMeasurementConstants.js';
import FractionNode from '../../common/view/FractionNode.js';
import quantumMeasurement from '../../quantumMeasurement.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';

type SelfOptions = EmptySelfOptions;
type PhotonsEquationNodeOptions = SelfOptions & WithRequired<HBoxOptions, 'tandem'>;

export default class PhotonsEquationNode extends HBox {

  public constructor( verticalValueProperty: TReadOnlyProperty<number>,
                      horizontalValueProperty: TReadOnlyProperty<number>,
                      providedOptions: PhotonsEquationNodeOptions ) {

    const totalNumberProperty = new DerivedProperty(
      [
        verticalValueProperty,
        horizontalValueProperty
      ],
      ( VValue, HValue ) => VValue + HValue
    );

    const equationsInfoDialog = new Dialog(
      new Node( { children: [ new Text( 'FILL THIS IN PLEASE', { font: new PhetFont( 18 ) } ) ] } ),
      { tandem: providedOptions.tandem.createTandem( 'equationsInfoDialog' ) }
    );

    // Create and add the info button.
    const infoButton = new InfoButton( {
      listener: () => equationsInfoDialog.show(),
      scale: 0.5,
      tandem: providedOptions.tandem.createTandem( 'infoButton' )
    } );

    const symbolicEquationStringProperty = new DerivedProperty(
      [
        QuantumMeasurementStrings.NStringProperty,
        QuantumMeasurementStrings.VStringProperty,
        QuantumMeasurementStrings.HStringProperty
      ],
      ( NString, VString, HString ) => {
        return `${NString}(${QuantumMeasurementConstants.CREATE_COLOR_SPAN(
          VString, QuantumMeasurementColors.verticalPolarizationColorProperty.value
        )}) - ${NString}(${QuantumMeasurementConstants.CREATE_COLOR_SPAN(
          HString, QuantumMeasurementColors.horizontalPolarizationColorProperty.value
        )})`;
      }
    );

    const symbolicEquationTextOptions = {
      font: new MathSymbolFont( 17 ),
      maxWidth: 100
    };
    const symbolicEquationNumerator = new RichText( symbolicEquationStringProperty, symbolicEquationTextOptions );
    const denominatorTextProperty = new DerivedStringProperty(
      [ QuantumMeasurementStrings.NStringProperty, QuantumMeasurementStrings.totalStringProperty ],
      ( nString, totalString ) => `${nString}(${totalString})`
    );
    const symbolicEquationDenominator = new RichText( denominatorTextProperty, symbolicEquationTextOptions );
    const symbolicEquationFraction = new FractionNode( symbolicEquationNumerator, symbolicEquationDenominator, {
      fractionLineMargin: 1
    } );

    const numericalEquationNumeratorProperty = new StringProperty( '' );
    const numericalEquationDenominatorProperty = new StringProperty( '' );
    const numericalResultProperty = new StringProperty( '' );

    Multilink.multilink(
      [
        verticalValueProperty,
        horizontalValueProperty,
        totalNumberProperty
      ],
      ( VValue, HValue, TotalValue ) => {
        numericalEquationNumeratorProperty.value = `${QuantumMeasurementConstants.CREATE_COLOR_SPAN(
          Utils.toFixed( VValue, 0 ), QuantumMeasurementColors.verticalPolarizationColorProperty.value
        )} - ${QuantumMeasurementConstants.CREATE_COLOR_SPAN(
          Utils.toFixed( HValue, 0 ), QuantumMeasurementColors.horizontalPolarizationColorProperty.value
        )}`;

        numericalEquationDenominatorProperty.value = `${Utils.toFixed( TotalValue, 0 )}`;

        numericalResultProperty.value = Utils.toFixed( ( VValue - HValue ) / TotalValue, 3 );
      }
    );

    const equationTextOptions = {
      font: new PhetFont( 17 )
    };
    const numericalTextOptions = combineOptions<RichTextOptions>( {}, equationTextOptions, {
      visibleProperty: new DerivedProperty( [ totalNumberProperty ], totalNumber => totalNumber > 0 ),
      font: new PhetFont( 17 )
    } );

    const numericalEquationNumerator = new RichText( numericalEquationNumeratorProperty, numericalTextOptions );
    const numericalEquationDenominator = new RichText( numericalEquationDenominatorProperty, numericalTextOptions );
    const numericalEquationFraction = new FractionNode( numericalEquationNumerator, numericalEquationDenominator, {
      fractionLineMargin: 1,
      visibleProperty: new DerivedProperty( [ totalNumberProperty ], totalNumber => totalNumber > 0 )
    } );

    const numericalResult = new RichText( numericalResultProperty, numericalTextOptions );

    const options = optionize<PhotonsEquationNodeOptions, SelfOptions, HBoxOptions>()( {
      spacing: 15,
      align: 'center',
      children: [
        infoButton,
        symbolicEquationFraction,
        new RichText( ' = ', numericalTextOptions ),
        numericalEquationFraction,
        new RichText( ' = ', numericalTextOptions ),
        numericalResult
      ]
    }, providedOptions );

    super( options );
  }
}

quantumMeasurement.register( 'PhotonsEquationNode', PhotonsEquationNode );