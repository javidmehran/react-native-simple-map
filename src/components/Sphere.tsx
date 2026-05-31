import { memo, useMemo } from 'react';
import { Defs, ClipPath, Path } from 'react-native-svg';
import { useMapContext } from './MapProvider';
import type { SphereProps } from '../types';
import type { GeoPermissibleObjects } from 'd3-geo';

const Sphere = ({
  id = 'rsm-sphere',
  fill = 'transparent',
  stroke = '#000',
  strokeWidth = 0.5,
}: SphereProps) => {
  const { path } = useMapContext();
  const spherePath = useMemo(
    () => path({ type: 'Sphere' } as GeoPermissibleObjects) || '',
    [path]
  );

  return (
    <>
      <Defs>
        <ClipPath id={id}>
          <Path d={spherePath} />
        </ClipPath>
      </Defs>
      <Path
        d={spherePath}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </>
  );
};

Sphere.displayName = 'Sphere';

export default memo(Sphere);
