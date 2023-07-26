import { builtinModules } from 'node:module'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { defineConfig } from 'rollup'

const input = 'src/index.ts'

const external = [
  ...builtinModules,
]

const plugins = [
  json(),
  nodeResolve({
    preferBuiltins: true,
  }),
  commonjs(),
  esbuild({
    target: 'node14',
  }),
]

export default () => defineConfig([
  {
    input,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].mjs',
    },
    external,
    plugins: [
      ...plugins,
    ],
  },
  {
    input,
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
    external,
    plugins: [
      ...plugins,
    ],
  },
  {
    input,
    output: {
      dir: 'dist',
      entryFileNames: 'index.d.ts',
      format: 'esm',
    },
    external,
    plugins: [
      dts({ respectExternal: true }),
    ],
  },
])
