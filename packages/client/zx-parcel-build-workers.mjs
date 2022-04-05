import 'zx/globals'

// ROOT=$PWD/node_modules/monaco-editor/esm/vs
// OPTS="--no-source-maps --log-level 1"        # Parcel options - See: https://parceljs.org/cli.html

// parcel build $ROOT/language/json/json.worker.js $OPTS
// parcel build $ROOT/language/css/css.worker.js $OPTS
// parcel build $ROOT/language/html/html.worker.js $OPTS
// parcel build $ROOT/language/typescript/ts.worker.js $OPTS
// parcel build $ROOT/editor/editor.worker.js $OPTS

const SRC_MONACO_EDITOR_PATH = path.join( '..', '..', 'node_modules', 'monaco-editor' )
const DEST_MONACO_EDITOR_PATH = path.join( 'node_modules', 'monaco-editor' )
const ESM_DEST_MONACO_EDITOR_PATH = path.join( DEST_MONACO_EDITOR_PATH, 'esm', 'vs')

await fs.ensureSymlink( SRC_MONACO_EDITOR_PATH,  DEST_MONACO_EDITOR_PATH, 'dir' )

const TS_WORKER_PATH = path.join( ESM_DEST_MONACO_EDITOR_PATH, 'language',  'typescript', 'ts.worker.js' )
const JSON_WORKER_PATH = path.join( ESM_DEST_MONACO_EDITOR_PATH, 'language',  'json', 'json.worker.js' )
const CSS_WORKER_PATH = path.join( ESM_DEST_MONACO_EDITOR_PATH, 'language',  'css', 'css.worker.js' )
const HTML_WORKER_PATH = path.join( ESM_DEST_MONACO_EDITOR_PATH, 'language',  'html', 'html.worker.js' )
const EDITOR_WORKER_PATH = path.join( ESM_DEST_MONACO_EDITOR_PATH, 'editor',  'editor.worker.js' )

await fs.copyFile( 'ts.worker.patched.js', TS_WORKER_PATH  )

await $`parcel build ${JSON_WORKER_PATH} --no-source-maps --log-level info`
await $`parcel build ${CSS_WORKER_PATH} --no-source-maps --log-level info`
await $`parcel build ${HTML_WORKER_PATH} --no-source-maps --log-level info`
await $`parcel build ${TS_WORKER_PATH} --no-source-maps --log-level info`
await $`parcel build ${EDITOR_WORKER_PATH} --no-source-maps --log-level info`


