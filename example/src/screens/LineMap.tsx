import { View, StyleSheet, Text } from 'react-native';
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from 'react-native-simple-map';
import { Circle } from 'react-native-svg';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const routes = [
  {
    from: [-74.006, 40.7128] as [number, number], // New York
    to: [-0.1278, 51.5074] as [number, number], // London
    color: '#F53',
  },
  {
    from: [-0.1278, 51.5074] as [number, number], // London
    to: [72.8777, 19.076] as [number, number], // Mumbai
    color: '#07A',
  },
  {
    from: [72.8777, 19.076] as [number, number], // Mumbai
    to: [139.6917, 35.6895] as [number, number], // Tokyo
    color: '#2A9D8F',
  },
  {
    from: [139.6917, 35.6895] as [number, number], // Tokyo
    to: [-122.4194, 37.7749] as [number, number], // San Francisco
    color: '#E76F51',
  },
];

const cities = [
  { name: 'NYC', coordinates: [-74.006, 40.7128] as [number, number] },
  { name: 'LDN', coordinates: [-0.1278, 51.5074] as [number, number] },
  { name: 'MUM', coordinates: [72.8777, 19.076] as [number, number] },
  { name: 'TKY', coordinates: [139.6917, 35.6895] as [number, number] },
  { name: 'SFO', coordinates: [-122.4194, 37.7749] as [number, number] },
];

export default function LineMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lines – Flight Routes</Text>
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
          {routes.map((route, i) => (
            <Line
              key={i}
              from={route.from}
              to={route.to}
              stroke={route.color}
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}
          {cities.map(({ name, coordinates }) => (
            <Marker key={name} coordinates={coordinates}>
              <Circle r={3} fill="#333" />
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
