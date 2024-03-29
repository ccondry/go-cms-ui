import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import image from '@rollup/plugin-image'
import postcss from 'rollup-plugin-postcss'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import filesize from 'rollup-plugin-filesize'
import requireContext from 'rollup-plugin-require-context'
import { visualizer } from 'rollup-plugin-visualizer'
import copy from 'rollup-plugin-copy'
import cleaner from 'rollup-plugin-cleaner'

const production = !process.env.ROLLUP_WATCH
const port = 3000

export default {
  input: 'src/main.js',
  output: {
    dir: 'dist',
    entryFileNames: 'app.js',
    format: 'iife',
    sourcemap: !production ? 'inline' : false,
    name: 'app',
  },
  plugins: [
    cleaner({
      targets: [
        'dist'
      ]
    }),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist' },
        { src: 'src/assets/*', dest: 'dist/assets' }
      ]
    }),
    json(),
    alias({
      entries: [{ find: 'src', replacement: __dirname + '/src' }],
      // entries: [{ find: 'components', replacement: __dirname + '/src/components' }],
    }),
    image(),
    postcss({ extract: 'app.css', config: { path: 'postcss.config.js' } }),
    requireContext(),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    // scriptSetup(),
    vue({
      css: false,
      needMap: false,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    replace({
      'process.env.NODE_ENV': production ? '"production"' : '"development"',
      preventAssignment: true,
    }),
    esbuild({
      minify: production,
      target: 'es2015',
    }),
    !production &&
      visualizer({
        open: false,
      }),
    !production &&
      serve({
        open: true,
        openPage: '/',
        contentBase: 'dist',
        historyApiFallback: '/',
        port,
      }),
    !production &&
      livereload({
        watch: 'dist'
      }),
    production && filesize(),
  ],
  watch: {
    clearScreen: true,
  },
}
