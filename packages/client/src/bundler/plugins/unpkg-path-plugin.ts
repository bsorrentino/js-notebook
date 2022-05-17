import * as esbuild from "esbuild-wasm";
import { getLogger } from '@bsorrentino/jsnotebook-logger'

const PLUGIN_ID = 'unpkg-path-plugin'

const UNPKG_URL = 'https://unpkg.com'
const UNPKG_NAMESPACE = 'a'

const LOCAL_NAMESPACE = 'local'

const logger = getLogger(PLUGIN_ID)

logger.trace( `
href          => '${window.location.href}'
host          => '${window.location.host}'
hostname      => '${window.location.hostname}'
port          => '${window.location.port}'
protocol      => '${window.location.protocol}'
pathname      => '${window.location.pathname}'
hashpathname  => '${window.location.hash}'
search        => '${window.location.search}'
`)

const LOCAL_URL = `${window.location.protocol}//${window.location.host}`

const processPackageUrlForLocalCheck = ( pkg: string ) => {

  if( pkg.lastIndexOf('/') !== -1 ) {
    if( !pkg.endsWith('.js') ) {
      pkg = pkg.concat('.js')
    }
  }
  else {
    pkg = pkg.concat('/package.json')
  }

  return `${LOCAL_URL}/local/${pkg}`
}

const getLocalPackageUrlIfExists = async (pkg: string): Promise<string | undefined> => {

  const packageUrl = processPackageUrlForLocalCheck(pkg)

  logger.trace(`check if package '${pkg}' at '${packageUrl}' is locally installed`)

  try {
    const res = await fetch(packageUrl)

    if (res.status !== 404) {
      const contentType = res.headers.get('Content-Type')
      logger.trace(`package '${pkg}' is locally installed!`, contentType )

      if( contentType?.includes('javascript') ) {
        return `${LOCAL_URL}/local/${pkg}.js`
      }
      else if( contentType?.includes('json')) {
        const packageJson =  await res.json() 
        return `${LOCAL_URL}/local/${pkg}/${packageJson.main ?? 'index.js'}`  
      }
      else {
        logger.warn( `response Content-Type '${contentType} has not been recognized!` )
      }
    }
    logger.trace(`package '${pkg}' isn't locally installed!`)
  }
  catch (e) {
    logger.warn('error on isPackageInstalled!', e);
  }
}

export const unpkgPathPlugin = () => {
  return {
    name: PLUGIN_ID,

    setup(build: esbuild.PluginBuild) {
      //
      // handle root entry file of user input
      //
      build.onResolve({ filter: /(^index\.js$)/ }, (args: esbuild.OnResolveArgs) => {
        logger.trace( "onResolve.root", args )

        return { path: "index.js", namespace: UNPKG_NAMESPACE };
      });

      //
      // handle relative imports inside a module
      //
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        logger.trace( "onResolve.relative ==>", args)

        let result: esbuild.OnResolveResult

        // If required to resolve locally 
        if (args.namespace === LOCAL_NAMESPACE && args.path.startsWith('./')) {
          
          const _path = args.path.endsWith('.js') ? args.path : `${args.path}.js`
          const baseUrl = `${LOCAL_URL}${args.resolveDir}/`

          try {
            result = {
              path: new URL(_path, baseUrl).href,
              namespace: LOCAL_NAMESPACE,
            };
          }
          catch (e) {
            logger.warn(`error resolving url( ${args.path}, ${baseUrl} )`, e)
            return
          }

        }
        else { // resolve remotely
          const baseUrl = `${UNPKG_URL}${args.resolveDir}/`

          try {
            result = {
              path: new URL(args.path, baseUrl).href,
              namespace: UNPKG_NAMESPACE,
            };
          }
          catch (e) {
            logger.warn(`error resolving url( ${args.path}, ${baseUrl}`, e)
            return
          }
        }
        logger.trace("onResolve.relative <==", result)
        return result
      });


      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {

        logger.trace("onResolve.main ==>", args)

        // check if package is available locally
        const localPath = await getLocalPackageUrlIfExists(args.path)
        const result = (localPath) ?
          {
            path: localPath,
            namespace: LOCAL_NAMESPACE,
          } :
          {
            path: `${UNPKG_URL}/${args.path}`,
            namespace: UNPKG_NAMESPACE,
          };

        logger.trace("onResolve.main <==", result)
        return result

      });
    },
  };
};
