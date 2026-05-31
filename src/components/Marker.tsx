import { useState } from 'react';
import { G } from 'react-native-svg';
import { useMapContext } from './MapProvider';
import type { MarkerProps } from '../types';

const Marker = ({
  coordinates,
  children,
  style = {},
  onPress,
  onPressIn,
  onPressOut,
  ...restProps
}: MarkerProps) => {
  const { projection } = useMapContext();
  const [isPressed, setPressed] = useState(false);

  const projected = projection(coordinates);
  if (!projected) return null;
  const [x, y] = projected;

  function handlePressIn() {
    setPressed(true);
    if (onPressIn) onPressIn();
  }

  function handlePressOut() {
    setPressed(false);
    if (onPressOut) onPressOut();
  }

  function handlePress() {
    if (onPress) onPress();
  }

  const currentStyle = isPressed ? style.pressed : style.default;

  return (
    <G
      transform={`translate(${x}, ${y})`}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      opacity={currentStyle?.opacity as number | undefined}
      {...restProps}
    >
      {children}
    </G>
  );
};

Marker.displayName = 'Marker';

export default Marker;
