const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { withMetroConfig } = require('react-native-monorepo-config');

const root = path.resolve(__dirname, '..');

// Packages that exist in both root (devDeps for type-checking) and example (real deps).
// We must force Metro to resolve only from example/node_modules to avoid double registration.
const packages = [
  'react-native-svg',
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-worklets',
];

const extraNodeModules = {};
const blockList = [];

for (const pkg of packages) {
  extraNodeModules[pkg] = path.resolve(__dirname, 'node_modules', pkg);
  // Block the copy in root node_modules
  blockList.push(
    new RegExp(`${root.replace(/[/\\]/g, '[/\\\\]')}/node_modules/${pkg}/.*`)
  );
}

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

// Merge our resolver overrides
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    ...extraNodeModules,
  },
  blockList: [
    ...(Array.isArray(config.resolver?.blockList)
      ? config.resolver.blockList
      : config.resolver?.blockList
        ? [config.resolver.blockList]
        : []),
    ...blockList,
  ],
};

module.exports = config;
