import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-native-simple-map';
import { ZoomableGroup } from 'react-native-simple-map/zoom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Circle } from 'react-native-svg';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function ZoomableMapScreen() {
  const [zoom, setZoom] = useState(1);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.label}>Zoom & Pan (Pinch + Drag)</Text>
      <Text style={styles.info}>Zoom: {zoom.toFixed(2)}x</Text>
      <View style={styles.mapContainer}>
        <ComposableMap projectionConfig={{ scale: 140 }}>
          <ZoomableGroup
            center={[0, 0]}
            zoom={1}
            minZoom={1}
            maxZoom={8}
            onMove={({ zoom: z }: { x: number; y: number; zoom: number }) =>
              setZoom(z)
            }
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#B8D4E3"
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                  />
                ))
              }
            </Geographies>
            <Marker coordinates={[-74.006, 40.7128]}>
              <Circle r={3} fill="#F53" />
            </Marker>
            <Marker coordinates={[2.3522, 48.8566]}>
              <Circle r={3} fill="#F53" />
            </Marker>
            <Marker coordinates={[139.6917, 35.6895]}>
              <Circle r={3} fill="#F53" />
            </Marker>
          </ZoomableGroup>
        </ComposableMap>
      </View>
    </GestureHandlerRootView>
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
