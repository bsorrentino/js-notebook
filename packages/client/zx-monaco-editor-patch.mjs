import 'zx/globals'

const TS_WORKER_FILE = 'ts.worker.js'
const TS_WORKER_PATCHED_FILE ='ts.worker.patched.js'

const tsWorkerRelativeToNodeModulesPath = path.join( 'monaco-editor', 'esm', 'vs', 'language', 'typescript', TS_WORKER_FILE )

const result = await glob( [ 
    path.join( '..',  tsWorkerRelativeToNodeModulesPath ),
    path.join( '..', 'node_modules',  tsWorkerRelativeToNodeModulesPath ),
    path.join( '..', '..', 'node_modules', tsWorkerRelativeToNodeModulesPath )
])

if( result.length == 0 ) {
    throw new Error( `"${TS_WORKER_FILE}" not found!`)
}
if( result.length > 1 ) {
    throw new Error( `there are more "${TS_WORKER_FILE}" in your installation!\n${result}`)
}

const [ tsWorker ] = result

console.log( tsWorker )

console.log( 'copy file', tsWorker,  tsWorker.concat('.original') )
await fs.copyFile( tsWorker, tsWorker.concat('.original')  )

console.log( 'copy file', TS_WORKER_PATCHED_FILE,  tsWorker )
await fs.copyFile( TS_WORKER_PATCHED_FILE, tsWorker )