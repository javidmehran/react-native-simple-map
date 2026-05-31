import { View, StyleSheet, Text } from 'react-native';
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from 'react-native-simple-map';
import { Text as SvgText } from 'react-native-svg';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function AnnotationMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Annotations with Connectors</Text>
      <View style={styles.mapContainer}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 200,
            center: [10, 50],
          }}
        >
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
          <Annotation
            subject={[2.3522, 48.8566]}
            dx={-40}
            dy={-30}
            connectorProps={{ stroke: '#F53', strokeWidth: 2 }}
          >
            <SvgText fontSize={12} fill="#F53" textAnchor="end">
              Paris
            </SvgText>
          </Annotation>
          <Annotation
            subject={[-0.1278, 51.5074]}
            dx={-50}
            dy={-20}
            connectorProps={{ stroke: '#07A', strokeWidth: 2 }}
          >
            <SvgText fontSize={12} fill="#07A" textAnchor="end">
              London
            </SvgText>
          </Annotation>
          <Annotation
            subject={[13.405, 52.52]}
            dx={30}
            dy={-25}
            connectorProps={{ stroke: '#333', strokeWidth: 2 }}
          >
            <SvgText fontSize={12} fill="#333">
              Berlin
            </SvgText>
          </Annotation>
          <Annotation
            subject={[12.4964, 41.9028]}
            dx={40}
            dy={20}
            curve={0.5}
            connectorProps={{ stroke: '#2A9D8F', strokeWidth: 2 }}
          >
            <SvgText fontSize={12} fill="#2A9D8F">
              Rome
            </SvgText>
          </Annotation>
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
