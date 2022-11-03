/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import babel from '@rollup/plugin-babel';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';

const pkg = require(path.resolve(__dirname, './package.json'));
const inputDir = path.resolve(__dirname, './src/index.ts');

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
].map(externalName => RegExp(`^${externalName}($|/)`));
const { name } = pkg;

// CJS for browser
export default {
  input: inputDir,
  output: {
    format: 'umd',
    name,
    file: path.resolve(__dirname, './dist/index.js'),
  },
  external,
  plugins: [
    json(),
    nodeResolve({
      browser: true,
      preferBuiltins: true,
    }),
    common({}),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, '../../babel.config.js'),
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts', '.tsx', '.jsx'],
    }),
    terser({
      compress: true,
      format: {
        comments: false,
      },
    }),
    sourcemaps(),
  ],
};
