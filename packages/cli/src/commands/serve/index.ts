import { Command } from "commander";
import { serve, Configuration, CellsRoute } from "@bsorrentino/jsnotebook-server";
import path from "path";
import chalk from "chalk";
import os from 'os'

interface Options {
  port: string;
}
// not used for now
const isProduction = process.env.NODE_ENV === "production";

const serveAction = async ( { port }: Options) => {

  const modulePath = ( moduleName:string, join:string ) => 
      path.join( path.dirname(require.resolve( path.join('@bsorrentino', moduleName, 'package.json' ) )), join )
  
  const config:Configuration = {
    port: parseFloat(port)
  }

  try {
    config.pkgModulePath = modulePath('jsnotebook-local-pkg', 'node_modules')
  }
  catch(e) {
    console.warn(e)
  }

  try {

    await serve( config );
    console.log(
      `Notebook live at ${chalk.inverse(`http://localhost:${port}/notebooks`)} `
    )

  } catch (error:any) {
    if (error.code === "EADDRINUSE") {
      console.log( chalk.red(
          `${port} already in use, try using a different port via the --port option`
        ))
    } else {
      console.log(chalk.red(error));
    }
    process.exit(1);
  }
};

export const serveCommand = new Command()
  .command("serve")
  .option("-p, --port <number>", "port to run server on", "3001")
  .description("open available notebook")
  .action(serveAction);
