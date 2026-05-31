import type { GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

export interface ProjectionConfig {
  center?: [number, number];
  rotate?: [number, number, number?];
  scale?: number;
  parallels?: [number, number];
}

export interface MapContextValue {
  width: number;
  height: number;
  projection: GeoProjection;
  path: GeoPath<unknown, GeoPermissibleObjects>;
}

export interface ZoomPanContextValue {
  x: number;
  y: number;
  k: number;
  transformString: string;
}

export interface GeographyFeature {
  rsmKey: string;
  svgPath: string | null;
  type?: string;
  geometry?: unknown;
  properties?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MeshData {
  rsmKey: string;
  svgPath: string | null;
  type?: string;
  coordinates?: unknown;
  [key: string]: unknown;
}

export interface GeographyStyleState {
  default?: Record<string, string | number>;
  pressed?: Record<string, string | number>;
}

export interface ComposableMapProps {
  width?: number;
  height?: number;
  projection?: string | (() => GeoProjection);
  projectionConfig?: ProjectionConfig;
  style?: ViewStyle;
  children?: ReactNode;
}

export interface GeographiesProps {
  geography: string | object | unknown[];
  children: (data: {
    geographies: GeographyFeature[];
    outline?: MeshData;
    borders?: MeshData;
    path: GeoPath<unknown, GeoPermissibleObjects>;
    projection: GeoProjection;
  }) => ReactNode;
  parseGeographies?: (features: unknown[]) => unknown[];
}

export interface GeographyProps {
  geography: GeographyFeature;
  style?: GeographyStyleState;
  onPress?: (geography: GeographyFeature) => void;
  onPressIn?: (geography: GeographyFeature) => void;
  onPressOut?: (geography: GeographyFeature) => void;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  [key: string]: unknown;
}

export interface MarkerProps {
  coordinates: [number, number];
  children?: ReactNode;
  style?: GeographyStyleState;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  [key: string]: unknown;
}

export interface AnnotationProps {
  subject: [number, number];
  children?: ReactNode;
  dx?: number;
  dy?: number;
  curve?: number | [number, number];
  connectorProps?: Record<string, string | number>;
}

export interface LineProps {
  from?: [number, number];
  to?: [number, number];
  coordinates?: [number, number][];
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  [key: string]: unknown;
}

export interface SphereProps {
  id?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface GraticuleProps {
  fill?: string;
  stroke?: string;
  step?: [number, number];
  strokeWidth?: number;
}

export interface ZoomableGroupProps {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  translateExtent?: [[number, number], [number, number]];
  onMoveStart?: (event: {
    coordinates: [number, number] | null;
    zoom: number;
  }) => void;
  onMove?: (event: { x: number; y: number; zoom: number }) => void;
  onMoveEnd?: (event: {
    coordinates: [number, number] | null;
    zoom: number;
  }) => void;
  children?: ReactNode;
}
