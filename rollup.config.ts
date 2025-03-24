import convertStringConvention from './convert-string-convention';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import addBanner from './rollup-plugin-add-banner';

import packageMetadata from './package.json';

const packageName = packageMetadata.name;
const packageNamespace =
  packageName.startsWith('@') && packageName.includes('/') ?
    packageName.substring(0, packageName.indexOf('/'))
  : null;
const packagePureName =
  packageNamespace ?
    packageName.substring(packageName.indexOf('/') + 1)
  : packageName;
const packageAuthor =
  ('author' in packageMetadata &&
    typeof packageMetadata.author === 'string' &&
    packageMetadata.author) ||
  packageNamespace?.substring(1) ||
  'Unknown';

const scriptName =
  ('displayName' in packageMetadata &&
    typeof packageMetadata.displayName === 'string' &&
    packageMetadata.displayName) ||
  convertStringConvention(packagePureName, 'Space Case');
const shortScriptName =
  ('shortDisplayName' in packageMetadata &&
    typeof packageMetadata.shortDisplayName === 'string' &&
    packageMetadata.shortDisplayName) ||
  scriptName;

function transformSourcemapPath(path: string): string {
  const topLevelPath = path.replace(/^(\.\.\/)*/, '');
  return `userscript:///${packageAuthor}/${packagePureName}/${topLevelPath}`;
}

export default {
  input: 'src/index.tsx',
  output: [
    {
      format: 'es',
      inlineDynamicImports: true,
      file: `dist/${packagePureName}.user.js`,
      sourcemap: 'inline',
      sourcemapPathTransform: transformSourcemapPath,
    },
    {
      format: 'es',
      inlineDynamicImports: true,
      file: `dist/${packagePureName}.min.user.js`,
      sourcemap: 'inline',
      sourcemapPathTransform: transformSourcemapPath,
      plugins: [terser({ mangle: false })],
    },
  ],
  plugins: [
    typescript(),
    commonjs(),
    resolve(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      __SCRIPT_ID__: JSON.stringify(`${packageAuthor}/${packagePureName}`),
      __SCRIPT_AUTHOR__: JSON.stringify(packageAuthor),
      __SCRIPT_NAME__: JSON.stringify(scriptName),
      __SCRIPT_SHORT_NAME__: JSON.stringify(shortScriptName),
      __BUILD_TIME__: JSON.stringify(new Date()),
    }),
    addBanner({ file: 'tampermonkey.meta.js' }),
  ],
};
