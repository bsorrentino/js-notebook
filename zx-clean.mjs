import 'zx/globals'

const cache_path = path.join( 'packages', 'local-client', '.parcel-cache' )
await fs.remove( cache_path )

if( argv.all ) {
    await fs.remove( 'node_modules' )
}