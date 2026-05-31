import { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, PanResponder } from 'react-native';
import { ComposableMap, Geographies, Geography } from 'react-native-simple-map';
import type { GeographyFeature } from 'react-native-simple-map';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function InteractiveMapScreen() {
  const [pressedGeo, setPressedGeo] = useState<string | null>(null);
  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -20, 0,
  ]);
  const [autoRotate, setAutoRotate] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationRef = useRef(rotation);
  rotationRef.current = rotation;

  // Auto-rotation
  useEffect(() => {
    if (autoRotate) {
      intervalRef.current = setInterval(() => {
        setRotation(([lon, lat, gamma]) => [(lon + 0.3) % 360, lat, gamma]);
      }, 30);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRotate]);

  // Pan responder for manual rotation
  const lastPan = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
      onPanResponderGrant: () => {
        setAutoRotate(false);
        lastPan.current = { x: 0, y: 0 };
      },
      onPanResponderMove: (_, gestureState) => {
        const sensitivity = 0.3;
        const dx = gestureState.dx - lastPan.current.x;
        const dy = gestureState.dy - lastPan.current.y;
        lastPan.current = { x: gestureState.dx, y: gestureState.dy };
        setRotation(([lon, lat, gamma]) => [
          lon + dx * sensitivity,
          Math.max(-90, Math.min(90, lat - dy * sensitivity)),
          gamma,
        ]);
      },
      onPanResponderRelease: () => {
        setAutoRotate(true);
      },
    })
  ).current;

  const handlePress = useCallback((g: GeographyFeature) => {
    const geoName = (g.properties as Record<string, string>)?.name;
    setPressedGeo(geoName || null);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Interactive – Press Countries</Text>
      <Text style={styles.info}>
        {pressedGeo ? `Selected: ${pressedGeo}` : 'Tap a country'}
      </Text>

      <View style={styles.mapContainer} {...panResponder.panHandlers}>
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ scale: 350, rotate: rotation }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = (geo.properties as Record<string, string>)?.name;
                const isSelected = name === pressedGeo;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? '#F53' : '#D6D6DA'}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    onPress={handlePress}
                    style={{
                      default: { fill: isSelected ? '#F53' : '#D6D6DA' },
                      pressed: { fill: '#E42' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    padding: 12,
    paddingBottom: 4,
    color: '#333',
  },
  info: {
    fontSize: 13,
    paddingHorizontal: 12,
    paddingBottom: 8,
    color: '#666',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
