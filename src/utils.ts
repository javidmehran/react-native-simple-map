import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryObject } from 'topojson-specification';
import type { GeoPath, GeoPermissibleObjects } from 'd3-geo';
import type { GeographyFeature, MeshData } from './types';

export function getCoords(
  w: number,
  h: number,
  t: { x: number; y: number; k: number }
): [number, number] {
  const xOffset = (w * t.k - w) / 2;
  const yOffset = (h * t.k - h) / 2;
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k];
}

export function fetchGeographies(url: string): Promise<unknown | undefined> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .catch((error) => {
      console.log('There was a problem when fetching the data: ', error);
      return undefined;
    });
}

export function getFeatures(
  geographies: Record<string, unknown>,
  parseGeographies?: (features: unknown[]) => unknown[]
): unknown[] {
  const isTopojson = geographies.type === 'Topology';
  if (!isTopojson) {
    const feats =
      (geographies.features as unknown[]) ||
      (geographies as unknown as unknown[]);
    return parseGeographies ? parseGeographies(feats) : feats;
  }
  const topo = geographies as unknown as Topology;
  const firstKey = Object.keys(topo.objects)[0]!;
  const feats = feature(topo, topo.objects[firstKey] as GeometryObject);
  const features = 'features' in feats ? feats.features : [feats];
  return parseGeographies ? parseGeographies(features) : features;
}

export function getMesh(
  geographies: Record<string, unknown>
): { outline: unknown; borders: unknown } | null {
  const isTopojson = geographies.type === 'Topology';
  if (!isTopojson) return null;
  const topo = geographies as unknown as Topology;
  const firstKey = Object.keys(topo.objects)[0]!;
  const outline = mesh(
    topo,
    topo.objects[firstKey] as GeometryObject,
    (a, b) => a === b
  );
  const borders = mesh(
    topo,
    topo.objects[firstKey] as GeometryObject,
    (a, b) => a !== b
  );
  return { outline, borders };
}

export function prepareMesh(
  outline: unknown,
  borders: unknown,
  path: GeoPath<unknown, GeoPermissibleObjects>
): { outline?: MeshData; borders?: MeshData } {
  if (!outline || !borders) return {};
  return {
    outline: {
      ...(outline as object),
      rsmKey: 'outline',
      svgPath: path(outline as GeoPermissibleObjects),
    } as MeshData,
    borders: {
      ...(borders as object),
      rsmKey: 'borders',
      svgPath: path(borders as GeoPermissibleObjects),
    } as MeshData,
  };
}

export function prepareFeatures(
  geographies: unknown[] | undefined,
  path: GeoPath<unknown, GeoPermissibleObjects>
): GeographyFeature[] {
  if (!geographies) return [];
  return geographies.map((d, i) => ({
    ...(d as object),
    rsmKey: `geo-${i}`,
    svgPath: path(d as GeoPermissibleObjects),
  })) as GeographyFeature[];
}

export function createConnectorPath(
  dx = 30,
  dy = 30,
  curve: number | [number, number] = 0.5
): string {
  const curvature: [number, number] = Array.isArray(curve)
    ? curve
    : [curve, curve];
  const curveX = (dx / 2) * curvature[0];
  const curveY = (dy / 2) * curvature[1];
  return `M${0},${0} Q${-dx / 2 - curveX},${-dy / 2 + curveY} ${-dx},${-dy}`;
}

export function isString(geo: unknown): geo is string {
  return typeof geo === 'string';
}
