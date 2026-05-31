import { Path } from 'react-native-svg';
import { useMapContext } from './MapProvider';
import type { LineProps } from '../types';
import type { GeoPermissibleObjects } from 'd3-geo';

const Line = ({
  from = [0, 0],
  to = [0, 0],
  coordinates,
  stroke = 'currentColor',
  strokeWidth = 3,
  fill = 'transparent',
  ...restProps
}: LineProps) => {
  const { path } = useMapContext();

  const lineData: GeoPermissibleObjects = {
    type: 'LineString',
    coordinates: coordinates || [from, to],
  };

  return (
    <Path
      d={path(lineData) || ''}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      {...restProps}
    />
  );
};

Line.displayName = 'Line';

export default Line;
