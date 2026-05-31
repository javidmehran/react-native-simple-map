# react-native-simple-map

Create beautiful, interactive SVG maps in React Native with d3-geo and TopoJSON using a declarative API. A React Native port of [react-simple-maps](https://github.com/zcreativelabs/react-simple-maps).

## Features

- 🗺️ **15+ map projections** — Mercator, Orthographic, Equal Earth, Natural Earth, and more
- 📍 **Markers** — Place markers at any coordinates with custom SVG children
- ✏️ **Annotations** — Label locations with connector lines
- 🛫 **Lines** — Draw routes/connections between coordinates
- 🌐 **Graticule** — Latitude/longitude grid overlay
- 🔵 **Sphere** — Globe boundary with clipping
- 👆 **Interactive** — Press handlers on geographies and markers
- 🔍 **Zoom & Pan** — Pinch-to-zoom and drag gestures (optional, separate import)
- 📦 **TypeScript** — Full type definitions included
- ⚡ **Tree-shakeable** — ESM output, zoom module is a separate entry point

## Installation

```sh
npm install react-native-simple-map react-native-svg
```

### Peer Dependencies

| Package | Required | Purpose |
|---------|----------|---------|
| `react-native-svg` | **Yes** | SVG rendering |
| `react-native-gesture-handler` | Only for ZoomableGroup | Gesture handling |
| `react-native-reanimated` | Only for ZoomableGroup | Smooth animations |

If you want zoom/pan support:

```sh
npm install react-native-gesture-handler react-native-reanimated
```

> **Note:** After installing native dependencies, rebuild your app (`npx react-native run-android` or `run-ios`).

## Quick Start

```tsx
import { ComposableMap, Geographies, Geography } from 'react-native-simple-map';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function WorldMap() {
  return (
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
  );
}
```

## Components

### `<ComposableMap>`

Root container that sets up the SVG canvas and map projection.

```tsx
<ComposableMap
  width={800}           // SVG viewport width (default: 800)
  height={600}          // SVG viewport height (default: 600)
  projection="geoMercator"  // Projection name or factory function
  projectionConfig={{
    scale: 140,
    center: [0, 0],
    rotate: [0, 0, 0],
  }}
>
  {children}
</ComposableMap>
```

**Available projections:** `geoEqualEarth`, `geoMercator`, `geoOrthographic`, `geoNaturalEarth1`, `geoAlbers`, `geoAlbersUsa`, `geoAzimuthalEqualArea`, `geoAzimuthalEquidistant`, `geoConicConformal`, `geoConicEqualArea`, `geoConicEquidistant`, `geoEquirectangular`, `geoGnomonic`, `geoStereographic`, `geoTransverseMercator`

---

### `<Geographies>`

Loads and parses TopoJSON data, providing geography features to children.

```tsx
<Geographies geography={geoUrl}>
  {({ geographies, outline, borders, path, projection }) =>
    geographies.map((geo) => (
      <Geography key={geo.rsmKey} geography={geo} />
    ))
  }
</Geographies>
```

| Prop | Type | Description |
|------|------|-------------|
| `geography` | `string \| object` | TopoJSON URL or inline object |
| `children` | `function` | Render function receiving `{ geographies, outline, borders, path, projection }` |
| `parseGeographies` | `function` | Optional transform applied to features array |

---

### `<Geography>`

Renders a single geographic feature as an SVG path.

```tsx
<Geography
  geography={geo}
  fill="#EAEAEC"
  stroke="#D6D6DA"
  strokeWidth={0.5}
  onPress={(geo) => console.log(geo.properties.name)}
  style={{
    default: { fill: '#D6D6DA' },
    pressed: { fill: '#E42' },
  }}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `geography` | `GeographyFeature` | Feature object from Geographies render prop |
| `fill` | `string` | Fill color |
| `stroke` | `string` | Border color |
| `strokeWidth` | `number` | Border width |
| `onPress` | `(geo) => void` | Press handler |
| `onPressIn` | `(geo) => void` | Touch start handler |
| `onPressOut` | `(geo) => void` | Touch end handler |
| `style` | `{ default?, pressed? }` | Style states |

---

### `<Marker>`

Places children at projected geographic coordinates.

```tsx
import { Circle } from 'react-native-svg';

<Marker coordinates={[-74.006, 40.7128]}>
  <Circle r={4} fill="#F53" />
</Marker>
```

| Prop | Type | Description |
|------|------|-------------|
| `coordinates` | `[number, number]` | `[longitude, latitude]` |
| `children` | `ReactNode` | SVG elements to render at the location |
| `onPress` | `() => void` | Press handler |

---

### `<Line>`

Draws a geodesic line between two or more coordinates.

```tsx
<Line
  from={[-74.006, 40.7128]}
  to={[2.3522, 48.8566]}
  stroke="#F53"
  strokeWidth={2}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `[number, number]` | `[0, 0]` | Start coordinates |
| `to` | `[number, number]` | `[0, 0]` | End coordinates |
| `coordinates` | `[number, number][]` | — | Multi-point path (overrides from/to) |
| `stroke` | `string` | `"currentColor"` | Line color |
| `strokeWidth` | `number` | `3` | Line width |
| `fill` | `string` | `"transparent"` | Fill (usually transparent for lines) |

---

### `<Annotation>`

Renders a label with a connector line from a geographic coordinate.

```tsx
import { Text as SvgText } from 'react-native-svg';

<Annotation subject={[2.3522, 48.8566]} dx={-40} dy={-30}>
  <SvgText fontSize={12} fill="#333">Paris</SvgText>
</Annotation>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `subject` | `[number, number]` | — | Target coordinates |
| `dx` | `number` | `30` | Horizontal offset for label |
| `dy` | `number` | `30` | Vertical offset for label |
| `curve` | `number` | `0` | Connector line curvature |
| `connectorProps` | `object` | `{}` | SVG props for the connector path |

---

### `<Graticule>`

Renders a latitude/longitude grid.

```tsx
<Graticule stroke="#ccc" strokeWidth={0.3} step={[20, 20]} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fill` | `string` | `"transparent"` | Grid fill |
| `stroke` | `string` | `"#ccc"` | Grid line color |
| `strokeWidth` | `number` | `0.5` | Grid line width |
| `step` | `[number, number]` | `[10, 10]` | Grid spacing in degrees |

---

### `<Sphere>`

Renders the globe boundary with an optional clip path.

```tsx
<Sphere fill="#E8F4FD" stroke="#999" strokeWidth={0.5} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `"rsm-sphere"` | ClipPath ID |
| `fill` | `string` | `"transparent"` | Background fill |
| `stroke` | `string` | `"#000"` | Border color |
| `strokeWidth` | `number` | `0.5` | Border width |

---

### `<ZoomableGroup>` (separate import)

Adds pinch-to-zoom and drag-to-pan gestures. Requires `react-native-gesture-handler` and `react-native-reanimated`.

```tsx
import { ZoomableGroup } from 'react-native-simple-map/zoom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

<GestureHandlerRootView style={{ flex: 1 }}>
  <ComposableMap>
    <ZoomableGroup
      center={[0, 0]}
      zoom={1}
      minZoom={1}
      maxZoom={8}
      onMove={({ x, y, zoom }) => console.log(zoom)}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ZoomableGroup>
  </ComposableMap>
</GestureHandlerRootView>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `[number, number]` | `[0, 0]` | Initial center coordinates |
| `zoom` | `number` | `1` | Initial zoom level |
| `minZoom` | `number` | `1` | Minimum zoom |
| `maxZoom` | `number` | `8` | Maximum zoom |
| `translateExtent` | `[[x0, y0], [x1, y1]]` | — | Pan bounds |
| `onMoveStart` | `function` | — | Gesture start callback |
| `onMove` | `function` | — | Gesture move callback `{ x, y, zoom }` |
| `onMoveEnd` | `function` | — | Gesture end callback |

> **Important:** Wrap your app (or screen) in `<GestureHandlerRootView>` when using ZoomableGroup.

---

## Hooks

### `useMapContext()`

Access the map projection and path generator from any child component.

```tsx
import { useMapContext } from 'react-native-simple-map';

const { projection, path, width, height } = useMapContext();
```

### `useGeographies()`

Fetch and parse TopoJSON data programmatically.

```tsx
import { useGeographies } from 'react-native-simple-map';

const { geographies, outline, borders } = useGeographies({ geography: geoUrl });
```

---

## Geography Data

This library works with [TopoJSON](https://github.com/topojson/topojson) format. Recommended sources:

- **World Atlas** — `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`
- **US Atlas** — `https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json`
- **Custom** — Any valid TopoJSON file or URL

---

## Comparison with react-simple-maps (Web)

This library aims for API parity with [react-simple-maps](https://www.react-simple-maps.io/). Key differences for React Native:

| Web | React Native |
|-----|-------------|
| `className` prop | Use inline SVG props (`fill`, `stroke`, etc.) |
| `onMouseEnter`/`onMouseLeave` | `onPress`/`onPressIn`/`onPressOut` |
| `style.hover` state | Not available (no hover on mobile) |
| d3-zoom (mouse wheel) | Pinch + pan gestures via react-native-gesture-handler |
| Single import | ZoomableGroup is a separate import (`/zoom`) |

---

## TypeScript

All components are fully typed. Import types directly:

```tsx
import type {
  ComposableMapProps,
  GeographiesProps,
  GeographyProps,
  GeographyFeature,
  MarkerProps,
  AnnotationProps,
  LineProps,
  SphereProps,
  GraticuleProps,
  ZoomableGroupProps,
  ProjectionConfig,
  MapContextValue,
  ZoomPanContextValue,
} from 'react-native-simple-map';
```

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
