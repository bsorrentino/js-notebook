import 'zx/globals'

[ 
    path.join( 'packages', 'local-client-page1', '.parcel-cache' ),
    path.join( 'packages', 'local-client', '.parcel-cache' )
]
.forEach( async (p) => await fs.remove( p ) )

if( argv.all ) {
    await fs.remove( 'node_modules' )
}