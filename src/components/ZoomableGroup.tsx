import { useCallback, useEffect, useRef, useState } from 'react';
import { G, Rect } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useMapContext } from './MapProvider';
import { ZoomPanProvider } from './ZoomPanProvider';
import { getCoords } from '../utils';
import type { ZoomableGroupProps, ZoomPanContextValue } from '../types';

const ZoomableGroup = ({
  center = [0, 0],
  zoom = 1,
  minZoom = 1,
  maxZoom = 8,
  translateExtent,
  onMoveStart,
  onMove,
  onMoveEnd,
  children,
}: ZoomableGroupProps) => {
  const { width, height, projection } = useMapContext();

  const [position, setPosition] = useState({ x: 0, y: 0, k: zoom });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(zoom);

  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(zoom);

  const lastCenter = useRef(center);
  const lastZoom = useRef(zoom);

  // Sync with controlled center/zoom props
  useEffect(() => {
    if (
      center[0] === lastCenter.current[0] &&
      center[1] === lastCenter.current[1] &&
      zoom === lastZoom.current
    )
      return;

    const coords = projection(center);
    if (!coords) return;

    const x = coords[0] * zoom;
    const y = coords[1] * zoom;
    const newX = width / 2 - x;
    const newY = height / 2 - y;

    translateX.value = newX;
    translateY.value = newY;
    scale.value = zoom;
    savedTranslateX.value = newX;
    savedTranslateY.value = newY;
    savedScale.value = zoom;
    setPosition({ x: newX, y: newY, k: zoom });

    lastCenter.current = center;
    lastZoom.current = zoom;
  }, [
    center,
    zoom,
    width,
    height,
    projection,
    translateX,
    translateY,
    scale,
    savedTranslateX,
    savedTranslateY,
    savedScale,
  ]);

  const updatePosition = useCallback((x: number, y: number, k: number) => {
    setPosition({ x, y, k });
  }, []);

  const handleMoveStart = useCallback(
    (k: number, x: number, y: number) => {
      if (!onMoveStart) return;
      const coords = projection.invert?.(getCoords(width, height, { x, y, k }));
      onMoveStart({
        coordinates: coords ? [coords[0], coords[1]] : null,
        zoom: k,
      });
    },
    [onMoveStart, projection, width, height]
  );

  const handleMove = useCallback(
    (k: number, x: number, y: number) => {
      if (!onMove) return;
      onMove({ x, y, zoom: k });
    },
    [onMove]
  );

  const handleMoveEnd = useCallback(
    (k: number, x: number, y: number) => {
      if (!onMoveEnd) return;
      const coords = projection.invert?.(getCoords(width, height, { x, y, k }));
      onMoveEnd({
        coordinates: coords ? [coords[0], coords[1]] : null,
        zoom: k,
      });
    },
    [onMoveEnd, projection, width, height]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(handleMoveStart)(scale.value, translateX.value, translateY.value);
    })
    .onUpdate((e) => {
      'worklet';
      let newX = savedTranslateX.value + e.translationX;
      let newY = savedTranslateY.value + e.translationY;
      if (translateExtent) {
        const [[minX, minY], [maxX, maxY]] = translateExtent;
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
      }
      translateX.value = newX;
      translateY.value = newY;
      runOnJS(updatePosition)(newX, newY, scale.value);
      runOnJS(handleMove)(scale.value, newX, newY);
    })
    .onEnd(() => {
      'worklet';
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(handleMoveEnd)(scale.value, translateX.value, translateY.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      'worklet';
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      'worklet';
      const newScale = Math.max(
        minZoom,
        Math.min(maxZoom, savedScale.value * e.scale)
      );
      scale.value = newScale;
      runOnJS(updatePosition)(translateX.value, translateY.value, newScale);
      runOnJS(handleMove)(newScale, translateX.value, translateY.value);
    })
    .onEnd(() => {
      'worklet';
      savedScale.value = scale.value;
      runOnJS(handleMoveEnd)(scale.value, translateX.value, translateY.value);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const transformString = `translate(${position.x} ${position.y}) scale(${position.k})`;

  const contextValue: ZoomPanContextValue = {
    x: position.x,
    y: position.y,
    k: position.k,
    transformString,
  };

  return (
    <ZoomPanProvider value={contextValue}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View>
          <G>
            <Rect width={width} height={height} fill="transparent" />
            <G transform={transformString}>{children}</G>
          </G>
        </Animated.View>
      </GestureDetector>
    </ZoomPanProvider>
  );
};

ZoomableGroup.displayName = 'ZoomableGroup';

export default ZoomableGroup;
