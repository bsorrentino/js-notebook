import express, { RequestHandler } from "express";
import path from "path";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells"

export type Proxy = Options

export type StaticModulePath = string

export type CellsRoute = {
  filename: string,
  dir: string
}

export interface Configuration {
  port: number
  proxy?: Options
  mainModulePath: StaticModulePath
  pkgModulePath?: StaticModulePath
  cellRoute?: CellsRoute
}

export const serve = async ( config:Configuration ) => {
  console.log( config )

  const { port, cellRoute, proxy, mainModulePath, pkgModulePath  } = config

  const app = express();

  if( cellRoute ) {
    const { filename, dir } = cellRoute

    const cellsRouter = createCellsRouter(filename, dir);

    app.use(cellsRouter);
  }


  if (proxy) {
    app.use( createProxyMiddleware(proxy) )
    // app.use(
    //   createProxyMiddleware({
    //     target: "http://localhost:3000",
    //     ws: true,
    //     logLevel: "silent",
    //   })
    // )
  } else {

  const modulePath = ( moduleName:string, join:string ) => 
      path.join( path.dirname(require.resolve( path.join('@bsorrentino', moduleName, 'package.json' ) )), join )

    // static route for main module      
    app.use( express.static( mainModulePath ) )

    app.use( '/notebook', express.static( modulePath( 'jsnotebook-client', 'dist' ) ) )  

    if( pkgModulePath )
    { // static route for package module

      // LOG STATIC REQUEST    
      const log:RequestHandler =  (req, _, next) => {
        const { url, path: routePath } = req;
        console.log(url, routePath);
        next();
      }

      app.use('/local', log, express.static( pkgModulePath ))
    }

  }

  return new Promise<void>((resolve, reject) => app.listen(port, resolve).on('error', reject) )
}
