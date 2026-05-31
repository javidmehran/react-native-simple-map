import { useMemo, useState, useEffect } from 'react';
import { useMapContext } from './MapProvider';
import {
  fetchGeographies,
  getFeatures,
  getMesh,
  prepareFeatures,
  isString,
  prepareMesh,
} from '../utils';
import type { GeographyFeature, MeshData } from '../types';

interface UseGeographiesInput {
  geography: string | object | unknown[];
  parseGeographies?: (features: unknown[]) => unknown[];
}

interface UseGeographiesOutput {
  geographies: GeographyFeature[];
  outline?: MeshData;
  borders?: MeshData;
}

export default function useGeographies({
  geography,
  parseGeographies,
}: UseGeographiesInput): UseGeographiesOutput {
  const { path } = useMapContext();
  const [output, setOutput] = useState<{
    geographies?: unknown[];
    mesh?: { outline: unknown; borders: unknown } | null;
  }>({});

  useEffect(() => {
    if (!geography) return;

    if (isString(geography)) {
      fetchGeographies(geography).then((geos) => {
        if (geos) {
          setOutput({
            geographies: getFeatures(
              geos as Record<string, unknown>,
              parseGeographies
            ),
            mesh: getMesh(geos as Record<string, unknown>),
          });
        }
      });
    } else {
      setOutput({
        geographies: getFeatures(
          geography as Record<string, unknown>,
          parseGeographies
        ),
        mesh: getMesh(geography as Record<string, unknown>),
      });
    }
  }, [geography, parseGeographies]);

  const { geographies, outline, borders } = useMemo(() => {
    const meshData = output.mesh || {};
    const preparedMesh = prepareMesh(
      (meshData as { outline?: unknown }).outline,
      (meshData as { borders?: unknown }).borders,
      path
    );
    return {
      geographies: prepareFeatures(output.geographies, path),
      outline: preparedMesh.outline,
      borders: preparedMesh.borders,
    };
  }, [output, path]);

  return { geographies, outline, borders };
}
