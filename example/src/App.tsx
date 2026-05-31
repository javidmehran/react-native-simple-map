import { useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import BasicMapScreen from './screens/BasicMap';
import GraticuleScreen from './screens/GraticuleMap';
import MarkerScreen from './screens/MarkerMap';
import AnnotationScreen from './screens/AnnotationMap';
import LineScreen from './screens/LineMap';
import InteractiveScreen from './screens/InteractiveMap';
import ZoomableScreen from './screens/ZoomableMap';
import ProjectionsScreen from './screens/ProjectionsMap';

const SCREENS = [
  { key: 'basic', title: 'Basic Map', component: BasicMapScreen },
  { key: 'graticule', title: 'Graticule & Sphere', component: GraticuleScreen },
  { key: 'markers', title: 'Markers', component: MarkerScreen },
  { key: 'annotations', title: 'Annotations', component: AnnotationScreen },
  { key: 'lines', title: 'Lines & Routes', component: LineScreen },
  {
    key: 'interactive',
    title: 'Interactive (Press)',
    component: InteractiveScreen,
  },
  { key: 'zoomable', title: 'Zoom & Pan', component: ZoomableScreen },
  { key: 'projections', title: 'Projections', component: ProjectionsScreen },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<string | null>(null);

  const ActiveComponent = SCREENS.find(
    (s) => s.key === activeScreen
  )?.component;

  if (ActiveComponent) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setActiveScreen(null)}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <ActiveComponent />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.menu}>
        <Text style={styles.title}>React Native Simple Maps</Text>
        <Text style={styles.subtitle}>Component Demos</Text>
        {SCREENS.map((screen) => (
          <TouchableOpacity
            key={screen.key}
            style={styles.menuItem}
            onPress={() => setActiveScreen(screen.key)}
          >
            <Text style={styles.menuText}>{screen.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menu: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
