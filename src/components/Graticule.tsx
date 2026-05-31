import { memo } from 'react';
import { Path } from 'react-native-svg';
import { geoGraticule } from 'd3-geo';
import { useMapContext } from './MapProvider';
import type { GraticuleProps } from '../types';
import type { GeoPermissibleObjects } from 'd3-geo';

const Graticule = ({
  fill = 'transparent',
  stroke = '#ccc',
  step = [10, 10],
  strokeWidth = 0.5,
}: GraticuleProps) => {
  const { path } = useMapContext();

  return (
    <Path
      d={path(geoGraticule().step(step)() as GeoPermissibleObjects) || ''}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

Graticule.displayName = 'Graticule';

export default memo(Graticule);
