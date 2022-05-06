import vuePlugin from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'

export default {
  input: './src/main.js',
  output: {
    file: 'dist/yun-desktop-ui.js',
    format: 'esm'
  },
  plugins: [
    vuePlugin({
      target: 'browser',
      css: true,
      compileTemplate: true
    }),
    commonjs(),
    nodeResolve({
      browser: true
    }),
    scss()
  ]
}