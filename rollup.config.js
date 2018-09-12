import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [{
    file: pkg.main,
    format: 'es',
  }],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescriptPlugin({
      typescript
    }),
  ],
}