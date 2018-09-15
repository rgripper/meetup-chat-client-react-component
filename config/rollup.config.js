import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript'
import pkg from '../package.json'
import path from 'path'

export default {
  input: path.resolve('src/index.ts'),
  output: [{
    file: path.resolve(pkg.main),
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