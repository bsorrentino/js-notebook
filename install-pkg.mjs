
import { argv, fs } from 'zx'

// console.log( argv )

for( let i = 1 ; i < argv._.length ; ++i  ) {

    await fs.copy(  path.join( 'node_modules', argv._[i]), path.join('dist', 'local', argv._[i]) )

}

