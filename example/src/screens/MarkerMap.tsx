import { View, StyleSheet, Text } from 'react-native';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-native-simple-map';
import { Circle, Text as SvgText } from 'react-native-svg';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const markers = [
  { name: 'New York', coordinates: [-74.006, 40.7128] as [number, number] },
  { name: 'London', coordinates: [-0.1278, 51.5074] as [number, number] },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895] as [number, number] },
  { name: 'Sydney', coordinates: [151.2093, -33.8688] as [number, number] },
  { name: 'São Paulo', coordinates: [-46.6333, -23.5505] as [number, number] },
  { name: 'Cairo', coordinates: [31.2357, 30.0444] as [number, number] },
  { name: 'Mumbai', coordinates: [72.8777, 19.076] as [number, number] },
  { name: 'Beijing', coordinates: [116.4074, 39.9042] as [number, number] },
];

export default function MarkerMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Markers – Major World Cities</Text>
      <View style={styles.mapContainer}>
        <ComposableMap projectionConfig={{ scale: 140 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates}>
              <Circle r={4} fill="#F53" stroke="#fff" strokeWidth={1} />
              <SvgText y={-8} fontSize={8} textAnchor="middle" fill="#333">
                {name}
              </SvgText>
            </Marker>
          ))}
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
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
