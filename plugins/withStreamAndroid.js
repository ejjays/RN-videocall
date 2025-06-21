const { withSettingsGradle } = require('@expo/config-plugins');

/**
 * A config plugin to add the `@stream-io/react-native-webrtc` project to the Android build.
 * This is necessary to fix the "Project with path ':@stream-io_react-native-webrtc' could not be found" error.
 */
const withStreamAndroid = (config) => {
  return withSettingsGradle(config, (modConfig) => {
    // Check if the lines are already there to avoid duplicates
    if (!modConfig.modResults.contents.includes("':@stream-io_react-native-webrtc'")) {
      // Append the lines to include the webrtc project
      modConfig.modResults.contents += `
include ':@stream-io_react-native-webrtc'
project(':@stream-io_react-native-webrtc').projectDir = new File(rootProject.projectDir, '../node_modules/@stream-io/react-native-webrtc/android')
`;
    }
    return modConfig;
  });
};

module.exports = withStreamAndroid;
