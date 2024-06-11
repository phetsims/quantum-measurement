// Copyright 2024, University of Colorado Boulder

/**
 * PhysicalCoinsExperimentSceneView is the parent node in which the "Physical Coin" scene is displayed.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import { Color, NodeOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import CoinsExperimentSceneModel from '../model/CoinsExperimentSceneModel.js';
import CoinsExperimentSceneView, { CoinsExperimentSceneViewOptions } from './CoinsExperimentSceneView.js';
import SceneSectionHeader from './SceneSectionHeader.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhysicalCoinNode from './PhysicalCoinNode.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { PhysicalCoinStates, PhysicalCoinStateValues } from '../../common/model/PhysicalCoinStates.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Panel from '../../../../sun/js/Panel.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type SelfOptions = EmptySelfOptions;
type PhysicalCoinsExperimentSceneViewOptions = SelfOptions & CoinsExperimentSceneViewOptions;

const RADIO_BUTTON_COIN_NODE_RADIUS = 20;
const SUBHEADING_FONT = new PhetFont( 18 );

export default class PhysicalCoinsExperimentSceneView extends CoinsExperimentSceneView {

  public constructor( sceneModel: CoinsExperimentSceneModel, providedOptions?: PhysicalCoinsExperimentSceneViewOptions ) {

    const options = optionize<PhysicalCoinsExperimentSceneViewOptions, SelfOptions, NodeOptions>()(
      { visibleProperty: sceneModel.activeProperty },
      providedOptions
    );

    super( sceneModel, options );

    // Set up the header for the preparation area.
    const prepAreaHeadingTextProperty: TReadOnlyProperty<string> = new DerivedProperty(
      [
        QuantumMeasurementStrings.coinStringProperty,
        QuantumMeasurementStrings.itemToPreparePatternStringProperty,
        sceneModel.preparingExperimentProperty
      ],
      ( coinString, itemToPreparePattern, preparingExperiment ) => preparingExperiment ?
                                                                   StringUtils.fillIn( itemToPreparePattern, { item: coinString } ) :
                                                                   coinString
    );
    const prepAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: See https://github.com/phetsims/quantum-measurement/issues/1. Values below are empirically determined,
      //       but there is probably a better way.
      preparingExperiment => preparingExperiment ? 250 : 100
    );
    this.preparationArea.addChild( new SceneSectionHeader(
      prepAreaHeadingTextProperty,
      prepAreaHeaderLineWidthProperty
    ) );

    // Add the UI element that will allow the user to specify the initial state of the coin.
    const selectionPanelTitle = new Text( QuantumMeasurementStrings.initialOrientationStringProperty, {
      font: SUBHEADING_FONT
    } );
    // TODO: See https://github.com/phetsims/quantum-measurement/issues/8 - Look at potentially generalizing this for
    //       use in the Quantum scene as well.
    const initialCoinStateItems = PhysicalCoinStateValues.map( stateValue => ( {
      createNode: () => new PhysicalCoinNode(
        new Property<PhysicalCoinStates>( stateValue ),
        RADIO_BUTTON_COIN_NODE_RADIUS,
        Tandem.OPT_OUT
      ),
      value: stateValue,
      tandemName: `${stateValue.toLowerCase()}RadioButton`,
      options: { minWidth: 80 }
    } ) );
    const initialOrientationRadioButtonGroup = new RectangularRadioButtonGroup<PhysicalCoinStates>(
      sceneModel.initialCoinStateProperty,
      initialCoinStateItems,
      {
        orientation: 'horizontal',
        spacing: 10,
        radioButtonOptions: {
          xMargin: 1,
          yMargin: 10,
          baseColor: Color.WHITE
        },
        tandem: options.tandem.createTandem( 'initialOrientationRadioButtonGroup' )
      }
    );

    const selectorPanelContent = new VBox( {
      children: [ selectionPanelTitle, initialOrientationRadioButtonGroup ],
      spacing: 10
    } );

    const selectorPanel = new Panel( selectorPanelContent, {
      fill: new Color( '#eeeeee' ),
      stroke: null,
      xMargin: 40,
      visibleProperty: sceneModel.preparingExperimentProperty
    } );
    this.preparationArea.addChild( selectorPanel );

    // Add the Node that will indicate the initial orientation of the coin.
    this.preparationArea.addChild( new PhysicalCoinNode(
      sceneModel.initialCoinStateProperty,
      32, // TODO: Make this a shared constant, see https://github.com/phetsims/quantum-measurement/issues/7.
      options.tandem.createTandem( 'coinIndicatorNode' )
    ) );

    // Set up the top header for the measurement area.  It changes based on the mode and the strings.
    const measurementAreaHeaderLineWidthProperty = new DerivedProperty(
      [ sceneModel.preparingExperimentProperty ],

      // TODO: Values below are empirically determined, but there is probably a better way.  See https://github.com/phetsims/quantum-measurement/issues/1.
      preparingExperiment => preparingExperiment ? 300 : 400
    );
    this.measurementArea.addChild( new SceneSectionHeader(
      QuantumMeasurementStrings.singleCoinMeasurementsStringProperty,
      measurementAreaHeaderLineWidthProperty
    ) );

    // Update the activity area positions now that the have some content.
    this.updateActivityAreaPositions();
  }
}

quantumMeasurement.register( 'PhysicalCoinsExperimentSceneView', PhysicalCoinsExperimentSceneView );