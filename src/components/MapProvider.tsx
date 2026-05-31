import { createContext, useMemo, useContext } from 'react';
import type { ReactNode } from 'react';
import {
  geoPath,
  geoEqualEarth,
  geoMercator,
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  geoEquirectangular,
  geoGnomonic,
  geoNaturalEarth1,
  geoOrthographic,
  geoStereographic,
  geoTransverseMercator,
} from 'd3-geo';
import type { GeoProjection } from 'd3-geo';
import type { MapContextValue, ProjectionConfig } from '../types';

const projectionMap: Record<string, () => GeoProjection> = {
  geoEqualEarth,
  geoMercator,
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  geoEquirectangular,
  geoGnomonic,
  geoNaturalEarth1,
  geoOrthographic,
  geoStereographic,
  geoTransverseMercator,
};

const MapContext = createContext<MapContextValue | undefined>(undefined);

interface MakeProjectionParams {
  projectionConfig?: ProjectionConfig;
  projection?: string | (() => GeoProjection);
  width?: number;
  height?: number;
}

const makeProjection = ({
  projectionConfig = {},
  projection = 'geoEqualEarth',
  width = 800,
  height = 600,
}: MakeProjectionParams): GeoProjection => {
  const isFunc = typeof projection === 'function';
  if (isFunc) return projection();

  const projFactory = projectionMap[projection];
  if (!projFactory) {
    throw new Error(`Unknown projection: ${projection}`);
  }

  const proj = projFactory().translate([width / 2, height / 2]);

  if (projectionConfig.center && proj.center) {
    proj.center(projectionConfig.center);
  }
  if (projectionConfig.rotate && proj.rotate) {
    proj.rotate(projectionConfig.rotate as [number, number, number]);
  }
  if (projectionConfig.scale != null && proj.scale) {
    proj.scale(projectionConfig.scale);
  }
  if (
    projectionConfig.parallels &&
    (proj as unknown as { parallels?: (p: [number, number]) => void }).parallels
  ) {
    (proj as unknown as { parallels: (p: [number, number]) => void }).parallels(
      projectionConfig.parallels
    );
  }

  return proj;
};

interface MapProviderProps {
  width: number;
  height: number;
  projection?: string | (() => GeoProjection);
  projectionConfig?: ProjectionConfig;
  children?: ReactNode;
}

const MapProvider = ({
  width,
  height,
  projection,
  projectionConfig = {},
  children,
}: MapProviderProps) => {
  const [cx, cy] = projectionConfig.center || [];
  const [rx, ry, rz] = projectionConfig.rotate || [];
  const [p1, p2] = projectionConfig.parallels || [];
  const s = projectionConfig.scale || null;

  const projMemo = useMemo(() => {
    return makeProjection({
      projectionConfig: {
        center:
          cx !== undefined || cy !== undefined ? [cx ?? 0, cy ?? 0] : undefined,
        rotate:
          rx !== undefined || ry !== undefined
            ? [rx ?? 0, ry ?? 0, rz]
            : undefined,
        parallels:
          p1 !== undefined || p2 !== undefined ? [p1 ?? 0, p2 ?? 0] : undefined,
        scale: s ?? undefined,
      },
      projection,
      width,
      height,
    });
  }, [width, height, projection, cx, cy, rx, ry, rz, p1, p2, s]);

  const value = useMemo((): MapContextValue => {
    return {
      width,
      height,
      projection: projMemo,
      path: geoPath().projection(projMemo),
    };
  }, [width, height, projMemo]);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

const useMapContext = (): MapContextValue => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};

export { MapProvider, MapContext, useMapContext };
