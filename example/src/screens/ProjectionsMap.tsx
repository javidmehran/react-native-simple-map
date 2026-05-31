import { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from 'react-native-simple-map';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const PROJECTIONS = [
  { name: 'Equal Earth', value: 'geoEqualEarth' },
  { name: 'Mercator', value: 'geoMercator' },
  { name: 'Orthographic', value: 'geoOrthographic' },
  { name: 'Albers USA', value: 'geoAlbersUsa' },
  { name: 'Natural Earth', value: 'geoNaturalEarth1' },
] as const;

export default function ProjectionsMapScreen() {
  const [projIdx, setProjIdx] = useState(0);
  const current = PROJECTIONS[projIdx]!;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Projections</Text>
      <View style={styles.buttons}>
        {PROJECTIONS.map((p, i) => (
          <TouchableOpacity
            key={p.value}
            style={[styles.btn, i === projIdx && styles.btnActive]}
            onPress={() => setProjIdx(i)}
          >
            <Text
              style={[styles.btnText, i === projIdx && styles.btnTextActive]}
            >
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mapContainer}>
        <ComposableMap
          projection={current.value}
          projectionConfig={{
            scale: current.value === 'geoOrthographic' ? 200 : 140,
            rotate:
              current.value === 'geoOrthographic' ? [-10, -40, 0] : undefined,
          }}
        >
          <Sphere fill="#F0F8FF" stroke="#999" strokeWidth={0.5} />
          <Graticule stroke="#ddd" strokeWidth={0.3} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#9BC4CB"
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
    paddingBottom: 8,
    color: '#333',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 6,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  btnActive: {
    backgroundColor: '#333',
  },
  btnText: {
    fontSize: 12,
    color: '#333',
  },
  btnTextActive: {
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
