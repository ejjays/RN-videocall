const { getDefaultConfig } = require('expo/metro-config');

console.log("--- metro.config.js (v5 - Goldilocks) is being loaded! ---");

const config = getDefaultConfig(__dirname);

// This is the key change. We are NO LONGER blocking the whole node_modules folder.
// We are ONLY blocking the specific junk folders that cause the watcher to crash.
config.resolver.blockList = [
  /.*\/__tests__\/.*/,
  /.*\/test\/.*/,
  // This is a more specific rule for the firebase test files that were crashing before
  /.*\/@firebase\/firestore\/dist\/firestore\/test\/.*/,
];

// We still need these to help the watcher behave in Termux
config.watchFolders = [__dirname];
config.watcher.healthCheck.enabled = false;

module.exports = config;
