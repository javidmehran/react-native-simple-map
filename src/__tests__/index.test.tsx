import { it, expect } from '@jest/globals';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  Line,
  Sphere,
  Graticule,
  useMapContext,
  useZoomPanContext,
} from '../index';

it('exports all components', () => {
  expect(ComposableMap).toBeDefined();
  expect(Geographies).toBeDefined();
  expect(Geography).toBeDefined();
  expect(Marker).toBeDefined();
  expect(Annotation).toBeDefined();
  expect(Line).toBeDefined();
  expect(Sphere).toBeDefined();
  expect(Graticule).toBeDefined();
  expect(useMapContext).toBeDefined();
  expect(useZoomPanContext).toBeDefined();
});
