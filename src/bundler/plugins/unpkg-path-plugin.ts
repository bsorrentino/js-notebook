import * as esbuild from "esbuild-wasm";


const isPackageInstalled = async (pkg: string): Promise<any | undefined> => {
  try {
    const res = await fetch(`/local/${pkg}/package.json`)

    if (res.status !== 404) {
      return res.json()
    }
  }
  catch (e) {
    console.warn('ERROR: isPackageInstalled!', e);
  }
}

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",

    setup(build: esbuild.PluginBuild) {
      // handle root entry file of user input
      build.onResolve({ filter: /(^index\.js$)/ }, (args: esbuild.OnResolveArgs) => {
        console.log("onResolve.root", args)

        return { path: "index.js", namespace: "a" };


      });

      // handle relative imports inside a module
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        console.log("onResolve.relative ==>", args)

        let result: esbuild.OnResolveResult

        if (args.namespace === 'local' && args.path.startsWith('./')) {

          const path = args.path.endsWith('.js') ? args.path : `${args.path}.js`
          result = {
            path: `${args.resolveDir}/${path}`,
            namespace: "local",
          };
        }
        else {
          const baseUrl = `https://unpkg.com${args.resolveDir}/`
          try {
            result = {
              path: new URL(args.path, baseUrl).href,
              namespace: "a",
            };
          }
          catch (e) {
            console.error(`(error resolving url( ${args.path}, ${baseUrl} ) `, e)
            return
          }
        }
        console.log("onResolve.relative <==", result)
        return result
      });


      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {

        console.log("onResolve.main ==>", args)

        let result: esbuild.OnResolveResult

        const packageJson = await isPackageInstalled(args.path)
        if (packageJson) {
          console.log(`package ${args.path} is locally installed`)

          result = {
            path: `/local/${args.path}/${packageJson.main}`,
            namespace: "local",
          }
        }
        else {
          result = {
            path: `https://unpkg.com/${args.path}`,
            namespace: "a",
          };
        }


        console.log("onResolve.main <==", result)
        return result


      });
    },
  };
};
