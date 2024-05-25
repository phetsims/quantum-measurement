// Copyright 2024, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import quantumMeasurement from './quantumMeasurement.js';

type StringsType = {
  'quantum-measurement': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'coinsStringProperty': LocalizedStringProperty;
    'photonsStringProperty': LocalizedStringProperty;
  }
};

const QuantumMeasurementStrings = getStringModule( 'QUANTUM_MEASUREMENT' ) as StringsType;

quantumMeasurement.register( 'QuantumMeasurementStrings', QuantumMeasurementStrings );

export default QuantumMeasurementStrings;
