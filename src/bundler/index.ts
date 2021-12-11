import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let hasService = false;

interface BundledResult {
  code: string;
  error: string;
}

const esBundle = async (input: string): Promise<BundledResult> => {
  if (!hasService) {
    await esbuild.initialize({
      worker: true,
//      wasmURL: "https://unpkg.com/esbuild-wasm@0.14.2/esbuild.wasm",
      wasmURL: "/esbuild.wasm",
    });
    hasService = true;
  }
  try {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        global: "window",
      },
    });
    return {
      code: result.outputFiles[0].text,
      error: "",
    };
  } catch (error:any) {
    return {
      code: "",
      error: error.message,
    };
  }
};

export default esBundle;
