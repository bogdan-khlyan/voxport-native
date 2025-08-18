/* eslint-disable */

const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // чтобы svg обрабатывались трансформером, а не как ассеты
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg', 'cjs'],
    // главный фикс: алиас '@' указывает на src
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
