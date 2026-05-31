import { View, StyleSheet, Text } from 'react-native';
import { ComposableMap, Geographies, Geography } from 'react-native-simple-map';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function BasicMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Basic World Map (geoEqualEarth)</Text>
      <View style={styles.mapContainer}>
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#D6D6DA"
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
