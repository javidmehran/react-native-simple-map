import { View, StyleSheet, Text } from 'react-native';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from 'react-native-simple-map';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function GraticuleMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Graticule Grid + Sphere Boundary</Text>
      <View style={styles.mapContainer}>
        <ComposableMap projectionConfig={{ scale: 140 }}>
          <Sphere fill="#E8F4FD" stroke="#999" strokeWidth={0.5} />
          <Graticule stroke="#ccc" strokeWidth={0.3} step={[20, 20]} />
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
