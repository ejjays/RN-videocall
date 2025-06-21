const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro configuration.
const config = getDefaultConfig(__dirname);

// --- START OF CUSTOM CONFIGURATION ---

// 1. Watch the project's node_modules directory. This is crucial for resolving
// peer dependencies that might be hoisted or linked.
config.watchFolders = [path.resolve(__dirname, 'node_modules')];

// 2. Add the project's node_modules to the resolver's search paths.
// This ensures Metro looks in the right places for packages.
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// 3. Explicitly define a path for the problematic package.
// This is a direct workaround for the "Unable to resolve" error.
config.resolver.extraNodeModules = {
  '@stream-io/react-native-webrtc': path.resolve(
    __dirname,
    'node_modules/@stream-io/react-native-webrtc'
  ),
};

// --- END OF CUSTOM CONFIGURATION ---

module.exports = config;
