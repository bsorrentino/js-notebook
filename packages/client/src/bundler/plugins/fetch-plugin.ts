import * as esbuild from "esbuild-wasm";

import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (input: string, hasTypescript: boolean) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root user input code
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: hasTypescript ? "tsx" : "jsx",
          contents: input,
        };
      });

      // if not cached, carry on to the reamining load functions
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      // handle css files
      build.onLoad({ filter: /\.css$/ }, async (args: esbuild.OnLoadArgs) => {

        const response = await fetch(args.path);
        const fileType = args.path.match(/.css$/) ? "css" : "jsx";
        let contents;
        if (fileType === "css") {
          const data = await response.text()
          const replaced = data
            .replace(/\n/g, "")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");
          contents = `
                        const style = document.createElement('style');
                        style.innerText = '${replaced}';
                        document.head.appendChild(style);
                    `;
        }

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", response.url).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });

      // handle js and jsx files
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const response = await fetch(args.path);
        const contents = await response.text()

        const result: esbuild.OnLoadResult = {
          loader: "js",
          contents,
          resolveDir: new URL("./", response.url).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
