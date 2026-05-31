import { Svg } from 'react-native-svg';
import { MapProvider } from './MapProvider';
import type { ComposableMapProps } from '../types';

const ComposableMap = ({
  width = 800,
  height = 600,
  projection = 'geoEqualEarth',
  projectionConfig = {},
  style,
  children,
}: ComposableMapProps) => {
  return (
    <MapProvider
      width={width}
      height={height}
      projection={projection}
      projectionConfig={projectionConfig}
    >
      <Svg
        viewBox={`0 0 ${width} ${height}`}
        style={style}
        width="100%"
        height="100%"
      >
        {children}
      </Svg>
    </MapProvider>
  );
};

ComposableMap.displayName = 'ComposableMap';

export default ComposableMap;
