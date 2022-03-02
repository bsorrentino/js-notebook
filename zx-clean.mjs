import 'zx/globals'

[ 
    path.join( 'packages', 'local-client-start', '.parcel-cache' ),
    path.join( 'packages', 'local-client-start', 'dist' ),
    path.join( 'packages', 'local-client', '.parcel-cache' ),
    path.join( 'packages', 'local-client', 'dist' ),
    path.join( 'packages', 'local-api', 'dist' ),
    path.join( 'packages', 'cli', 'dist' ),
]
.forEach( async (p) => await fs.remove( p ) )

if( argv.all ) {
    await fs.remove( 'node_modules' )
}