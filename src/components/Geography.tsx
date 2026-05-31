import { useState, memo } from 'react';
import { Path } from 'react-native-svg';
import type { GeographyProps } from '../types';

const Geography = ({
  geography,
  onPress,
  onPressIn,
  onPressOut,
  style = {},
  fill = '#D6D6DA',
  stroke = '#FFFFFF',
  strokeWidth = 0.5,
  ...restProps
}: GeographyProps) => {
  const [isPressed, setPressed] = useState(false);

  function handlePressIn() {
    setPressed(true);
    if (onPressIn) onPressIn(geography);
  }

  function handlePressOut() {
    setPressed(false);
    if (onPressOut) onPressOut(geography);
  }

  function handlePress() {
    if (onPress) onPress(geography);
  }

  const currentStyle = isPressed ? style.pressed : style.default;

  return (
    <Path
      d={geography.svgPath || ''}
      fill={(currentStyle?.fill as string) || fill}
      stroke={(currentStyle?.stroke as string) || stroke}
      strokeWidth={(currentStyle?.strokeWidth as number) || strokeWidth}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...restProps}
    />
  );
};

Geography.displayName = 'Geography';

export default memo(Geography);
