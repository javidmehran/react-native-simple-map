import { G, Path } from 'react-native-svg';
import { useMapContext } from './MapProvider';
import { createConnectorPath } from '../utils';
import type { AnnotationProps } from '../types';

const Annotation = ({
  subject,
  children,
  connectorProps = {},
  dx = 30,
  dy = 30,
  curve = 0,
}: AnnotationProps) => {
  const { projection } = useMapContext();
  const projected = projection(subject);
  if (!projected) return null;
  const [x, y] = projected;
  const connectorPath = createConnectorPath(dx, dy, curve);

  return (
    <G transform={`translate(${x + dx}, ${y + dy})`}>
      <Path
        d={connectorPath}
        fill="transparent"
        stroke="#000"
        {...connectorProps}
      />
      {children}
    </G>
  );
};

Annotation.displayName = 'Annotation';

export default Annotation;
