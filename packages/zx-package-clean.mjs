import 'zx/globals'

await fs.remove( 'dist' )
if( argv.all ) {
    await fs.remove( '.parcel-cache' )
}
