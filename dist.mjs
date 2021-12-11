
import { fs } from 'zx'


await fs.copy(  path.join( 'node_modules', 'esbuild-wasm', 'esbuild.wasm'), path.join('dist', 'esbuild.wasm') )