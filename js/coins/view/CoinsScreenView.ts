// Copyright 2024, University of Colorado Boulder

/**
 * Main screen view for the "Coins" screen.
 *
 * @author John Blanco, PhET Interactive Simulations
 */

import quantumMeasurement from '../../quantumMeasurement.js';
import CoinsModel from 'model/CoinsModel.js';
import coinsScreenMockup_png from '../../../images/coinsScreenMockup_png.js';
import QuantumMeasurementScreenView from '../../common/view/QuantumMeasurementScreenView.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { Color, Image, Text } from '../../../../scenery/js/imports.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import PhysicalCoinsExperimentSceneView from './PhysicalCoinsExperimentSceneView.js';
import QuantumCoinsExperimentSceneView from './QuantumCoinsExperimentSceneView.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { SystemType, SystemTypeValues } from '../../common/model/SystemType.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import QuantumMeasurementStrings from '../../QuantumMeasurementStrings.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import QuantumMeasurementColors from '../../common/QuantumMeasurementColors.js';

const SCENE_POSITION = new Vector2( 0, 90 ); // empirically determined to look decent
const SYSTEM_TYPE_TO_STRING_MAP = new Map<SystemType, LocalizedStringProperty>(
  [
    [ 'physical', QuantumMeasurementStrings.physicalCoinStringProperty ],
    [ 'quantum', QuantumMeasurementStrings.quantumCoinQuotedStringProperty ]
  ]
);

export default class CoinsScreenView extends QuantumMeasurementScreenView {

  private readonly model: CoinsModel;

  // the two scene views for the experiments
  private readonly physicalCoinsExperimentSceneView: QuantumCoinsExperimentSceneView;
  private readonly quantumCoinsExperimentSceneView: QuantumCoinsExperimentSceneView;

  public constructor( model: CoinsModel, tandem: Tandem ) {

    super( {
      mockupImage: new Image( coinsScreenMockup_png, {
        scale: ScreenView.DEFAULT_LAYOUT_BOUNDS.width / coinsScreenMockup_png.width
      } ),
      initialMockupOpacity: 0,
      tandem: tandem
    } );

    this.model = model;

    // Add the radio buttons at the top of the screen that will allow users to pick between physical and quantum coins.
    const experimentTypeItems = SystemTypeValues.map( systemType => ( {
      createNode: () => {
        assert && assert( SYSTEM_TYPE_TO_STRING_MAP.has( systemType ), 'no string Property for system type' );
        return new Text(
          SYSTEM_TYPE_TO_STRING_MAP.get( systemType )!,
          {
            font: new PhetFont( { size: 28, weight: 'bold' } ),
            fill: systemType === 'quantum' ? Color.BLUE : Color.BLACK,
            maxWidth: 300
          }
        );
      },
      value: systemType,
      tandemName: `${systemType.toLowerCase()}RadioButton`,
      options: { minWidth: 80 }
    } ) );
    const deselectedRadioButtonOpacity = 0.3;
    const experimentTypeRadioButtonGroup = new RectangularRadioButtonGroup<SystemType>(
      model.experimentTypeProperty,
      experimentTypeItems,
      {
        orientation: 'horizontal',
        spacing: 3,
        centerX: this.layoutBounds.centerX,
        y: 10,
        radioButtonOptions: {
          xMargin: 10,
          baseColor: QuantumMeasurementColors.selectorButtonSelectedColorProperty,
          buttonAppearanceStrategyOptions: {
            deselectedButtonOpacity: deselectedRadioButtonOpacity
          },
          contentAppearanceStrategyOptions: {
            deselectedContentOpacity: deselectedRadioButtonOpacity
          }
        },
        tandem: tandem.createTandem( 'experimentTypeRadioButtonGroup' )
      }
    );
    this.addChild( experimentTypeRadioButtonGroup );

    // Add the views for the two scenes that can be shown on this screen.
    this.physicalCoinsExperimentSceneView = new PhysicalCoinsExperimentSceneView( model.physicalCoinExperimentSceneModel, {
      translation: SCENE_POSITION,
      tandem: tandem.createTandem( 'physicalCoinsExperimentSceneView' )
    } );
    this.addChild( this.physicalCoinsExperimentSceneView );
    this.quantumCoinsExperimentSceneView = new QuantumCoinsExperimentSceneView( model.quantumCoinExperimentSceneModel, {
      translation: SCENE_POSITION,
      tandem: tandem.createTandem( 'quantumCoinsExperimentSceneView' )
    } );
    this.addChild( this.quantumCoinsExperimentSceneView );

    // Move the mockup image to the front of the Z-order for easier comparisons with added UI elements.
    if ( this.mockupImage ) {
      this.mockupImage.moveToFront();
    }
  }

  public override reset(): void {
    this.model.reset();
    this.physicalCoinsExperimentSceneView.reset();
    this.quantumCoinsExperimentSceneView.reset();
    super.reset();
  }
}

quantumMeasurement.register( 'CoinsScreenView', CoinsScreenView );