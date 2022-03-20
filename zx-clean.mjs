import 'zx/globals'

[ 
    path.join( 'packages', 'client', '.parcel-cache' ),
    path.join( 'packages', 'client-main', '.parcel-cache' ),
    path.join( 'packages', 'client', 'dist' ),
    path.join( 'packages', 'client-main', 'dist' ),
    path.join( 'packages', 'clent-data', 'dist' ),
    path.join( 'packages', 'cli', 'dist' ),
    path.join( 'packages', 'server', 'dist' ),
]
.forEach( async (p) => await fs.remove( p ) )

if( argv.all ) {
    await fs.remove( 'node_modules' )
}