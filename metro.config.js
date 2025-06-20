const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the project's node_modules to the resolver
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Explicitly tell Metro how to resolve the missing package
config.resolver.extraNodeModules = {
  '@stream-io/react-native-webrtc': path.resolve(__dirname, 'node_modules/@stream-io/react-native-webrtc'),
};

module.exports = config;
