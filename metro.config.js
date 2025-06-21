const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro configuration
const config = getDefaultConfig(__dirname);

// Add the project's node_modules to the resolver's search paths
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// This is the crucial part:
// It tells Metro how to resolve this specific package.
config.resolver.extraNodeModules = {
  '@stream-io/react-native-webrtc': path.resolve(__dirname, 'node_modules/@stream-io/react-native-webrtc'),
};

module.exports = config;
