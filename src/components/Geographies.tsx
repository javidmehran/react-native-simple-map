import { G } from 'react-native-svg';
import { useMapContext } from './MapProvider';
import useGeographies from './useGeographies';
import type { GeographiesProps } from '../types';

const Geographies = ({
  geography,
  children,
  parseGeographies,
}: GeographiesProps) => {
  const { path, projection } = useMapContext();
  const { geographies, outline, borders } = useGeographies({
    geography,
    parseGeographies,
  });

  return (
    <G>
      {geographies &&
        geographies.length > 0 &&
        children({ geographies, outline, borders, path, projection })}
    </G>
  );
};

Geographies.displayName = 'Geographies';

export default Geographies;
